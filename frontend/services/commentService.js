import api from "./api";

export const getComments = async (resourceId) => {
    const response = await api.get(`/comments/${resourceId}`);
    return response.data;
};

export const addComment = async (resourceId, content) => {
    const response = await api.post(`/comments/${resourceId}`, {
        content,
    });

    return response.data;
};