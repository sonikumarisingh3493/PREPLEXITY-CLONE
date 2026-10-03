# 🔎 AI-Powered Perplexity Clone

An AI-powered search and research assistant inspired by **Perplexity AI**, built as a full-stack application using **React, TypeScript, Node.js, Express, AI APIs, SearXNG, and RAG techniques**.

The application allows users to ask questions and receive AI-generated responses using different specialized search modes and AI agents. It combines web search, AI processing, streaming responses, and source-based information retrieval to create an interactive search experience.


## 🚀 About The Project

The **AI-Powered Perplexity Clone** is a full-stack AI search application developed to understand and implement the architecture behind modern AI-powered search engines.

Instead of working only as a traditional chatbot, the application can process user queries through different specialized agents and search sources.

The project focuses on:

* 🤖 AI-powered question answering
* 🔎 Real-time web search
* 🧠 Multiple specialized AI agents
* 📚 Retrieval-Augmented Generation (RAG)
* ⚡ Streaming AI responses
* 🎥 YouTube search
* 🖼️ Image search
* 💬 Interactive chat interface
* ✍️ AI writing assistance
* 🔴 Reddit-based search
* 📑 Source and search-result processing
* 🔄 Multiple search modes


# ✨ Key Features

### 🔍 1. AI-Powered Search

Users can enter a question or search query and receive an AI-generated response.

The backend processes the query and uses AI models along with external search sources to generate useful responses.


### 🤖 2. Multiple AI Agents

The project integrates **8 specialized agents** for handling different types of user queries.

These agents allow the system to route requests according to the type of information required.

The agents are designed for tasks such as:

* 🌐 Web Search
* 🔴 Reddit Search
* ▶️ YouTube Search
* 🖼️ Image Search
* 🎥 Video Search
* ✍️ Writing assistance
* 📚 Research-oriented search
* 🧠 Specialized AI processing

This agent-based architecture makes the application more modular and easier to extend.


### 🌐 3. Web Search

The application can search the web using **SearXNG** and process the returned search results.

The search pipeline can:

```text
User Query
     ↓
Search Agent
     ↓
SearXNG
     ↓
Search Results
     ↓
Relevant Information
     ↓
AI Processing
     ↓
Generated Response
```


### 🔴 4. Reddit Search

A dedicated Reddit search mode allows users to search Reddit-related information.

This provides an additional source of community discussions and user-generated information.


### ▶️ 5. YouTube Search

The application includes a YouTube search mode for finding relevant videos.

Search results can include:

* 🎬 Video title
* 🖼️ Thumbnail
* 🔗 Video URL
* ▶️ Video information


### 🖼️ 6. Image Search

The project includes an image-search mode that retrieves image results based on the user's query.

The frontend displays the retrieved images in a dedicated image result layout.


### 🎥 7. Video Search

A separate video-search mode allows users to search and display video-related results.



### ✍️ 8. AI Writing Mode

The project includes a dedicated writing mode for generating AI-assisted written content.

Users can use the AI to generate and process different types of text-based requests.


### ⚡ 9. Streaming Responses

The application supports **streaming AI responses**, allowing the generated answer to appear progressively rather than waiting for the complete response.

This creates a more interactive chatbot-like experience.

```text
User Query
    ↓
Backend
    ↓
AI Model
    ↓
Streaming Response
    ↓
Frontend
    ↓
User sees response progressively
```


### 🧠 10. RAG-Based Processing

The project also explores **Retrieval-Augmented Generation (RAG)**.

Relevant information can be retrieved first and then supplied to the AI model as context.

```text
User Query
     ↓
Retrieve Relevant Information
     ↓
Process Context
     ↓
AI Model
     ↓
Final Answer
```

This approach helps the model generate responses using retrieved information rather than relying only on its pretrained knowledge.


# 🏗️ System Architecture

The application follows a frontend-backend architecture.

