// src/api/hrmisApi.ts
import axios, { AxiosError } from "axios";

// ================= TYPES =================
export interface HRMISUser {
  checkno: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  email: string;
  phone?: string;
  department?: string;
  designation?: string;
  photo?: string | null;
  signature?: string | null;
  fname?: string;  // Alternative field names
  lname?: string;
  mname?: string;
  phoneno?: string;
  rank?: string; 
}

export interface HRMISResponse {
  success: boolean;
  data?: HRMISUser;
  message?: string;
  error?: string;
}

export interface HRMISApiResponse {
  info?: HRMISUser;
  message?: string;
  status?: string;
}

// ================= CONFIGURATION =================
const HRMIS_URL = "http://192.168.10.12/api/authentication";
const HRMIS_API_KEY = "cc7bdc8b80572f99848145c70d219969d476a53c";

// Create axios instance with default config
const hrmisClient = axios.create({
  baseURL: HRMIS_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
    "key": "tms",
    "value": HRMIS_API_KEY,
  },
});

// Request interceptor for logging
hrmisClient.interceptors.request.use(
  (config) => {
    console.log(`HRMIS API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("HRMIS Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
hrmisClient.interceptors.response.use(
  (response) => {
    console.log("HRMIS API Response:", response.status);
    return response;
  },
  (error) => {
    console.error("HRMIS Response Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ================= API FUNCTIONS =================

/**
 * Fetch user from HRMIS system using check number
 */
export const fetchHRMISUser = async (checkno: string): Promise<HRMISResponse> => {
  // Input validation
  if (!checkno || !checkno.trim()) {
    return {
      success: false,
      message: "Check number is required",
    };
  }

  try {
    const response = await hrmisClient.post<HRMISApiResponse>("", {
      checkno: checkno.trim(),
    });

    // Check if response has the expected structure
    if (response.data && response.data.info) {
      const userInfo = response.data.info;
      
      // Map the response to our standard HRMISUser format
      const userData: HRMISUser = {
        checkno: userInfo.checkno || checkno,
        firstname: userInfo.firstname || userInfo.fname || "",
        middlename: userInfo.middlename || userInfo.mname,
        lastname: userInfo.lastname || userInfo.lname || "",
        email: userInfo.email || "",
        phone: userInfo.phone || userInfo.phoneno,
        department: userInfo.department,
        designation: userInfo.designation,
        photo: userInfo.photo || null,
        signature: userInfo.signature || null,
      };

      // Validate required fields
      if (!userData.firstname || !userData.lastname || !userData.email) {
        return {
          success: false,
          message: "Incomplete user data received from HRMIS",
          data: userData,
        };
      }

      return {
        success: true,
        data: userData,
        message: "User found successfully",
      };
    } else {
      return {
        success: false,
        message: response.data?.message || "Invalid response from HRMIS server",
      };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    
    // Handle different error scenarios
    if (axiosError.response) {
      // Server responded with error status
      const status = axiosError.response.status;
      const data = axiosError.response.data as any;
      
      if (status === 404 || status === 400) {
        return {
          success: false,
          message: data?.message || "User not found in HRMIS system",
        };
      } else if (status === 401 || status === 403) {
        return {
          success: false,
          message: "Authentication failed with HRMIS server",
        };
      } else if (status === 500) {
        return {
          success: false,
          message: "HRMIS server internal error",
        };
      } else {
        return {
          success: false,
          message: `Server error: ${status} - ${data?.message || "Unknown error"}`,
        };
      }
    } else if (axiosError.request) {
      // Request was made but no response received
      return {
        success: false,
        message: "Network error - Cannot connect to HRMIS server. Please check your connection.",
      };
    } else {
      // Something else happened
      return {
        success: false,
        message: axiosError.message || "An unexpected error occurred",
      };
    }
  }
};

/**
 * Search multiple users from HRMIS (if supported by API)
 */
export const searchHRMISUsers = async (params: {
  query?: string;
  department?: string;
  limit?: number;
}): Promise<HRMISResponse & { users?: HRMISUser[] }> => {
  try {
    // This is a placeholder - implement based on actual API capabilities
    const response = await hrmisClient.post("/search", params);
    
    if (response.data && Array.isArray(response.data.users)) {
      const users = response.data.users.map((user: any) => ({
        checkno: user.checkno,
        firstname: user.firstname || user.fname,
        lastname: user.lastname || user.lname,
        email: user.email,
        phone: user.phone || user.phoneno,
        department: user.department,
        designation: user.designation,
      }));
      
      return {
        success: true,
        users,
        message: "Users found successfully",
      };
    }
    
    return {
      success: false,
      message: "No users found",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to search HRMIS users",
    };
  }
};

/**
 * Validate HRMIS connection
 */
export const validateHRMISConnection = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Test with a dummy check number or use a health check endpoint
    const response = await hrmisClient.post("", { checkno: "TEST" });
    
    if (response.status === 200) {
      return {
        success: true,
        message: "HRMIS connection successful",
      };
    }
    
    return {
      success: false,
      message: "HRMIS connection failed",
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to HRMIS server",
    };
  }
};

/**
 * Get HRMIS user by check number with retry mechanism
 */
export const fetchHRMISUserWithRetry = async (
  checkno: string,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<HRMISResponse> => {
  let lastError: HRMISResponse = { success: false, message: "Unknown error" };
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`HRMIS API attempt ${attempt} of ${maxRetries}`);
    
    const result = await fetchHRMISUser(checkno);
    
    if (result.success) {
      return result;
    }
    
    lastError = result;
    
    if (attempt < maxRetries) {
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return {
    ...lastError,
    message: `Failed after ${maxRetries} attempts: ${lastError.message}`,
  };
};

/**
 * Batch fetch multiple HRMIS users
 */
export const batchFetchHRMISUsers = async (
  checknos: string[]
): Promise<{ successful: HRMISUser[]; failed: { checkno: string; error: string }[] }> => {
  const successful: HRMISUser[] = [];
  const failed: { checkno: string; error: string }[] = [];
  
  // Process in parallel with concurrency limit
  const concurrencyLimit = 5;
  const chunks = [];
  
  for (let i = 0; i < checknos.length; i += concurrencyLimit) {
    chunks.push(checknos.slice(i, i + concurrencyLimit));
  }
  
  for (const chunk of chunks) {
    const promises = chunk.map(async (checkno) => {
      const result = await fetchHRMISUser(checkno);
      if (result.success && result.data) {
        successful.push(result.data);
      } else {
        failed.push({ checkno, error: result.message || "Unknown error" });
      }
    });
    
    await Promise.all(promises);
  }
  
  return { successful, failed };
};

// ================= HOOKS (Optional) =================

/**
 * React hook for HRMIS user search
 */
