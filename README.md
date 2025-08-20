

# 📘 NotebookLM (Custom AI Chat with Knowledge Base)

A full-stack application where users can upload documents (PDF, CSV, TXT), provide website links, or other data sources, and interact with an AI-powered chatbot trained on their own data.  
The backend is built with **Node.js + Express + MongoDB**, and the frontend (React/Vite) is served as static files from the backend.

---
## 🚀 Live
[Click here to view the live app](https://chai-notebooklm.onrender.com/)

## Demo
[Click here to view the youtube video](https://www.youtube.com/watch?v=cKSowU8JHuQ)

## 🚀 Features

- Upload and process multiple data sources (PDF, DOCX, CSV, TXT, Website links, etc.)
- Store and query embeddings with **Qdrant** vector database.
- AI chatbot with contextual responses based on uploaded data.
- Supports code snippets, rich text formatting, and links in responses.
- Previous chat history with CRUD operations (create, view, delete).
- Clean UI built with React + TailwindCSS.

---

## 📂 Project Structure

```

backend/
├── fronted/               # React frontend (built & served as static files)
├── node\_modules/
├── public/
│   └── temp/              # Temporary file storage for uploads
├── src/
│   ├── config/            # Configuration files (DB, Qdrant, etc.)
│   ├── controllers/       # Express route controllers
│   ├── middlewares/       # Custom middlewares (auth, error handling, etc.)
│   ├── models/            # Mongoose models
│   ├── routes/            # Express route definitions
│   ├── services/          # Core services (chatService, documentService, etc.)
│   ├── app.js             # Express app configuration
├── .env                   # Environment variables
├── .gitignore
├── index.js               # Server entry point
├── package.json
├── package-lock.json

````

---

## 🛠️ Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Qdrant (vector database)
- LangChain (for embeddings & AI orchestration)

**Frontend**
- React + Vite
- TailwindCSS
- Lucide-react (icons)



## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ritik913553/Chai-NotebookLm
   cd notebooklm/backend


2. **Install dependencies**

   ```bash
   npm install


3. **Setup environment variables**
   Create a `.env` file in the backend root with the following (example):

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/notebooklm
   QDRANT_URL=http://localhost:6333
   OPENAI_API_KEY=your-openai-api-key
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Run backend**

   ```bash
   npm start
   ```

5. **Run frontend (development mode)**

   ```bash
   cd fronted
   npm install
   npm run dev
   ```

6. **Build frontend and serve as static files**

   ```bash
   cd fronted
   npm run build
   # Copy dist/ into backend/fronted/ or configure express.static()
   ```

---

## 📌 API Endpoints (examples)

* `POST /api/upload` → Upload document/website link
* `POST /api/chat/:chatId` → Ask question to AI
* `GET /api/chats` → Get all previous chats
* `DELETE /api/chats/:id` → Delete chat and related vectors in Qdrant

---

## ✅ Roadmap

* [ ] Add more data source integrations (Google Drive, Notion, etc.)
* [ ] Improve error handling and logging
* [ ] Add authentication & user management
* [ ] Deploy to cloud (Render/Heroku/Vercel + Mongo Atlas + Qdrant Cloud)

---



<img width="1842" height="1004" alt="Screenshot from 2025-08-20 14-53-00" src="https://github.com/user-attachments/assets/7521075f-6ba4-49c7-94dd-5475b90bae1c" />
<img width="1842" height="1004" alt="Screenshot from 2025-08-20 14-52-53" src="https://github.com/user-attachments/assets/6c35ce2e-91ac-40f7-9290-d55f0eb2772a" />
<img width="1842" height="1004" alt="Screenshot from 2025-08-20 14-52-45" src="https://github.com/user-attachments/assets/1d5bd55c-a9e7-4f71-881c-19f3de4680f3" />
<img width="1842" height="1004" alt="Screenshot from 2025-08-20 14-52-37" src="https://github.com/user-attachments/assets/34c5712b-b9eb-4f3b-9674-61e0818b4aab" />
