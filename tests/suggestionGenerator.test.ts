import dotenv from "dotenv";
dotenv.config();

import generateSuggestions from "../src/agents/suggestionGeneratorAgent";
import { HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-2.5-flash",
});

async function main() {
  const suggestions = await generateSuggestions(
    {
      chat_history: [
        new HumanMessage("Tell me about AI.")
      ]
    },
    llm
  );

  console.log(suggestions);
}

main();