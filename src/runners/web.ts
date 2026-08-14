import handleWebSearch from "../agents/webSearchAgent";
import { HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-3.5-flash",
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-embedding-001",
});

const emitter = handleWebSearch(
  "Latest AI news",
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
