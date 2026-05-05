from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src.classifier import predict
import os
app=FastAPI()
MODEL_PATH = "models/classifier.pkl"
@app.get("/")
def home():
    return{"status":"ok"}
class EmailRequest(BaseModel):
    text:str
class ClassifyResponse(BaseModel):
    label:str
    confidence:float
@app.post("/classify")
def classifier(req:EmailRequest):
    if(not req.text.strip()):
        raise HTTPException(status_code=400,detail="text cannot be empty")
    if not os.path.exists(MODEL_PATH):
        raise HTTPException(status_code=503,detail="Model file not available")
    else:
        label,confidence=predict(req.text)      
    return ClassifyResponse(label=str(label[0]),confidence=float(
  confidence))



    
    
