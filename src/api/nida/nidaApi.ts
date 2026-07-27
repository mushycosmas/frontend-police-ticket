// src/api/nida/nidaApi.ts

import publicApi from "../publicApi";

/**
 * Verify NIDA number.
 * Django handles communication with the external NIDA service.
 */
export const verifyNida = async (nidaNumber: string) => {
  return publicApi.post("/nida/verify/", {
    nin: nidaNumber,
  });
};

/**
 * Fetch citizen profile by NIDA through Django.
 */
export const getCitizenByNida = async (nidaNumber: string) => {
  return publicApi.get(`/nida/citizens/${nidaNumber}/`);
};

/**
 * Check if NIDA already used for reporting.
 */
export const checkNidaUsage = async (nidaNumber: string) => {
  return publicApi.post("/nida/check-usage/", {
    nin: nidaNumber,
  });
};