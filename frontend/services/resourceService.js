import api from "./api";

export const getResources = async () => {
    const response = await api.get("/resources");
    return response.data;
};