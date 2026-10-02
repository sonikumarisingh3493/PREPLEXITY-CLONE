import { RunnableSequence, RunnableMap } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import formatChatHistoryAsString from "../utils/formatHistory.js";
import { ListLineOutputParser } from "../lib/outputparsers/listLineoutputparser.js";

import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

const suggestionGeneratorPrompt = `
You are an AI follow-up suggestion generator.

Based on the conversation history, generate 4 to 5 relevant follow-up questions that the user might ask next.

Rules:
- Suggestions should be medium length.
- Suggestions should be specific to the conversation.
- Avoid generic suggestions like "Tell me more".
- Each suggestion must be on a new line.
- Wrap all suggestions inside <suggestions> and </suggestions> tags.

Conversation:
{chat_history}

Output format:
<suggestions>
Suggestion 1
Suggestion 2
Suggestion 3
Suggestion 4
Suggestion 5
</suggestions>
`;

const outputParser = new ListLineOutputParser({
  key: "suggestions",
});

const createSuggestionGeneratorChain = (
  llm: BaseChatModel
) => {
  return RunnableSequence.from([
    RunnableMap.from({
      chat_history: (input: any) =>
        formatChatHistoryAsString(input.chat_history),
    }),

    PromptTemplate.fromTemplate(suggestionGeneratorPrompt),

    llm,
  ]);
};

const generateSuggestions = async (
  input: { chat_history: any[] },
  llm: BaseChatModel
) => {
  // Make suggestions deterministic
  (llm as any).temperature = 0;

  const chain = createSuggestionGeneratorChain(llm);

  const response = await chain.invoke(input);

  // response AIMessage ho sakta hai, isliye text nikalo
  const text =
    typeof response === "string"
      ? response
      : (response as any).content || "";

  return outputParser.parse(text);
};

export default generateSuggestions;
