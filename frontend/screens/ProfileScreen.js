import { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import COLORS from "../constants/colors";

import {
    getProfile,
    updateProfile,
    uploadProfilePicture,
} from "../services/authService";

export default function ProfileScreen() {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const loadProfile = async () => {

        try {

            const response = await getProfile();

            setUser(response.data);


        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const pickImage = async () => {

        console.log("Avatar pressed");

        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {

            Alert.alert(
                "Permission Required",
                "Please allow gallery access."
            );

            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({

            mediaTypes: ImagePicker.MediaTypeOptions.Images,

            allowsEditing: true,

            aspect: [1, 1],

            quality: 0.8,

        });

        if (result.canceled) return;

        try {

            const image = result.assets[0];

            const formData = new FormData();

            formData.append("image", {
                uri: image.uri,
                name: "profile.jpg",
                type: "image/jpeg",
            });

            const response = await uploadProfilePicture(formData);

            setUser({
                ...user,
                profile_picture: response.data.profile_picture,
            });

            Alert.alert(
                "Success",
                "Profile picture updated!"
            );

        } catch (error) {

            console.log("FULL ERROR:", error);

            console.log("RESPONSE:", error.response?.data);

            console.log("MESSAGE:", error.message);

            Alert.alert(
                "Error",
                "Unable to upload image."
            );

        }

    };

    useEffect(() => {

        loadProfile();

    }, []);

    if (loading) {

        return (

            <View style={styles.loadingContainer}>

                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                />

            </View>

        );

    }

    return (

        <ScrollView style={styles.container}>

            <TouchableOpacity
                style={styles.avatar}
                onPress={pickImage}
            >

                {user.profile_picture ? (

                    <Image
                        source={{
                            uri: user.profile_picture,
                        }}
                        style={styles.profileImage}
                    />

                ) : (

                    <Ionicons
                        name="person"
                        size={70}
                        color={COLORS.white}
                    />

                )}

            </TouchableOpacity>

            <Text style={styles.email}>
                {user.email}
            </Text>

            <View style={styles.card}>

                <Text style={styles.heading}>
                    Edit Profile
                </Text>

                <TextInput
                    style={styles.input}
                    value={user.full_name}
                    onChangeText={(text) =>
                        setUser({
                            ...user,
                            full_name: text,
                        })
                    }
                    placeholder="Full Name"
                    placeholderTextColor="#94A3B8"
                />

                <TextInput
                    style={styles.input}
                    value={user.department || ""}
                    onChangeText={(text) =>
                        setUser({
                            ...user,
                            department: text,
                        })
                    }
                    placeholder="Department"
                    placeholderTextColor="#94A3B8"
                />

                <TextInput
                    style={styles.input}
                    value={user.semester || ""}
                    onChangeText={(text) =>
                        setUser({
                            ...user,
                            semester: text,
                        })
                    }
                    placeholder="Semester"
                    placeholderTextColor="#94A3B8"
                />

                <TextInput
                    style={styles.bio}
                    multiline
                    value={user.bio || ""}
                    onChangeText={(text) =>
                        setUser({
                            ...user,
                            bio: text,
                        })
                    }
                    placeholder="Write something about yourself..."
                    placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={async () => {

                        try {

                            const response = await updateProfile({
                                full_name: user.full_name,
                                bio: user.bio,
                                department: user.department,
                                semester: user.semester,
                            });

                            setUser(response.data);

                            Alert.alert(
                                "Success",
                                "Profile updated successfully."
                            );

                        } catch (error) {

                            Alert.alert(
                                "Error",
                                error.response?.data?.message ||
                                "Unable to update profile."
                            );

                        }

                    }}
                >
                    <Text style={styles.saveText}>
                        Save Changes
                    </Text>
                </TouchableOpacity>

                <View style={styles.infoCard}>

                    <Text style={styles.infoHeading}>
                        Account Information
                    </Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Role
                        </Text>

                        <Text style={styles.infoValue}>
                            {user.role}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Email
                        </Text>

                        <Text style={styles.infoValue}>
                            {user.email}
                        </Text>
                    </View>

                </View>

            </View>

        </ScrollView>

    );
}
const styles = StyleSheet.create({

    input: {
        backgroundColor: "#1E293B",
        color: COLORS.white,
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },

    bio: {
        backgroundColor: "#1E293B",
        color: COLORS.white,
        borderRadius: 12,
        padding: 15,
        height: 120,
        textAlignVertical: "top",
        marginBottom: 20,
    },

    saveButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },

    saveText: {
        color: COLORS.white,
        fontWeight: "bold",
        fontSize: 16,
    },

    infoCard: {
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: "#334155",
        paddingTop: 20,
    },

    infoHeading: {
        color: COLORS.primary,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    infoLabel: {
        color: "#94A3B8",
        fontSize: 15,
    },

    infoValue: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: "600",
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
    },

    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 30,
        marginBottom: 20,
    },

    name: {
        color: COLORS.white,
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
    },

    email: {
        color: COLORS.text,
        textAlign: "center",
        marginTop: 8,
        marginBottom: 30,
    },

    card: {
        backgroundColor: COLORS.card,
        borderRadius: 15,
        padding: 20,
    },

    heading: {
        color: COLORS.primary,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },

    row: {
        marginBottom: 18,
    },

    label: {
        color: "#94A3B8",
        fontSize: 13,
    },

    value: {
        color: COLORS.white,
        fontSize: 17,
        marginTop: 4,
    },

});