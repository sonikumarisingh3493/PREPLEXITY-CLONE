import handleWebSearch from "../src/agents/webSearchAgent";
import { HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-2.5-flash",
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "text-embedding-004",
});

const emitter = handleWebSearch(
  "What is RAG?",
  [new HumanMessage("Hi")],
  llm,
  embeddings
);

emitter.on("data", (chunk) => {
  console.log("DATA:", chunk);
});

emitter.on("end", () => {
  console.log("Finished");
});

emitter.on("error", (err) => {
  console.error(err);
});