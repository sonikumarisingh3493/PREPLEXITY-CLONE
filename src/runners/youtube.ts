import dotenv from "dotenv";
dotenv.config();

import handleYoutubeSearch from "../agents/youtubeSearchAgent.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// Initialize Gemini
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-3.5-flash",
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY!,
   model: "gemini-embedding-001",
});

const emitter = handleYoutubeSearch(
  "Learn React in 30 minutes",
  [],
  llm,
  embeddings
);

emitter.on("data", (chunk: any) => {
  console.log(chunk);
});

emitter.on("end", () => {
  console.log("✅ Test completed");
});

emitter.on("error", (err: any) => {
  console.error(err);
});
