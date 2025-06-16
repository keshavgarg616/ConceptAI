# 💡 ConceptAI

**ConceptAI** is an AI-powered chatbot web app that helps users learn and organize programming concepts across various languages. With an Angular frontend and Node.js + Express backend, ConceptAI integrates Google's Gemini API to deliver individualized, context-aware assistance on each concept you add.

Whether you're learning Python, JavaScript, Java, or any other language, ConceptAI provides a structured space to define concepts and receive smart, AI-generated guidance — like having a personal tutor for every coding idea.

---

## 🌟 Key Features

-   🧠 **Concept-based Chat**: Get AI help on individual programming concepts.
-   🌍 **Multi-language Support**: Add multiple programming languages and concepts under each.
-   🔐 **Secure User Auth**: Encrypted login system with JWT-based session management.
-   💬 **Persistent History**: Concept-specific conversations stored and restored across sessions.
-   🧰 **Modular Form Management**: Add, remove, and manage concepts and languages dynamically with Angular Reactive Forms.
-   ⚙️ **Seamless Full-Stack Architecture**: Decoupled frontend and backend for scalability.

---

## 🏗 Architectural Overview

-   🧱 **Modular Backend (Node.js + Express)**

    -   REST API structure with controllers, routes, and middleware.
    -   Gemini API calls secured in the backend (API key never exposed to frontend).

-   🛡 **Authentication**

    -   Email/password stored securely using SHA256 + bcrypt.
    -   JWT-based stateless session handling.
    -   Protected routes + Angular route guards.

-   🌀 **Frontend (Angular + Angular Material)**
    -   Multi-page flow: Login, Signup, Language/Concept Editor, Chat.
    -   Form validation, route navigation, and conditional rendering built-in.

---

## 🧩 Project Structure

```
ConceptAI/
├── frontend/             # Angular application
│   └── src/
│       └── app/
│           └── routes/
├── backend/              # Node.js + Express server
│   ├── controllers/
│   ├── routes/
│   ├── schemas/
│   └── .env
└── Readme.md             # You're here!
```

---

## 🚀 Getting Started

### 🔧 Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 🔧 Backend Setup

```bash
cd backend
npm install
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory with:

```env
GENAI_API_KEY=your_google_gemini_api_key
MongoDBUsername=your_mongodb_atlas_username
MongoDBPswd=your_mongodb_atlas_password
MongoDBClusterString=your_mongodb_cluster_string
SALT_WORK_FACTOR=your_salt_work_factor_for_bcrypt
EMAIL_HASH_SECRET=your_sha256_secret_key
JWT_SECRET=your_jwt_encryption_key
```

---

## 🧠 Tech Stack

-   **Frontend**: Angular 20 + Angular Material
-   **Backend**: Node.js + Express
-   **Authentication**: SHA256 + bcrypt + JWT
-   **Database**: MongoDB with Mongoose
-   **AI**: Google Gemini API (Generative Language SDK)

---

## 🧠 Contributors

Built with ❤️ by **Keshav Garg**  
Based on **EssayHelper**, by me :D
