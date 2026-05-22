// Pre-configured axios instance. Adds JWT token from localStorage automatically.
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// Helper to build a full URL for a product image
export const imageUrl = (image) => {
  if (!image) return "https://via.placeholder.com/400x400?text=No+Image";
  if (image.startsWith("http")) return image;
  return `${process.env.REACT_APP_UPLOADS_URL || "http://localhost:5000/uploads"}/${image}`;
};
