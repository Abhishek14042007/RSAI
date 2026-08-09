import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import COLORS from "../constants/colors";
import api from "../services/api";

export default function ChatRequestsScreen({ navigation }) {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [processing, setProcessing] = useState(null);

    const fetchRequests = async () => {
        try {

            const response = await api.get("/chat/requests");

            setRequests(
                response.data.data ||
                response.data.requests ||
                []
            );

        } catch (error) {

            console.log(
                "REQUEST FETCH ERROR:",
                error.response?.data || error.message
            );

            Alert.alert(
                "Error",
                "Unable to load chat requests."
            );

        } finally {

            setLoading(false);

        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRequests();
        }, [])
    );

    const respondToRequest = async (request, action) => {
        try {

            setProcessing(request.id);

            const response = await api.post(
                `/chat/respond/${request.id}`,
                {
                    action: action,
                }
            );

            if (action === "accept") {

                const roomId =
                    response.data.data?.room_id ||
                    response.data.room_id;

                setRequests((prev) =>
                    prev.filter(
                        (item) => item.id !== request.id
                    )
                );

                Alert.alert(
                    "Request Accepted",
                    "You can now start chatting."
                );

                if (roomId) {
                    navigation.navigate("ChatMessages", {
                        roomId: roomId,
                        userName: request.sender_name,
                    });
                }

            } else {

                setRequests((prev) =>
                    prev.filter(
                        (request) => request.id !== requestId
                    )
                );

                Alert.alert(
                    "Request Rejected",
                    "The chat request was rejected."
                );
            }

        } catch (error) {

            console.log(
                "REQUEST RESPONSE ERROR:",
                error.response?.data || error.message
            );

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                `Unable to ${action} request.`
            );

        } finally {

            setProcessing(null);

        }
    };

    const confirmReject = (requestId) => {

        Alert.alert(
            "Reject Request",
            "Are you sure you want to reject this request?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Reject",
                    style: "destructive",
                    onPress: () =>
                        respondToRequest(
                            requestId,
                            "reject"
                        ),
                },
            ]
        );
    };

    const onRefresh = async () => {

        setRefreshing(true);

        await fetchRequests();

        setRefreshing(false);
    };

    const renderRequest = ({ item }) => {

        const isProcessing =
            processing === item.id;

        return (
            <View style={styles.card}>

                <View style={styles.userRow}>

                    <View style={styles.avatar}>
                        <Ionicons
                            name="person"
                            size={27}
                            color={COLORS.primary}
                        />
                    </View>

                    <View style={styles.userInfo}>

                        <Text style={styles.name}>
                            {item.sender_name}
                        </Text>

                        <Text style={styles.role}>
                            {item.sender_role}
                        </Text>

                        {item.created_at && (
                            <Text style={styles.date}>
                                {new Date(
                                    item.created_at
                                ).toLocaleDateString()}
                            </Text>
                        )}

                    </View>

                </View>

                <Text style={styles.message}>
                    wants to connect with you.
                </Text>

                <View style={styles.buttons}>

                    <TouchableOpacity
                        style={[
                            styles.acceptButton,
                            isProcessing && {
                                opacity: 0.6,
                            },
                        ]}
                        disabled={isProcessing}
                        onPress={() =>
                            respondToRequest(
                                item,
                                "accept"
                            )
                        }
                    >

                        {isProcessing ? (

                            <ActivityIndicator
                                size="small"
                                color="white"
                            />

                        ) : (

                            <>
                                <Ionicons
                                    name="checkmark"
                                    size={18}
                                    color="white"
                                />

                                <Text
                                    style={
                                        styles.buttonText
                                    }
                                >
                                    Accept
                                </Text>
                            </>
                        )}

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.rejectButton,
                            isProcessing && {
                                opacity: 0.6,
                            },
                        ]}
                        disabled={isProcessing}
                        onPress={() =>
                            confirmReject(item.id)
                        }
                    >

                        <Ionicons
                            name="close"
                            size={18}
                            color="white"
                        />

                        <Text style={styles.buttonText}>
                            Reject
                        </Text>

                    </TouchableOpacity>

                </View>

            </View>
        );
    };

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

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons
                        name="arrow-back"
                        size={25}
                        color={COLORS.white}
                    />
                </TouchableOpacity>

                <View style={styles.headerText}>

                    <Text style={styles.heading}>
                        Chat Requests
                    </Text>

                    <Text style={styles.subtitle}>
                        Manage your connection requests.
                    </Text>

                </View>

            </View>

            {requests.length === 0 ? (

                <View style={styles.emptyContainer}>

                    <Ionicons
                        name="chatbubbles-outline"
                        size={55}
                        color={COLORS.text}
                    />

                    <Text style={styles.emptyTitle}>
                        No Pending Requests
                    </Text>

                    <Text style={styles.emptyText}>
                        You don't have any new chat requests.
                    </Text>

                </View>

            ) : (

                <FlatList
                    data={requests}
                    keyExtractor={(item) =>
                        item.id.toString()
                    }
                    renderItem={renderRequest}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={COLORS.primary}
                        />
                    }
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
        alignItems: "center",
        marginTop: 20,
        marginBottom: 25,
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: COLORS.card,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    headerText: {
        flex: 1,
    },

    heading: {
        color: COLORS.white,
        fontSize: 25,
        fontWeight: "bold",
    },

    subtitle: {
        color: COLORS.text,
        marginTop: 4,
        fontSize: 13,
    },

    card: {
        backgroundColor: COLORS.card,
        borderRadius: 15,
        padding: 16,
        marginBottom: 14,
    },

    userRow: {
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

    date: {
        color: COLORS.text,
        fontSize: 11,
        marginTop: 3,
    },

    message: {
        color: COLORS.text,
        fontSize: 14,
        marginTop: 14,
        marginBottom: 14,
    },

    buttons: {
        flexDirection: "row",
        gap: 10,
    },

    acceptButton: {
        flex: 1,
        backgroundColor: "#16A34A",
        borderRadius: 10,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 5,
    },

    rejectButton: {
        flex: 1,
        backgroundColor: "#DC2626",
        borderRadius: 10,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 5,
    },

    buttonText: {
        color: COLORS.white,
        fontWeight: "bold",
        fontSize: 13,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 100,
    },

    emptyTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 15,
    },

    emptyText: {
        color: COLORS.text,
        fontSize: 14,
        marginTop: 6,
        textAlign: "center",
    },

});