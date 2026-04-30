import pandas as pd
from src.classifier import train

df = pd.read_csv("data/emails.csv")
train(df)
print("Training done! Model saved to models/classifier.pkl")
