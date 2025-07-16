import React from "react";
import ChatMessage from "./ChatMessage";

interface Message {
  role: "user" | "assistant" | "email-preview";
  content: string;
}

interface ChatMessageListProps {
  messages: Message[];
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => (
  <>
    {messages.filter(msg => msg.role !== "email-preview").map((msg, i) => (
      <div
        key={i}
        className={`flex mb-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`rounded-xl p-3 max-w-[90%] sm:max-w-[75%] shadow-sm text-base break-words ${
            msg.role === "user"
              ? "bg-blue-100 text-gray-800 shadow-blue-200/50"
              : "bg-gray-100 text-gray-800 shadow-gray-200/50"
          }`}
        >
          <ChatMessage role={msg.role} content={msg.content} />
        </div>
      </div>
    ))}
  </>
);

export default ChatMessageList; 