import axios from "axios";

// 建立axios 實例
const api = axios.create({
  baseURL: "http://localhost:8000/api", // 後端 API 路徑
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API 錯誤:", error);
    return Promise.reject(error);
  }
);

export default api;
