import "dotenv/config";

import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";

import handleAcademicSearch from "../agents/academicSearchAgent.js";


const apiKey =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error(
    "No API key found. Please set GEMINI_API_KEY or GOOGLE_API_KEY in your .env file."
  );
}

const llm = new ChatGoogleGenerativeAI({
  apiKey,
  model: "gemini-3.5-flash",
  temperature: 0.3,
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey,
  model: "gemini-embedding-001",
});

const emitter = handleAcademicSearch(
  "LLM hallucinations",
  [],
  llm,
  embeddings
);

emitter.on("data", (d) => {
    const data = JSON.parse(d);
    console.log(JSON.stringify(data, null, 2));
});

emitter.on("end", () => {
  console.log("Academic search finished");
});

emitter.on("error", (err) => {
  console.error(err);
});
