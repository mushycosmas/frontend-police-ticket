
import api from "./axios";
import publicApi from "./publicApi";
// ========================
// FAQ APIs
// ========================

// Get all FAQs (filter supported)
// export const getFAQs = async (params = {}) => {
//   const response = await publicApi.get("/faqs/", { params });
//   return response.data;
// };
export const getFAQs = async (
  page = 1,
  pageSize = 10,
  params = {}
) => {
  const response = await publicApi.get("/faqs/", {
    params: {
      page,
      page_size: pageSize,
      ...params,
    },
  });

  return response.data;
};

// Get single FAQ
export const getFAQ = async (id) => {
  const response = await api.get(`/faqs/${id}/`);
  return response.data;
};

// Create FAQ
export const createFAQ = async (data) => {
  const response = await api.post("/faqs/", data);
  return response.data;
};

// Update FAQ
export const updateFAQ = async (id, data) => {
  const response = await api.put(`/faqs/${id}/`, data);
  return response.data;
};

// Delete FAQ
export const deleteFAQ = async (id) => {
  const response = await api.delete(`/faqs/${id}/`);
  return response.data;
};

// ========================
// Custom filter (category + channel)
// ========================

export const getFAQsByCategoryChannel = async (category_id, channel_id) => {
  const response = await api.get("/faqs/by_category_channel/", {
    params: { category_id, channel_id },
  });
  return response.data;
};

// ========================
// Search FAQs
// ========================

export const searchFAQs = async (query) => {
  const response = await api.get("/faqs/", {
    params: { search: query },
  });
  return response.data;
};

// ========================
// Feedback APIs
// ========================

// Submit feedback
export const submitFAQFeedback = async (data) => {
  const response = await api.post("/faq-feedback/", data);
  return response.data;
};

// Get feedback (admin)
export const getFAQFeedback = async () => {
  const response = await api.get("/faq-feedback/");
  return response.data;
};

export const incrementFAQView = async (id) => {
  const response = await publicApi.post(`/faqs/${id}/increment_view/`);
  return response.data;
};