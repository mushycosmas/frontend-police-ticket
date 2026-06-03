// C:\Users\Hp\Desktop\1frontend\src\components\modals\ReportTicketModal.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticket.service';
import { Input } from '../common/Input';
import { ProgressIndicator } from '../common/ProgressIndicator';
import { ErrorMessage } from '../common/ErrorMessage';
import { ReporterInfoStep } from '../forms/ReporterInfoStep';
import { IssueDetailsStep } from '../forms/IssueDetailsStep';
import { AttachmentsStep } from '../forms/AttachmentsStep';
import { FormNavigation } from '../forms/FormNavigation';

interface ReportTicketModalProps {
  onClose: () => void;
}

interface FormData {
  reporterName: string;
  reporterPhone: string;
  reporterEmail: string;
  region: string;
  district: string;
  ward: string;
  street: string;
  title: string;
  description: string;
}

export const ReportTicketModal: React.FC<ReportTicketModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormData>({
    reporterName: '',
    reporterPhone: '',
    reporterEmail: '',
    region: '',
    district: '',
    ward: '',
    street: '',
    title: '',
    description: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);

  const updateFormField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return form.reporterName.trim() !== '' && form.reporterPhone.trim() !== '';
    }
    if (step === 2) {
      return form.title.trim() !== '' && form.description.trim() !== '';
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setError('');
      setCurrentStep(currentStep + 1);
    } else {
      setError('Please fill in all required fields in this step.');
    }
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });
      if (files && files.length) {
        for (let i = 0; i < files.length; i++) {
          fd.append('attachments', files[i]);
        }
      }
      await ticketService.createPublic(fd);
      onClose();
      navigate('/');
    } catch (err) {
      setError('Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-[24px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in-up">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0 bg-white">
          <h2 className="text-xl font-bold text-brand-primary">
            Report Information
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
          <ProgressIndicator currentStep={currentStep} totalSteps={3} />
          
          <ErrorMessage 
            message={error} 
            onClose={() => setError('')}
          />

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Step 1: Reporter Information */}
            {currentStep === 1 && (
              <ReporterInfoStep 
                form={form}
                onChange={updateFormField}
              />
            )}

            {/* Step 2: Issue Details */}
            {currentStep === 2 && (
              <IssueDetailsStep 
                title={form.title}
                description={form.description}
                onChange={updateFormField}
              />
            )}

            {/* Step 3: Attachments & Review */}
            {currentStep === 3 && (
              <AttachmentsStep 
                files={files}
                onFilesChange={setFiles}
                form={form}
              />
            )}

            {/* Navigation Buttons */}
            <FormNavigation 
              currentStep={currentStep}
              totalSteps={3}
              loading={loading}
              onBack={handlePrevStep}
              onNext={handleNextStep}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
            />
          </form>
        </div>
      </div>
    </div>
  );
};