import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export const uploadResource = async (formData) => {
    const token = await AsyncStorage.getItem("token");

    const response = await api.post(
        "/resources/upload",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};