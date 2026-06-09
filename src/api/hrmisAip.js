import axios from "axios";

// Base URL of your external API
const HRMIS_URL = "http://192.168.10.12/api/authentication";

/**
 * Fetch user from HRMIS system using check number
 */
export const fetchHRMISUser = async (checkno) => {
  try {
    const response = await axios.post(
      HRMIS_URL,
      {
        checkno: checkno,
      },
      {
        headers: {
          key: "tms",
          value: "cc7bdc8b80572f99848145c70d219969d476a53c",
          "Content-Type": "application/json",
        },
      }
    );

    // Check if response has the expected structure
    if (response.data && response.data.info) {
      return {
        success: true,
        data: {
          checkno: response.data.info.checkno || checkno,
          firstname: response.data.info.firstname || response.data.info.fname,
          middlename: response.data.info.middlename || response.data.info.mname,
          lastname: response.data.info.lastname || response.data.info.lname,
          email: response.data.info.email,
          phone: response.data.info.phone || response.data.info.phoneno,
          department: response.data.info.department,
          designation: response.data.info.designation,
          photo: response.data.info.photo || null,
          signature: response.data.info.signature || null,
          ...response.data.info
        }
      };
    } else {
      return {
        success: false,
        message: response.data?.message || "Invalid response from server"
      };
    }
  } catch (error) {
    console.error("HRMIS API Error:", error.response?.data || error.message);
    
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 404 || error.response.status === 400) {
        return {
          success: false,
          message: "User not found"
        };
      }
      return {
        success: false,
        message: `Server error: ${error.response.status}`
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        message: "Network error - Cannot connect to HRMIS server"
      };
    } else {
      // Something else happened
      return {
        success: false,
        message: error.message || "An error occurred"
      };
    }
  }
};