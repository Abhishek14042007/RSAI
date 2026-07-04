import { Ionicons } from "@expo/vector-icons";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import COLORS from "../constants/colors";

export default function ResourceDetails({ navigation, route }) {

    const { resource } = route.params;

    const openPDF = async () => {
        try {

            const supported = await Linking.canOpenURL(resource.pdf_url);

            if (supported) {
                await Linking.openURL(resource.pdf_url);
            } else {
                alert("Unable to open PDF.");
            }

        } catch (error) {

            console.log(error);

        }
    };

    const tags =
        resource.tags && resource.tags.length > 0
            ? resource.tags.split(",")
            : [];

    return (

        <View style={styles.screen}>

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >

                {/* Header */}

                <View style={styles.header}>

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={28}
                            color={COLORS.white}
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Resource Details
                    </Text>

                    <Ionicons
                        name="ellipsis-vertical"
                        size={24}
                        color={COLORS.white}
                    />

                </View>

                {/* Banner */}

                <View style={styles.banner}>

                    <Ionicons
                        name="document-text"
                        size={70}
                        color={COLORS.primary}
                    />

                    <Text style={styles.bannerText}>
                        PDF Document
                    </Text>

                </View>

                {/* Title */}

                <Text style={styles.title}>
                    {resource.title}
                </Text>

                {/* Uploader */}

                <View style={styles.profileCard}>

                    <View style={styles.avatar}>

                        <Ionicons
                            name="person"
                            size={34}
                            color="white"
                        />

                    </View>

                    <View>

                        <Text style={styles.uploadedBy}>
                            Uploaded By
                        </Text>

                        <Text style={styles.userName}>
                            User {resource.uploaded_by}
                        </Text>

                    </View>

                </View>

                {/* Stats */}

                <View style={styles.statsRow}>

                    <View style={styles.statCard}>

                        <Ionicons
                            name="heart"
                            size={28}
                            color="#EF4444"
                        />

                        <Text style={styles.statNumber}>
                            {resource.likes}
                        </Text>

                        <Text style={styles.statLabel}>
                            Likes
                        </Text>

                    </View>

                    <View style={styles.statCard}>

                        <Ionicons
                            name="download"
                            size={28}
                            color="#38BDF8"
                        />

                        <Text style={styles.statNumber}>
                            {resource.downloads}
                        </Text>

                        <Text style={styles.statLabel}>
                            Downloads
                        </Text>

                    </View>

                </View>

                {/* Description */}

                <Text style={styles.sectionTitle}>
                    Description
                </Text>

                <View style={styles.card}>

                    <Text style={styles.description}>

                        {resource.description ||
                            "No description available."}

                    </Text>

                </View>

                {/* Information */}

                <Text style={styles.sectionTitle}>
                    Resource Information
                </Text>

                <View style={styles.card}>

                    <View style={styles.infoRow}>

                        <Ionicons
                            name="book"
                            size={20}
                            color={COLORS.primary}
                        />

                        <Text style={styles.infoText}>
                            Subject : {resource.subject}
                        </Text>

                    </View>

                    <View style={styles.infoRow}>

                        <Ionicons
                            name="school"
                            size={20}
                            color={COLORS.primary}
                        />

                        <Text style={styles.infoText}>
                            Semester : {resource.semester}
                        </Text>

                    </View>

                    <View style={styles.infoRow}>

                        <Ionicons
                            name="business"
                            size={20}
                            color={COLORS.primary}
                        />

                        <Text style={styles.infoText}>
                            Department : {resource.department}
                        </Text>

                    </View>

                </View>

                {/* Tags */}

                <Text style={styles.sectionTitle}>
                    Tags
                </Text>

                <View style={styles.tagsContainer}>

                    {tags.length === 0 ? (

                        <Text style={styles.noTags}>
                            No Tags
                        </Text>

                    ) : (

                        tags.map((tag, index) => (

                            <View
                                key={index}
                                style={styles.tag}
                            >

                                <Text style={styles.tagText}>
                                    {tag.trim()}
                                </Text>

                            </View>

                        ))

                    )}

                </View>

                {/* Comments */}

                <Text style={styles.sectionTitle}>
                    Comments
                </Text>

                <View style={styles.card}>

                    <View style={styles.commentRow}>

                        <Ionicons
                            name="chatbubble-ellipses"
                            size={24}
                            color={COLORS.primary}
                        />

                        <Text style={styles.commentText}>
                            No comments yet.
                        </Text>

                    </View>

                    <Text style={styles.commentSub}>
                        Comments feature coming soon...
                    </Text>

                </View>

                <View style={{ height: 120 }} />

            </ScrollView>

            <TouchableOpacity
                style={styles.openButton}
                onPress={openPDF}
            >

                <Ionicons
                    name="document-text"
                    size={22}
                    color="white"
                />

                <Text style={styles.openText}>
                    Open PDF
                </Text>

            </TouchableOpacity>

        </View>

    );

}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    container: {
        flex: 1,
        padding: 20,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 25,
    },

    headerTitle: {
        color: COLORS.white,
        fontSize: 22,
        fontWeight: "bold",
    },

    banner: {
        height: 180,
        backgroundColor: COLORS.card,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 25,
    },

    bannerText: {
        color: COLORS.text,
        marginTop: 10,
        fontSize: 18,
    },

    title: {
        color: COLORS.white,
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 25,
    },

    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        borderRadius: 18,
        padding: 18,
        marginBottom: 25,
    },

    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },

    uploadedBy: {
        color: COLORS.text,
        fontSize: 14,
    },

    userName: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 4,
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25,
    },

    statCard: {
        width: "48%",
        backgroundColor: COLORS.card,
        borderRadius: 18,
        paddingVertical: 25,
        alignItems: "center",
    },

    statNumber: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 10,
    },

    statLabel: {
        color: COLORS.text,
        marginTop: 6,
        fontSize: 15,
    },

    sectionTitle: {
        color: COLORS.primary,
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
    },

    card: {
        backgroundColor: COLORS.card,
        borderRadius: 18,
        padding: 18,
        marginBottom: 25,
    },

    description: {
        color: COLORS.white,
        fontSize: 16,
        lineHeight: 25,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    infoText: {
        color: COLORS.white,
        marginLeft: 12,
        fontSize: 16,
    },

    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 25,
    },

    tag: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },

    tagText: {
        color: COLORS.white,
        fontWeight: "bold",
    },

    noTags: {
        color: COLORS.text,
        marginBottom: 25,
    },

    commentRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    commentText: {
        color: COLORS.white,
        marginLeft: 12,
        fontSize: 17,
        fontWeight: "600",
    },

    commentSub: {
        color: COLORS.text,
        marginTop: 12,
        marginLeft: 36,
        fontSize: 15,
    },

    openButton: {
        position: "absolute",
        left: 20,
        right: 20,
        bottom: 20,
        backgroundColor: COLORS.primary,
        borderRadius: 18,
        padding: 18,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
    },

    openText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },

});