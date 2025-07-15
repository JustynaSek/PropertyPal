export const metadata = {
  title: "Real Estate AI Assistant",
  description: "Your AI-powered real estate assistant. Instantly find, compare, and explore property offers tailored to your needs."
};

import Chat from "@/components/Chat";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", position: "relative" }}>
      {/* Main app content placeholder */}
      <div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>🏡 Real Estate AI Assistant</h1>
        <p style={{ fontSize: 18, color: "#555", marginBottom: 32 }}>
          Welcome! Use the chat widget in the corner to ask about available properties, get recommendations, or ask for help.
        </p>
        <a
          href="/offers/add"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transition mb-8"
        >
          + Add New Offer
        </a>
        {/* ...other app content can go here... */}
      </div>
      {/* Floating Chat Widget */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          maxWidth: 400,
          width: "90vw",
          boxShadow: "0 4px 32px #0002",
          borderRadius: 18,
          background: "none"
        }}
      >
        <Chat />
      </div>
    </div>
  );
} 