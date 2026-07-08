import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import ResourceCard from "../components/ResourceCard";
import COLORS from "../constants/colors";
import { likeResource, searchResources } from "../services/resourceService";

export default function HomeScreen({ navigation }) {

    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchResources = async () => {
        try {

            const response = await searchResources(search);

            setResources(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

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

    useFocusEffect(
        useCallback(() => {

            fetchResources();

        }, [])
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchResources();
        }, 400);

        return () => clearTimeout(timer);

    }, [search]);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>

                <View style={styles.header}>

                    <View>
                        <Text style={styles.heading}>
                            Welcome 👋
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

                <TextInput
                    placeholder="Search resources..."
                    placeholderTextColor="#94A3B8"
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={fetchResources}
                    style={styles.search}
                />

                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => navigation.navigate("Upload")}
                >
                    <Text style={styles.uploadButtonText}>
                        Upload Resource
                    </Text>
                </TouchableOpacity>

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
                            uploader={`User ${resource.uploaded_by}`}
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

});