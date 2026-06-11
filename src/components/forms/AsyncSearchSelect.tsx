import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface Option {
  id: number;
  name: string;
  description?: string;
}

interface AsyncSearchSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  endpoint: string; // API endpoint
  required?: boolean;
}

export const AsyncSearchSelect: React.FC<AsyncSearchSelectProps> = ({
  value,
  onChange,
  placeholder,
  label,
  endpoint,
  required = false,
}) => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const timeoutRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setOptions([]);
      return;
    }

    setLoading(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      axios
        .get(`${endpoint}?q=${query}`)
        .then((res) => {
          setOptions(res.data.results || res.data || []);
        })
        .finally(() => setLoading(false));
    }, 400);
  }, [query, endpoint]);

  // Close outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => String(o.id) === value);

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      {/* LABEL */}
      <label className="text-sm text-gray-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* INPUT */}
      <input
        value={open ? query : selected?.name || ""}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full border-b border-gray-300 bg-transparent py-2 outline-none focus:border-brand-primary transition-colors"
      />

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-30 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-sm text-gray-500">Searching...</div>
          ) : options.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">No results found</div>
          ) : (
            options.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  onChange(String(opt.id));
                  setOpen(false);
                  setQuery("");
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="text-sm font-medium text-gray-800">
                  {opt.name}
                </div>
                {opt.description && (
                  <div className="text-xs text-gray-500">
                    {opt.description}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};