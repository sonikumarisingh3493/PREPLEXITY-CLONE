# Perplexity Clone - Backend

A backend implementation of a Perplexity-style AI search assistant built with **Node.js, TypeScript, Express, LangChain, Google Gemini, SearXNG, and Server-Sent Events (SSE)**.

The backend provides multiple AI-powered search and assistant capabilities including web search, Reddit search, YouTube search, video search, image search, and writing assistance.

> Note: This repository currently contains the **backend only**. No frontend is included.

---

## Features

- AI-powered web search
- Reddit search
- YouTube search
- Video search
- Image search
- Writing assistant
- Conversation history support
- Google Gemini integration
- LangChain integration
- SearXNG metasearch integration
- Server-Sent Events (SSE) streaming
- Source/result streaming
- Video result streaming
- Image result streaming
- AI response streaming
- Suggestion streaming
- Modular agent architecture
- Environment variable configuration
- TypeScript support
- Express REST API
- CORS configuration

---

# Architecture

The backend follows a modular agent-based architecture.

```text
                         Client
                           |
                           |
                           v
                    Express REST API
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
      Web Search       Reddit Search    YouTube Search
        Agent             Agent             Agent
          |                |                |
          +----------------+----------------+
                           |
                           v
                        SearXNG
                           |
                           v
                    Search Results
                           |
                           v
                    LangChain / Gemini
                           |
                           v
                    AI Generated Result
                           |
                           v
                    Event Emitter
                           |
                           v
                         SSE
                           |
                           v
                        Client

Technology Stack
Runtime
Node.js
TypeScript
Web Server
Express.js
CORS
AI
Google Gemini
LangChain
@langchain/google-genai
@langchain/core
Search
SearXNG
Environment
dotenv
Project Structure
backend-perplexity/
│
├── src/
│   │
│   ├── agents/
│   │   ├── webSearchAgent.ts
│   │   ├── redditSearchAgent.ts
│   │   ├── youtubeSearchAgent.ts
│   │   ├── imageSearchAgent.ts
│   │   ├── videoSearchAgent.ts
│   │   └── writingAssistantAgent.ts
│   │
│   ├── lib/
│   │   ├── llm.ts
│   │   └── embeddings.ts
│   │
│   ├── runners/
│   │   ├── web.ts
│   │   ├── reddit.ts
│   │   ├── youtube.ts
│   │   ├── image.ts
│   │   ├── video.ts
│   │   ├── writing.ts
│   │   ├── academic.ts
│   │   └── suggestion.ts
│   │
│   └── server.ts
│
├── tests/
│   ├── redditSearch.test.ts
│   ├── suggestionGenerator.test.ts
│   ├── videoSearch.test.ts
│   ├── webSearch.test.ts
│   ├── writingAssistant.test.ts
│   └── youtubeSearch.test.ts
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
Directory Explanation
src/agents

