import { useEffect, useRef, useState } from "react";

import SearchBar from "./components/SearchBar";
import MessageList from "./components/MessageList";
import ImageGrid from "./components/ImageGrid";
import VideoGrid from "./components/VideoGrid";

import type { Message, Mode } from "./types/chat";

const API_BASE = "http://localhost:8000";

const endpointMap: Record<Mode, string> = {
  web: "/api/chat",
  reddit: "/api/reddit",
  youtube: "/api/youtube",
  images: "/api/images",
  videos: "/api/videos",
  write: "/api/write",
};

const modes: Mode[] = [
  "web",
  "reddit",
  "youtube",
  "images",
  "videos",
  "write",
];

type ImageResult = {
  img_src: string;
  url: string;
  title: string;
};

type VideoResult = {
  img_src: string;
  url: string;
  title: string;
  iframe_src?: string;
};

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<Mode>("web");
  const [loading, setLoading] = useState(false);

  const [imageResults, setImageResults] = useState<ImageResult[]>([]);
  const [videoResults, setVideoResults] = useState<VideoResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // --------------------------------------------------
  // AUTO SCROLL
  // --------------------------------------------------

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  // --------------------------------------------------
  // SEND MESSAGE
  // --------------------------------------------------
const sendMessage = async () => {
  if (!input.trim() || loading) return;

  const currentInput = input.trim();
  const currentHistory = [...messages];

  const userMessage: Message = {
    role: "user",
    content: currentInput,
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setImageResults([]);
  setVideoResults([]);
  setSuggestions([]);
  setLoading(true);

  
  try {
    const endpoint = endpointMap[mode];
    const url = `${API_BASE}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        query: currentInput,
        history: currentHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No streaming response received.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, {
        stream: true,
      });

      const events = buffer.split("\n\n");
      buffer = events.pop() || "";

      for (const event of events) {
        const line = event
          .split("\n")
          .find((line) => line.startsWith("data:"));

        if (!line) continue;

        const jsonString = line
          .replace(/^data:\s*/, "")
          .trim();

        if (!jsonString) continue;

        try {
          const parsed = JSON.parse(jsonString);

          console.log("STREAM DATA:", parsed);

          if (parsed.type === "response") {
  const chunk = parsed.data || "";

  setMessages((prev) => {
    const updated = [...prev];

    const lastIndex = updated.length - 1;

    if (
      lastIndex >= 0 &&
      updated[lastIndex].role === "assistant"
    ) {
      updated[lastIndex] = {
        ...updated[lastIndex],
        content:
          updated[lastIndex].content + chunk,
      };
    } else {
      updated.push({
        role: "assistant",
        content: chunk,
      });
    }

    return updated;
  });
}

          if (parsed.type === "images") {
            if (Array.isArray(parsed.data)) {
              setImageResults(parsed.data);
            }
          }

          if (parsed.type === "videos") {
            if (Array.isArray(parsed.data)) {
              setVideoResults(parsed.data);
            }
          }

          if (parsed.type === "suggestions") {
            if (Array.isArray(parsed.data)) {
              setSuggestions(parsed.data);
            }
          }

          if (parsed.type === "done") {
            console.log("STREAM FINISHED");
          }

          if (parsed.type === "error") {
            throw new Error(
              parsed.data || "Backend streaming error"
            );
          }
        } catch (parseError) {
          console.error(
            "SSE PARSE ERROR:",
            parseError
          );
        }
      }
    }
  } catch (error: unknown) {
    console.error("FRONTEND ERROR:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong.";

    setMessages((prev) => {
      const updated = [...prev];

      const lastIndex = updated.length - 1;

      if (
        lastIndex >= 0 &&
        updated[lastIndex].role === "assistant"
      ) {
        updated[lastIndex] = {
          ...updated[lastIndex],
          content: errorMessage,
        };
      }

      return updated;
    });
  } finally {
    setLoading(false);
  }
};

  // --------------------------------------------------
  // ENTER KEY
  // --------------------------------------------------

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();

      sendMessage();
    }
  };

  // --------------------------------------------------
  // SUGGESTION CLICK
  // --------------------------------------------------

  const handleSuggestionClick = (
    suggestion: string
  ) => {
    setInput(suggestion);
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="app">

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="header">
        <h1>Perplexity Clone</h1>

        <p>
          AI research assistant search, AI + Web
          Search + Images + Videos and create content
          and also give suggestion.
        </p>
      </header>

      {/* ==========================================
          MODE BUTTONS
      ========================================== */}

      <div className="modes">
        {modes.map((m) => (
          <button
            key={m}
            className={
              mode === m ? "active" : ""
            }
            onClick={() => {
              setMode(m);

              // Clear old results when changing mode
              setImageResults([]);
              setVideoResults([]);
              setSuggestions([]);
            }}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ==========================================
          CHAT AREA
      ========================================== */}

      <main className="chat-area">

        {/* MESSAGES */}

        <MessageList
          messages={messages}
        />

        {/* ======================================
            IMAGES
        ====================================== */}

        {mode === "images" &&
          imageResults.length > 0 && (
            <ImageGrid
              images={imageResults}
            />
          )}

        {/* ======================================
            VIDEOS
        ====================================== */}

        {mode === "videos" &&
          videoResults.length > 0 && (
            <VideoGrid
              videos={videoResults}
            />
          )}

        {/* ======================================
            SUGGESTIONS
        ====================================== */}

        {suggestions.length > 0 && (
          <div className="suggestions">

            <h3>Related questions</h3>

            {suggestions.map(
              (suggestion, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleSuggestionClick(
                      suggestion
                    )
                  }
                >
                  {suggestion}
                </button>
              )
            )}

          </div>
        )}

        {/* ======================================
            LOADING
        ====================================== */}

        {loading && (
          <div className="loading">
            Searching...
          </div>
        )}

        {/* ======================================
            AUTO SCROLL TARGET
        ====================================== */}

        <div
          ref={messagesEndRef}
          style={{
            height: "1px",
          }}
        />

      </main>

      {/* ==========================================
          BOTTOM SEARCH BAR
      ========================================== */}

      <div className="bottom-search">
        <SearchBar
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          loading={loading}
          onKeyDown={handleKeyDown}
        />
      </div>

    </div>
  );
}