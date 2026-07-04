import api from "./api";

export const getResources = async () => {
    const response = await api.get("/resources");
    return response.data;
};

export const likeResource = async (resourceId) => {
    const response = await api.post(`/resources/${resourceId}/like`);
    return response.data;
};