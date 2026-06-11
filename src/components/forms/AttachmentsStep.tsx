// src/components/forms/AttachmentsStep.tsx
import React, { useCallback } from "react";

interface AttachmentsStepProps {
  files: FileList | null;
  onFilesChange: (files: FileList | null) => void;
  form?: any; // optional (for compatibility)
}

export const AttachmentsStep: React.FC<AttachmentsStepProps> = ({
  files,
  onFilesChange,
}) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      onFilesChange(selectedFiles);
    }
  }, [onFilesChange]);

  const removeFile = useCallback((index: number) => {
    if (!files) return;
    const newFileList = Array.from(files);
    newFileList.splice(index, 1);
    const dataTransfer = new DataTransfer();
    newFileList.forEach((file) => dataTransfer.items.add(file));
    onFilesChange(dataTransfer.files);
  }, [files, onFilesChange]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Attachments (optional)</h3>
        </div>
        {files && files.length > 0 && (
          <button
            type="button"
            onClick={() => onFilesChange(null)}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remove all
          </button>
        )}
      </div>

      {/* File upload area */}
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m-4-4l4-4"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600 justify-center gap-1">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
            >
              <span>Upload files</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                multiple
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
            <p>or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB each</p>
        </div>
      </div>

      {/* File list preview */}
      {files && files.length > 0 && (
        <div className="border rounded-lg divide-y">
          {Array.from(files).map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 text-sm">
              <div className="flex items-center space-x-3 overflow-hidden">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="truncate max-w-[200px] md:max-w-xs">{file.name}</span>
                <span className="text-gray-400 text-xs">{formatFileSize(file.size)}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};