import axios from "axios";

// Change this to your computer's IPv4 address
const API_BASE_URL = "http://10.78.133.254:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;