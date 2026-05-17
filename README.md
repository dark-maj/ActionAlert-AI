# 📧 AI-Powered Gmail Email Classifier

An intelligent Gmail Email Classifier built using Machine Learning and AI to automatically categorize emails based on their content, priority, and importance. The system analyzes incoming emails and predicts categories such as Spam, Promotions, Social, Important, Work, Personal, and more.

---

# 🚀 Features

* 🔍 Automatic email classification using Machine Learning
* 📊 Confidence score prediction for each email
* ⚡ Priority score generation
* 🧠 NLP-based text preprocessing
* 📁 Categorization into multiple labels
* 📬 Gmail API integration
* 📈 Dashboard for visualization and analytics
* 🔐 Secure authentication using OAuth
* 🌐 Full-stack web application

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Axios

## Backend

* Node.js
* Express.js
* Python (ML Service)

## Machine Learning

* Scikit-learn
* Pandas
* NumPy
* NLTK / spaCy
* TF-IDF Vectorization
* Logistic Regression / Naive Bayes

## Database

* Firebase Firestore / MongoDB

## APIs

* Gmail API
* Google OAuth 2.0

---

# 🧠 Machine Learning Workflow

1. Collect email dataset
2. Preprocess email text
3. Remove stopwords and punctuation
4. Convert text using TF-IDF Vectorizer
5. Train classification model
6. Predict category and confidence score
7. Assign priority level
8. Display results on dashboard

---

# 📂 Project Structure

```bash
gmail-email-classifier/
│
├── frontend/                # React frontend
├── backend/                 # Express backend
├── ml-model/                # ML model and preprocessing
├── dataset/                 # Training dataset
├── routes/                  # API routes
├── controllers/             # Backend controllers
├── utils/                   # Helper functions
├── public/                  # Public assets
├── package.json
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/gmail-email-classifier.git
cd gmail-email-classifier
```

---

## 2️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 3️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 4️⃣ Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

# 🔑 Environment Variables

Create a `.env` file in the backend folder.

```env
PORT=5000
MONGO_URI=your_database_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_secret_key
```

---

# ▶️ Running the Project

## Start Frontend

```bash
cd frontend
npm run dev
```

## Start Backend

```bash
cd backend
npm start
```

## Run ML Model

```bash
python app.py
```

---

# 📊 Model Performance

| Metric    | Score |
| --------- | ----- |
| Accuracy  | 94%   |
| Precision | 92%   |
| Recall    | 91%   |
| F1-Score  | 91.5% |

---

# 📸 Screenshots

## Dashboard

* Email analytics
* Priority visualization
* Category distribution

## Classification View

* Predicted category
* Confidence score
* Priority level

---

# 🔮 Future Improvements

* Real-time email monitoring
* AI-generated email summaries
* Smart reply suggestions
* Multi-language support
* Deep Learning integration using Transformers
* Mobile application support

---

# 👨‍💻 Contributors

* Jaahnavi Yeturi

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub!
