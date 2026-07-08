import api from "./api";

export const getPosts = async () => {

    const response = await api.get(
        "/community"
    );

    return response.data;

};

export const createPost = async (content) => {

    const response = await api.post(
        "/community",
        {
            content,
        }
    );

    return response.data;

};

export const likePost = async (postId) => {

    const response = await api.post(
        `/community/${postId}/like`
    );

    return response.data;

};

export const deletePost = async (postId) => {

    const response = await api.delete(
        `/community/${postId}`
    );

    return response.data;

};

export const getComments = async (postId) => {

    const response = await api.get(
        `/community/${postId}/comments`
    );

    return response.data;

};

export const addComment = async (
    postId,
    content
) => {

    const response = await api.post(
        `/community/${postId}/comments`,
        {
            content,
        }
    );

    return response.data;

};

export const deleteComment = async (
    commentId
) => {

    const response = await api.delete(
        `/community/comments/${commentId}`
    );

    return response.data;

};