```text
                    👤 USER
                       │
                       ▼
                🖥️ React Frontend
                       │
                       ▼
                🔌 REST API
                       │
                       ▼
              ⚙️ Express Backend
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      🤖 AI Agents  🔎 Search    🧠 RAG
          │            │            │
          ▼            ▼            ▼
       AI Model      SearXNG     Vector Search
          │            │            │
          └────────────┼────────────┘
                       ▼
                ⚡ AI Response
                       │
                       ▼
                💬 Chat Interface
```


# 🔄 Query Processing Flow

The basic flow of the application is:

```text
1. User enters a query
          ↓
2. Frontend sends request to backend
          ↓
3. Backend identifies the selected search mode
          ↓
4. Appropriate AI/Search Agent processes the request
          ↓
5. External search sources are queried when required
          ↓
6. Relevant information is retrieved
          ↓
7. AI model processes the information
          ↓
8. Response is streamed back to frontend
          ↓
9. User receives the final answer
```

---

# 🛠️ Technologies Used

| Technology    | Purpose                        |
| ------------- | ------------------------------ |
| ⚛️ React      | Frontend user interface        |
| 📘 TypeScript | Type-safe development          |
| 🟢 Node.js    | Backend runtime                |
| 🚂 Express.js | Backend API server             |
| 🤖 Gemini     | AI model integration           |
| ⚡ Groq        | Fast AI inference              |
| 🔎 SearXNG    | Web search integration         |
| 🧠 RAG        | Retrieval-Augmented Generation |
| 📌 Pinecone   | Vector search / retrieval      |
| 🗄️ MongoDB   | Database integration           |
| 🎨 CSS        | Frontend styling               |
| 📡 REST API   | Frontend-backend communication |
| 📦 npm        | Package management             |

---

# 💻 Frontend

The frontend is built using **React and TypeScript**.

It provides the main user interface where users can:

* 💬 Enter queries
* 🔍 Select search modes
* 📑 View AI responses
* 🖼️ View image results
* 🎥 View video results
* ▶️ View YouTube results
* 🔄 Receive streaming responses

### Main Frontend Components

```text
Frontend
│
├── App.tsx
│
├── SearchBar
│   ├── Query Input
│   └── Search Button
│
├── MessageList
│   └── AI Responses
│
├── ImageGrid
│   └── Image Results
│
├── VideoGrid
│   └── Video Results
│
└── Chat / Response Components
```

---

# ⚙️ Backend

The backend is built using **Node.js, Express, and TypeScript**.

It manages:

* 🔌 API endpoints
* 🤖 AI model requests
* 🔎 Search requests
* 🧠 Agent routing
* ⚡ Streaming responses
* 📚 RAG processing
* 📡 Communication with external services

Example API routes include:

```text
/api/chat
/api/reddit
/api/youtube
/api/images
/api/videos
/api/write
```

---

# 🤖 AI Agent Architecture

The project uses an agent-based approach to separate different types of tasks.

```text
                    User Query
                        │
                        ▼
                 Agent Selection
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
   🌐 Web Agent    🔴 Reddit Agent   ▶️ YouTube Agent
        │               │                │
        └───────────────┼────────────────┘
                        ▼
                  Search Results
                        │
                        ▼
                    AI Model
                        │
                        ▼
                  Final Response
```

This architecture makes it easier to add new agents and search capabilities in the future.

---

# 📂 Project Structure

The project is organized into separate frontend and backend responsibilities.

```text
PREPLEXITY-CLONE/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── App.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── SearchBar
│   │   │   ├── MessageList
│   │   │   ├── ImageGrid
│   │   │   └── VideoGrid
│   │   │
│   │   ├── hooks/
│   │   │   └── useChat
│   │   │
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   └── package.json
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── runners/
│   │   │   ├── web.ts
│   │   │   ├── reddit.ts
│   │   │   └── youtube.ts
│   │   │
│   │   ├── agents/
│   │   │   └── AI/Search Agents
│   │   │
│   │   ├── services/
│   │   │   ├── Gemini
│   │   │   ├── Groq
│   │   │   └── Search Services
│   │   │
│   │   └── server.ts
│   │
│   └── package.json
│
├── .env
├── README.md
└── package.json
```

