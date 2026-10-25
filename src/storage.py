import sqlite3, json, os
from datetime import datetime, timezone
from contextlib import contextmanager

# If DATABASE_URL is set (Render + Neon) we use Postgres, otherwise a local
# SQLite file. All SQL below is written once and works on both.

_pool = None


def use_postgres():
    return bool(os.getenv("DATABASE_URL"))


def get_db_path():
    return os.getenv("DB_PATH", "data/actionalert.db")


def _get_pool():
    # One pool per process, created on first use. Reusing connections avoids a
    # new TLS handshake to Neon for every query; check= replaces connections
    # Neon closed while the database was idle.
    global _pool
    if _pool is None:
        from psycopg.rows import dict_row
        from psycopg_pool import ConnectionPool
        _pool = ConnectionPool(
            os.getenv("DATABASE_URL"),
            min_size=1,
            max_size=5,
            kwargs={"row_factory": dict_row},
            check=ConnectionPool.check_connection,
            open=True,
        )
    return _pool


@contextmanager
def connect():
    """Yield a connection; commit on success, roll back on error."""
    if use_postgres():
        with _get_pool().connection() as conn:
            yield conn
    else:
        path = get_db_path()
        folder = os.path.dirname(path)
        if folder:
            os.makedirs(folder, exist_ok=True)
        conn = sqlite3.connect(path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()


def _q(sql):
    # SQLite uses ? placeholders, psycopg uses %s.
    return sql.replace("?", "%s") if use_postgres() else sql


def init_db():
    with connect() as conn:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS emails(
            id            TEXT PRIMARY KEY,
            subject       TEXT,
            sender        TEXT,
            snippet       TEXT,
            label         TEXT,
            confidence    DOUBLE PRECISION,
            deadline      TEXT,
            actions       TEXT,
            classified_at TEXT
        )""")


def save_email(email):
    now = datetime.now(timezone.utc).isoformat()
    action_json = json.dumps(email.get("actions", []))

    # Upsert: insert a new email, or refresh the classification of one we have
    # already seen. classified_at keeps the time we first saw it.
    with connect() as conn:
        conn.execute(_q("""
            INSERT INTO emails(id, subject, sender, snippet, label, confidence, deadline, actions, classified_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                subject    = excluded.subject,
                sender     = excluded.sender,
                snippet    = excluded.snippet,
                label      = excluded.label,
                confidence = excluded.confidence,
                deadline   = excluded.deadline,
                actions    = excluded.actions
            """),
            (email["id"], email["subject"], email["from"], email["snippet"], email["label"],
             email["confidence"], email.get("deadline"), action_json, now),
        )


def _row_to_dict(row):
    data = dict(row)
    data["actions"] = json.loads(data["actions"])
    return data


def get_email(email_id):
    with connect() as conn:
        row = conn.execute(_q("SELECT * FROM emails WHERE id = ?"), (email_id,)).fetchone()
    if row is None:
        return None
    return _row_to_dict(row)


def list_emails(limit=50, label=None):
    sql = "SELECT * FROM emails"
    params = []
    if label:
        sql += " WHERE label = ?"
        params.append(label)
    sql += " ORDER BY classified_at DESC LIMIT ?"
    params.append(limit)
    with connect() as conn:
        rows = conn.execute(_q(sql), params).fetchall()
    return [_row_to_dict(row) for row in rows]
