import { Ionicons } from "@expo/vector-icons";
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
import {
    getMessages,
    sendMessage,
} from "../services/chatService";

export default function ChatScreen({ route, navigation }) {

    const { roomId, user } = route.params;

    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const fetchMessages = async () => {

        try {

            const response = await getMessages(roomId);

            setMessages(response.data || []);

        } catch (error) {

            console.log(
                "MESSAGES ERROR:",
                error.response?.data || error.message
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        fetchMessages();

        // Refresh messages periodically
        const interval = setInterval(() => {
            fetchMessages();
        }, 3000);

        return () => clearInterval(interval);

    }, [roomId]);

    const handleSend = async () => {

        const text = content.trim();

        if (!text || sending) {
            return;
        }

        try {

            setSending(true);

            await sendMessage(roomId, text);

            setContent("");

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

        return (
            <View
                style={[
                    styles.messageWrapper,
                    item.is_mine
                        ? styles.myMessageWrapper
                        : styles.otherMessageWrapper,
                ]}
            >

                <View
                    style={[
                        styles.messageBubble,
                        item.is_mine
                            ? styles.myMessage
                            : styles.otherMessage,
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

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
            keyboardVerticalOffset={90}
        >

            {/* Header */}

            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={26}
                        color={COLORS.white}
                    />
                </TouchableOpacity>

                <View style={styles.headerInfo}>

                    <Text style={styles.userName}>
                        {user?.name || "User"}
                    </Text>

                    <Text style={styles.userRole}>
                        {user?.role || "student"}
                    </Text>

                </View>

                <View style={{ width: 26 }} />

            </View>

            {/* Messages */}

            {loading ? (

                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                    style={{ flex: 1 }}
                />

            ) : (

                <FlatList
                    data={messages}
                    keyExtractor={(item) =>
                        item.id.toString()
                    }
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messages}
                    showsVerticalScrollIndicator={false}
                    inverted={false}
                />

            )}

            {/* Input */}

            <View style={styles.inputContainer}>

                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#94A3B8"
                    value={content}
                    onChangeText={setContent}
                    multiline
                />

                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        sending && {
                            opacity: 0.6,
                        },
                    ]}
                    onPress={handleSend}
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

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: COLORS.card,
        borderBottomWidth: 1,
        borderBottomColor: "#334155",
    },

    headerInfo: {
        flex: 1,
        marginLeft: 15,
    },

    userName: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "bold",
    },

    userRole: {
        color: COLORS.text,
        fontSize: 12,
        marginTop: 3,
    },

    messages: {
        padding: 15,
        paddingBottom: 10,
    },

    messageWrapper: {
        width: "100%",
        marginBottom: 10,
    },

    myMessageWrapper: {
        alignItems: "flex-end",
    },

    otherMessageWrapper: {
        alignItems: "flex-start",
    },

    messageBubble: {
        maxWidth: "78%",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
    },

    myMessage: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4,
    },

    otherMessage: {
        backgroundColor: COLORS.card,
        borderBottomLeftRadius: 4,
    },

    messageText: {
        color: COLORS.white,
        fontSize: 15,
        lineHeight: 21,
    },

    time: {
        color: "#CBD5E1",
        fontSize: 9,
        marginTop: 4,
        textAlign: "right",
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
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
    },

});