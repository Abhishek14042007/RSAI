import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import COLORS from "../constants/colors";
import { getUserById } from "../services/authService";
import { sendChatRequest } from "../services/chatService";

export default function UserProfileScreen({ route, navigation }) {

    const { userId } = route.params;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {

            const response = await getUserById(userId);

            setUser(response.data.data);

        } catch (error) {
            console.log("========== USER PROFILE ERROR ==========");
            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);
            console.log("MESSAGE:", error.message);
            console.log("URL:", error.config?.url);
            console.log("========================================");

            Alert.alert(
                "Error",
                error.response?.data?.message || "Unable to load user profile"
            );
            navigation.goBack();

        } finally {

            setLoading(false);

        }
    };

    const handleSendRequest = async () => {

        try {

            setSending(true);

            await sendChatRequest(userId);

            Alert.alert(
                "Success",
                "Chat request sent successfully."
            );

        } catch (error) {

            console.log(
                "CHAT REQUEST ERROR:",
                error.response?.data || error
            );

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                "Unable to send chat request."
            );

        } finally {

            setSending(false);

        }
    };

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

    if (!user) {
        return null;
    }

    return (

        <ScrollView style={styles.container}>

            <View style={styles.profileCard}>

                <View style={styles.avatarContainer}>

                    {user.profile_picture ? (

                        <Image
                            source={{
                                uri: user.profile_picture,
                            }}
                            style={styles.avatar}
                        />

                    ) : (

                        <Text style={styles.avatarText}>
                            {user.full_name?.charAt(0)?.toUpperCase()}
                        </Text>

                    )}

                </View>

                <Text style={styles.name}>
                    {user.full_name}
                </Text>

                <Text style={styles.role}>
                    {user.role}
                </Text>

                {user.role === "alumni" && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            🎓 Alumni
                        </Text>
                    </View>
                )}

            </View>

            <View style={styles.infoCard}>

                <Text style={styles.heading}>
                    About
                </Text>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>
                        Department
                    </Text>

                    <Text style={styles.value}>
                        {user.department || "Not provided"}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>
                        Semester
                    </Text>

                    <Text style={styles.value}>
                        {user.semester || "Not provided"}
                    </Text>
                </View>

                <View style={styles.bioSection}>

                    <Text style={styles.label}>
                        Bio
                    </Text>

                    <Text style={styles.bio}>
                        {user.bio || "No bio available."}
                    </Text>

                </View>

            </View>

            <TouchableOpacity
                style={[
                    styles.chatButton,
                    sending && { opacity: 0.7 }
                ]}
                onPress={handleSendRequest}
                disabled={sending}
            >

                {sending ? (

                    <ActivityIndicator color="white" />

                ) : (

                    <Text style={styles.chatButtonText}>
                        💬 Send Chat Request
                    </Text>

                )}

            </TouchableOpacity>

        </ScrollView>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
    },

    loadingContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
    },

    profileCard: {
        backgroundColor: COLORS.card,
        borderRadius: 15,
        padding: 25,
        alignItems: "center",
        marginBottom: 20,
    },

    avatarContainer: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
    },

    avatarText: {
        color: COLORS.white,
        fontSize: 45,
        fontWeight: "bold",
    },

    name: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: "bold",
    },

    role: {
        color: COLORS.text,
        fontSize: 14,
        marginTop: 5,
    },

    badge: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 15,
        marginTop: 10,
    },

    badgeText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "bold",
    },

    infoCard: {
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

    infoRow: {
        marginBottom: 18,
    },

    label: {
        color: "#94A3B8",
        fontSize: 13,
        marginBottom: 5,
    },

    value: {
        color: COLORS.white,
        fontSize: 16,
    },

    bioSection: {
        marginTop: 5,
    },

    bio: {
        color: COLORS.white,
        fontSize: 15,
        lineHeight: 22,
    },

    chatButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 30,
    },

    chatButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "bold",
    },

});