
import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios";

interface Option {
  id: number;
  name: string;
  description?: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const IssueTemplateSelect: React.FC<Props> = ({ value, onChange }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [common, setCommon] = useState<Option[]>([]);
  const [results, setResults] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load top 3 common issues (most used or recent)
  useEffect(() => {
    api
      .get("/tickets/issue-templates/", { params: { limit: 3, is_active: true } })
      .then((res) => {
        const data = res.data?.results || res.data || [];
        setCommon(data.slice(0, 3));
      })
      .catch((err) => {
        console.error("Failed to load common templates:", err);
        setCommon([]);
      });
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      api
        .get("/tickets/issue-templates/", { params: { search: query } })
        .then((res) => {
          const data = res.data?.results || res.data || [];
          setResults(data);
        })
        .catch((err) => {
          console.error("Search failed:", err);
          setError("Search failed. Please try again.");
          setResults([]);
        })
        .finally(() => setLoading(false));
    }, 350);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = [...common, ...results].find((i) => String(i.id) === value);

  return (
    <div className="relative space-y-1" ref={containerRef}>
      <label className="block text-sm font-semibold text-gray-700">
        Select from common issues <span className="text-gray-400 text-xs font-normal ml-1">(optional, searchable)</span>
      </label>
      <div className="relative">
        <input
          type="text"
          value={open ? query : selected?.name || ""}
          placeholder="Search by name or description..."
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (value) onChange(""); // clear current selection when typing
          }}
          onFocus={() => setOpen(true)}
          className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 px-4 py-2.5 pr-10 shadow-sm"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setQuery("");
              setOpen(false);
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-red-500"
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
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {open && (
        <div className="absolute z-30 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-y-auto">
          {/* Common Issues section */}
          {!query && common.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 sticky top-0">Common Issues</div>
              {common.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange(String(item.id));
                    setOpen(false);
                    setQuery("");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className="text-sm font-medium text-gray-800">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500 truncate">{item.description}</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Search Results section */}
          {query && (
            <div>
              <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 sticky top-0">Search Results</div>
              {loading ? (
                <div className="p-3 text-sm text-gray-500 text-center">Searching...</div>
              ) : results.length === 0 ? (
                <div className="p-3 text-sm text-gray-500 text-center">No results found</div>
              ) : (
                results.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(String(item.id));
                      setOpen(false);
                      setQuery("");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div className="text-sm font-medium text-gray-800">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 truncate">{item.description}</div>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-1">
        Start typing to search among thousands of known issues. Selecting one will pre‑fill the title and description.
      </p>
    </div>
  );
};