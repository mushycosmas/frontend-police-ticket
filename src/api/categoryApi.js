import api from "./axios";
import publicApi from "./publicApi";
// GET ALL
export const getCategories = () =>
  publicApi.get("/categories/");

// CREATE
export const createCategory = (data) =>
  api.post("/categories/", data);

// UPDATE
export const updateCategory = (id, data) =>
  api.put(`/categories/${id}/`, data);

// DELETE
export const deleteCategory = (id) =>
  api.delete(`/categories/${id}/`);