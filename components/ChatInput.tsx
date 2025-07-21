import React from "react";

interface ChatInputProps {
  input: string;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onShowEmailForm: () => void;
  hasOffers: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  loading,
  onInputChange,
  onKeyDown,
  onSend,
  onShowEmailForm,
  hasOffers,
  inputRef,
}) => (
  <div className="w-full bg-white rounded-xl shadow flex flex-col sm:flex-row gap-2 p-3 border border-gray-200">
    <input
      ref={inputRef}
      type="text"
      value={input}
      onChange={onInputChange}
      onKeyDown={onKeyDown}
      placeholder="Type your message..."
      disabled={loading}
      className="flex-1 p-4 rounded-lg border border-gray-300 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 transition-all"
    />
    <button
      onClick={onSend}
      disabled={loading || !input.trim()}
      className="flex items-center gap-2 px-7 py-3 rounded-full bg-gray-900 text-white font-serif text-base font-semibold shadow hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span>Sending...</span>
      ) : (
        <>
          <span>Send</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </>
      )}
    </button>
    <button
      type="button"
      className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-serif text-base font-semibold shadow hover:from-yellow-500 hover:to-yellow-600 focus:ring-2 focus:ring-yellow-300 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onShowEmailForm}
      disabled={!hasOffers}
      title={hasOffers ? undefined : "No offers found to send by email"}
    >
      Send by Email
    </button>
  </div>
);

export default ChatInput; 