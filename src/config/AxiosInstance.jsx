import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://aivirtual-assistant-backend.vercel.app/api/v1/users",
    withCredentials: true
});

export default axiosInstance;