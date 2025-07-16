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
  const [emailForm, setEmailForm] = useState({ email: "", recipientName: "", agentName: "", clientName: "", agentNote: "" });
  const [pendingOffers, setPendingOffers] = useState<any[]>([]); // Offers to send by email
  const [emailDraft, setEmailDraft] = useState<string | null>(null);
  const [awaitingApproval, setAwaitingApproval] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function extractOffersFromLastAssistantMessage(): any[] {
    const lastAssistant = [...messages].reverse().find(m => m.role === "assistant");
    if (!lastAssistant) return [];
    return pendingOffers;
  }

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
      if (data.offers) {
        setPendingOffers(data.offers);
      }
    } catch (err: any) {
      setError("Failed to get response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
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
      const res = await fetch("/api/send-offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailForm.email,
          recipientName: emailForm.recipientName,
          agentName: emailForm.agentName,
          clientName: emailForm.clientName,
          agentNote: emailForm.agentNote,
          offers,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate email draft.");
      const data = await res.json();
      setEmailDraft(data.draftEmail);
      setMessages((prev) => [...prev, { role: "email-preview", content: data.draftEmail }]);
      setAwaitingApproval(true);
      setShowEmailForm(false);
    } catch (err: any) {
      setError("Failed to generate email draft.");
    } finally {
      setEmailLoading(false);
    }
  };

  // Approval handlers (send/edit/cancel)
  const handleApproveSend = () => {
    setAwaitingApproval(false);
    setMessages((prev) => [...prev, { role: "assistant", content: "✅ Email sent! (Simulation)" }]);
  };
  const handleEditDraft = () => {
    setShowEmailForm(true);
    setAwaitingApproval(false);
  };
  const handleCancelEmail = () => {
    setAwaitingApproval(false);
    setEmailDraft(null);
    setMessages((prev) => [...prev, { role: "assistant", content: "Email sending cancelled." }]);
  };

  return (
    <div className="max-w-5xl mx-auto min-h-screen flex flex-col rounded-2xl shadow-xl bg-white font-inter w-full p-4 gap-6">
      <h2 className="text-center mb-4 font-extrabold text-3xl text-gray-900">💬 PropertyPal Chat</h2>
      {/* Chat Section: takes most of the viewport height, always scrollable, input at the bottom of this section */}
      <section className="h-[70vh] flex flex-col bg-gray-50 rounded-lg p-4 mb-2 border border-gray-200 shadow">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 && <div className="text-gray-500 text-center py-4">Ask me about properties!</div>}
          <ChatMessageList messages={messages} />
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-4">
          <ChatInput
            input={input}
            loading={loading}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onSend={sendMessage}
            onShowEmailForm={() => setShowEmailForm(true)}
            hasOffers={pendingOffers.length > 0}
          />
        </div>
      </section>
      {/* Email Form Section: appears below chat+input, does not affect chat height */}
      {showEmailForm && (
        <section className="bg-white rounded-lg p-4 mb-2 border border-blue-200 shadow">
          <EmailForm
            email={emailForm.email}
            recipientName={emailForm.recipientName}
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
      {awaitingApproval && emailDraft && (
        <section className="bg-yellow-50 rounded-lg p-4 mb-2 border border-yellow-300 shadow">
          <EmailPreview
            draft={emailDraft}
            onSend={handleApproveSend}
            onEdit={handleEditDraft}
            onCancel={handleCancelEmail}
          />
        </section>
      )}
      {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
    </div>
  );
};

export default Chat;