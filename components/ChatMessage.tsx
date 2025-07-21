import React from "react";

interface ChatMessageProps {
  role: "user" | "assistant" | "email-preview";
  content: string;
}

function renderAssistantMessage(text: string) {
  // Split the text into logical blocks based on newlines
  const blocks = text.split(/\n\s*\n/); // Split by double newlines for paragraphs/sections

  const renderedBlocks = blocks.map((block, blockIdx) => {
    const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
    const propertyRows: { key: string; value: string }[] = [];
    let offerTitle: string | null = null;
    const otherContent: string[] = [];
    let isPropertySection = false;

    lines.forEach(line => {
      // If the line looks like a title (first line, not a key-value, not a label)
      if (!offerTitle && line && !line.includes(":") && !line.match(/^\d+$/)) {
        offerTitle = line;
        return;
      }
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
          {offerTitle && (
            <div className="font-extrabold text-lg text-gray-900 mb-2 font-serif" style={{ fontFamily: 'Merriweather, Georgia, Times New Roman, serif' }}>{offerTitle}</div>
          )}
          {propertyRows.map((row, rowIdx) => {
            if (row.key.toLowerCase() === "amenities") {
              const items = row.value.split(/,\s*/).filter(Boolean);
              return (
                <div key={rowIdx} className="mb-1">
                  <span className="font-bold text-gray-700 text-base">Amenities:</span>
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
                  <span className="font-bold text-gray-700 text-base min-w-[100px] mr-2">Link:</span>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-800 underline hover:text-black break-all">
                    {urlMatch ? "View Offer" : url}
                  </a>
                </div>
              );
            }
            return (
              <div key={rowIdx} className="flex flex-wrap items-baseline mb-1">
                <span className="font-bold text-gray-700 text-base min-w-[100px] mr-2">{row.key}:</span>
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
  });

  // Fallback: if all blocks returned null, render the original text as a paragraph
  if (!renderedBlocks.some(Boolean)) {
    return <p className="mb-2 text-gray-800 text-base leading-relaxed break-words">{text}</p>;
  }
  return <>{renderedBlocks}</>;
}

const AVATARS = {
  user: (
    <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-lg shadow-md mr-2">
      <span>U</span>
    </div>
  ),
  assistant: (
    <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-900 font-bold text-lg shadow-md mr-2">
      <span>A</span>
    </div>
  ),
};

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  if (role === "assistant") {
    // Debug log for assistant message content
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('[DEBUG] Rendering assistant message:', content);
    }
    const hasContent = typeof content === 'string' && content.trim().length > 0;
    return (
      <div className="flex items-start">
        {AVATARS.assistant}
        <div className="rounded-2xl p-4 max-w-[90vw] sm:max-w-[70%] shadow bg-gray-50 text-gray-900 text-base font-normal leading-relaxed break-words">
          {hasContent ? renderAssistantMessage(content) : <span className="italic text-gray-400">(No response from assistant)</span>}
        </div>
      </div>
    );
  }
  if (role === "user") {
    return (
      <div className="flex items-start flex-row-reverse">
        {AVATARS.user}
        <div className="rounded-2xl p-4 max-w-[90vw] sm:max-w-[70%] shadow bg-gray-700 text-white text-base font-normal leading-relaxed break-words">
          <p className="font-medium">{content}</p>
        </div>
      </div>
    );
  }
  if (role === "email-preview") {
    return (
      <div className="w-full">
        <div className="font-bold text-yellow-700 mb-2">Email Preview</div>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }
  return null;
};

export default ChatMessage; 