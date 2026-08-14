import { BaseMessage } from "@langchain/core/messages";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import EventEmitter from "events";
import handleStream from '../utils/handleStream.js';

import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

const writingAssistantPrompt = `
You are FutureSearch Writing Assistant.

Your job is to help users write, rewrite, improve, summarize, and edit content.

You do NOT perform web searches.

You can help with:
- Emails
- Essays
- Assignments
- LinkedIn posts
- Resumes
- Cover letters
- Reports
- Messages
- Grammar correction
- Tone improvement
- Professional writing

If the user asks for factual information that requires current web data, politely ask them to switch to Web Search mode.

Always provide clear, well-structured, and polished writing.
`;

const strParser = new StringOutputParser();

const createWritingAssistantChain = (
  llm: BaseChatModel
) => {
  return RunnableSequence.from([
    ChatPromptTemplate.fromMessages([
      ["system", writingAssistantPrompt],
      new MessagesPlaceholder("chat_history"),
      ["user", "{query}"],
    ]),
    llm,
    strParser,
  ]).withConfig({
    runName: "FinalResponseGenerator",
  });
};

const handleWritingAssistant = (
  query: string,
  history: BaseMessage[],
  llm: BaseChatModel
) => {
  const emitter = new EventEmitter();

  try {
    const chain = createWritingAssistantChain(llm);

    const stream = chain.streamEvents(
      {
        chat_history: history,
        query,
      },
      {
        version: "v1",
      }
    );

    handleStream(stream, emitter);
  } catch (error) {
    emitter.emit(
      "error",
      JSON.stringify({
        data: "An error has occurred please try again later",
      })
    );

    console.error(error);
  }

  return emitter;
};

export default handleWritingAssistant;
