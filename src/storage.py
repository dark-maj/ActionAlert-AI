import sqlite3 ,json,os
from datetime import datetime,timezone
from contextlib import closing
def get_db_path():
    return os.getenv("DB_PATH","data/actionalert.db")
def connect():
    path=get_db_path()
    folder=os.path.dirname(path)
    if folder:
        os.makedirs(folder, exist_ok=True)
    conn=sqlite3.connect(path)
    conn.row_factory=sqlite3.Row
    return conn
def init_db():
   with closing(connect()) as conn:
       conn.execute("""
       CREATE TABLE IF NOT EXISTS emails(
       id        TEXT PRIMARY KEY,
       subject   TEXT,
       sender    TEXT,
       snippet   TEXT,
        label    TEXT,
        confidence  REAL,
        deadline    TEXT, 
        actions     TEXT,
       classified_at TEXT
       )""")
       conn.commit()
def save_email(email):
    now=datetime.now(timezone.utc).isoformat()
    action_json=json.dumps(email.get("actions",[]))
 
    with closing (connect()) as conn:
        conn.execute(
            """
            INSERT OR REPLACE INTO EMAILS(id,subject ,sender, snippet, label, confidence, deadline, actions, classified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",(email["id"], email["subject"], email["from"], email["snippet"], email["label"], email["confidence"], email.get("deadline"), action_json, now)        )
        conn.commit()
def _row_to_dict(row):
        data = dict(row)
        data["actions"] = json.loads(data["actions"])
        return data
def get_email(email_id):
    with closing(connect()) as conn:
        cur=conn.execute("SELECT * FROM emails where id=?",(email_id,))
        row=cur.fetchone()
        
        
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
    with closing(connect()) as conn:
        rows = conn.execute(sql, params).fetchall()
    return [_row_to_dict(row) for row in rows]