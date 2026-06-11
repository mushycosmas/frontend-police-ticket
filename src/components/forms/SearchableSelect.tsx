// src/components/forms/SearchableSelect.tsx
import React, { useState, useMemo, useRef, useEffect } from "react";

interface SearchableSelectProps {
  options: { id: number; name: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
  loading?: boolean;
  placeholder?: string;
  helpText?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  label,
  required = false,
  loading = false,
  placeholder = "Search...",
  helpText,
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const lower = search.toLowerCase();
    return options.filter((opt) => opt.name.toLowerCase().includes(lower));
  }, [options, search]);

  const selectedOption = options.find((opt) => String(opt.id) === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    setSearch("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-1" ref={containerRef}>
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          value={isOpen ? search : selectedOption?.name || ""}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            // If user types manually, clear the current selection
            if (value) onChange("");
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 px-4 py-2.5 pr-10 shadow-sm"
        />
        {value && (
          <button
            type="button"
            onClick={() => handleSelect("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-red-500"
            aria-label="Clear selection"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {!value && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-sm text-gray-500">Loading...</div>
          ) : filteredOptions.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">No options found</div>
          ) : (
            filteredOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(String(opt.id))}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="text-sm font-medium text-gray-800">{opt.name}</div>
              </button>
            ))
          )}
        </div>
      )}
      {helpText && <p className="text-xs text-gray-400 mt-1">{helpText}</p>}
    </div>
  );
};