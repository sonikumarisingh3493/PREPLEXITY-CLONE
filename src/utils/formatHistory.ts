import { BaseMessage } from '@langchain/core/messages';

const formatChatHistoryAsString = (
  history: BaseMessage[]
): string => {
  return history
    .map((msg) => `${msg._getType()}: ${msg.content}`)
    .join('\n');
};

export default formatChatHistoryAsString;
