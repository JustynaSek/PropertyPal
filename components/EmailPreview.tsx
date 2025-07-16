import React from "react";

interface EmailPreviewProps {
  draft: string;
  onSend: () => void;
  onCancel: () => void;
}

const processDraftHtml = (html: string) => {
  // Remove code block markers if present
  let cleaned = html.trim();
  if (cleaned.startsWith('```html')) {
    cleaned = cleaned.slice(7).trim();
  }
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3).trim();
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3).trim();
  }
  // Add a new line (margin) before each offer title and make the title font larger
  // Assume offer titles are lines that end with 'in <Location>' or similar, and are not 'Price', 'Rooms', etc.
  // We'll match lines that look like: 'House in Zalesie', 'Apartment in Wilkowyja', etc.
  return cleaned.replace(/(^|<br\s*\/?>)([A-Z][\w\s]+ in [A-Z][\w\s]+)(?=<br|$)/gm, (match, br, title) => {
    return `${br}<span style="display:block;margin-top:1.5em;font-size:1.25em;font-weight:bold;">${title}</span>`;
  });
};

const EmailPreview: React.FC<EmailPreviewProps> = ({ draft, onSend, onCancel }) => (
  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
    <div className="font-bold text-yellow-700 mb-2">Email Preview</div>
    <div className="mb-4" dangerouslySetInnerHTML={{ __html: processDraftHtml(draft) }} />
    <div className="font-bold mb-2 text-yellow-800">Would you like to send this email, edit it, or cancel?</div>
    <div className="flex gap-2">
      <button className="px-4 py-2 bg-green-600 text-white rounded font-bold" onClick={onSend}>
        Send
      </button>
      <button className="px-4 py-2 bg-gray-400 text-white rounded font-bold" onClick={onCancel}>
        Cancel
      </button>
    </div>
  </div>
);

export default EmailPreview; 