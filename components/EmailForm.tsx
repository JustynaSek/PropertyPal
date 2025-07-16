import React from "react";

interface EmailFormProps {
  email: string;
  agentName: string;
  clientName: string;
  agentNote: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({
  email,
  agentName,
  clientName,
  agentNote,
  loading,
  onChange,
  onSubmit,
  onCancel,
}) => (
  <form onSubmit={onSubmit} className="mb-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
    <div className="mb-2">
      <label className="block font-bold mb-1">Recipient Email</label>
      <input
        type="email"
        name="email"
        value={email}
        onChange={onChange}
        required
        className="w-full p-2 rounded border border-gray-300"
      />
    </div>
    <div className="mb-2">
      <label className="block font-bold mb-1">Client Name</label>
      <input
        type="text"
        name="clientName"
        value={clientName}
        onChange={onChange}
        required
        className="w-full p-2 rounded border border-gray-300"
      />
    </div>
    <div className="mb-2">
      <label className="block font-bold mb-1">Agent Name</label>
      <input
        type="text"
        name="agentName"
        value={agentName}
        onChange={onChange}
        required
        className="w-full p-2 rounded border border-gray-300"
      />
    </div>
    <div className="mb-2">
      <label className="block font-bold mb-1">Agent Note (optional)</label>
      <textarea
        name="agentNote"
        value={agentNote}
        onChange={onChange}
        className="w-full p-2 rounded border border-gray-300"
      />
    </div>
    <div className="flex gap-2 mt-2">
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-bold" disabled={loading}>
        {loading ? "Generating..." : "Preview Email"}
      </button>
      <button type="button" className="px-4 py-2 bg-gray-300 rounded font-bold" onClick={onCancel}>
        Cancel
      </button>
    </div>
  </form>
);

export default EmailForm; 