import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import ResourceCard from "../components/ResourceCard";
import COLORS from "../constants/colors";
import { getProfile } from "../services/authService";
import { getChatRooms } from "../services/chatService";
import { likeResource, searchResources } from "../services/resourceService";

export default function HomeScreen({ navigation }) {

    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState("");
    const [filterVisible, setFilterVisible] = useState(false);

    const [department, setDepartment] = useState("");
    const [semester, setSemester] = useState("");
    const [subject, setSubject] = useState("");
    const [sort, setSort] = useState("latest");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [chatRooms, setChatRooms] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    const fetchResources = async () => {
        try {

            const response = await searchResources(
                search,
                department,
                semester,
                subject,
                sort
            );

            setResources(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };
    const fetchChatRooms = async () => {
        try {
            const response = await getChatRooms();


            setChatRooms(
                response.data ||
                response ||
                []
            );

        } catch (error) {
            console.log(
                "CHAT ROOMS ERROR:",
                error.response?.data || error.message
            );
        }
    };
    const openPDF = async (url) => {
        try {
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                await Linking.openURL(url);
            } else {
                alert("Unable to open PDF.");
            }
        } catch (error) {
            console.log(error);
            alert("Unable to open PDF.");
        }
    };
    const handleLike = async (resourceId) => {

        try {

            await likeResource(resourceId);

            fetchResources();

        } catch (error) {

            console.log(error.response?.data);

        }

    };
    const onRefresh = async () => {

        setRefreshing(true);

        await fetchResources();

        setRefreshing(false);

    };

    useFocusEffect(
        useCallback(() => {

            fetchResources();
            fetchChatRooms();

        }, [])
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchResources();
        }, 400);

        return () => clearTimeout(timer);

    }, [search]);
    useEffect(() => {
        const loadUserId = async () => {
            try {
                const response = await getProfile();

                const id = response.data.id;

                console.log("========== CURRENT USER ID ==========");
                console.log(id);
                console.log("=====================================");

                setCurrentUserId(Number(id));

            } catch (error) {
                console.log(
                    "CURRENT USER ERROR:",
                    error.response?.data || error.message
                );
            }
        };

        loadUserId();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <View style={styles.header}>

                    <View>
                        <Text style={styles.heading}>
                            Welcome
                        </Text>

                        <Text style={styles.subtitle}>
                            Find and share study resources
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Profile")}
                    >
                        <Ionicons
                            name="person-circle"
                            size={42}
                            color={COLORS.primary}
                        />
                    </TouchableOpacity>

                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 20
                    }}
                >

                    <TextInput
                        placeholder="Search resources..."
                        placeholderTextColor="#94A3B8"
                        value={search}
                        onChangeText={setSearch}
                        style={[
                            styles.search,
                            {
                                flex: 1,
                                marginBottom: 0
                            }
                        ]}
                    />

                    <TouchableOpacity
                        style={{
                            marginLeft: 10
                        }}
                        onPress={() => {
                            setFilterVisible(true);
                        }}
                    >

                        <Ionicons
                            name="filter"
                            size={26}
                            color={COLORS.primary}
                        />

                    </TouchableOpacity>

                </View>

                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => navigation.navigate("Upload")}
                >
                    <Text style={styles.uploadButtonText}>
                        Upload Resource
                    </Text>
                </TouchableOpacity>

                {chatRooms.length > 0 && (

                    <View style={styles.chatSection}>

                        <Text style={styles.section}>
                            Private Chats
                        </Text>

                        {chatRooms.map((room) => (

                            <TouchableOpacity
                                key={room.id}
                                style={styles.chatCard}
                                onPress={() =>
                                    navigation.navigate("ChatMessages", {
                                        roomId: room.id,
                                        userName:
                                            Number(room.student_id) === Number(currentUserId)
                                                ? room.alumni_name
                                                : room.student_name
                                    })
                                }
                            >

                                <View style={styles.chatIcon}>

                                    <Ionicons
                                        name="chatbubble"
                                        size={22}
                                        color={COLORS.white}
                                    />

                                </View>

                                <View style={styles.chatInfo}>

                                    <Text style={styles.chatName}>
                                        {Number(room.student_id) === Number(currentUserId)
                                            ? room.alumni_name
                                            : room.student_name}
                                    </Text>

                                    <Text style={styles.chatSubtitle}>
                                        One-to-one chat
                                    </Text>

                                </View>

                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color={COLORS.text}
                                />

                            </TouchableOpacity>

                        ))}

                    </View>

                )}

                <Text style={styles.section}>
                    Latest Resources
                </Text>

                {loading ? (

                    <ActivityIndicator
                        size="large"
                        color={COLORS.primary}
                    />

                ) : resources.length === 0 ? (

                    <Text style={styles.emptyText}>
                        No resources available.
                    </Text>

                ) : (

                    resources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            title={resource.title}
                            uploader={resource.uploader_name}
                            likes={resource.likes}
                            comments={resource.comments}
                            onPress={() =>
                                navigation.navigate("ResourceDetails", {
                                    resource: resource,
                                })
                            }
                            onLike={() => handleLike(resource.id)}
                        />
                    ))

                )}

            </ScrollView>
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("Community")}
            >
                <Text style={styles.fabIcon}>
                    🎓
                </Text>
            </TouchableOpacity>
            <Modal
                visible={filterVisible}
                animationType="slide"
                transparent
            >

                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >

                    <View
                        style={{
                            backgroundColor: COLORS.card,
                            padding: 20,
                            borderTopLeftRadius: 25,
                            borderTopRightRadius: 25
                        }}
                    >

                        <Text
                            style={{
                                color: "white",
                                fontSize: 22,
                                fontWeight: "bold",
                                marginBottom: 20
                            }}
                        >
                            Filter
                        </Text>

                        <Text style={{ color: "white" }}>Department</Text>

                        <Picker
                            selectedValue={department}
                            onValueChange={setDepartment}
                        >

                            <Picker.Item label="All" value="" />
                            <Picker.Item label="CSE" value="CSE" />
                            <Picker.Item label="ECE" value="ECE" />
                            <Picker.Item label="EEE" value="EEE" />

                        </Picker>

                        <Text style={{ color: "white" }}>Semester</Text>

                        <Picker
                            selectedValue={semester}
                            onValueChange={setSemester}
                        >

                            <Picker.Item label="All" value="" />

                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i =>

                                <Picker.Item
                                    key={i}
                                    label={`${i}`}
                                    value={`${i}`}
                                />

                            )}

                        </Picker>

                        <TextInput

                            placeholder="Subject"

                            placeholderTextColor="gray"

                            value={subject}

                            onChangeText={setSubject}

                            style={styles.search}

                        />

                        <Text style={{ color: "white" }}>Sort</Text>

                        <Picker

                            selectedValue={sort}

                            onValueChange={setSort}

                        >

                            <Picker.Item label="Latest" value="latest" />

                            <Picker.Item label="Most Liked" value="likes" />

                            <Picker.Item label="Most Downloaded" value="downloads" />

                        </Picker>

                        <TouchableOpacity

                            style={styles.uploadButton}

                            onPress={() => {

                                setFilterVisible(false);

                                fetchResources();

                            }}

                        >

                            <Text style={styles.uploadButtonText}>

                                Apply Filters

                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>

            </Modal>

        </View >


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
        fontSize: 30,
        fontWeight: "bold",
    },

    subtitle: {
        color: COLORS.text,
        marginTop: 8,
        marginBottom: 25,
        fontSize: 16,
    },

    search: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 15,
        color: COLORS.white,
        marginBottom: 25,
    },

    uploadButton: {
        backgroundColor: COLORS.primary,
        padding: 14,
        borderRadius: 10,
        marginBottom: 20,
    },

    uploadButtonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
    },

    section: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },

    emptyText: {
        color: COLORS.text,
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
    },
    fab: {
        position: "absolute",
        bottom: 30,
        right: 25,
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",

        elevation: 8,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },

    fabIcon: {
        fontSize: 30,
    },
    chatSection: {
        marginBottom: 10,
    },

    chatCard: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
    },

    chatIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
    },

    chatInfo: {
        flex: 1,
        marginLeft: 12,
    },

    chatName: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "bold",
    },

    chatSubtitle: {
        color: COLORS.text,
        fontSize: 12,
        marginTop: 3,
    },

});