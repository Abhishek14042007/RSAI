import api from "./api";

export const loginUser = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password,
    });

    return response.data;
};

export const registerUser = async (
    full_name,
    email,
    password,
    role,
    department,
    semester
) => {

    const response = await api.post("/auth/register", {
        full_name,
        email,
        password,
        role,
        department,
        semester,
    });

    return response.data;
};
export const getProfile = async () => {

    const response = await api.get("/auth/profile");

    return response.data;

};
export const updateProfile = async (data) => {

    const response = await api.put(
        "/auth/profile",
        data
    );

    return response.data;

};

export const uploadProfilePicture = async (formData) => {

    const response = await api.post(
        "/auth/profile-picture",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};