> 📌 The exact folder names can vary depending on the current version of the repository.

---

# 🔌 API & Search Modes

The frontend communicates with the backend through different API endpoints.

| Mode       | Endpoint       | Purpose               |
| ---------- | -------------- | --------------------- |
| 🌐 Web     | `/api/chat`    | AI + web-based search |
| 🔴 Reddit  | `/api/reddit`  | Reddit search         |
| ▶️ YouTube | `/api/youtube` | YouTube search        |
| 🖼️ Images | `/api/images`  | Image search          |
| 🎥 Videos  | `/api/videos`  | Video search          |
| ✍️ Write   | `/api/write`   | AI writing            |

---

# 🔐 Environment Variables

Create a `.env` file for the required API credentials.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
SEARXNG_URL=http://localhost:8080
```

If vector search or database functionality is enabled:

```env
PINECONE_API_KEY=your_pinecone_api_key
MONGODB_URI=your_mongodb_connection_string
```

⚠️ **Never commit your `.env` file or API keys to GitHub.**

---

# ▶️ How to Run the Project

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/sonikumarisingh3493/PREPLEXITY-CLONE.git
```

```bash
cd PREPLEXITY-CLONE
```

---

## 2️⃣ Install Dependencies

Install the frontend dependencies:

```bash
npm install
```

Then install the backend dependencies if the backend is maintained separately:

```bash
cd backend
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file and add the required API keys.

```env
GEMINI_API_KEY=your_key
GROQ_API_KEY=your_key
SEARXNG_URL=http://localhost:8080
```


## 4️⃣ Start the Backend

Run the backend development server using the project's configured command.

For example:

```bash
npm run dev
```


## 5️⃣ Start the Frontend

Start the React development server:

```bash
npm run dev
```

Then open the local URL shown in your terminal.


# 🧪 Example Queries

You can test the application with queries such as:

```text
What is React?
```

```text
Explain how RAG works.
```

```text
Find React tutorials on YouTube.
```

```text
Search Reddit for discussions about JavaScript.
```

```text
Write a professional introduction for a software engineer.
```

---

# 🎯 Learning Outcomes

Through this project, I gained practical experience in:

* ⚛️ React and TypeScript development
* 🟢 Node.js and Express backend development
* 🤖 Integrating AI models
* 🔌 Building and consuming REST APIs
* 🔎 Integrating search engines
* 🧠 Understanding RAG architecture
* 🤖 Designing AI-agent workflows
* ⚡ Implementing streaming responses
* 📡 Frontend-backend communication
* 🗄️ Working with databases and vector search
* 🧩 Building modular full-stack applications
* 🐛 Debugging APIs and backend services


# 🌟 What I Built

This project helped me move beyond a basic chatbot and understand how an **AI-powered search application** can combine:

```text
🤖 Artificial Intelligence
        +
🔎 Web Search
        +
🧠 RAG
        +
🤖 Multiple Agents
        +
⚡ Streaming
        +
⚛️ React UI
        +
🟢 Express Backend
```



# 📌 Project Highlights

* 🤖 Integrated multiple specialized AI agents
* 🔎 Implemented multiple search modes
* 🌐 Connected the application with web search
* ▶️ Added YouTube search functionality
* 🖼️ Added image and video search
* 🔴 Added Reddit search
* ⚡ Implemented streaming AI responses
* 🧠 Explored RAG and vector-based retrieval
* ⚛️ Built an interactive React frontend
* 🟢 Developed backend APIs using Express
* 🔌 Integrated multiple AI and external services

---

