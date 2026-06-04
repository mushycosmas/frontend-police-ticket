import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createTicket } from '../../api/ticketApi';

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
  // ✅ UPDATED to match backend column names
  customer_name: string;
  customer_phone: string;
  customer_email: string;

  // UI ONLY (cascading selects)
  region: string;
  district: string;
  ward: string;
  
  // Backend field
  street: string;

  // Ticket details
  title: string;
  description: string;
}

export const ReportTicketModal: React.FC<ReportTicketModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<FormData>({
    // ✅ UPDATED field names
    customer_name: '',
    customer_phone: '',
    customer_email: '',

    region: '',
    district: '',
    ward: '',
    street: '',

    title: '',
    description: '',
  });

  const [files, setFiles] = useState<FileList | null>(null);

  // ======================
  // UPDATE FORM
  // ======================
  const updateFormField = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ======================
  // VALIDATION
  // ======================
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      // ✅ UPDATED field names
      return Boolean(
        form.customer_name.trim() &&
        form.customer_phone.trim() &&
        form.street.trim()
      );
    }

    if (step === 2) {
      return Boolean(
        form.title.trim() &&
        form.description.trim()
      );
    }

    return true;
  };

  // ======================
  // NEXT STEP
  // ======================
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setError('');
      setCurrentStep((prev) => prev + 1);
    } else {
      setError('Please fill in all required fields in this step.');
    }
  };

  // ======================
  // PREVIOUS STEP
  // ======================
  const handlePrevStep = () => {
    setError('');
    setCurrentStep((prev) => prev - 1);
  };

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fd = new FormData();

      // Only send backend fields (exclude UI-only fields like region, district, ward)
      const backendFields = ['customer_name', 'customer_phone', 'customer_email', 'street', 'title', 'description'];
      
      backendFields.forEach((key) => {
        const value = form[key as keyof FormData];
        if (value) fd.append(key, value);
      });

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          fd.append('attachments', files[i]);
        }
      }

      await createTicket(fd);

      onClose();
      navigate('/');
    } catch (err) {
      setError('Failed to submit ticket. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // CANCEL
  // ======================
  const handleCancel = () => {
    onClose();
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-4xl bg-white rounded-[24px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-brand-primary">
            Report Ticket
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-8 overflow-y-auto">

          <ProgressIndicator currentStep={currentStep} totalSteps={3} />

          <ErrorMessage message={error} onClose={() => setError('')} />

          <form onSubmit={handleSubmit} className="space-y-12">

            {currentStep === 1 && (
              <ReporterInfoStep
                form={form}
                onChange={updateFormField}
              />
            )}

            {currentStep === 2 && (
              <IssueDetailsStep
                title={form.title}
                description={form.description}
                onChange={updateFormField}
              />
            )}

            {currentStep === 3 && (
              <AttachmentsStep
                files={files}
                onFilesChange={setFiles}
                form={form}
              />
            )}

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