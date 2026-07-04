import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../constants/colors";

export default function ResourceCard({
    title,
    uploader,
    likes,
    comments,
    onLike,
    onPress,
}) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Text style={styles.title}>{title}</Text>

            <Text style={styles.uploader}>
                Uploaded by {uploader}
            </Text>

            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.iconRow}
                    onPress={onLike}
                >
                    <Ionicons
                        name="heart"
                        size={18}
                        color="#EF4444"
                    />
                    <Text style={styles.count}>
                        {likes}
                    </Text>
                </TouchableOpacity>

                <View style={styles.iconRow}>
                    <Ionicons name="chatbubble" size={18} color="#38BDF8" />
                    <Text style={styles.count}>{comments}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        padding: 18,
        borderRadius: 15,
        marginBottom: 15,
    },

    title: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "bold",
    },

    uploader: {
        color: COLORS.text,
        marginTop: 8,
        marginBottom: 15,
    },

    row: {
        flexDirection: "row",
    },

    iconRow: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
    },

    count: {
        color: COLORS.white,
        marginLeft: 6,
    },
});