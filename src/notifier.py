import json, os
import urllib.error
import urllib.request
from dotenv import load_dotenv

load_dotenv()

# Sends alerts to Telegram when TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set,
# otherwise prints them. A failed send is logged and never raised, so a Telegram
# outage can't break /emails.


def send_alert(text):
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        print(f"[ALERT] (Telegram not configured) {text}")
        return

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    body = json.dumps({"chat_id": chat_id, "text": text}).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            resp.read()
        print("[ALERT] sent to Telegram")
    except urllib.error.HTTPError as e:
        # Telegram's error body says what went wrong (bad token, chat not found)
        # and doesn't contain the token, unlike str(e) which can include the URL.
        print(f"[ALERT] Telegram send failed ({e.code}): {e.read().decode(errors='replace')}")
    except Exception as e:
        print(f"[ALERT] Telegram send failed ({type(e).__name__}): {text}")
