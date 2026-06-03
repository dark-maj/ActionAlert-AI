from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src.classifier import predict
from src.extractor import extract
from dateutil import parser as dateparser
from datetime import datetime, timezone
import os
app=FastAPI()
MODEL_PATH = "models/classifier.pkl"
@app.get("/")
def home():
    return{"status":"ok"}
class EmailRequest(BaseModel):
    subject: str = ""
    body: str
class ClassifyResponse(BaseModel):
    label: str
    confidence: float
    deadline: str | None
    actions: list[str]
@app.post("/classify")
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
                    print(f"[ALERT] Urgent email — deadline in {hours_until:.1f}h: {deadline}")
        except Exception:
            pass
    return ClassifyResponse(
          label=str(label[0]),
          confidence=round(float(confidence), 2),
          deadline=deadline,
          actions=extracted.get("actions", [])
    )



    
    
