// src/components/forms/IssueDetailsStep.tsx
import React from "react";
import { SearchableSelect } from "./SearchableSelect";
import { IssueTemplateSelect } from "./IssueTemplateSelect";

interface IssueDetailsStepProps {
  title: string;
  description: string;
  channels: { id: number; name: string }[];
  selectedChannel: string;
  selectedTemplate: string;
  onChange: (field: string, value: string) => void;
  onTemplateSelect: (templateId: string) => void;
  loadingChannels?: boolean;
}

export const IssueDetailsStep: React.FC<IssueDetailsStepProps> = ({
  title,
  description,
  channels,
  selectedChannel,
  selectedTemplate,
  onChange,
  onTemplateSelect,
  loadingChannels = false,
}) => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md mr-4">
          2
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Issue Details</h2>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        {/* Channel - searchable select */}
        <SearchableSelect
          options={channels}
          value={selectedChannel}
          onChange={(val) => onChange("channel", val)}
          label="Channel"
          required={true}
          loading={loadingChannels}
          placeholder="Search channel by name..."
          helpText="Select the source of this report (e.g., HRMIS, Email)."
        />

        {/* Template - searchable with API */}
        <IssueTemplateSelect value={selectedTemplate} onChange={onTemplateSelect} />

        {/* Title */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onChange("title", e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 px-4 py-2.5 shadow-sm"
            placeholder="Brief summary of the issue"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            Description <span className="text-gray-400 text-xs font-normal ml-1">(Optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={4}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 px-4 py-2.5 shadow-sm resize-y"
            placeholder="Detailed description of the problem..."
          />
        </div>
      </div>
    </div>
  );
};