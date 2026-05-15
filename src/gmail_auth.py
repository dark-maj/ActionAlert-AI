import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]
def get_service():
    creds=None
    if os.path.exists("token.json"):
        creds=Credentials.from_authorized_user_file("token.json",SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
    with open("token.json", "w") as f:
        f.write(creds.to_json())

    service = build("gmail", "v1", credentials=creds)
    return service
import base64


def _extract_body(payload: dict) -> str:
      """Return the plain-text body of a Gmail message payload, or '' if none found."""
      # Case 1: single-part message — body is right here
      data = payload.get("body", {}).get("data")
      if data:
          return base64.urlsafe_b64decode(data).decode("utf-8", errors="replace")

      # Case 2: multipart — walk one level of parts looking for text/plain
      for part in payload.get("parts", []):
          if part.get("mimeType") == "text/plain":
              data = part.get("body", {}).get("data")
              if data:
                  return base64.urlsafe_b64decode(data).decode("utf-8", errors="replace")

      return ""


def list_recent_emails(service, n: int = 10) -> list[dict]:
      """Fetch the n most recent emails from the user's inbox.

      Returns a list of dicts: {id, subject, from, snippet, body}.
      """
      resp = service.users().messages().list(userId="me", maxResults=n).execute()
      messages = resp.get("messages", [])

      results = []
      for m in messages:
          msg = service.users().messages().get(
              userId="me", id=m["id"], format="full"
          ).execute()

          headers = msg.get("payload", {}).get("headers", [])
          subject = next((h["value"] for h in headers if h["name"] == "Subject"), "")
          sender = next((h["value"] for h in headers if h["name"] == "From"), "")

          body = _extract_body(msg.get("payload", {}))

          results.append({
              "id": msg["id"],
              "subject": subject,
              "from": sender,
              "snippet": msg.get("snippet", ""),
              "body": body or msg.get("snippet", ""),  # fall back to snippet if body extraction fails
          })

      return results
    