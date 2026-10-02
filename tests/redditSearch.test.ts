import dotenv from "dotenv";
dotenv.config();

import handleRedditSearch from "../src/agents/redditSearchAgent";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-2.5-flash",
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "text-embedding-004",
});

const emitter = handleRedditSearch(
  "Best VS Code extensions",
  [],
  llm,
  embeddings
);

emitter.on("data", console.log);
emitter.on("end", () => console.log("Done"));
emitter.on("error", console.error);