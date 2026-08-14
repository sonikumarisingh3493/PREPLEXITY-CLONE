import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import handleImageSearch from "../agents/imageSearchAgent";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-3.5-flash",
  temperature: 0.3,
});

async function run() {
 const emitter = handleImageSearch(
  "Elon Musk",
  [],
  llm
);

emitter.on("data", (data) => {
  console.log(JSON.parse(data));
});

emitter.on("end", () => {
  console.log("Image search finished");
});

emitter.on("error", (err) => {
  console.error(err);
});

console.log("Runner Started")
}
run();
