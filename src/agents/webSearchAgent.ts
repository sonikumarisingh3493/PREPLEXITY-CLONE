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
const basicwebSearchRetrieverPrompt = `
You will be given a conversation below and a follow up question.

You need to rephrase the follow-up question into a standalone search query.

If it is only a greeting like hi, hello or a writing request, return \`not_needed\`.

Example:

1. Follow up question: Who is Elon Musk?
Rephrased: Elon Musk

2. Follow up question: Best places to visit in Japan?
Rephrased: Best places Japan

3. Follow up question: How does ChatGPT work?
Rephrased: ChatGPT working

Conversation:
{chat_history}

Follow up question:
{query}

Rephrased question:
`;
const basicwebSearchResponsePrompt = `
You are FutureSearch, an AI assistant.

Generate an informative answer using the search results provided in the context.

Use a neutral tone.

Answer using markdown.

Use bullet points whenever appropriate.

Every statement should include citations using [number].

<context>
{context}
</context>

If nothing useful is found, politely say that no relevant information was found.

Today's date is ${new Date().toISOString()}
`;
const strParser = new StringOutputParser();
type BasicChainInput = {
  chat_history: BaseMessage[];
  query: string;
};

const createBasicwebSearchRetrieverChain = (
  llm: BaseChatModel
) => {
  return RunnableSequence.from([
    PromptTemplate.fromTemplate(
      basicwebSearchRetrieverPrompt
    ),
    llm,
    strParser,
    RunnableLambda.from(async (input: string) => {
      if (input === "not_needed") {
        return { query: "", docs: [] };
      }

      try {
        const res = await searchSearxng(input, {
          language: "en",
        });
        console.log("Total results:", res.results?.length);
        console.log("SEARCH RESULT:");
console.log(JSON.stringify(res, null, 2));

        return {
          query: input,
          docs: res.results.map(
            (r: any) =>
              new Document({
                pageContent: r.content || "",
                metadata: {
                  title: r.title || "Untitled",
                  url: r.url || "",
                },
              })
          ),
        };
      } catch (error) {
        console.error("SearXNG failed:", error);

        return {
          query: input,
          docs: [
            new Document({
              pageContent:
                "No web search results available. Answer using general knowledge.",
              metadata: {},
            }),
          ],
        };
      }
    }),
  ]);
};

const createBasicwebSearchAnsweringChain = (
  llm: BaseChatModel,
  embeddings: Embeddings
) => {
  const basicwebSearchRetrieverChain =
    createBasicwebSearchRetrieverChain(llm);

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
        basicwebSearchRetrieverChain
          .pipe(rerankDocs)
          .withConfig({
            runName: "FinalSourceRetriever",
          })
          .pipe(processDocs),
      ]),
    }),
    ChatPromptTemplate.fromMessages([
      ["system", basicwebSearchResponsePrompt],
      new MessagesPlaceholder("chat_history"),
      ["user", "{query}"],
    ]),
    llm,
    strParser,
  ]).withConfig({
    runName: "FinalResponseGenerator",
  });
};
const basicwebSearch = (
  query: string,
  history: BaseMessage[],
  llm: BaseChatModel,
  embeddings: Embeddings
) => {
  const emitter = new EventEmitter();

  try {
    const basicwebSearchAnsweringChain =
      createBasicwebSearchAnsweringChain(llm, embeddings);

    const stream = basicwebSearchAnsweringChain.streamEvents(
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

const handlewebSearch = (
  message: string,
  history: BaseMessage[],
  llm: BaseChatModel,
  embeddings: Embeddings
) => {
  const emitter = basicwebSearch(
    message,
    history,
    llm,
    embeddings
  );

  return emitter;
};

export default handlewebSearch;
