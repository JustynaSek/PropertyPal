


export const metadata = {
  title: "Real Estate AI Assistant",
  description: "Your AI-powered real estate assistant. Instantly find, compare, and explore property offers tailored to your needs."
};

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", position: "relative" }}>
      {/* Main app content placeholder */}
      <div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>🏡 Real Estate AI Assistant</h1>
        <p style={{ fontSize: 18, color: "#555", marginBottom: 32 }}>
          Welcome! Use the chat page to ask about available properties, get recommendations, or ask for help.
        </p>
        <a
          href="/offers/add"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transition mb-8"
        >
          + Add New Offer
        </a>
        <a
          href="/offers"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow transition mb-8 ml-4"
        >
          View All Offers
        </a>
        {/* ...other app content can go here... */}
      </div>
      {/* Chat widget removed. Use the Chat page instead. */}
    </div>
  );
} 