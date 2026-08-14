import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";

import handleWebSearch from "./agents/webSearchAgent.js";
import handleRedditSearch from "./agents/redditSearchAgent.js";
import handleYoutubeSearch from "./agents/youtubeSearchAgent.js";
import handleImageSearch from "./agents/imageSearchAgent.js";
import handleVideoSearch from "./agents/videoSearchAgent.js";
import handleWritingAssistant from "./agents/writingAssistantAgent.js";

import llm from "./lib/llm.js";
import embeddings from "./lib/embeddings.js";

const app = express();

/* =========================
   CORS
========================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Perplexity Clone Backend Running",
  });
});

/* =========================
   HISTORY CONVERTER
========================= */

const convertHistoryToMessages = (history: any[] = []) => {
  return history.map((message) => {
    if (message.role === "user") {
      return new HumanMessage(message.content);
    }

    if (message.role === "assistant") {
      return new AIMessage(message.content);
    }

    if (message.role === "system") {
      return new SystemMessage(message.content);
    }

    return new HumanMessage(message.content);
  });
};

/* =========================
   STREAMING RESPONSE HANDLER
========================= */

const handleStreamingResponse = (
  emitter: any,
  res: express.Response
) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  let closed = false;

  const send = (data: any) => {
    if (closed || res.writableEnded) return;

    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  emitter.on("data", (chunk: string) => {
    try {
      const parsed = JSON.parse(chunk);

     if (parsed.type === "sources") {
  send({
    type: "sources",
    data: parsed.data,
  });
}

if (parsed.type === "response") {
  send({
    type: "response",
    data: parsed.data,
  });
}

if (parsed.type === "videos") {
  send({
    type: "videos",
    data: parsed.data,
  });
}

if (parsed.type === "images") {
  send({
    type: "images",
    data: parsed.data,
  });
}

if (parsed.type === "suggestions") {
  send({
    type: "suggestions",
    data: parsed.data,
  });
}
    } catch (error) {
      console.error("Stream parsing error:", error);
    }
  });

  emitter.on("end", () => {
    if (!closed) {
      send({ type: "done" });
      closed = true;
      res.end();
    }
  });

  emitter.on("error", (error: any) => {
    console.error("STREAM ERROR:", error);

    if (!closed && !res.writableEnded) {
      send({
        type: "error",
        data: error instanceof Error
          ? error.message
          : String(error),
      });

      closed = true;
      res.end();
    }
  });

  res.on("close", () => {
    closed = true;
  });
};

/* =========================
   WEB SEARCH
========================= */

app.post('/api/chat', async (req, res) => {
  console.log("================================");
  console.log("POST /api/chat RECEIVED");
  console.log("BODY:", req.body);
  console.log("================================");

  try {
    const { query, history = [] } = req.body;

    console.log("QUERY:", query);
    console.log("HISTORY:", history);

    const chatHistory = convertHistoryToMessages(history);

    console.log("CONVERTED HISTORY:", chatHistory);

    const emitter = handleWebSearch(
      query,
      chatHistory,
      llm,
      embeddings
    );

    console.log("WEB SEARCH AGENT CREATED");

    handleStreamingResponse(emitter, res);

    console.log("STREAM HANDLER ATTACHED");

  } catch (error) {
    console.error("🔥🔥🔥 CHAT ROUTE ERROR 🔥🔥🔥");
    console.error(error);
    console.error(
      error instanceof Error ? error.stack : String(error)
    );

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error instanceof Error
          ? error.message
          : String(error),
      });
    }
  }
});
/* =========================
   REDDIT
========================= */

app.post("/api/reddit", async (req, res) => {
  try {
    const {
      query,
      history = [],
    } = req.body;

    console.log("REDDIT QUERY:", query);

    const chatHistory =
      convertHistoryToMessages(history);

    const emitter = handleRedditSearch(
      query,
      chatHistory,
      llm,
      embeddings
    );

    handleStreamingResponse(emitter, res);
  } catch (error) {
    console.error("REDDIT ERROR:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
});

/* =========================
   YOUTUBE
========================= */

app.post("/api/youtube", async (req, res) => {
  try {
    const {
      query,
      history = [],
    } = req.body;

    console.log("YOUTUBE QUERY:", query);

    const chatHistory =
      convertHistoryToMessages(history);

    const emitter = handleYoutubeSearch(
      query,
      chatHistory,
      llm,
      embeddings
    );

    handleStreamingResponse(emitter, res);
  } catch (error) {
    console.error("YOUTUBE ERROR:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
});

/* =========================
   IMAGE SEARCH
========================= */

app.post("/api/images", async (req, res) => {
  try {
    const {
      query,
      history = [],
    } = req.body;

    console.log("IMAGE QUERY:", query);

    const chatHistory =
      convertHistoryToMessages(history);

    const emitter = handleImageSearch(
      query,
      chatHistory,
      llm
    );

    handleStreamingResponse(emitter, res);
  } catch (error) {
    console.error("IMAGE ERROR:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
});

/* =========================
   VIDEO SEARCH
========================= */

app.post("/api/videos", async (req, res) => {
  try {
    const {
      query,
      history = [],
    } = req.body;

    console.log("VIDEO QUERY:", query);

    const chatHistory =
      convertHistoryToMessages(history);

    const emitter = handleVideoSearch(
      query,
      chatHistory,
      llm
    );

    handleStreamingResponse(emitter, res);
  } catch (error) {
    console.error("VIDEO ERROR:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
});

/* =========================
   WRITING ASSISTANT
========================= */

app.post("/api/write", async (req, res) => {
  try {
    const {
      query,
      history = [],
    } = req.body;

    console.log("WRITE QUERY:", query);

    const chatHistory =
      convertHistoryToMessages(history);

    const emitter = handleWritingAssistant(
      query,
      chatHistory,
      llm
    );

    handleStreamingResponse(emitter, res);
  } catch (error) {
    console.error("WRITE ERROR:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
