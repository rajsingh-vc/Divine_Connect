import axios from "axios";

/**
 * If you already have a shared axios instance elsewhere in the project,
 * delete this file and just point inventory-api.ts's import at that one —
 * this is only here as a working default.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "", // e.g. "https://api.yourdomain.org"
  withCredentials: true, // send session cookies if you're using Django session auth
});

// If you're using token/JWT auth instead of session auth, attach it here:
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: handle 401s globally (e.g. redirect to login)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // e.g. window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);