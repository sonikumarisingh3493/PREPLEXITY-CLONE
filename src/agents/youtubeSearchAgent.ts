import { BaseMessage } from "@langchain/core/messages";
import {
  RunnableSequence,
  RunnableMap,
  RunnableLambda,
} from "@langchain/core/runnables";
import formatChatHistoryAsString from "../utils/formatHistory.js";
import {
  PromptTemplate,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { searchSearxng } from "../lib/searxng.js";
import { Document } from "@langchain/core/documents";
import computeSimilarity from "../utils/computeSimilarity.js";
import EventEmitter from "events";
import handleStream from "../utils/handleStream.js";

import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { Embeddings } from "@langchain/core/embeddings";
const basicyoutubeSearchRetrieverPrompt = `
You will be given a conversation below and a follow up question.

You need to rephrase the follow-up question into a standalone search query.

If it is only a greeting like hi, hello or a writing request, return \`not_needed\`.

Example:

1. Follow up question: Best Java tutorial on YouTube?
Rephrased: Java tutorial YouTube

2. Follow up question: Learn React from videos
Rephrased: React tutorial videos

3. Follow up question: Python interview preparation videos
Rephrased: Python interview preparation YouTube

Conversation:
{chat_history}

Follow up question:
{query}

Rephrased question:
`;
const basicyoutubeSearchResponsePrompt = `
You are FutureSearch, an AI assistant.

You are working in focus mode "YouTube".

Generate an answer using ONLY the YouTube search results provided in the context.

IMPORTANT FORMATTING RULES:

1. Present each video as a separate numbered section.
2. Leave ONE blank line between every video.
3. Use this exact structure for every video:

## 1. Video Title

**Description:** Short description [1]

**Author:** Author name [1]

**Duration:** Video duration [1]

**YouTube:** URL [1]

## 2. Video Title

**Description:** Short description [2]

**Author:** Author name [2]

**Duration:** Video duration [2]

**YouTube:** URL [2]

4. Do NOT combine multiple videos into one paragraph.
5. Do NOT place two video titles directly next to each other.
6. Keep each video's information grouped together.
7. Leave a blank line after every field.
8. Do not add unnecessary introduction or conclusion.
9. Use markdown.
10. Every statement based on a search result must have its citation [number].
11. If nothing useful is found, say:
"No relevant YouTube videos were found."

Search results:
{context}

Today's date is ${new Date().toISOString()}
`;
const strParser = new StringOutputParser();
type BasicChainInput = {
  chat_history: BaseMessage[];
  query: string;
};

const createBasicyoutubeSearchRetrieverChain = (
  llm: BaseChatModel
) => {
  return RunnableSequence.from([
    PromptTemplate.fromTemplate(
      basicyoutubeSearchRetrieverPrompt
    ),
    llm,
    strParser,
    RunnableLambda.from(async (input: string) => {
      if (input === "not_needed") {
        return {
          query: "",
          docs: [],
        };
      }

      const res = await searchSearxng(input, {
        language: "en",
        engines:["youtube"],
      });

      const youtubeResults = res.results
  .filter((video: any) => video.engine === "youtube")
  .slice(0, 10);

const documents = youtubeResults.map(
  (result: any) =>
    new Document({
      pageContent: result.content || result.title || "",
      metadata: {
        title: result.title || "",
        url: result.url || "",
        thumbnail: result.thumbnail || "",
        iframe_src: result.iframe_src || "",
        author: result.author || "",
        length: result.length || "",
        engine: result.engine || "youtube",
      },
    })
);

      return {
        query: input,
        docs: documents,
      };
    }),
  ]);
};
const createBasicyoutubeSearchAnsweringChain = (
  llm: BaseChatModel,
  embeddings: Embeddings
) => {
  const basicyoutubeSearchRetrieverChain =
    createBasicyoutubeSearchRetrieverChain(llm);

 const processDocs = async (docs: Document[]) => {
  return docs.map((doc, index) => ({
    id: index + 1,

    title: doc.metadata.title || "Untitled Video",

    description: doc.pageContent || "",

    author: doc.metadata.author || "",

    duration: doc.metadata.length || "",

    url: doc.metadata.url || "",

    img_src:
      doc.metadata.thumbnail ||
      "",

    iframe_src:
      doc.metadata.iframe_src ||
      "",
  }));
};
  const rerankDocs = async ({
    query,
    docs,
  }: {
    query: string;
    docs: Document[];
  }) => {
    if (docs.length === 0) {
      return docs;
    }

    const docsWithContent = docs.filter(
      (doc) => doc.pageContent && doc.pageContent.length > 0
    );

    const [docEmbeddings, queryEmbedding] = await Promise.all([
      embeddings.embedDocuments(
        docsWithContent.map((doc) => doc.pageContent)
      ),
      embeddings.embedQuery(query),
    ]);

    const similarity = docEmbeddings.map((docEmbedding, i) => {
      const sim = computeSimilarity(queryEmbedding, docEmbedding);

      return {
        index: i,
        similarity: sim,
      };
    });

    const sortedDocs = similarity
      .sort((a, b) => b.similarity - a.similarity)
      .filter((sim) => sim.similarity > 0.5)
      .slice(0, 15)
      .map((sim) => docsWithContent[sim.index]);

    return sortedDocs;
  };

  return RunnableSequence.from([
    RunnableMap.from({
      query: (input: BasicChainInput) => input.query,
      chat_history: (input: BasicChainInput) => input.chat_history,
      context: RunnableSequence.from([
        (input) => ({
          query: input.query,
          chat_history: formatChatHistoryAsString(input.chat_history),
        }),
        basicyoutubeSearchRetrieverChain
          .pipe(rerankDocs)
          .withConfig({
            runName: "FinalSourceRetriever",
          })
          .pipe(processDocs),
      ]),
    }),
    ChatPromptTemplate.fromMessages([
      ["system", basicyoutubeSearchResponsePrompt],
      new MessagesPlaceholder("chat_history"),
      ["user", "{query}"],
    ]),
    llm,
    strParser,
  ]).withConfig({
    runName: "FinalResponseGenerator",
  });
};
const basicyoutubeSearch = (
  query: string,
  history: BaseMessage[],
  llm: BaseChatModel,
  embeddings: Embeddings
) => {
  const emitter = new EventEmitter();

  try {
    const basicyoutubeSearchAnsweringChain =
      createBasicyoutubeSearchAnsweringChain(llm, embeddings);

    const stream = basicyoutubeSearchAnsweringChain.streamEvents(
      {
        chat_history: history,
        query: query,
      },
      {
        version: "v1",
      }
    );

    handleStream(stream, emitter);
  } catch (err) {
    emitter.emit(
      "error",
      JSON.stringify({
        data: "An error has occurred please try again later",
      })
    );

    console.error(err);
  }

  return emitter;
};

const handleyoutubeSearch = (
  message: string,
  history: BaseMessage[],
  llm: BaseChatModel,
  embeddings: Embeddings
) => {
  const emitter = basicyoutubeSearch(
    message,
    history,
    llm,
    embeddings
  );

  return emitter;
};

export default handleyoutubeSearch;
