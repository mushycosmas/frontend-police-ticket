import React from "react";

interface IssueDetailsStepProps {
  title: string;
  description: string;
  channels: { id: number; name: string }[];
  templates: { id: number; name: string; description: string }[];
  selectedChannel: string;
  selectedTemplate: string;
  onChange: (field: string, value: string) => void;
  onTemplateSelect: (templateId: string) => void;
  loadingChannels?: boolean;
  loadingTemplates?: boolean;
}

export const IssueDetailsStep: React.FC<IssueDetailsStepProps> = ({
  title,
  description,
  channels,
  templates,
  selectedChannel,
  selectedTemplate,
  onChange,
  onTemplateSelect,
  loadingChannels = false,
  loadingTemplates = false,
}) => {
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    onTemplateSelect(templateId);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-lg mr-4">
          2
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Issue Details</h2>
      </div>

      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
        {/* Channel Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Channel <span className="text-red-500">*</span>
          </label>
          {loadingChannels ? (
            <div className="text-gray-500">Loading channels...</div>
          ) : (
            <select
              value={selectedChannel}
              onChange={(e) => onChange("channel", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select channel --</option>
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue Template (Optional)
          </label>
          {loadingTemplates ? (
            <div className="text-gray-500">Loading templates...</div>
          ) : (
            <select
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- None / Manual entry --</option>
              {templates.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onChange("title", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Brief summary of the issue"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Detailed description of the problem..."
          />
        </div>
      </div>
    </div>
  );
};