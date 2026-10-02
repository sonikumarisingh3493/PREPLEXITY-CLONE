import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY!,
});

async function main() {
  const result = await embeddings.embedQuery("hello world");
  console.log(result.length);
}

main().catch(console.error);
