// pages/public/FaqsPublic.tsx

import React, { useEffect, useState, useCallback } from "react";
import { incrementFAQView, getFAQs } from "../../api/faqApi";
import { useChannels } from "../../hooks/useChannels";

interface FAQ {
  id: number;
  category: number;
  category_name?: string;
  channel: number;
  channel_name?: string;
  question: string;
  answer: string;
  slug: string;
  is_active: boolean;
  is_featured: boolean;
  views: number;
  sort_order: number;
  created_at: string;
}

interface Channel {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  is_active: boolean;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FAQ[];
}

const ITEMS_PER_PAGE = 10;

const FaqsPublic: React.FC = () => {
  const { channels } = useChannels();

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);
  const [expandingId, setExpandingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // ============================================
  // LOAD FAQS WITH PAGINATION
  // ============================================
  const loadFaqs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build params object
      const params: any = {};
      if (selectedChannel !== null && selectedChannel !== undefined) {
        params.channel = selectedChannel;
      }

      // ✅ CORRECT: Call getFAQs with (page, pageSize, params)
      console.log("Fetching FAQs - Page:", currentPage, "Params:", params);
      
      const response = await getFAQs(currentPage, ITEMS_PER_PAGE, params);
      console.log("FAQ Response:", response);

      let faqData: FAQ[] = [];
      let count = 0;

      // Handle different response formats
      if (response?.results && Array.isArray(response.results)) {
        faqData = response.results;
        count = response.count || faqData.length;
      } else if (response?.data?.results && Array.isArray(response.data.results)) {
        faqData = response.data.results;
        count = response.data.count || faqData.length;
      } else if (Array.isArray(response)) {
        faqData = response;
        count = faqData.length;
      } else if (response?.data && Array.isArray(response.data)) {
        faqData = response.data;
        count = faqData.length;
      } else {
        faqData = [];
        count = 0;
      }

      // Filter active FAQs
      const activeFaqs = faqData.filter((faq) => faq.is_active === true);
      
      setFaqs(activeFaqs);
      setTotalItems(count);
      setTotalPages(Math.max(1, Math.ceil(count / ITEMS_PER_PAGE)));
      
      console.log(`Loaded ${activeFaqs.length} FAQs, Total: ${count}, Pages: ${Math.ceil(count / ITEMS_PER_PAGE)}`);
      
    } catch (err) {
      console.error("Failed to load FAQs", err);
      setError("Unable to load FAQs. Please try again.");
      setFaqs([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [selectedChannel, currentPage]);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  // Reset to page 1 when channel changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedChannel]);

  // ============================================
  // TOGGLE FAQ WITH VIEW INCREMENT
  // ============================================
  const toggle = async (id: number) => {
    const isOpening = openId !== id;
    
    if (isOpening) {
      setOpenId(id);
      setExpandingId(id);
      
      try {
        await incrementFAQView(id);
        
        // Update local view count
        setFaqs((prev) =>
          prev.map((faq) =>
            faq.id === id ? { ...faq, views: faq.views + 1 } : faq
          )
        );
      } catch (err) {
        console.error("Failed to increment view count:", err);
      } finally {
        setExpandingId(null);
      }
    } else {
      setOpenId(null);
    }
  };

  // ============================================
  // PAGINATION HANDLERS
  // ============================================
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // ============================================
  // Helper: Get channel name
  // ============================================
  const getChannelName = (channelId: number): string => {
    const channel = channels.find((ch) => ch.id === channelId);
    return channel?.name || "Unknown Channel";
  };

  // ============================================
  // Render Pagination
  // ============================================
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-wrap justify-center items-center gap-1 mt-6 pt-4 border-t">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          ← Previous
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="px-3 py-1 rounded border hover:bg-gray-50 transition-colors"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-1 rounded border transition-colors ${
              page === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => goToPage(totalPages)}
              className="px-3 py-1 rounded border hover:bg-gray-50 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Next →
        </button>
      </div>
    );
  };

  // ============================================
  // Render
  // ============================================
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* TITLE */}
      <h1 className="text-2xl font-bold text-center mb-6">
        Frequently Asked Questions
      </h1>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
          {error}
          <button
            onClick={() => {
              setError(null);
              loadFaqs();
            }}
            className="ml-3 text-red-700 underline hover:text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* ========================
          CHANNEL FILTER
      ======================== */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
        <button
          onClick={() => setSelectedChannel(null)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition ${
            selectedChannel === null
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white hover:bg-gray-50 border-gray-300"
          }`}
        >
          All Channels
        </button>

        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setSelectedChannel(ch.id)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition ${
              selectedChannel === ch.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-gray-50 border-gray-300"
            }`}
          >
            {ch.name}
          </button>
        ))}
      </div>

      {/* ========================
          FAQ LIST
      ======================== */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-3 text-gray-500">Loading FAQs...</p>
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-2 text-gray-500">
            {selectedChannel
              ? `No FAQs found for ${getChannelName(selectedChannel)}`
              : "No FAQs available"}
          </p>
          {selectedChannel && (
            <button
              onClick={() => setSelectedChannel(null)}
              className="mt-3 text-blue-600 hover:underline text-sm"
            >
              View all FAQs
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              const isExpanding = expandingId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Question Button */}
                  <button
                    onClick={() => toggle(faq.id)}
                    className="w-full px-6 py-4 text-left font-medium flex justify-between items-center hover:bg-gray-50 transition-colors"
                    disabled={isExpanding}
                  >
                    <div className="flex items-start gap-3">
                      {faq.is_featured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-0.5 flex-shrink-0">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Featured
                        </span>
                      )}
                      <span className="text-gray-900">{faq.question}</span>
                    </div>
                    <span
                      className={`text-2xl font-light text-gray-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      {isExpanding ? (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : isOpen ? (
                        "−"
                      ) : (
                        "+"
                      )}
                    </span>
                  </button>

                  {/* Answer Section */}
                  <div
                    className={`transition-all duration-300 ${
                      isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    {isOpen && (
                      <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                        <div
                          className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />

                        {/* Meta Tags */}
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          {faq.category_name && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                              {faq.category_name}
                            </span>
                          )}
                          {faq.channel_name && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-700">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              {faq.channel_name}
                            </span>
                          )}
                          {faq.views !== undefined && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-50 text-gray-500">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              {faq.views} views
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================
              PAGINATION
          ======================== */}
          {renderPagination()}

          {/* Showing info */}
          {totalItems > 0 && (
            <div className="text-center text-sm text-gray-500 mt-4">
              Showing {faqs.length} of {totalItems} FAQs
              {selectedChannel && ` for ${getChannelName(selectedChannel)}`}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FaqsPublic;