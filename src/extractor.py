import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def extract(email_text:str)->dict:
    model=genai.GenerativeModel("gemini-3.5-flash")
    prompt = f"""You are an email assistant. Analyze the email below and extract:
  1. deadline: any date or time mentioned (as a string), or null if none
  2. actions: a list of things the recipient needs to do (empty list if none)

  Respond ONLY with valid JSON in this exact format:
  {{"deadline": "...", "actions": ["...", "..."]}}

  Email:
  {email_text}"""

    response = model.generate_content(prompt)
    text = response.text.strip()

    if text.startswith("```"):
          text = text.split("```")[1]
          if text.startswith("json"):
              text = text[4:]

    return json.loads(text)