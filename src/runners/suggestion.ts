import dotenv from "dotenv";
dotenv.config();

import generateSuggestions from "../agents/suggestionGeneratorAgent.js";
import { HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-3.5-flash",
});

async function main() {
  try {
  const suggestions = await generateSuggestions(
    {
      chat_history: [
        new HumanMessage("Tell me about AI.")
      ]
    },
    llm
  );

  console.log(suggestions);
} catch (error) {
    console.error("Suggestion error:", error);
  }
}


main();
