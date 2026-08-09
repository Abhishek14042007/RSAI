import api from "./api";

export const sendChatRequest = async (receiverId) => {
    return await api.post("/chat/request", {
        receiver_id: receiverId,
    });
};

// Get all accepted chats
export const getChatRooms = async () => {
    const response = await api.get("/chat/rooms");
    return response.data;
};

// Get messages from a chat room
export const getMessages = async (roomId) => {
    const response = await api.get(
        `/chat/rooms/${roomId}/messages`
    );
    return response.data;
};

// Send a message
export const sendMessage = async (roomId, content) => {
    const response = await api.post(
        `/chat/rooms/${roomId}/messages`,
        {
            content,
        }
    );

    return response.data;
};