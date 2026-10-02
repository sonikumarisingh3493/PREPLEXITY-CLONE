import type { Message } from "../types/chat";
import ReactMarkdown from "react-markdown";

type Props = {
  messages: Message[];
};

export default function MessageList({
  messages,
}: Props) {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.role}`}
        >
          <strong>
            {message.role === "user"
              ? "You:"
              : "AI:"}
          </strong>

          <div className="message-content">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}