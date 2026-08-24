# AI Keypoints Extraction

An AI-powered document analysis tool that extracts the most important **keypoints, keywords, and concise summaries** from uploaded documents. It also provides an **AI chatbot** that can answer questions based on the uploaded document.

## 🚀 Features

* 📄 Upload documents such as PDF, DOCX, and TXT
* 🤖 AI-powered keypoint extraction
* 🔑 Extract important keywords from documents
* 📝 Generate concise document summaries
* 💬 Chat with AI about the uploaded document
* 🔍 Ask questions and get answers based on document content
* 📚 View previously processed documents
* 🎨 Modern and responsive user interface
* ⚡ Fast document processing

## 🧠 How It Works

The system follows a simple pipeline:

```text
User Uploads Document
        ↓
Document Text Extraction
        ↓
Text Preprocessing
        ↓
AI/NLP Analysis
        ↓
Keypoint & Keyword Extraction
        ↓
Summary Generation
        ↓
AI Document Chat
```

The application analyzes the content instead of simply searching for frequently occurring words. This helps identify the actual important information within the document.

## 🏗️ Project Architecture

```text
                    ┌──────────────────┐
                    │      User        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  React Frontend  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Backend API    │
                    │ Node.js/Express  │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
       ┌─────────────────┐       ┌─────────────────┐
       │ Document Parser │       │   AI Service    │
       └────────┬────────┘       └────────┬────────┘
                │                         │
                └────────────┬────────────┘
                             ▼
                    ┌──────────────────┐
                    │ Extracted Results│
                    │ • Keypoints      │
                    │ • Keywords       │
                    │ • Summary        │
                    │ • AI Answers     │
                    └──────────────────┘
```

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js
* REST API

### AI / NLP

* Google Gemini API
* Natural Language Processing
* Text Summarization
* Keyword Extraction
* Question Answering

### Other Technologies

* Git
* GitHub
* npm

## 📂 Project Structure

```text
AI-Keypoints-Extraction/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

> Adjust the folder structure above to match your actual project before pushing it to GitHub.

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

### 2. Navigate to the Project

```bash
cd AI-Keypoints-Extraction
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Install Backend Dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 5. Configure Environment Variables

Create a `.env` file inside the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

**Never upload your `.env` file or API keys to GitHub.**

Make sure `.gitignore` contains:

```text
node_modules/
.env
uploads/
dist/
```

## ▶️ Running the Project

### Start Backend

```bash
cd backend
npm run dev
```

If you don't have a development script:

```bash
node server.js
```

The backend should run on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Vite will provide a local URL similar to:

```text
http://localhost:5173
```

Open that URL in your browser.

## 🔌 API Endpoints

Example API structure:

| Method | Endpoint         | Description                  |
| ------ | ---------------- | ---------------------------- |
| POST   | `/api/upload`    | Upload a document            |
| POST   | `/api/extract`   | Extract keypoints            |
| POST   | `/api/summarize` | Generate summary             |
| POST   | `/api/chat`      | Ask questions about document |
| GET    | `/api/history`   | Get processing history       |

Your actual endpoints should replace these examples if your backend uses different routes.

## 💡 Example

### Input

A document containing information about Artificial Intelligence:

```text
Artificial Intelligence is a branch of computer science...
Machine learning allows systems to learn from data...
Deep learning uses neural networks...
```

### Extracted Keypoints

```text
• Artificial Intelligence is a branch of computer science.
• Machine Learning enables systems to learn from data.
• Deep Learning uses neural networks.
```

### Keywords

```text
Artificial Intelligence
Machine Learning
Deep Learning
Neural Networks
Computer Science
```

### AI Chat

**User:**

```text
What is the relationship between AI and Machine Learning?
```

**AI:**

```text
Machine Learning is a subset of Artificial Intelligence
that enables systems to learn patterns from data.
```

## 🔐 Security

* API keys are stored in environment variables.
* `.env` files are excluded from Git.
* Uploaded files should be validated before processing.
* File size and file-type restrictions should be implemented.
* User documents should not be exposed publicly.

## 🎯 Future Improvements

* [ ] Support more document formats
* [ ] Multi-language document processing
* [ ] User authentication
* [ ] Cloud document storage
* [ ] Improved AI-based summarization
* [ ] Voice-based document interaction
* [ ] Export keypoints as PDF/DOCX
* [ ] Document comparison
* [ ] Personalized summaries
* [ ] Advanced conversation history

## 📊 Use Cases

This project can be useful for:

* 🎓 Students studying lecture notes
* 📚 Researchers analyzing papers
* 💼 Professionals reviewing reports
* 🧑‍💻 Developers analyzing technical documentation
* 📝 Users who need quick summaries of long documents

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/new-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add new feature"
```

5. Push the branch

```bash
git push origin feature/new-feature
```

6. Create a Pull Request

## 📜 License

This project is intended for educational and development purposes.

## 👨‍💻 Author

**Akhil**

AI / CSE Student

---

⭐ If you find this project useful, consider giving the repository a star!
