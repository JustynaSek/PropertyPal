import React from "react";

interface ChatInputProps {
  input: string;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onShowEmailForm: () => void;
  hasOffers: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  loading,
  onInputChange,
  onKeyDown,
  onSend,
  onShowEmailForm,
  hasOffers,
}) => (
  <div className="w-full">
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <input
        type="text"
        value={input}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        placeholder="Type your message..."
        disabled={loading}
        className="flex-1 p-3 rounded-lg border border-gray-300 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
      <button
        onClick={onSend}
        disabled={loading || !input.trim()}
        className="px-5 py-3 rounded-lg bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
    <div className="mt-2 w-full flex">
      <button
        type="button"
        className="w-full sm:w-auto px-5 py-3 rounded-lg bg-yellow-500 text-white font-bold text-base hover:bg-yellow-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onShowEmailForm}
        disabled={!hasOffers}
        title={hasOffers ? undefined : "No offers found to send by email"}
      >
        Send by Email
      </button>
    </div>
  </div>
);

export default ChatInput; 