import React from "react";

interface EmailPreviewProps {
  draft: string;
  onSend: () => void;
  onCancel: () => void;
}

// Helper to extract HTML code block and comments from LLM response
type ParsedDraft = { html: string; comments: string[] };
function parseDraftWithComments(draft: string): ParsedDraft {
  const codeBlockRegex = /```html([\s\S]*?)```/i;
  const match = draft.match(codeBlockRegex);
  let html = "";
  const comments: string[] = [];
  if (match) {
    html = match[1].trim();
    // Everything before and after the code block is a comment
    const before = draft.slice(0, match.index).trim();
    const after = draft.slice(match.index! + match[0].length).trim();
    if (before) comments.push(before);
    if (after) comments.push(after);
  } else {
    html = draft.trim();
  }
  return { html, comments };
}

const processDraftHtml = (html: string) => {
  // Add a new line (margin) before each offer title and make the title font larger
  return html.replace(/(^|<br\s*\/?>)([A-Z][\w\s]+ in [A-Z][\w\s]+)(?=<br|$)/gm, (match, br, title) => {
    return `${br}<span style="display:block;margin-top:1.5em;font-size:1.25em;font-weight:bold;">${title}</span>`;
  });
};

const EmailPreview: React.FC<EmailPreviewProps> = ({ draft, onSend, onCancel }) => {
  const { html, comments } = parseDraftWithComments(draft);
  return (
    <div className="mb-4 p-6 bg-white border border-gray-200 rounded-2xl shadow-md max-w-3xl mx-auto">
      <div className="font-bold text-gray-900 text-lg mb-3">Email Preview</div>
      {comments.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded text-gray-700 text-sm">
          {comments.map((c, i) => <div key={i} className="mb-1">{c}</div>)}
        </div>
      )}
      <div className="mb-6 prose prose-neutral prose-base max-w-none" style={{ background: '#f8fafc', borderRadius: 16, padding: 28 }} dangerouslySetInnerHTML={{ __html: processDraftHtml(html) }} />
      <div className="font-semibold mb-3 text-gray-700">Would you like to send this email, edit it, or cancel?</div>
      <div className="flex gap-2">
        <button className="px-7 py-3 rounded-full bg-green-600 text-white font-serif text-base font-semibold shadow hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition-all duration-150" onClick={onSend}>
          Send
        </button>
        <button className="px-7 py-3 rounded-full bg-gray-200 text-gray-800 font-serif text-base font-semibold shadow hover:bg-gray-300 focus:ring-2 focus:ring-gray-300 transition-all duration-150" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EmailPreview; 