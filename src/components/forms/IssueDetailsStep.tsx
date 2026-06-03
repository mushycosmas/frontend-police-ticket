// C:\Users\Hp\Desktop\1frontend\src\components\forms\IssueDetailsStep.tsx
import React from 'react';

interface IssueDetailsStepProps {
  title: string;
  description: string;
  onChange: (field: string, value: string) => void;
}

export const IssueDetailsStep: React.FC<IssueDetailsStepProps> = ({
  title,
  description,
  onChange
}) => {
  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-lg mr-4">2</div>
        <h2 className="text-2xl font-bold text-gray-900">Issue Details</h2>
      </div>
      
      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Issue Title <span className="text-red-500">*</span>
          </label>
          <input 
            className="input-underline w-full px-4 py-2 border-b-2 border-gray-300 focus:border-brand-primary focus:outline-none transition-colors" 
            value={title} 
            onChange={(e) => onChange('title', e.target.value)} 
            required 
            placeholder="Brief title of the issue"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea 
            className="input-underline w-full px-4 py-2 border-b-2 border-gray-300 focus:border-brand-primary focus:outline-none transition-colors min-h-[150px] resize-y" 
            value={description} 
            onChange={(e) => onChange('description', e.target.value)} 
            required 
            placeholder="Provide as much detail as possible to help us resolve the issue quickly..."
          />
        </div>
      </div>
    </div>
  );
};