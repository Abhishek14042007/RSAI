import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL = "https://rsai-backend-rsh9.onrender.com/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {

        const token = await AsyncStorage.getItem("token");



        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;

    },
    (error) => Promise.reject(error)
);

export default api;