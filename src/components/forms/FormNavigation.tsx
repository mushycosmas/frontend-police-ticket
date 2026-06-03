// C:\Users\Hp\Desktop\1frontend\src\components\forms\FormNavigation.tsx
import React from 'react';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;  // Changed from () => void to (e: React.FormEvent) => void
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  loading,
  onBack,
  onNext,
  onCancel,
  onSubmit
}) => {
  return (
    <div className="pt-8 border-t border-gray-200 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
      <p className="text-sm text-gray-500 font-medium w-full text-center md:text-left">
        Required fields are marked with <span className="text-red-500">*</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row w-full md:w-auto gap-4">
        {currentStep > 1 && (
          <button 
            type="button" 
            onClick={onBack} 
            className="px-8 py-3.5 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-xl font-bold text-base w-full md:w-auto"
          >
            Back
          </button>
        )}
        
        {currentStep < totalSteps && (
          <button 
            type="button" 
            onClick={onNext} 
            className="px-8 py-3.5 bg-brand-primary text-white hover:bg-brand-light transition-all rounded-xl font-bold text-base shadow-[0_8px_20px_rgba(28,35,109,0.25)] hover:shadow-[0_12px_25px_rgba(28,35,109,0.35)] hover:-translate-y-0.5 w-full md:w-auto"
          >
            {currentStep === 1 ? 'Next' : 'Continue'}
          </button>
        )}

        {currentStep === totalSteps && (
          <>
            <button 
              type="button" 
              onClick={onCancel} 
              className="px-8 py-3.5 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-xl font-bold text-base w-full md:w-auto"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              onClick={onSubmit}  // Now this matches the expected type
              className="px-8 py-3.5 bg-brand-primary text-white hover:bg-brand-light transition-all rounded-xl font-bold text-base shadow-[0_8px_20px_rgba(28,35,109,0.25)] hover:shadow-[0_12px_25px_rgba(28,35,109,0.35)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 w-full md:w-auto"
            >
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};