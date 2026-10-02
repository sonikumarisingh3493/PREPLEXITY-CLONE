type Props = {
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
  loading: boolean;
  onKeyDown?: (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void;
};

export default function SearchBar({
  input,
  setInput,
  sendMessage,
  loading,
  onKeyDown,
}: Props) {
  return (
    <div className="search-bar">

      <input
        type="text"
        value={input}
        placeholder="Ask anything..."
        onChange={(e) =>
          setInput(e.target.value)
        }
        onKeyDown={onKeyDown}
        disabled={loading}
      />

      <button
        onClick={sendMessage}
        disabled={
          loading || !input.trim()
        }
      >
        {loading ? "Searching..." : "Send"}
      </button>

    </div>
  );
}