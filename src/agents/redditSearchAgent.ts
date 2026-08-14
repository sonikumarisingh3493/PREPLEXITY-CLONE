import { BaseMessage } from "@langchain/core/messages";
import {
  RunnableSequence,
  RunnableMap,
  RunnableLambda,
} from "@langchain/core/runnables";
import formatChatHistoryAsString from "../utils/formatHistory";
import {
  PromptTemplate,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { searchSearxng } from "../lib/searxng";
import { Document } from "@langchain/core/documents";
import computeSimilarity from "../utils/computeSimilarity";
import EventEmitter from "events";
import handleStream from "../utils/handleStream";

import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { Embeddings } from "@langchain/core/embeddings";
const basicRedditSearchRetrieverPrompt = `
You will be given a conversation below and a follow up question.

You need to rephrase the follow-up question into a standalone search query.

If it is only a greeting like hi, hello or a writing request, return \`not_needed\`.

Example:

1. Follow up question: What do people think about React?
Rephrased: React opinions

2. Follow up question: Best laptop for programming?
Rephrased: Best laptop programming

3. Follow up question: Is Java difficult to learn?
Rephrased: Java learning difficulty

Conversation:
{chat_history}

Follow up question:
{query}

Rephrased question:
`;
const basicRedditSearchResponsePrompt = `
You are FutureSearch, an AI assistant.

You are working in focus mode "Reddit".

Generate an informative answer using only the Reddit search results provided in the context.

Use a neutral tone.

Answer using markdown.

Use bullet points whenever appropriate.

Every statement should include citations using [number].

<context>
{context}
</context>

If nothing useful is found, politely say that no relevant Reddit discussions were found.

Today's date is ${new Date().toISOString()}
`;
const strParser = new StringOutputParser();
type BasicChainInput = {
  chat_history: BaseMessage[];
  query: string;
};

const createBasicRedditSearchRetrieverChain = (
  llm: BaseChatModel
) => {
  return RunnableSequence.from([
    PromptTemplate.fromTemplate(
      basicRedditSearchRetrieverPrompt
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
        engines: ["reddit"],
      });

      const documents = res.results.map(
        (result: any) =>
          new Document({
            pageContent: result.content,
            metadata: {
              title: result.title,
              url: result.url,
              ...(result.img_src && {
                img_src: result.img_src,
              }),
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
const createBasicRedditSearchAnsweringChain = (
  llm: BaseChatModel,
  embeddings: Embeddings
) => {
  const basicRedditSearchRetrieverChain =
    createBasicRedditSearchRetrieverChain(llm);

  const processDocs = async (docs: Document[]) => {
    return docs
      .map((_, index) => `${index + 1}. ${docs[index].pageContent}`)
      .join("\n");
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
        basicRedditSearchRetrieverChain
          .pipe(rerankDocs)
          .withConfig({
            runName: "FinalSourceRetriever",
          })
          .pipe(processDocs),
      ]),
    }),
    ChatPromptTemplate.fromMessages([
      ["system", basicRedditSearchResponsePrompt],
      new MessagesPlaceholder("chat_history"),
      ["user", "{query}"],
    ]),
    llm,
    strParser,
  ]).withConfig({
    runName: "FinalResponseGenerator",
  });
};
const basicRedditSearch = (
  query: string,
  history: BaseMessage[],
  llm: BaseChatModel,
  embeddings: Embeddings
) => {
  const emitter = new EventEmitter();

  try {
    const basicRedditSearchAnsweringChain =
      createBasicRedditSearchAnsweringChain(llm, embeddings);

    const stream = basicRedditSearchAnsweringChain.streamEvents(
      {
        chat_history: history,
        query: query,
      },
      {
        version: "v1",
      }
    );

    handleStream(stream, emitter);
  }catch (error) {
  console.error("FULL ERROR:");
  console.error(error);

  emitter.emit(
    "data",
    JSON.stringify({
      type: "error",
      data: String(error),
    })
  );
}

  return emitter;
};

const handleRedditSearch = (
  message: string,
  history: BaseMessage[],
  llm: BaseChatModel,
  embeddings: Embeddings
) => {
  const emitter = basicRedditSearch(
    message,
    history,
    llm,
    embeddings
  );

  return emitter;
};

export default handleRedditSearch;
