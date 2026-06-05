import React from 'react';

export const QuickTips: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-xl p-5">
      <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Quick Tips
      </h5>
      <ul className="text-sm text-gray-600 space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-brand-primary font-bold">•</span>
          Your tracking ID was sent to your email when you created the ticket
        </li>
        <li className="flex items-start gap-2">
          <span className="text-brand-primary font-bold">•</span>
          Tracking IDs are case-sensitive - please enter exactly as received
        </li>
        <li className="flex items-start gap-2">
          <span className="text-brand-primary font-bold">•</span>
          Updates are usually posted within 24-48 hours of ticket creation
        </li>
      </ul>
    </div>
  );
};