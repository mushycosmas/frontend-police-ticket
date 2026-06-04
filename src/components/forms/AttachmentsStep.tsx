import React from 'react';

interface AttachmentsStepProps {
  files: FileList | null;
  onFilesChange: (files: FileList | null) => void;

  form: {
    // ✅ UPDATED to match backend column names
    customer_name: string;
    customer_phone: string;
    customer_email: string;

    street: string;

    title: string;
    description: string;
  };
}

export const AttachmentsStep: React.FC<AttachmentsStepProps> = ({
  files,
  onFilesChange,
  form
}) => {
  return (
    <div>

      {/* HEADER */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-lg mr-4">
          3
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Attachments & Review
        </h2>
      </div>

      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">

        {/* FILE UPLOAD */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Attachments (Images, PDF, Docs)
          </label>

          <div className="mt-1 flex justify-center px-6 pt-6 pb-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-brand-primary bg-white transition-colors group">

            <div className="space-y-2 text-center">

              <div className="mx-auto h-16 w-16 bg-brand-primary/10 rounded-full flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                <svg className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 48 48">
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="flex text-sm text-gray-600 justify-center items-center gap-1">

                <label
                  htmlFor="file-upload"
                  className="cursor-pointer font-bold text-brand-primary hover:text-brand-light"
                >
                  <span>Browse files</span>

                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={(e) => onFilesChange(e.target.files)}
                  />
                </label>

                <p>or drag and drop here</p>
              </div>

              <p className="text-xs text-gray-500 font-medium">
                Max size: 10MB per file
              </p>

              {files && files.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {files.length} file(s) ready
                  </span>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* SUMMARY - UPDATED FIELD NAMES */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Summary
          </h3>

          <div className="bg-white p-4 rounded-lg space-y-2 text-sm">

            <p>
              <span className="font-semibold text-gray-700">Name:</span>{" "}
              {form.customer_name}
            </p>

            <p>
              <span className="font-semibold text-gray-700">Phone:</span>{" "}
              {form.customer_phone}
            </p>

            {form.customer_email && (
              <p>
                <span className="font-semibold text-gray-700">Email:</span>{" "}
                {form.customer_email}
              </p>
            )}

            <p>
              <span className="font-semibold text-gray-700">Street ID:</span>{" "}
              {form.street}
            </p>

            <p>
              <span className="font-semibold text-gray-700">Issue:</span>{" "}
              {form.title}
            </p>

            {form.description && (
              <p>
                <span className="font-semibold text-gray-700">Description:</span>{" "}
                {form.description.length > 100 
                  ? `${form.description.substring(0, 100)}...` 
                  : form.description}
              </p>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};