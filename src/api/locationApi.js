import api from "./axios";

// =====================
// LOCATIONS API
// =====================

// REGIONS
export const getRegions = () => api.get("/locations/regions/");
export const getRegion = (id) => api.get(`/locations/regions/${id}/`);
export const createRegion = (data) => api.post("/locations/regions/", data);
export const updateRegion = (id, data) =>
    api.patch(`/locations/regions/${id}/`, data);
export const deleteRegion = (id) =>
    api.delete(`/locations/regions/${id}/`);


// DISTRICTS
export const getDistricts = () => api.get("/locations/districts/");
export const getDistrict = (id) => api.get(`/locations/districts/${id}/`);
export const createDistrict = (data) =>
    api.post("/locations/districts/", data);
export const updateDistrict = (id, data) =>
    api.patch(`/locations/districts/${id}/`, data);
export const deleteDistrict = (id) =>
    api.delete(`/locations/districts/${id}/`);


// WARDS
export const getWards = () => api.get("/locations/wards/");
export const getWard = (id) => api.get(`/locations/wards/${id}/`);
export const createWard = (data) => api.post("/locations/wards/", data);
export const updateWard = (id, data) =>
    api.patch(`/locations/wards/${id}/`, data);
export const deleteWard = (id) =>
    api.delete(`/locations/wards/${id}/`);


// =====================
// STREETS (NEW)
// =====================
export const getStreets = () => api.get("/locations/streets/");
export const getStreet = (id) => api.get(`/locations/streets/${id}/`);
export const createStreet = (data) =>
    api.post("/locations/streets/", data);
export const updateStreet = (id, data) =>
    api.patch(`/locations/streets/${id}/`, data);
export const deleteStreet = (id) =>
    api.delete(`/locations/streets/${id}/`);