import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import COLORS from "../constants/colors";
import api from "../services/api";

export default function AlumniScreen({ navigation }) {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(null);

    const fetchAlumni = async () => {
        try {

            const response = await api.get("/auth/users");

            setUsers(
                response.data.data || response.data.users || []
            );

        } catch (error) {

            console.log(
                "ALUMNI FETCH ERROR:",
                error.response?.data || error.message
            );

            Alert.alert(
                "Error",
                "Unable to load alumni."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchAlumni();
    }, []);

    const sendChatRequest = async (userId) => {

        try {

            setSending(userId);

            await api.post(
                "/chat/request",
                {
                    receiver_id: userId,
                }
            );

            Alert.alert(
                "Request Sent",
                "Your chat request has been sent."
            );

        } catch (error) {

            console.log(
                "CHAT REQUEST ERROR:",
                error.response?.data || error.message
            );

            const message =
                error.response?.data?.message ||
                "Unable to send chat request.";

            Alert.alert("Request", message);

        } finally {

            setSending(null);

        }
    };

    const renderAlumni = ({ item }) => (

        <View style={styles.card}>

            <View style={styles.userSection}>

                <View style={styles.avatar}>
                    <Ionicons
                        name="person"
                        size={28}
                        color={COLORS.primary}
                    />
                </View>

                <View style={styles.userInfo}>

                    <Text style={styles.name}>
                        {item.full_name}
                    </Text>

                    <Text style={styles.role}>
                        {item.role}
                    </Text>

                    {item.department && (
                        <Text style={styles.details}>
                            {item.department}
                            {item.semester
                                ? ` • Semester ${item.semester}`
                                : ""}
                        </Text>
                    )}

                </View>

            </View>

            <TouchableOpacity
                style={styles.messageButton}
                onPress={() => sendChatRequest(item.id)}
                disabled={sending === item.id}
            >

                {sending === item.id ? (

                    <ActivityIndicator
                        size="small"
                        color="white"
                    />

                ) : (

                    <>
                        <Ionicons
                            name="chatbubble-outline"
                            size={17}
                            color="white"
                        />

                        <Text style={styles.messageText}>
                            Message
                        </Text>
                    </>

                )}

            </TouchableOpacity>

        </View>
    );

    if (loading) {

        return (
            <View style={styles.loading}>
                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                />
            </View>
        );

    }

    return (

        <View style={styles.container}>

            <View style={styles.header}>

                <View>
                    <Text style={styles.heading}>
                        Alumni
                    </Text>

                    <Text style={styles.subtitle}>
                        Connect with alumni and ask questions.
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("ChatRequests")
                    }
                    style={styles.requestIcon}
                >
                    <Ionicons
                        name="notifications-outline"
                        size={25}
                        color={COLORS.white}
                    />
                </TouchableOpacity>

            </View>

            {users.length === 0 ? (

                <Text style={styles.empty}>
                    No alumni available.
                </Text>

            ) : (

                <FlatList
                    data={users}
                    keyExtractor={(item) =>
                        item.id.toString()
                    }
                    renderItem={renderAlumni}
                    showsVerticalScrollIndicator={false}
                />

            )}

        </View>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
    },

    loading: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 25,
    },

    heading: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: "bold",
    },

    subtitle: {
        color: COLORS.text,
        marginTop: 5,
    },

    requestIcon: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: COLORS.card,
        justifyContent: "center",
        alignItems: "center",
    },

    card: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 15,
        marginBottom: 12,
    },

    userSection: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#334155",
        justifyContent: "center",
        alignItems: "center",
    },

    userInfo: {
        flex: 1,
        marginLeft: 12,
    },

    name: {
        color: COLORS.white,
        fontSize: 17,
        fontWeight: "bold",
    },

    role: {
        color: COLORS.primary,
        fontSize: 13,
        marginTop: 3,
        textTransform: "capitalize",
    },

    details: {
        color: COLORS.text,
        fontSize: 12,
        marginTop: 3,
    },

    messageButton: {
        marginTop: 12,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
    },

    messageText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 13,
    },

    empty: {
        color: COLORS.text,
        textAlign: "center",
        marginTop: 40,
    },

});