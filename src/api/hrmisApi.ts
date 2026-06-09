// src/api/hrmisApi.ts
import axios from "axios";

const HRMIS_URL = "http://192.168.10.12/api/authentication";
const HRMIS_API_KEY = "cc7bdc8b80572f99848145c70d219969d476a53c";

export interface HRMISUser {
  checkno: string;
  fname: string;
  mname: string;
  lname: string;
  email: string;
  rank: string;
  phoneno: string;
  gender: string;
  birthdate: string;
  nin: string;
  department: string;
  commands: string;
  districts: string;
  stations: string;
  jobs: string;
  education: string;
  education_award: string;
  staff_status: string;
  force_number: string;
  designation: string | null;
  photo?: string;
}

export interface HRMISResponse {
  success: boolean;
  data?: HRMISUser;
  message?: string;
}

export const fetchHRMISUser = async (checkno: string): Promise<HRMISResponse> => {
  if (!checkno || !checkno.trim()) {
    return {
      success: false,
      message: "Check number is required",
    };
  }

  try {
    const response = await axios.post(
      HRMIS_URL,
      {
        checkno: checkno.trim(),
      },
      {
        headers: {
          "Content-Type": "application/json",
          key: "tms",
          value: HRMIS_API_KEY,
        },
        timeout: 30000,
      }
    );

    console.log("HRMIS API Response:", response.data);

    // Check if the response has the expected structure
    // The API returns code 400 but with user data - this is actually a success
    if (response.data && response.data.info) {
      const userData = response.data.info;
      
      // Check if we have essential user data
      if (userData.checkno && userData.email) {
        return {
          success: true,
          data: {
            checkno: userData.checkno,
            fname: userData.fname || "",
            mname: userData.mname || "",
            lname: userData.lname || "",
            email: userData.email,
            rank: userData.rank || "",
            phoneno: userData.phoneno || "",
            gender: userData.gender || "",
            birthdate: userData.birthdate || "",
            nin: userData.nin || "",
            department: userData.department || "",
            commands: userData.commands || "",
            districts: userData.districts || "",
            stations: userData.stations || "",
            jobs: userData.jobs || "",
            education: userData.education || "",
            education_award: userData.education_award || "",
            staff_status: userData.staff_status || "",
            force_number: userData.force_number || "",
            designation: userData.designation || null,
            photo: userData.photo || "",
          },
        };
      } else {
        return {
          success: false,
          message: "Incomplete user data received from HRMIS",
        };
      }
    } else {
      return {
        success: false,
        message: response.data?.message || "Invalid response from HRMIS server",
      };
    }
  } catch (error: any) {
    console.error("HRMIS API Error:", error);
    
    // Check if it's a network error
    if (error.code === "ERR_NETWORK") {
      return {
        success: false,
        message: "Network error - Cannot connect to HRMIS server. Please check your connection.",
      };
    }
    
    // Check if we have response data (even with error status)
    if (error.response && error.response.data) {
      const responseData = error.response.data;
      
      // Some APIs return data even on error status
      if (responseData.info) {
        const userData = responseData.info;
        if (userData.checkno) {
          return {
            success: true,
            data: {
              checkno: userData.checkno,
              fname: userData.fname || "",
              mname: userData.mname || "",
              lname: userData.lname || "",
              email: userData.email,
              rank: userData.rank || "",
              phoneno: userData.phoneno || "",
              gender: userData.gender || "",
              birthdate: userData.birthdate || "",
              nin: userData.nin || "",
              department: userData.department || "",
              commands: userData.commands || "",
              districts: userData.districts || "",
              stations: userData.stations || "",
              jobs: userData.jobs || "",
              education: userData.education || "",
              education_award: userData.education_award || "",
              staff_status: userData.staff_status || "",
              force_number: userData.force_number || "",
              designation: userData.designation || null,
              photo: userData.photo || "",
            },
          };
        }
      }
      
      return {
        success: false,
        message: error.response.data?.message || `Server error: ${error.response.status}`,
      };
    } else if (error.request) {
      return {
        success: false,
        message: "No response from HRMIS server. Please check if the server is running.",
      };
    } else {
      return {
        success: false,
        message: error.message || "An unexpected error occurred",
      };
    }
  }
};