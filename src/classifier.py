import re
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

def clean_text(text):# cleaning the text
    text1=text.lower()
    text2=re.sub(r'[^a-zA-Z\s]','',text1)# replaces the pattern in to a text which named text3
    text3=text2.strip()
    return text3

def build_pipeline():
    pipe=Pipeline([
        ('tfidf',TfidfVectorizer()),
        ('clf',LogisticRegression())

    ])
    return pipe

def train(df):
    df['clean_text']=df['text'].apply(clean_text)
    X_train, X_test, y_train, y_test = train_test_split(
        df["clean_text"], df["label"], test_size=0.2, random_state=42
    )
    pipeline=build_pipeline()
    pipeline.fit(X_train,y_train)
    joblib.dump(pipeline,"models/classifier.pkl")

def predict(text):
    pipeline=joblib.load("models/classifier.pkl")
    c=clean_text(text)
    model=pipeline.predict([c])
    confidence=pipeline.predict_proba([c]).max()
    return model,confidence



    
   


