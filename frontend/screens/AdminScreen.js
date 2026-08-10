import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

import { useFocusEffect } from "@react-navigation/native";

import COLORS from "../constants/colors";
import api from "../services/api";


export default function AdminScreen({ navigation }) {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);


    const fetchUsers = async () => {

        try {

            const response = await api.get(
                "/admin/users"
            );

            console.log(
                "ADMIN USERS:",
                response.data
            );

            setUsers(
                response.data.data || []
            );

        } catch (error) {

            console.log(
                "ADMIN USERS ERROR:",
                error.response?.data ||
                error.message
            );

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                "Unable to load users."
            );

        } finally {

            setLoading(false);

        }

    };


    const deleteUser = (user) => {

        Alert.alert(
            "Delete User",
            `Delete ${user.full_name}? This will also delete their resources, chat messages, chat requests and private chat rooms.`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",

                    onPress: async () => {

                        try {

                            const response = await api.delete(
                                `/admin/users/${user.id}`
                            );

                            console.log(
                                "DELETE RESPONSE STATUS:",
                                response.status
                            );

                            console.log(
                                "DELETE RESPONSE DATA:",
                                response.data
                            );

                            // Remove deleted user immediately from the screen
                            setUsers((currentUsers) =>
                                currentUsers.filter(
                                    (item) => item.id !== user.id
                                )
                            );

                            Alert.alert(
                                "Deleted",
                                "User and associated data deleted successfully."
                            );

                        } catch (error) {

                            console.log(
                                "DELETE USER ERROR STATUS:",
                                error.response?.status
                            );

                            console.log(
                                "DELETE USER ERROR DATA:",
                                error.response?.data
                            );

                            console.log(
                                "DELETE USER ERROR MESSAGE:",
                                error.message
                            );

                            // Backend may have deleted the user even if
                            // React Native reports a network error.
                            if (error.message === "Network Error") {

                                await fetchUsers();

                                Alert.alert(
                                    "Deleted",
                                    "User was deleted successfully."
                                );

                                return;
                            }

                            Alert.alert(
                                "Error",
                                error.response?.data?.message ||
                                "Unable to delete user."
                            );

                        }

                    },
                },
            ]
        );

    };


    const onRefresh = async () => {

        setRefreshing(true);

        await fetchUsers();

        setRefreshing(false);

    };


    useFocusEffect(
        useCallback(() => {

            fetchUsers();

        }, [])
    );


    const renderUser = ({ item }) => {

        const isAdmin =
            item.role === "admin";

        return (

            <View style={styles.userCard}>

                <View style={styles.avatar}>

                    <Ionicons
                        name="person"
                        size={24}
                        color={COLORS.white}
                    />

                </View>


                <View style={styles.userInfo}>

                    <Text style={styles.userName}>
                        {item.full_name}
                    </Text>

                    <Text style={styles.email}>
                        {item.email}
                    </Text>

                    <Text style={styles.role}>
                        {item.role}
                    </Text>

                </View>


                {!isAdmin && (

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() =>
                            deleteUser(item)
                        }
                    >

                        <Ionicons
                            name="trash-outline"
                            size={20}
                            color="white"
                        />

                    </TouchableOpacity>

                )}

            </View>

        );

    };
    const handleLogout = async () => {
        try {
            await AsyncStorage.multiRemove([
                "token",
                "user",
            ]);

            navigation.replace("Login");

        } catch (error) {

            console.log(
                "LOGOUT ERROR:",
                error.message
            );

            Alert.alert(
                "Error",
                "Unable to logout."
            );
        }
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

                <View>

                    <Text style={styles.title}>
                        Admin Panel
                    </Text>

                    <Text style={styles.subtitle}>
                        Manage RSAI users
                    </Text>

                </View>

                <TouchableOpacity
                    onPress={handleLogout}
                    style={styles.logoutButton}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={22}
                        color={COLORS.white}
                    />

                    <Text style={styles.logoutText}>
                        Logout
                    </Text>
                </TouchableOpacity>

            </View>


            <Text style={styles.count}>
                {users.length} Users
            </Text>


            <FlatList
                data={users}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                renderItem={renderUser}
                showsVerticalScrollIndicator={false}

                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }

                ListEmptyComponent={

                    <Text style={styles.empty}>
                        No users found.
                    </Text>

                }
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

    title: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: "bold",
    },

    subtitle: {
        color: COLORS.text,
        marginTop: 5,
    },

    count: {
        color: COLORS.primary,
        fontSize: 17,
        fontWeight: "bold",
        marginBottom: 15,
    },

    userCard: {
        backgroundColor: COLORS.card,
        borderRadius: 15,
        padding: 15,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    userInfo: {
        flex: 1,
    },

    userName: {
        color: COLORS.white,
        fontSize: 17,
        fontWeight: "bold",
    },

    email: {
        color: COLORS.text,
        fontSize: 13,
        marginTop: 4,
    },

    role: {
        color: COLORS.primary,
        fontSize: 12,
        marginTop: 5,
        textTransform: "capitalize",
    },

    deleteButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#DC2626",
        justifyContent: "center",
        alignItems: "center",
    },

    empty: {
        color: COLORS.text,
        textAlign: "center",
        marginTop: 40,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#DC2626",
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 10,
    },

    logoutText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 5,
    },

});