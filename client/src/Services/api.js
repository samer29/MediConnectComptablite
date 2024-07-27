// In src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4002", // Adjust the base URL according to your backend server configuration
});

export const loginUser = async (username, password) => {
  try {
    const response = await api.post("/users/login", { username, password });

    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response || error.message);
    throw error.response || error;
  }
};

export default api;
