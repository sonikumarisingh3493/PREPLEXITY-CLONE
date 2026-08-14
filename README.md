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

Contains the main AI/search agents.

webSearchAgent.ts

Handles general web search.

Responsibilities:

Receive user query
Process conversation history
Search the web using SearXNG
Process search results
Generate an AI response
Return sources
Return suggestions
Stream results
redditSearchAgent.ts

Handles Reddit-focused searches.

Responsibilities:

Search Reddit-related content
Process Reddit results
Use conversation history
Generate an AI response
Stream results to the client
youtubeSearchAgent.ts

Handles YouTube-focused searches.

Responsibilities:

Search YouTube through SearXNG
Extract video results
Process video information
Generate an AI response
Stream video results
imageSearchAgent.ts

Handles image searches.

Responsibilities:

Search image sources
Extract image results
Return image information through SSE
videoSearchAgent.ts

Handles general video searches.

Responsibilities:

Search video sources
Extract video results
Return video information
Generate AI responses where required
writingAssistantAgent.ts

Provides writing assistance.

Possible use cases:

Rewrite text
Improve grammar
Summarize
Generate content
Change tone
Improve clarity
src/lib


The model name is configured through environment variables so that the model can be changed without modifying the source code.

embeddings.ts

Contains the embedding configuration used for semantic/vector operations where required.

Embeddings can be used for:

Semantic search
Similarity comparison
Document retrieval
Context selection
Retrieval-Augmented Generation
Runners

The runners directory contains standalone scripts used to test individual backend capabilities.

For example:

src/runners/web.ts
src/runners/reddit.ts
src/runners/youtube.ts
src/runners/video.ts
src/runners/image.ts
src/runners/writing.ts

These runners allow individual agents to be tested without starting the complete Express server.

Server

The main Express server exposes the backend API.

The server:

Receives the request
Extracts the query
Converts conversation history into LangChain messages
Selects the appropriate agent
Starts the agent
Creates an SSE response
Streams results to the client
Conversation History

The backend supports conversation history.


Server-Sent Events

The backend uses Server-Sent Events (SSE) for streaming.

Instead of waiting for the entire AI response, the backend can send events as they become available.


This makes the backend suitable for a Perplexity-style streaming experience.

SSE Event Types
Sources
{
  "type": "sources",
  "data": []
}

Contains web/search sources.

Response
{
  "type": "response",
  "data": "Generated AI response"
}

Contains the AI-generated answer.

Videos
{
  "type": "videos",
  "data": []
}

Contains video search results.

Images
{
  "type": "images",
  "data": []
}

Contains image search results.

Suggestions
{
  "type": "suggestions",
  "data": []
}

Contains suggested follow-up questions.

Done
{
  "type": "done"
}

Indicates that streaming has finished.

Error
{
  "type": "error",
  "data": "Error message"
}

Indicates an error during processing.

API Endpoints
Health Check
GET /

Response:

{
  "success": true,
  "message": "Perplexity Clone Backend Running"
}
Web Search
POST /api/chat

Request:

{
  "query": "Latest AI news",
  "history": []
}

The endpoint:

Performs web search
Processes search results
Generates an AI response
Streams sources
Streams response
Streams suggestions
Reddit Search
POST /api/reddit

Request:

{
  "query": "Best Node.js frameworks according to Reddit",
  "history": []
}
YouTube Search
POST /api/youtube

Request:

{
  "query": "React tutorial 30 minutes",
  "history": []
}

Returns/streams:

Search sources
Video results
AI response
Completion event
Image Search
POST /api/images

Request:

{
  "query": "React architecture diagram",
  "history": []
}
Video Search
POST /api/videos

Request:

{
  "query": "Node.js beginners tutorial",
  "history": []
}
Writing Assistant
POST /api/write

Request:

{
  "query": "Rewrite this paragraph professionally",
  "history": []
}
Environment Variables

Create a .env file in the project root.

GEMINI_API_KEY=your_gemini_api_key


GEMINI_MODEL=your_supported_gemini_model


SEARXNG_URL=http://localhost:8080


PORT=8000

Do not commit .env to GitHub.

Add:

.env
.env.local

to .gitignore.

Gemini Configuration

The Gemini model should be configurable instead of hard-coded.

Recommended:

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: process.env.GEMINI_MODEL!,
});

Then change the model through .env:

GEMINI_MODEL=your_supported_model

This makes it easier to switch models when Google changes model availability.

SearXNG

SearXNG is used as the search layer.

The backend sends queries to SearXNG and receives aggregated results from multiple search engines.

Conceptually:

User Query
    |
    v
Search Agent
    |
    v
SearXNG
    |
    +---- Google
    +---- Bing
    +---- DuckDuckGo
    +---- YouTube
    +---- Reddit-related sources
    +---- Other configured engines
    |
    v
Search Results

The exact engines available depend on the SearXNG configuration.

Running SearXNG

The backend expects a running SearXNG instance.

Example:

SEARXNG_URL=http://localhost:8080

The backend then sends search requests to that instance.

If SearXNG engines timeout, the backend may receive:

{
  "results": []
}

This is generally a search-engine/SearXNG configuration problem rather than an Express problem.
