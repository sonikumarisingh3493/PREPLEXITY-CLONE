import EventEmitter from "events";
import {
  RunnableLambda,
  RunnableMap,
  RunnableSequence,
} from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

import formatChatHistoryAsString from "../utils/formatHistory.js";
import { searchSearxng } from "../lib/searxng.js";

const prompt = `
You are a search query generator.

Given a conversation and a user question, rewrite the question into a short search query.

Rules:
- Return ONLY the search query.
- Do NOT answer the question.
- Do NOT explain anything.
- Keep it under 8 words.

Examples:

Question: How do I learn Node.js?
Search Query: Node.js tutorial

Question: Explain LLM hallucinations
Search Query: LLM hallucinations

Conversation:
{chat_history}

Question:
{query}

Search Query:
`;

const parser = new StringOutputParser();

const createVideoChain = (llm: BaseChatModel) =>
  RunnableSequence.from([
    RunnableMap.from({
      chat_history: (i: any) =>
        formatChatHistoryAsString(i.chat_history),
      query: (i: any) => i.query,
    }),

   RunnableLambda.from(async (input: any) => {
    console.log(input);

  const query = input.query;

  const res = await searchSearxng(query, {
    categories: ["videos"],
    engines: ["youtube", "bing videos", "dailymotion"],
  });

  console.log("Video results:", res.results?.lengt || 0);

return (res.results || []).slice(0, 10);
}),
  ]);
const handleVideoSearch = (
  query: string,
  history: any[],
  llm: BaseChatModel
) => {
  const emitter = new EventEmitter();

  (async () => {
    try {
      const chain = createVideoChain(llm);

      const videos = await chain.invoke({
        chat_history: history,
        query,
      });

      emitter.emit(
        "data",
        JSON.stringify({
          type: "videos",
          data: videos,
        })
      );

      emitter.emit("end");
    } catch (e) {
      emitter.emit("error", e);
    }
  })();

  return emitter;
};

export default handleVideoSearch;
