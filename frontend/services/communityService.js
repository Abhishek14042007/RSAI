import api from "./api";

export const getPosts = async () => {

    const response = await api.get(
        "/community"
    );

    return response.data;

};

export const createPost = async (content, image) => {

    const formData = new FormData();

    formData.append("content", content);

    if (image) {

        formData.append("image", {
            uri: image.uri,
            name: image.fileName || "community.jpg",
            type: image.mimeType || "image/jpeg",
        });

    }
    console.log("Content:", content);
    console.log("Image:", image);
    const response = await api.post(
        "/community",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
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