"use client";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Helper to render assistant messages with elegant styling
function renderAssistantMessage(text: string) {
  // Split the text into logical blocks based on newlines
  const blocks = text.split(/\n\s*\n/); // Split by double newlines for paragraphs/sections

  return (
    <div>
      {blocks.map((block, blockIdx) => {
        const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
        const propertyRows: { key: string; value: string }[] = [];
        const otherContent: string[] = [];
        let isPropertySection = false;

        lines.forEach(line => {
          // Check for "Key: Value" pattern
          const match = line.match(/^([A-Z][\w\s]+):\s*(.*)$/);
          if (match) {
            propertyRows.push({ key: match[1], value: match[2] });
            isPropertySection = true;
          } else {
            otherContent.push(line);
          }
        });

        // If this block contains property-like key-value pairs
        if (isPropertySection && propertyRows.length > 0) {
          return (
            <div key={blockIdx} className="mb-3 p-3 bg-white rounded-lg shadow-sm break-words">
              {propertyRows.map((row, rowIdx) => {
                if (row.key.toLowerCase() === "amenities") {
                  const items = row.value.split(/,\s*/).filter(Boolean);
                  return (
                    <div key={rowIdx} className="mb-1">
                      <span className="font-bold text-blue-700 text-base">Amenities:</span>
                      <ul className="list-disc list-inside ml-2 mt-1 text-gray-800 text-base">
                        {items.map((item, itemIdx) => (
                          <li key={itemIdx} className="font-medium">{item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                // Handle the "Link:" specifically to make it clickable
                if (row.key.toLowerCase() === "link") {
                  const urlMatch = row.value.match(/\[View Offer\]\((https?:\/\/[^\s]+)\)/);
                  const url = urlMatch ? urlMatch[1] : row.value; // Extract URL or use raw value
                  return (
                    <div key={rowIdx} className="flex flex-wrap items-baseline mb-1">
                      <span className="font-bold text-blue-700 text-base min-w-[100px] mr-2">Link:</span>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                        {urlMatch ? "View Offer" : url}
                      </a>
                    </div>
                  );
                }
                return (
                  <div key={rowIdx} className="flex flex-wrap items-baseline mb-1">
                    <span className="font-bold text-blue-700 text-base min-w-[100px] mr-2">{row.key}:</span>
                    <span className="font-medium text-gray-800 text-base flex-1 break-words">{row.value}</span>
                  </div>
                );
              })}
            </div>
          );
        } else if (otherContent.length > 0) {
          // Render as a general paragraph if no key-value pairs were found
          return (
            <p key={blockIdx} className="mb-2 text-gray-800 text-base leading-relaxed break-words">
              {otherContent.join(' ')}
            </p>
          );
        }
        return null; // Should not happen if filter(Boolean) is used effectively
      })}
    </div>
  );
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setError(null);
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response || "(No response)" }]);
    } catch (err: any) {
      setError("Failed to get response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    // Increased max-w-xl to max-w-2xl for more horizontal space
    <div className="max-w-2xl mx-auto p-6 rounded-2xl shadow-xl bg-white font-inter">
      <h2 className="text-center mb-4 font-extrabold text-3xl text-gray-900">💬 PropertyPal Chat</h2>
      {/* Increased min-h-60 to min-h-80 and max-h-96 to max-h-screen-70 for better vertical scroll area */}
      <div className="min-h-80 max-h-[70vh] overflow-y-auto bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
        {messages.length === 0 && <div className="text-gray-500 text-center py-4">Ask me about properties!</div>}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex mb-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              // Adjusted max-w to be more flexible, allowing content to take more width
              // Added break-words to ensure long strings (like URLs) wrap correctly
              className={`rounded-xl p-3 max-w-[90%] sm:max-w-[75%] shadow-sm text-base break-words ${
                msg.role === "user"
                  ? "bg-blue-100 text-gray-800 shadow-blue-200/50"
                  : "bg-gray-100 text-gray-800 shadow-gray-200/50"
              }`}
            >
              {msg.role === "assistant" ? (
                renderAssistantMessage(msg.content)
              ) : (
                <p className="text-gray-800 font-medium">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={loading}
          className="flex-1 p-3 rounded-lg border border-gray-300 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-lg bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;