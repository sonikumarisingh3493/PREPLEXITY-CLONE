import dotenv from "dotenv";
dotenv.config();

import handleVideoSearch from "../src/agents/videoSearchAgent";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-2.5-flash",
});

async function main() {
  const result = await handleVideoSearch(
    "Node.js tutorial",
    [],
    llm
  );

  console.log(result);
}

main();