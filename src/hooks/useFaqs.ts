import { useEffect, useState } from "react";
import {
  getFAQs,
  getFAQ,
  getFAQsByCategoryChannel,
  searchFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from "../api/faqApi";

/* ========================
   TYPES
======================== */
export interface FAQ {
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

/* ========================
   NORMALIZER - FIXED
======================== */
const normalizeResponse = (res: any): FAQ[] => {
  if (!res) return [];

  // If the response itself is the array (most common)
  if (Array.isArray(res)) return res;

  // If response has data property that is an array
  if (res.data && Array.isArray(res.data)) return res.data;

  // If response has data.results (paginated)
  if (res.data?.results && Array.isArray(res.data.results)) return res.data.results;

  // If response has results directly
  if (res.results && Array.isArray(res.results)) return res.results;

  console.warn("Unexpected response structure:", res);
  return [];
};

/* ========================
   LIST FAQS HOOK - FIXED
======================== */
export const useFaqs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaqs = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getFAQs(params);

      // Log for debugging
      console.log("Full API Response:", response);
      console.log("Response type:", typeof response);
      console.log("Is array?", Array.isArray(response));
      console.log("Response.data:", response?.data);

      // Normalize the response
      const data = normalizeResponse(response);

      console.log("Normalized data:", data);

      setFaqs(data);
    } catch (err) {
      setError("Failed to load FAQs");
      console.error("Error fetching FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return {
    faqs,
    loading,
    error,
    refetch: fetchFaqs,
  };
};

/* ========================
   SINGLE FAQ
======================== */
export const useFaq = (id?: number) => {
  const [faq, setFaq] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchFAQ = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getFAQ(id);
        
        // Handle different response structures
        const faqData = response?.data || response;
        setFaq(faqData);
      } catch (err) {
        setError("Failed to load FAQ");
        console.error("Error fetching FAQ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQ();
  }, [id]);

  return { faq, loading, error };
};

/* ========================
   SEARCH FAQS - FIXED
======================== */
export const useFaqSearch = () => {
  const [results, setResults] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await searchFAQs(query);
      
      // Normalize the response
      const data = normalizeResponse(response);
      setResults(data);
    } catch (err) {
      setError("Failed to search FAQs");
      console.error("Error searching FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
};

/* ========================
   FILTER HOOK - FIXED
======================== */
export const useFaqByCategoryChannel = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (category_id: number, channel_id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getFAQsByCategoryChannel(
        category_id,
        channel_id
      );

      // Normalize the response
      const data = normalizeResponse(response);
      setFaqs(data);
    } catch (err) {
      setError("Failed to load FAQs by category and channel");
      console.error("Error loading filtered FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  return { faqs, loading, error, load };
};

/* ========================
   MUTATIONS
======================== */
export const useFaqMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: Omit<FAQ, 'id' | 'slug' | 'created_at' | 'views'>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createFAQ(data);
      return response?.data || response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to create FAQ";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: number, data: Partial<FAQ>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await updateFAQ(id, data);
      return response?.data || response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to update FAQ";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await deleteFAQ(id);
      return response?.data || response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to delete FAQ";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    create, 
    update, 
    remove, 
    loading, 
    error,
    clearError: () => setError(null)
  };
};