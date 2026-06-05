import React, { useState } from 'react';
import { Button } from '../../../common/Button';

interface CommentModalProps {
  show: boolean;
  title: string;
  message: string;
  actionType: 'resolve' | 'close';
  onHide: () => void;
  onConfirm: (comment: string) => void;
  loading?: boolean;
}

export const CommentModal: React.FC<CommentModalProps> = ({
  show,
  title,
  message,
  actionType,
  onHide,
  onConfirm,
  loading = false,
}) => {
  const [comment, setComment] = useState('');

  if (!show) return null;

  const handleConfirm = () => {
    onConfirm(comment);
  };

  const getActionButtonClass = () => {
    return actionType === 'resolve' 
      ? 'bg-green-600 hover:bg-green-700' 
      : 'bg-red-600 hover:bg-red-700';
  };

  const getActionButtonText = () => {
    return loading 
      ? (actionType === 'resolve' ? 'Resolving...' : 'Closing...')
      : (actionType === 'resolve' ? 'Resolve Ticket' : 'Close Ticket');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onHide}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {message}
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment about this action..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onHide}
            disabled={loading}
          >
            Cancel
          </Button>
          
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${getActionButtonClass()} disabled:opacity-50`}
          >
            {getActionButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};