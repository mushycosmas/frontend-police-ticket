import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTicket } from "../../api/ticketApi";
import { verifyNida } from "../../api/nida/nidaApi";
import { getChannels } from "../../api/channelApi";
import { getIssueTemplates } from "../../api/issueTemplateApi";

import { ProgressIndicator } from "../common/ProgressIndicator";
import { ErrorMessage } from "../common/ErrorMessage";
import { FormNavigation } from "../forms/FormNavigation";
import { ReporterInfoStep } from "../forms/ReporterInfoStep";
import { IssueDetailsStep } from "../forms/IssueDetailsStep";
import { AttachmentsStep } from "../forms/AttachmentsStep";
import { NidaVerificationSection } from "../forms/NidaVerificationSection";

// ======================
// TYPES
// ======================
interface ReportTicketModalProps {
  onClose: () => void;
}

interface FormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_nida?: string;
  customer_gender?: string;
  region: string;
  district: string;
  ward: string;
  street_id: string;
  channel: string;
  title: string;
  description: string;
}

interface CitizenData {
  FIRSTNAME?: string;
  MIDDLENAME?: string;
  SURNAME?: string;
  PHONENUMBER?: string;
  RESIDENTREGION?: string;
  RESIDENTDISTRICT?: string;
  RESIDENTWARD?: string;
  SEX?: string;
  NIN?: string;
  [key: string]: any;
}

interface Channel {
  id: number;
  name: string;
  status?: string;
}

interface Template {
  id: number;
  name: string;
  description: string;
}

const getGenderText = (genderCode: string) => {
  switch (genderCode) {
    case "M": return "Male";
    case "F": return "Female";
    default: return genderCode || "Not specified";
  }
};

