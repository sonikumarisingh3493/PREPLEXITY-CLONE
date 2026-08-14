import dotenv from "dotenv";
dotenv.config();

import handleWritingAssistant from "../agents/writingAssistantAgent.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

// Initialize Gemini LLM
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-3.5-flash",
});

async function main() {
  try {
    const emitter = handleWritingAssistant(
      "Write a cover letter for Google",
      [
        new HumanMessage(
          "I am a Computer Science student with React, Node.js and TypeScript experience."
        ),
      ],
      llm
    );

    emitter.on("data", (chunk: any) => {
      console.log(chunk);
    });

    emitter.on("end", () => {
      console.log("✅ Writing Assistant Test Completed");
    });

    emitter.on("error", (err: any) => {
      console.error("❌ Error:", err);
    });
  } catch (err) {
    console.error(err);
  }
}

main();
