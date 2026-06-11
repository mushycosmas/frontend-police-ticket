// src/components/issue-templates/TemplateHeader.tsx
import React from "react";

interface TemplateHeaderProps {
  onNew: () => void;
}

export const TemplateHeader: React.FC<TemplateHeaderProps> = ({ onNew }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Issue Templates</h1>
        <p className="text-gray-500 text-sm mt-1">Manage predefined issues for faster ticket creation</p>
      </div>
      <button
        onClick={onNew}
        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Template
      </button>
    </div>
  );
};