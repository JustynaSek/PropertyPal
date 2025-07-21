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
  <div className="flex flex-col gap-3">
    {messages.filter(msg => msg.role !== "email-preview").map((msg, i) => (
      <div
        key={i}
        className={`flex items-end mb-0 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
      >
        <ChatMessage role={msg.role} content={msg.content} />
      </div>
    ))}
  </div>
);

export default ChatMessageList; 