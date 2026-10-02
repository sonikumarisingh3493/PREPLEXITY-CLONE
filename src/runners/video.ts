import dotenv from "dotenv";
dotenv.config();

import handleVideoSearch from "../agents/videoSearchAgent.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-3.5-flash",
});

console.log("Runner Started");

const emitter = handleVideoSearch(
  "Node.js beginners tutorial",
  [],
  llm
);

emitter.on("data", (d) => {
  console.log(JSON.parse(d));
});

emitter.on("end", () => {
  console.log("Finished");
});

emitter.on("error", (err) => {
  console.error(err);
});