export const ReportTicketModal: React.FC<ReportTicketModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [createdTicketNumber, setCreatedTicketNumber] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<FormData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_nida: "",
    customer_gender: "",
    region: "",
    district: "",
    ward: "",
    street_id: "",
    channel: "",
    title: "",
    description: "",
  });

  // Template selection state
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const [files, setFiles] = useState<FileList | null>(null);

  // NIDA state
  const [nida, setNida] = useState("");
  const [nidaValid, setNidaValid] = useState<boolean | null>(null);
  const [checkingNida, setCheckingNida] = useState(false);
  const [citizenData, setCitizenData] = useState<CitizenData | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Channels & Templates state
  const [channels, setChannels] = useState<Channel[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // ======================
  // NIDA VERIFICATION
  // ======================
  useEffect(() => {
    if (!/^\d{20}$/.test(nida)) {
      setNidaValid(null);
      setCitizenData(null);
      setShowForm(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setCheckingNida(true);
        const res = await verifyNida(nida);
        const data = res?.data;

        const isValid = data?.status === "00" && data?.content && Object.keys(data.content).length > 0;

        setNidaValid(isValid);

        if (isValid && data.content) {
          const citizen = data.content;
          setCitizenData(citizen);

          const fullName = [
            citizen.FIRSTNAME,
            citizen.MIDDLENAME,
            citizen.SURNAME,
          ]
            .filter(Boolean)
            .join(" ");

          let genderCode = "";
          if (citizen.SEX === "MALE") genderCode = "M";
          else if (citizen.SEX === "FEMALE") genderCode = "F";

          setForm((prev) => ({
            ...prev,
            customer_name: fullName,
            customer_phone: prev.customer_phone,
            customer_nida: citizen.NIN || nida,
            customer_gender: genderCode,
          }));
          setShowForm(true);
        } else {
          setCitizenData(null);
          setShowForm(false);
        }
      } catch (err) {
        console.error("NIDA verification error:", err);
        setNidaValid(false);
        setCitizenData(null);
        setShowForm(false);
      } finally {
        setCheckingNida(false);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [nida]);

  // ======================
  // FETCH CHANNELS & TEMPLATES AFTER NIDA VERIFIED
  // ======================
  useEffect(() => {
    if (nidaValid === true) {
      // Fetch channels
      const fetchChannels = async () => {
        try {
          setLoadingChannels(true);
          const res = await getChannels();
          let data = res.data;
          if (data?.results) data = data.results;
          if (!Array.isArray(data)) data = [];
          setChannels(data);
        } catch (err) {
          console.error("Failed to load channels:", err);
          setChannels([]);
        } finally {
          setLoadingChannels(false);
        }
      };

      // Fetch templates
      const fetchTemplates = async () => {
        try {
          setLoadingTemplates(true);
          const res = await getIssueTemplates();
          let data = res.data;
          if (data?.results) data = data.results;
          if (!Array.isArray(data)) data = [];
          setTemplates(data);
        } catch (err) {
          console.error("Failed to load templates:", err);
          setTemplates([]);
        } finally {
          setLoadingTemplates(false);
        }
      };

      fetchChannels();
      fetchTemplates();
    }
  }, [nidaValid]);

  // ======================
  // FORM UPDATE (phone only digits)
  // ======================
  const updateFormField = (field: string, value: string) => {
    if (field === "customer_phone") {
      value = value.replace(/\D/g, "");
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ======================
  // TEMPLATE SELECTION HANDLER
  // ======================
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (!templateId) {
      updateFormField("title", "");
      updateFormField("description", "");
      return;
    }
    const selected = templates.find((t) => String(t.id) === templateId);
    if (selected) {
      updateFormField("title", selected.name);
      updateFormField("description", selected.description);
    }
  };

  // ======================
  // STEP VALIDATION
  // ======================
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return Boolean(form.customer_phone.trim() && form.street_id.trim());
    }
    if (step === 2) {
      return Boolean(form.channel.trim() && form.title.trim() && form.description.trim());
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setError("");
      setCurrentStep((p) => p + 1);
    } else {
      setError("Please fill in all required fields.");
    }
  };

  const handlePrevStep = () => {
    setError("");
    setCurrentStep((p) => p - 1);
  };

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!/^\d{20}$/.test(nida) || nidaValid !== true) {
      setError("Please enter a valid and verified 20-digit NIDA number.");
      setLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("customer_name", form.customer_name);
      fd.append("customer_phone", form.customer_phone);
      fd.append("customer_email", form.customer_email);
      fd.append("channel", form.channel);
      fd.append("street_id", form.street_id);
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("customer_nida", form.customer_nida || nida);
      fd.append("customer_gender", form.customer_gender || "");
      
      if (selectedTemplateId) {
        fd.append("template", selectedTemplateId);
      }

      if (files && files.length) {
        Array.from(files).forEach((file) => fd.append("attachments", file));
      }

      const res = await createTicket(fd);
      setCreatedTicketNumber(res?.data?.ticket_number);
      setSuccess(true);

      // Reset form
      setForm({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        customer_nida: "",
        customer_gender: "",
        region: "",
        district: "",
        ward: "",
        street_id: "",
        channel: "",
        title: "",
        description: "",
      });
      setSelectedTemplateId("");
      setFiles(null);
      setCurrentStep(1);
      setNida("");
      setNidaValid(null);
      setCitizenData(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTicketNumber = async () => {
    if (!createdTicketNumber) return;
    await navigator.clipboard.writeText(createdTicketNumber);
    alert("Ticket number copied!");
  };

  const handleTrackSearch = () => {
    const phoneInput = document.getElementById('trackPhone') as HTMLInputElement;
    const ticketInput = document.getElementById('trackTicket') as HTMLInputElement;
    const phone = phoneInput?.value.trim();
    const ticketNo = ticketInput?.value.trim();

    if (phone) {
      window.location.href = `/track?phone=${encodeURIComponent(phone)}`;
    } else if (ticketNo) {
      window.location.href = `/track?ticket=${encodeURIComponent(ticketNo)}`;
    } else {
      alert('Please enter either a phone number or a ticket number');
    }
  };

  const isNidaVerified = nidaValid === true;

  // Filter channels to only public (case‑insensitive)
  const publicChannels = channels.filter((ch) => ch.status?.toLowerCase() === "public");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-blue-600">Report Ticket</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <NidaVerificationSection
            nida={nida}
            setNida={setNida}
            checkingNida={checkingNida}
            nidaValid={nidaValid}
          />

          {isNidaVerified && (
            <div
              className={`transition-all duration-500 ease-out transform ${
                showForm ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <ProgressIndicator currentStep={currentStep} totalSteps={3} />
              <ErrorMessage message={error} onClose={() => setError("")} />

              <form onSubmit={handleSubmit} className="space-y-10">
                {currentStep === 1 && (
                  <ReporterInfoStep
                    form={form}
                    onChange={updateFormField}
                    hideName={true}
                    nameReadOnly={true}
                  />
                )}

                {currentStep === 2 && (
                  <IssueDetailsStep
                    title={form.title}
                    description={form.description}
                    channels={publicChannels}
                    templates={templates}
                    selectedChannel={form.channel}
                    selectedTemplate={selectedTemplateId}
                    onChange={(field, value) => {
                      if (field === "channel") updateFormField("channel", value);
                      else updateFormField(field, value);
                    }}
                    onTemplateSelect={handleTemplateSelect}
                    loadingChannels={loadingChannels}
                    loadingTemplates={loadingTemplates}
                  />
                )}

                {currentStep === 3 && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Review Your Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{form.customer_name || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{form.customer_phone || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">NIDA Number</p>
                          <p className="font-medium">{form.customer_nida || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium">{getGenderText(form.customer_gender || "")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Street ID</p>
                          <p className="font-medium">{form.street_id || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Channel</p>
                          <p className="font-medium">{form.channel || "—"}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">Issue Title</p>
                          <p className="font-medium">{form.title}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="font-medium whitespace-pre-wrap">{form.description}</p>
                        </div>
                      </div>
                    </div>
                    <AttachmentsStep files={files} onFilesChange={setFiles} />
                  </>
                )}

                <FormNavigation
                  currentStep={currentStep}
                  totalSteps={3}
                  loading={loading}
                  onBack={handlePrevStep}
                  onNext={handleNextStep}
                  onCancel={onClose}
                  onSubmit={handleSubmit}
                />
              </form>
            </div>
          )}

          {!isNidaVerified && !checkingNida && nida.length === 20 && nidaValid === null && (
            <div className="text-center py-8 text-gray-500 animate-pulse">
              Verifying NIDA, please wait...
            </div>
          )}

          {!isNidaVerified && (nida.length !== 20 || nidaValid === false) && (
            <div className="text-center py-8 text-gray-500">
              <p>Please enter and verify your NIDA number to continue</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Success Modal with Ticket Search */}
     {success && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white p-6 rounded-xl text-center animate-fade-in-up max-w-md w-full mx-4">
      {/* Success icon */}
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-green-600 text-xl font-bold">Ticket Created 🎉</h2>
      <p className="mt-2">Your ticket number:</p>
      <div className="text-2xl font-bold text-blue-600 break-all">{createdTicketNumber}</div>
      <button onClick={handleCopyTicketNumber} className="mt-2 text-blue-600 underline text-sm">
        Copy number
      </button>

      {/* Divider */}
      <div className="my-6 border-t border-gray-200"></div>

      {/* Informational message about tracking */}
      <p className="text-sm text-gray-700 mb-2">You can check the status of your ticket anytime using:</p>
      <ul className="text-sm text-gray-600 space-y-1 mb-4">
        <li>📞 Your registered phone number</li>
        <li>🆔 Your NIDA number</li>
        <li>🎫 Your ticket number (shown above)</li>
      </ul>
      <button
        onClick={() => {
          window.location.href = "/track";
        }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition text-sm font-medium"
      >
        Track My Ticket
      </button>

      {/* Close button */}
      <button
        className="mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg w-full transition text-sm"
        onClick={() => setSuccess(false)}
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};