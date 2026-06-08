import publicApi from "./publicApi";

// =====================
// LOCATIONS publicApi
// =====================

// REGIONS
export const getRegions = () => publicApi.get("/locations/regions/");
export const getRegion = (id) => publicApi.get(`/locations/regions/${id}/`);
export const createRegion = (data) => publicApi.post("/locations/regions/", data);
export const updateRegion = (id, data) =>
    publicApi.patch(`/locations/regions/${id}/`, data);
export const deleteRegion = (id) =>
    publicApi.delete(`/locations/regions/${id}/`);


// DISTRICTS
export const getDistricts = () => publicApi.get("/locations/districts/");
export const getDistrict = (id) => publicApi.get(`/locations/districts/${id}/`);
export const createDistrict = (data) =>
    publicApi.post("/locations/districts/", data);
export const updateDistrict = (id, data) =>
    publicApi.patch(`/locations/districts/${id}/`, data);
export const deleteDistrict = (id) =>
    publicApi.delete(`/locations/districts/${id}/`);


// WARDS
export const getWards = () => publicApi.get("/locations/wards/");
export const getWard = (id) => publicApi.get(`/locations/wards/${id}/`);
export const createWard = (data) => publicApi.post("/locations/wards/", data);
export const updateWard = (id, data) =>
    publicApi.patch(`/locations/wards/${id}/`, data);
export const deleteWard = (id) =>
    publicApi.delete(`/locations/wards/${id}/`);


// =====================
// STREETS (NEW)
// =====================
export const getStreets = () => publicApi.get("/locations/streets/");
export const getStreet = (id) => publicApi.get(`/locations/streets/${id}/`);
export const createStreet = (data) =>
    publicApi.post("/locations/streets/", data);
export const updateStreet = (id, data) =>
    publicApi.patch(`/locations/streets/${id}/`, data);
export const deleteStreet = (id) =>
    publicApi.delete(`/locations/streets/${id}/`);