import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import COLORS from "../constants/colors";
import { getChatRooms } from "../services/chatService";

export default function ChatListScreen({ navigation }) {

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRooms = async () => {

        try {

            setLoading(true);

            const response = await getChatRooms();

            setRooms(response.data || []);

        } catch (error) {

            console.log(
                "CHAT ROOMS ERROR:",
                error.response?.data || error.message
            );

        } finally {

            setLoading(false);

        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRooms();
        }, [])
    );

    const renderRoom = ({ item }) => {

        const user = item.other_user;

        return (
            <TouchableOpacity
                style={styles.room}
                onPress={() =>
                    navigation.navigate("Chat", {
                        roomId: item.id,
                        user: user,
                    })
                }
            >

                <Image
                    source={{
                        uri:
                            user?.profile_picture ||
                            "https://ui-avatars.com/api/?name=User",
                    }}
                    style={styles.avatar}
                />

                <View style={styles.info}>

                    <Text style={styles.name}>
                        {user?.name || "Unknown User"}
                    </Text>

                    <Text style={styles.role}>
                        {user?.role || "student"}
                    </Text>

                </View>

                <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={COLORS.text}
                />

            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>

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

                <Text style={styles.heading}>
                    Messages
                </Text>

                <View style={{ width: 26 }} />

            </View>

            {loading ? (

                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                    style={{ marginTop: 40 }}
                />

            ) : rooms.length === 0 ? (

                <View style={styles.empty}>

                    <Ionicons
                        name="chatbubbles-outline"
                        size={60}
                        color={COLORS.text}
                    />

                    <Text style={styles.emptyTitle}>
                        No conversations yet
                    </Text>

                    <Text style={styles.emptyText}>
                        Accept a chat request to start a conversation.
                    </Text>

                </View>

            ) : (

                <FlatList
                    data={rooms}
                    keyExtractor={(item) =>
                        item.id.toString()
                    }
                    renderItem={renderRoom}
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

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 25,
    },

    heading: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: "bold",
    },

    room: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    info: {
        flex: 1,
        marginLeft: 12,
    },

    name: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "bold",
    },

    role: {
        color: COLORS.text,
        fontSize: 13,
        marginTop: 4,
    },

    empty: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 100,
        paddingHorizontal: 30,
    },

    emptyTitle: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 15,
    },

    emptyText: {
        color: COLORS.text,
        textAlign: "center",
        marginTop: 8,
        lineHeight: 20,
    },

});