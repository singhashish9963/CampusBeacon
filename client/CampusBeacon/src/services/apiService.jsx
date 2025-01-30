import axios from 'axios'

export const handleApiCall = async (endpoint, data) => {
  try {
    const response = await axiosInstance.post(endpoint, data);
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "An error occurred";
    throw new Error(message);
  }
};
