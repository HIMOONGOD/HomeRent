import axios , {type AxiosInstance , type InternalAxiosRequestConfig } from "axios";

// , type InternalAxiosRequestConfig ,AxiosError

const api : AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,   
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
    }
    return Promise.reject(error);
    }
);

export default api;
