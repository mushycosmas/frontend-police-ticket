// src/components/forms/SummaryStep.tsx
import React from "react";
import { AttachmentsStep } from "./AttachmentsStep";

interface SummaryStepProps {
  form: {
    customer_name: string;
    customer_phone: string;
    customer_nida?: string;
    customer_gender?: string;
    street_id: string;
    title: string;
    description: string;
  };
  citizenData: any;
  files: FileList | null;
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
}

const getGenderText = (genderCode: string) => {
  switch (genderCode) {
    case "M": return "Male";
    case "F": return "Female";
    default: return genderCode || "Not specified";
  }
};

export const SummaryStep: React.FC<SummaryStepProps> = ({
  form,
  citizenData,
  files,
  setFiles,
}) => {
  const locationParts = [
    citizenData?.RESIDENTREGION,
    citizenData?.RESIDENTDISTRICT,
    citizenData?.RESIDENTWARD,
  ].filter(Boolean);
  const locationString = locationParts.join(" / ") || "—";

  return (
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
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{locationString}</p>
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
  );
};