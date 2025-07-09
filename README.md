# 🧠 AskAI – AI-Powered Productivity App

**AskAI** is an intelligent MERN Stack web application that integrates **Google Gemini AI** to provide a smart, AI-powered productivity assistant. Users can:

- Ask contextual questions and get intelligent answers
- Generate images from text prompts using AI
- Perform basic image editing
- Store and view their query history

It also supports **Google Authentication**, **image uploads with Cloudinary**, and uses **cookies for session management**.

---

## 🚀 Live Demo

🔗 [Click Here to Try AskAI](https://ask-ai-mu-nine.vercel.app) <!-- Replace with your live link -->

---

## ✨ Features

- ✅ Google Gemini AI integration for smart Q&A
- 🎨 AI Image Generation from user prompts
- 🖼️ Basic Image Editing Tools
- ☁️ Image Uploads using **Multer** and **Cloudinary**
- 🔐 Secure Auth with **Google OAuth 2.0**
- 🍪 Cookie-based session handling
- 👥 User Dashboard with query/image history
- 🌐 Responsive UI using Chakra UI
- 🔒 Protected Routes with JWT

---

## 🛠️ Tech Stack

### 🔧 Frontend
- React.js
- Chakra UI
- Axios
- React Router

### ⚙️ Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer for file upload
- Cloudinary for image storage
- Google OAuth (passport.js)
- JWT and cookies for authentication

---

## 🖼️ Glimpse of AskAI


## 🧾 Folder Structure

AskAI/
├── client/                           # React Frontend
│   ├── public/                       # Static files
│   ├── src/
│   │   ├── assets/                   # Images, icons, etc.
│   │   ├── components/               # Reusable components (Navbar, Footer, etc.)
│   │   ├── pages/                    # Page components (Home, Dashboard, Login, etc.)
│   │   ├── services/                 # Axios setup, API functions
│   │   ├── context/                  # Global context/state (e.g., AuthContext)
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── App.js                    # Main app component
│   │   └── index.js                  # Entry point
│   └── package.json

├── server/                           # Node.js Backend
│   ├── config/                       # Cloudinary & Google OAuth configs
│   ├── controllers/                  # Route handler logic
│   ├── middleware/                   # Auth, multer, error handlers
│   ├── models/                       # Mongoose schemas (User, Query, Image, etc.)
│   ├── routes/                       # Route definitions (auth, ai, upload, user)
│   ├── utils/                        # Utility functions
│   ├── app.js                        # Express app setup
│   └── server.js                     # Server entry point
│   └── package.json

├── .env                              # Environment variables (not pushed to GitHub)
├── .gitignore
├── README.md
└── LICENSE (optional)


