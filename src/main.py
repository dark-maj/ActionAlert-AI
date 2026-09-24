from fastapi import FastAPI, HTTPException,Header,Depends
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from src.classifier import predict
from src.extractor import extract
from src.gmail_auth import get_service, list_recent_emails
from dateutil import parser as dateparser
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from src.storage import init_db,save_email
import os




app=FastAPI()
@asynccontextmanager
async def  lifespan(app):
    db=init_db()
    yield
app = FastAPI(lifespan=lifespan)


MODEL_PATH = "models/classifier.pkl"

class EmailRequest(BaseModel):
    subject: str = ""
    body: str
class ClassifyResponse(BaseModel):
    label: str
    confidence: float
    deadline: str | None
    actions: list[str]
def verify_password(x_app_password :str =Header(None)):
    password=os.getenv("APP_PASSWORD")
    if password == x_app_password :
        return 
    elif password==None:
        return
       
    else:
      raise HTTPException(status_code=401,detail="Error Occured")
                       
    
@app.post("/classify",dependencies=[Depends(verify_password)])
def classifier(req:EmailRequest):
    text = (req.subject + " " + req.body).strip()
    if not text:
        raise HTTPException(status_code=400, detail="Email body cannot be empty")
    if not os.path.exists(MODEL_PATH):
        raise HTTPException(status_code=503, detail="Model file not available")
    else:
        label, confidence = predict(text)
        extracted = extract(text)
    deadline = extracted.get("deadline")
    if str(label[0]) == "urgent" and deadline:
        try:
            deadline_dt = dateparser.parse(deadline, fuzzy=True)
            if deadline_dt:
                deadline_dt = deadline_dt.replace(tzinfo=timezone.utc)
                hours_until = (deadline_dt - datetime.now(timezone.utc)).total_seconds() / 3600
                if hours_until <= 24:
                    print(f"[ALERT] Urgent email - deadline in {hours_until:.1f}h: {deadline}")
        except Exception:
            pass
    return ClassifyResponse(
          label=str(label[0]),
          confidence=round(float(confidence), 2),
          deadline=deadline,
          actions=extracted.get("actions", [])
    )

@app.get("/emails",dependencies=[Depends(verify_password)])
def get_emails(n: int = 10):
    try:
        service = get_service()
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Gmail auth failed: {e}")

    raw_emails = list_recent_emails(service, n=n)
    results = []
    for email in raw_emails:
        text = (email["subject"] + " " + email["body"]).strip()
        label, confidence = predict(text)

        deadline = None
        actions = []
        if str(label[0]) == "urgent":
            extracted = extract(text)
            deadline = extracted.get("deadline")
            actions = extracted.get("actions", [])

        if str(label[0]) == "urgent" and deadline:
            try:
                deadline_dt = dateparser.parse(deadline, fuzzy=True)
                if deadline_dt:
                    deadline_dt = deadline_dt.replace(tzinfo=timezone.utc)
                    hours_until = (deadline_dt - datetime.now(timezone.utc)).total_seconds() / 3600
                    if hours_until <= 24:
                        print(f"[ALERT] Urgent email from {email['from']} - deadline in {hours_until:.1f}h: {deadline}")
            except Exception:
                pass

        result={
            "id": email["id"],
            "subject": email["subject"],
            "from": email["from"],
            "snippet": email["snippet"],
            "label": str(label[0]),
            "confidence": round(float(confidence), 2),
            "deadline": deadline,
            "actions": actions,
        }
        save_email(result)
        results.append(result)



    return {"emails": results}
@app.get("/health")
def get_health():
    return {"Status":"ok"}

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")



    
    

