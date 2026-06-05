import React from 'react';
import { Button } from './Button';

interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  onHide: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onHide,
  onConfirm,
  loading = false,
}) => {
  if (!show) return null;

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
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onHide}
            disabled={loading}
          >
            {cancelText}
          </Button>
          
          <Button
            variant='primary'
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};