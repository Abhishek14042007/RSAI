import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    addComment,
    createPost,
    deletePost,
    getComments,
    getPosts,
    likePost
} from "../services/communityService";

import COLORS from "../constants/colors";


export default function CommunityScreen() {

    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState(null);

    const [content, setContent] = useState("");
    const [comments, setComments] = useState({});

    const [commentText, setCommentText] = useState("");

    const [expandedPost, setExpandedPost] = useState(null);
    const loadUser = async () => {

        const user = await AsyncStorage.getItem("user");

        if (user) {

            setUserId(
                JSON.parse(user).id
            );

        }

    };

    const loadPosts = async () => {

        try {

            const response = await getPosts();

            setPosts(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadUser();

        loadPosts();

    }, []);

    const handleCreate = async () => {

        if (!content.trim()) {

            Alert.alert(
                "Enter something first."
            );

            return;

        }

        try {

            await createPost(content);

            setContent("");

            loadPosts();

        } catch (error) {

            console.log(error);

        }

    };

    const handleLike = async (id) => {

        await likePost(id);

        loadPosts();

    };

    const handleDelete = async (id) => {

        await deletePost(id);

        loadPosts();

    };
    const loadComments = async (postId) => {

        try {

            const response = await getComments(postId);

            setComments(prev => ({
                ...prev,
                [postId]: response.data,
            }));

        } catch (error) {

            console.log(error);

        }

    };

    const toggleComments = (postId) => {

        if (expandedPost === postId) {

            setExpandedPost(null);

            return;

        }

        setExpandedPost(postId);

        loadComments(postId);

    };

    const handleComment = async (postId) => {

        if (!commentText.trim())
            return;

        await addComment(
            postId,
            commentText
        );

        setCommentText("");

        loadComments(postId);

        loadPosts();

    };

    return (

        <View style={styles.container}>

            <Text style={styles.heading}>
                🎓 Alumni Community
            </Text>

            <Text style={styles.subtitle}>
                Ask questions, share experiences and connect with alumni.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Share something..."
                placeholderTextColor="#94A3B8"
                value={content}
                onChangeText={setContent}
                multiline
            />

            <TouchableOpacity
                style={styles.postButton}
                onPress={handleCreate}
            >
                <Text style={styles.postText}>
                    Post
                </Text>
            </TouchableOpacity>

            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (

                    <View style={styles.card}>

                        <View style={styles.header}>

                            <Image
                                source={{
                                    uri:
                                        item.user.avatar ||
                                        "https://ui-avatars.com/api/?name=User"
                                }}
                                style={styles.avatar}
                            />

                            <View style={styles.userInfo}>

                                <View style={styles.nameRow}>

                                    <Text style={styles.name}>
                                        {item.user.name}
                                    </Text>

                                    {item.user.role === "alumni" && (

                                        <View style={styles.badge}>

                                            <Text style={styles.badgeText}>
                                                🎓 Alumni
                                            </Text>

                                        </View>

                                    )}

                                </View>

                                <Text style={styles.role}>
                                    {item.user.role}
                                </Text>

                            </View>

                        </View>

                        <Text style={styles.message}>
                            {item.content}
                        </Text>

                        <View style={styles.actions}>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleLike(item.id)}
                            >
                                <Text style={styles.actionText}>
                                    ❤️ Like ({item.likes})
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => toggleComments(item.id)}
                            >
                                <Text style={styles.actionText}>
                                    💬 Comments ({item.comment_count})
                                </Text>
                            </TouchableOpacity>

                            {item.user.id === userId && (

                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDelete(item.id)}
                                >
                                    <Text style={styles.deleteText}>
                                        🗑 Delete
                                    </Text>
                                </TouchableOpacity>

                            )}

                        </View>

                        {expandedPost === item.id && (

                            <View style={styles.commentSection}>

                                {(comments[item.id] || []).map((comment) => (

                                    <View
                                        key={comment.id}
                                        style={styles.commentCard}
                                    >

                                        <Text style={styles.commentName}>
                                            {comment.user.name}
                                        </Text>

                                        <Text style={styles.commentContent}>
                                            {comment.content}
                                        </Text>

                                    </View>

                                ))}

                                <TextInput
                                    placeholder="Write a comment..."
                                    placeholderTextColor="#94A3B8"
                                    value={commentText}
                                    onChangeText={setCommentText}
                                    style={styles.commentInput}
                                />

                                <TouchableOpacity
                                    style={styles.sendButton}
                                    onPress={() =>
                                        handleComment(item.id)
                                    }
                                >

                                    <Text style={styles.sendText}>
                                        Send
                                    </Text>

                                </TouchableOpacity>

                            </View>

                        )}

                    </View>

                )}
            />

        </View>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
    },

    heading: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 20,
    },

    subtitle: {
        color: COLORS.text,
        marginTop: 5,
        marginBottom: 20,
    },

    input: {
        backgroundColor: COLORS.card,
        color: COLORS.white,
        borderRadius: 12,
        padding: 15,
        minHeight: 90,
        textAlignVertical: "top",
    },

    postButton: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 12,
        marginTop: 15,
        marginBottom: 20,
        alignItems: "center",
    },

    postText: {
        color: COLORS.white,
        fontWeight: "bold",
        fontSize: 16,
    },

    card: {
        backgroundColor: COLORS.card,
        borderRadius: 15,
        padding: 18,
        marginBottom: 15,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    userInfo: {
        flex: 1,
        marginLeft: 12,
    },

    nameRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    badge: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        marginLeft: 8,
    },

    badgeText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "bold",
    },

    name: {
        color: COLORS.primary,
        fontWeight: "bold",
        fontSize: 17,
    },

    role: {
        color: COLORS.text,
        fontSize: 13,
        marginTop: 2,
    },

    message: {
        color: COLORS.white,
        fontSize: 15,
        marginTop: 12,
        lineHeight: 22,
    },

    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 18,
    },

    action: {
        color: COLORS.white,
        fontWeight: "600",
    },

    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },

    actionText: {
        color: COLORS.white,
        fontWeight: "bold",
        fontSize: 14,
    },

    delete: {
        color: "#EF4444",
        fontWeight: "bold",
    },
    deleteButton: {
        backgroundColor: "#DC2626",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },

    deleteText: {
        color: COLORS.white,
        fontWeight: "bold",
    },
    commentSection: {
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: "#333",
        paddingTop: 15,
    },

    commentCard: {
        backgroundColor: "#39475e",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },

    commentName: {
        color: COLORS.primary,
        fontWeight: "bold",
        marginBottom: 4,
    },

    commentContent: {
        color: COLORS.white,
    },

    commentInput: {
        backgroundColor: COLORS.card,
        color: COLORS.white,
        borderRadius: 10,
        padding: 12,
        marginTop: 10,
    },

    sendButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        padding: 12,
        alignItems: "center",
        marginTop: 10,
    },

    sendText: {
        color: COLORS.white,
        fontWeight: "bold",
    },
});