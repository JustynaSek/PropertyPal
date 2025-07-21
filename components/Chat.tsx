"use client";
import React, { useState, useRef, useEffect } from "react";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import EmailForm from "./EmailForm";
import EmailPreview from "./EmailPreview";

interface Message {
  role: "user" | "assistant" | "email-preview";
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // For chat send
  const [emailLoading, setEmailLoading] = useState(false); // For email form
  const [error, setError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: "", agentName: "", clientName: "", agentNote: "" });
  const [pendingOffers, setPendingOffers] = useState<unknown[]>([]); // Offers to send by email
  const [emailDraft, setEmailDraft] = useState<string | null>(null);
  const [awaitingApproval, setAwaitingApproval] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Hybrid email editing states
  const [isEditingDraft, setIsEditingDraft] = useState(false); // manual edit mode
  const [editInput, setEditInput] = useState(""); // manual edit content
  const [isLlmEditing, setIsLlmEditing] = useState(false); // LLM edit mode
  const [llmEditInput, setLlmEditInput] = useState(""); // user's LLM instruction
  const [llmEditLoading, setLlmEditLoading] = useState(false); // loading state for LLM edit

  useEffect(() => {
    console.log('[DEBUG] loading state:', loading, 'input:', input, 'button disabled:', loading || !input.trim());
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // Focus input if the last message is from assistant
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      inputRef.current?.focus();
    }
  }, [messages, input, loading]);

  function extractOffersFromLastAssistantMessage(): unknown[] {
    const lastAssistant = [...messages].reverse().find(m => m.role === "assistant");
    if (!lastAssistant) return [];
    return pendingOffers;
  }

  const sendMessage = async () => {
    if (!input.trim()) {
      console.log('[DEBUG] sendMessage: input is empty or whitespace');
      return;
    }
    setError(null);
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    console.log('[DEBUG] sendMessage: sending message, loading set to true');
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response || "(No response)" }]);
      if (data.offers) {
        setPendingOffers(data.offers);
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : String(error) || "Failed to get response. Please try again.");
      console.error('[DEBUG] sendMessage: error', error);
    } finally {
      setLoading(false);
      console.log('[DEBUG] sendMessage: finished, loading set to false');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[DEBUG] Input changed:', e.target.value);
    setInput(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  // Email form handlers
  const handleEmailFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmailForm({ ...emailForm, [e.target.name]: e.target.value });
  };
  const handleEmailFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setError(null);
    setEmailDraft(null);
    try {
      const offers = extractOffersFromLastAssistantMessage();
      if (!offers || offers.length === 0) {
        setError("No offers available to send.");
        setEmailLoading(false);
        return;
      }
      const endpoint = "/api/send-offers/preview";
      console.log('[EMAIL PREVIEW] Calling endpoint:', endpoint);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: emailForm.agentName,
          clientName: emailForm.clientName,
          agentNote: emailForm.agentNote,
          offers,
        }),
      });
      console.log('[EMAIL PREVIEW] Response status:', res.status);
      if (!res.ok) throw new Error("Failed to generate email draft.");
      const data = await res.json();
      setEmailDraft(data.draftEmail);
      setMessages((prev) => [...prev, { role: "email-preview", content: data.draftEmail }]);
      setAwaitingApproval(true);
      setShowEmailForm(false);
    } catch {
      setError("Failed to generate email draft.");
    } finally {
      setEmailLoading(false);
    }
  };

  // Approval handlers (send/edit/cancel)
  const handleApproveSend = async () => {
    console.log('[SEND EMAIL] Send button clicked');
    console.log('[SEND EMAIL] emailDraft:', emailDraft);
    console.log('[SEND EMAIL] emailForm:', emailForm);
    if (!emailForm.email || !emailForm.agentName || !emailDraft) {
      setError('Missing recipient email, agent name, or draft.');
      return;
    }
    try {
      const res = await fetch('/api/send-offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailForm.email,
          agentName: emailForm.agentName,
          draftEmail: emailDraft,
        }),
      });
      if (!res.ok) throw new Error('Failed to send email.');
      setMessages((prev) => [...prev, { role: "assistant", content: "✅ Email sent!" }]);
    } catch {
      setError('Failed to send email.');
    } finally {
      setAwaitingApproval(false);
    }
  };
  const handleCancelEmail = () => {
    setAwaitingApproval(false);
    setEmailDraft(null);
    setMessages((prev) => [...prev, { role: "assistant", content: "Email sending cancelled." }]);
  };

  return (
    <div className="max-w-3xl mx-auto min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 w-full p-0 sm:p-6 gap-6" style={{ fontFamily: 'Inter, Segoe UI, Helvetica Neue, Arial, Liberation Sans, sans-serif', fontWeight: 300 }}>
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 py-4 px-4 sm:rounded-t-2xl shadow-sm flex items-center justify-between">
        <h2 className="font-extrabold text-2xl sm:text-3xl text-gray-900 flex items-center gap-2 font-serif" style={{ fontFamily: 'Merriweather, Georgia, Times New Roman, serif' }}>
          <span role="img" aria-label="Chat">💬</span> PropertyPal Chat
        </h2>
      </header>
      {/* Chat Section: takes most of the viewport height, always scrollable, input at the bottom of this section */}
      <section className="flex-1 flex flex-col bg-white rounded-2xl p-0 sm:p-6 mb-2 border border-gray-100 shadow-md overflow-hidden">
        <div className="flex-1 overflow-y-auto px-2 sm:px-0 py-4">
          {messages.length === 0 && <div className="text-gray-400 text-center py-8 text-lg">Ask me about properties!</div>}
          <ChatMessageList messages={messages} />
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-2 sm:mt-4 px-2 sm:px-0 pb-2">
          <ChatInput
            input={input}
            loading={loading}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onSend={sendMessage}
            onShowEmailForm={() => setShowEmailForm(true)}
            hasOffers={pendingOffers.length > 0}
            inputRef={inputRef}
          />
        </div>
      </section>
      {/* Email Form Section: appears below chat+input, does not affect chat height */}
      {showEmailForm && (
        <section className="bg-white rounded-2xl p-6 mb-2 border border-blue-200 shadow-md max-w-lg mx-auto w-full">
          <EmailForm
            email={emailForm.email}
            agentName={emailForm.agentName}
            clientName={emailForm.clientName}
            agentNote={emailForm.agentNote}
            loading={emailLoading}
            onChange={handleEmailFormChange}
            onSubmit={handleEmailFormSubmit}
            onCancel={() => setShowEmailForm(false)}
          />
        </section>
      )}
      {/* Email Preview Section: appears below form, does not affect chat or form height */}
      {!showEmailForm && awaitingApproval && emailDraft && (
        <section className="bg-yellow-50 rounded-2xl p-6 mb-2 border border-yellow-300 shadow-md max-w-lg mx-auto w-full">
          <EmailPreview
            draft={emailDraft}
            onSend={handleApproveSend}
            onCancel={handleCancelEmail}
          />
          {/* Hybrid editing options */}
          <div className="mt-4 flex flex-col gap-4">
            {/* Manual Edit */}
            {!isEditingDraft && !isLlmEditing && (
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    setIsEditingDraft(true);
                    setEditInput(emailDraft);
                  }}
                >
                  Edit Manually
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded font-bold hover:bg-purple-700 transition-colors"
                  onClick={() => setIsLlmEditing(true)}
                >
                  Ask AI to Edit
                </button>
              </div>
            )}
            {/* Manual Edit Mode */}
            {isEditingDraft && (
              <div className="flex flex-col gap-2">
                <textarea
                  className="w-full p-2 rounded border border-gray-300 min-h-[300px]"
                  value={editInput}
                  onChange={e => setEditInput(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition-colors"
                    onClick={() => {
                      setEmailDraft(editInput);
                      setIsEditingDraft(false);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded font-bold hover:bg-gray-400 transition-colors"
                    onClick={() => setIsEditingDraft(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {/* LLM Edit Mode */}
            {isLlmEditing && (
              <div className="flex flex-col gap-2">
                <input
                  className="w-full p-2 rounded border border-gray-300"
                  placeholder="Describe how you'd like the draft improved..."
                  value={llmEditInput}
                  onChange={e => setLlmEditInput(e.target.value)}
                  disabled={llmEditLoading}
                />
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-purple-600 text-white rounded font-bold hover:bg-purple-700 transition-colors"
                    onClick={async () => {
                      setLlmEditLoading(true);
                      try {
                        const res = await fetch('/api/send-offers/edit', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ draft: emailDraft, instruction: llmEditInput }),
                        });
                        if (!res.ok) throw new Error('Failed to edit draft.');
                        const data = await res.json();
                        setEmailDraft(data.draftEmail);
                        setIsLlmEditing(false);
                        setLlmEditInput("");
                      } catch {
                        setError('Failed to edit draft.');
                      } finally {
                        setLlmEditLoading(false);
                      }
                    }}
                    disabled={llmEditLoading || !llmEditInput.trim()}
                  >
                    {llmEditLoading ? 'Editing...' : 'Apply Edit'}
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded font-bold hover:bg-gray-400 transition-colors"
                    onClick={() => setIsLlmEditing(false)}
                    disabled={llmEditLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      {/* Error message */}
      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-semibold text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default Chat;