. Project Overview

Perplexity Clone is an AI-powered search and question-answering application inspired by Perplexity. The main purpose of the project is to allow users to enter a natural-language query and receive an AI-generated answer based on information retrieved from the web.

Instead of simply returning a list of search results, the system uses AI agents, web search, LLMs, and retrieval workflows to process the query and generate a meaningful response.

Your major contribution was focused on the backend and AI workflow, including the integration of 8 specialized agents.

Developed the backend architecture using Node.js and TypeScript.
Integrated Gemini APIs for LLM-based processing.
Integrated SearXNG for web search and information retrieval.
Implemented 8 specialized AI agents for different query types.
Created separate workflows for web, Reddit, YouTube, images, videos, and writing-related queries.
Implemented search-result processing and relevance filtering.
Worked with RAG/retrieval concepts to provide context to the LLM.
Implemented streaming responses so generated answers can be delivered progressively.
Connected the backend APIs with the frontend application.

PERPLEXITY CLONE
│
├── Frontend
│   ├── App.tsx
│   ├── SearchBar
│   ├── MessageList
│   ├── ImageGrid
│   └── VideoGrid
│
├── Backend
│   ├── API Routes
│   ├── Agents / Runners
│   ├── LLM Services
│   ├── Search Services
│   ├── RAG / Retrieval
│   └── Utilities
│
├── AI / LLM Layer
│   ├── Gemini
│   ├── Prompt Processing
│   └── Response Generation
│
└── Search / Retrieval
    └── SearXNG

    How project works 
    User Query
     ↓
Frontend Search Bar
     ↓
Backend API
     ↓
Query Analysis
     ↓
Select Appropriate Agent
     ↓
Web/Search Retrieval
     ↓
Process & Filter Results
     ↓
LLM / Gemini
     ↓
Generate Answer
     ↓
Stream Response
     ↓
Frontend
     ↓
User
Backend receives the query

Your Node.js/TypeScript backend receives the request through an API endpoint.

The backend determines what type of operation is required.

For example:

/api/chat
/api/reddit
/api/youtube
/api/images
/api/videos
/api/write

Technologies Used

For your project description, you can list:

Frontend: React.js, TypeScript, HTML, CSS
Backend: Node.js, TypeScript
AI/LLM: Google Gemini APIs
Search: SearXNG
AI Architecture: Multi-Agent Workflows, RAG
Tools: Git, GitHub, VS Code
