import EventEmitter from "events";
import { RunnableSequence, RunnableMap, RunnableLambda } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import formatChatHistoryAsString from "../utils/formatHistory";
import { searchSearxng } from "../lib/searxng";

import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

const imageSearchChainPrompt = `
You will be given a conversation below and a follow up question.

Rephrase the follow-up question so it becomes a standalone search query.

Conversation:
{chat_history}

Question:
{query}

Standalone question:
`;

const strParser = new StringOutputParser();

const createImageSearchChain = (llm: BaseChatModel) => {
  return RunnableSequence.from([
    RunnableMap.from({
      chat_history: (input: any) =>
        formatChatHistoryAsString(input.chat_history),

      query: (input: any) => input.query,
    }),

    PromptTemplate.fromTemplate(imageSearchChainPrompt),

    llm,

    strParser,
  

    RunnableLambda.from(async (input: string) => {
      const res = await searchSearxng(input, {
        categories: ["images"],
        engines: ["bing images", "google images"],
       });

       console.log("Search Query:", input);
console.log("Results:", res.results.length);

     const results = res.results
  .filter((result: any) => {
    return (
      result.img_src &&
      result.url &&
      result.title &&
      !result.img_src.endsWith(".svg") &&
      !result.url.endsWith(".svg") &&
      !result.url.includes("commons.wikimedia.org") &&
      !result.url.includes("flickr.com") &&
      !result.url.includes("pinterest.") &&
      !result.url.includes("marketrealist.com") &&
      !result.url.includes("finance-monthly.com") &&
      !result.url.includes("businessinsider.de") 
    );
  })
  .map((result: any) => ({
    img_src: result.img_src,
    url: result.url,
    title: result.title,
  }));

  const uniqueResults = results.filter(
  (item: any, index: number, self: any[]) =>
    index === self.findIndex((t) => t.url === item.url)
);

  const portraitResults = uniqueResults.filter(
  (item: any) =>
    !item.title.toLowerCase().includes("logo") &&
    !item.title.toLowerCase().includes("icon")
);

  const rankedResults = uniqueResults.sort((a: any, b: any) => {
  const score = (item: any) => {
    let s = 0;
    
    const title = item.title.toLowerCase();
  const query = input.toLowerCase();

  if (title === query) s += 100;
  else if (title.includes(query)) s += 50;

    if (item.url.includes("wikipedia.org")) s += 15;
    if (item.url.includes("britannica")) s += 14;
    if (item.url.includes("biography.com")) s += 13;
    if (item.url.includes("reuters")) s += 12;
    if (item.url.includes("forbes")) s += 11;
    if (item.url.includes("investopedia")) s += 10;
    return s;
  };

  return score(b) - score(a);
});

return rankedResults.slice(0, 10);
    }),
  ]);
};


const imageSearch = (query: string,
  history: any[],
  llm: BaseChatModel) => {
  const emitter = new EventEmitter();

  (async () => {
    try {
      const chain = createImageSearchChain(llm);

      const images = await chain.invoke({
        chat_history: history,
        query,
      });

      emitter.emit(
        "data",
        JSON.stringify({
          type: "images",
          data: images,
        })
      );

      emitter.emit("end");
    } catch (err) {
      emitter.emit("error", err);
    }
  })();

  return emitter;
};

const handleImageSearch = (
  query: string,
  history: any[],
  llm: BaseChatModel
) => {
  return imageSearch(query, history, llm);
};

export default handleImageSearch;
