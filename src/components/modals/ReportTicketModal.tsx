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
  // Backend column names
  customer_name: string;
  customer_phone: string;
  customer_email: string;

  // UI ONLY (cascading selects)
  region: string;
  district: string;
  ward: string;
  
  // Backend field - CHANGED from street to street_id
  street_id: string;

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
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    region: '',
    district: '',
    ward: '',
    street_id: '',  // CHANGED from street to street_id
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
      return Boolean(
        form.customer_name.trim() &&
        form.customer_phone.trim() &&
        form.street_id.trim()  // CHANGED from street to street_id
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
  setError("");
  setLoading(true);

  try {
    const fd = new FormData();

    // ======================
    // ONLY BACKEND FIELDS
    // ======================
    fd.append("customer_name", form.customer_name);
    fd.append("customer_phone", form.customer_phone);
    fd.append("customer_email", form.customer_email);
    fd.append("street_id", form.street_id);
    fd.append("title", form.title);
    fd.append("description", form.description);

    // ======================
    // DEBUG LOGS
    // ======================
    console.log("===== FORM STATE =====", form);

    console.log("===== FORMDATA =====");
    for (const [key, value] of fd.entries()) {
      console.log(key, value);
    }

    // ======================
    // FILES (IMPORTANT FIX)
    // ======================
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        fd.append("attachments", file); // ✅ MUST match backend
      });
    }

    // ======================
    // API CALL
    // ======================
    await createTicket(fd);

    onClose();
    // navigate("/");
  } catch (err) {
    console.error("Submit error:", err);
    setError("Failed to submit ticket. Please try again.");
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