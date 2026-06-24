// pages/public/FaqsPublic.tsx
import React, { useEffect, useState } from "react";
import { getFAQs } from "../../api/faqApi";
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

const FaqsPublic: React.FC = () => {
  const { channels } = useChannels();

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [allFaqs, setAllFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);

  // ============================================
  // LOAD FAQS
  // ============================================
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);

        const params: any = {};
        if (selectedChannel !== null && selectedChannel !== undefined) {
          params.channel = selectedChannel;
        }

        console.log("Fetching FAQs with params:", params);

        const res = await getFAQs(params);

        console.log("FAQ Response:", res);

        let data: FAQ[] = [];
        
        if (Array.isArray(res)) {
          data = res;
        } else if (res?.data && Array.isArray(res.data)) {
          data = res.data;
        } else if (res?.data?.results && Array.isArray(res.data.results)) {
          data = res.data.results;
        } else if (res?.results && Array.isArray(res.results)) {
          data = res.results;
        }

        const activeFaqs = data.filter(faq => faq.is_active === true);
        setAllFaqs(activeFaqs);
        setFaqs(activeFaqs);
      } catch (err) {
        console.error("Failed to load FAQs", err);
        if (selectedChannel !== null) {
          await fetchAllAndFilter();
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchAllAndFilter = async () => {
      try {
        const res = await getFAQs({});
        let data: FAQ[] = [];
        
        if (Array.isArray(res)) {
          data = res;
        } else if (res?.data && Array.isArray(res.data)) {
          data = res.data;
        } else if (res?.data?.results && Array.isArray(res.data.results)) {
          data = res.data.results;
        } else if (res?.results && Array.isArray(res.results)) {
          data = res.results;
        }

        const activeFaqs = data.filter(faq => faq.is_active === true);
        setAllFaqs(activeFaqs);
        
        const filteredFaqs = selectedChannel 
          ? activeFaqs.filter(faq => faq.channel === selectedChannel)
          : activeFaqs;
        
        setFaqs(filteredFaqs);
      } catch (err) {
        console.error("Failed to load all FAQs for filtering", err);
      }
    };

    fetchFaqs();
  }, [selectedChannel]);

  // Client-side filtering
  useEffect(() => {
    if (allFaqs.length > 0) {
      const filteredFaqs = selectedChannel 
        ? allFaqs.filter(faq => faq.channel === selectedChannel)
        : allFaqs;
      setFaqs(filteredFaqs);
    }
  }, [selectedChannel, allFaqs]);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  // ============================================
  // Helper: Strip HTML for meta description
  // ============================================
  const stripHtml = (html: string): string => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
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
              ? `No FAQs found for ${channels.find(ch => ch.id === selectedChannel)?.name || 'this channel'}`
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
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Question Button */}
              <button
                onClick={() => toggle(faq.id)}
                className="w-full px-6 py-4 text-left font-medium flex justify-between items-center hover:bg-gray-50 transition-colors"
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
                <span className={`text-2xl font-light text-gray-400 transition-transform duration-200 ${openId === faq.id ? 'rotate-180' : ''}`}>
                  {openId === faq.id ? "−" : "+"}
                </span>
              </button>

              {/* Answer Section */}
              <div className={`transition-all duration-200 ${openId === faq.id ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                {openId === faq.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    {/* ✅ FIX: Render HTML content with dangerouslySetInnerHTML */}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default FaqsPublic;