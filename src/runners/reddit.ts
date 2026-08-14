import dotenv from "dotenv";
dotenv.config();

import handleRedditSearch from "../agents/redditSearchAgent";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-3.5-flash",
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-embedding-001",
});

const query = process.argv.slice(2).join(" ") || "Best VS Code extensions";

const emitter = handleRedditSearch(
query,
  [],
  llm,
  embeddings
);

emitter.on("data", (data) => {
  console.log(JSON.parse(data));
});



emitter.on("error", console.error);
emitter.on("end", () => console.log("Done"));
emitter.on("error", console.error);
