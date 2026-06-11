// src/api/nida/nidaApi.ts
import axios from "axios";

// Create a dedicated axios instance for the external NIDA API
const nidaApi = axios.create({
  baseURL: "http://192.168.57.17:83/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Verify NIDA number with external service
 */
export const verifyNida = async (nidaNumber: string) => {
  return nidaApi.post("/nida", {
    nin: nidaNumber,
  });
};

/**
 * Fetch citizen profile by NIDA (if needed)
 */
export const getCitizenByNida = async (nidaNumber: string) => {
  return nidaApi.get(`/nida/citizens/${nidaNumber}/`);
};

/**
 * Check if NIDA already used for reporting (your backend endpoint)
 * This uses your main API, not the external one.
 */
export const checkNidaUsage = async (nidaNumber: string) => {
  // This should use your main api instance (already imported)
  // We'll import the main api inside to avoid circular dependency
  const mainApi = (await import("../axios")).default;
  return mainApi.post("/nida/check-usage/", {
    nin: nidaNumber,
  });
};