import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-3.5-flash",
});

export default llm;
