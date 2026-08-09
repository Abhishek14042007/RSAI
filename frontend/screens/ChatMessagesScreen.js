import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import COLORS from "../constants/colors";
import api from "../services/api";
import { getProfile } from "../services/authService";

export default function ChatMessagesScreen({ route, navigation }) {

    const { roomId, userName } = route.params;

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const fetchMessages = async () => {
        try {

            const response = await api.get(
                `/chat/rooms/${roomId}/messages`
            );

            setMessages(
                response.data.data ||
                response.data.messages ||
                []
            );

        } catch (error) {

            console.log(
                "MESSAGE FETCH ERROR:",
                error.response?.data || error.message
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        const loadUser = async () => {
            try {

                const response = await getProfile();

                const id = response.data.id;


                setCurrentUserId(Number(id));

            } catch (error) {

                console.log(
                    "CURRENT USER ERROR:",
                    error.response?.data || error.message
                );

            }
        };

        loadUser();

        fetchMessages();

        const interval = setInterval(() => {
            fetchMessages();
        }, 3000);

        return () => clearInterval(interval);

    }, [roomId]);
    useEffect(() => {
        const loadUserId = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");

                if (userId) {
                    setCurrentUserId(Number(userId));
                }
            } catch (error) {
                console.log("USER ID ERROR:", error);
            }
        };

        loadUserId();
    }, []);

    const sendMessage = async () => {

        if (!message.trim()) {
            return;
        }

        try {

            setSending(true);

            await api.post(
                `/chat/rooms/${roomId}/messages`,
                {
                    content: message.trim(),
                }
            );

            setMessage("");

            await fetchMessages();

        } catch (error) {

            console.log(
                "SEND MESSAGE ERROR:",
                error.response?.data || error.message
            );

        } finally {

            setSending(false);

        }
    };

    const renderMessage = ({ item }) => {

        const isMine =
            Number(item.sender_id) === Number(currentUserId);

        console.log(
            "MESSAGE:",
            item.content,
            "SENDER:",
            item.sender_id,
            "CURRENT USER:",
            currentUserId
        );

        return (
            <View
                style={[
                    styles.messageContainer,
                    isMine
                        ? styles.myMessageContainer
                        : styles.theirMessageContainer,
                ]}
            >

                <View
                    style={[
                        styles.messageBubble,
                        isMine
                            ? styles.myMessageBubble
                            : styles.theirMessageBubble,
                    ]}
                >

                    <Text style={styles.messageText}>
                        {item.content}
                    </Text>

                    {item.created_at && (
                        <Text style={styles.time}>
                            {new Date(
                                item.created_at
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>
                    )}

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

        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
        >

            {/* HEADER */}

            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >

                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={COLORS.white}
                    />

                </TouchableOpacity>

                <View style={styles.headerInfo}>

                    <Text style={styles.userName}>
                        {userName || "Chat"}
                    </Text>

                    <Text style={styles.onlineText}>
                        One-to-one chat
                    </Text>

                </View>

            </View>


            {/* MESSAGES */}

            <FlatList
                data={messages}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                renderItem={renderMessage}
                contentContainerStyle={
                    messages.length === 0
                        ? styles.emptyList
                        : styles.messagesList
                }
                showsVerticalScrollIndicator={false}
            />

            {messages.length === 0 && (

                <View style={styles.emptyMessage}>

                    <Ionicons
                        name="chatbubble-outline"
                        size={45}
                        color={COLORS.text}
                    />

                    <Text style={styles.emptyTitle}>
                        Start the conversation
                    </Text>

                    <Text style={styles.emptyText}>
                        Send a message to {userName || "this user"}.
                    </Text>

                </View>

            )}


            {/* MESSAGE INPUT */}

            <View style={styles.inputContainer}>

                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#94A3B8"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                />

                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        sending && { opacity: 0.6 }
                    ]}
                    onPress={sendMessage}
                    disabled={sending}
                >

                    {sending ? (

                        <ActivityIndicator
                            size="small"
                            color="white"
                        />

                    ) : (

                        <Ionicons
                            name="send"
                            size={20}
                            color="white"
                        />

                    )}

                </TouchableOpacity>

            </View>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
        padding: 20,
        paddingTop: 25,
        backgroundColor: COLORS.card,
        borderBottomWidth: 1,
        borderBottomColor: "#334155",
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    headerInfo: {
        flex: 1,
    },

    userName: {
        color: COLORS.white,
        fontSize: 19,
        fontWeight: "bold",
    },

    onlineText: {
        color: COLORS.text,
        fontSize: 12,
        marginTop: 3,
    },

    messagesList: {
        padding: 15,
        paddingBottom: 20,
    },

    emptyList: {
        flexGrow: 1,
    },

    messageContainer: {
        marginBottom: 10,
        alignItems: "flex-start",
    },

    messageBubble: {
        backgroundColor: COLORS.card,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 15,
        maxWidth: "80%",
    },

    messageText: {
        color: COLORS.white,
        fontSize: 15,
        lineHeight: 21,
    },

    time: {
        color: "#94A3B8",
        fontSize: 10,
        marginTop: 4,
        alignSelf: "flex-end",
    },

    emptyMessage: {
        position: "absolute",
        top: "42%",
        left: 0,
        right: 0,
        alignItems: "center",
    },

    emptyTitle: {
        color: COLORS.white,
        fontSize: 17,
        fontWeight: "bold",
        marginTop: 12,
    },

    emptyText: {
        color: COLORS.text,
        fontSize: 13,
        marginTop: 5,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        padding: 12,
        backgroundColor: COLORS.card,
        borderTopWidth: 1,
        borderTopColor: "#334155",
    },

    input: {
        flex: 1,
        backgroundColor: COLORS.background,
        color: COLORS.white,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxHeight: 100,
        marginRight: 8,
    },

    sendButton: {
        width: 43,
        height: 43,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
    },
    messageContainer: {
        width: "100%",
        marginBottom: 10,
    },

    myMessageContainer: {
        alignItems: "flex-end",
    },

    theirMessageContainer: {
        alignItems: "flex-start",
    },

    messageBubble: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 15,
        maxWidth: "80%",
    },

    myMessageBubble: {
        backgroundColor: COLORS.primary,
    },

    theirMessageBubble: {
        backgroundColor: COLORS.card,
    },

});