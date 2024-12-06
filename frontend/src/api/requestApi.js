import axios from "axios";

const API_URL = "http://localhost:23077/api/requests";

export const getAllGroupedRequests = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    return [];
  }
};

export const updateRequestStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}`, { id, status });
    return response.data;
  } catch (error) {
    console.error("Error updating request status:", error);
    return null;
  }
};

export const submitLeaveRequest = async (dopusti) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:23077/api/users/request",
      { dopusti },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error submitting request:", error);
    throw error;
  }
};
export const getAllLeaves = async () => {
  try {
    const response = await axios.get(`${API_URL}/all-leaves`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all leaves:", error);
    return [];
  }
};

export const getUserRequests = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/user-requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user requests:", error);
    throw error;
  }
};
export const getUserRequestStatuses = async () => {
  try {
    const response = await axios.get(`${API_URL}/user-request-statuses`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user request statuses:", error);
    return [];
  }
};
export const deleteLeave = async (leaveId) => {
  try {
    const response = await axios.delete(`${API_URL}/leave/${leaveId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting leave:", error);
    throw error;
  }
};
