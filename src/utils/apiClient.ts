import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.BASE_API_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization Header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle Expired Tokens
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // eslint-disable-next-line no-console
      console.error("Token expired or unauthorized. Redirecting to login.");
      localStorage.removeItem("token");
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

export default apiClient;