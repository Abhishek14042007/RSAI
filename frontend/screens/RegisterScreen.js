import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import COLORS from "../constants/colors";
import { registerUser } from "../services/authService";

export default function RegisterScreen({ navigation }) {

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [role, setRole] = useState("student");

    const [department, setDepartment] = useState("");

    const [semester, setSemester] = useState("");

    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {

        if (
            !fullName ||
            !email ||
            !password ||
            !confirmPassword ||
            !department
        ) {
            Alert.alert(
                "Error",
                "Please fill all required fields."
            );
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert(
                "Error",
                "Passwords do not match."
            );
            return;
        }

        try {

            setLoading(true);

            const response = await registerUser(
                fullName,
                email,
                password,
                role,
                department,
                semester
            );

            if (response.success) {

                await AsyncStorage.setItem(
                    "token",
                    response.data.token
                );

                Alert.alert(
                    "Success",
                    response.message
                );

                navigation.replace("Home");

            } else {

                Alert.alert(
                    "Registration Failed",
                    response.message
                );

            }

        } catch (error) {

            Alert.alert(
                "Error",
                error.response?.data?.message ||
                "Unable to register."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <ScrollView
            style={styles.container}
            contentContainerStyle={{
                paddingBottom: 40,
            }}
        >

            <Text style={styles.logo}>
                RSAI
            </Text>

            <Text style={styles.subtitle}>
                Create your account
            </Text>

            <InputField
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
            />

            <InputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <InputField
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <InputField
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <Text style={styles.label}>
                Role
            </Text>

            <View style={styles.roleContainer}>

                <TouchableOpacity
                    style={[
                        styles.roleButton,
                        role === "student" && styles.activeRole
                    ]}
                    onPress={() => setRole("student")}
                >
                    <Text style={styles.roleText}>
                        Student
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.roleButton,
                        role === "alumni" && styles.activeRole
                    ]}
                    onPress={() => setRole("alumni")}
                >
                    <Text style={styles.roleText}>
                        Alumni
                    </Text>
                </TouchableOpacity>

            </View>

            <InputField
                placeholder="Department"
                value={department}
                onChangeText={setDepartment}
            />

            {role === "student" && (

                <InputField
                    placeholder="Semester"
                    value={semester}
                    onChangeText={setSemester}
                    keyboardType="numeric"
                />

            )}

            <CustomButton
                title="Register"
                loading={loading}
                onPress={handleRegister}
            />

            <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
            >
                <Text style={styles.login}>
                    Already have an account? Login
                </Text>
            </TouchableOpacity>

        </ScrollView>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 25,
    },

    logo: {
        color: COLORS.primary,
        fontSize: 40,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 50,
    },

    subtitle: {
        color: COLORS.text,
        textAlign: "center",
        fontSize: 18,
        marginBottom: 35,
    },

    label: {
        color: COLORS.white,
        marginBottom: 10,
        fontSize: 16,
        fontWeight: "600",
    },

    roleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    roleButton: {
        flex: 1,
        backgroundColor: COLORS.card,
        padding: 15,
        borderRadius: 12,
        marginHorizontal: 5,
        alignItems: "center",
    },

    activeRole: {
        backgroundColor: COLORS.primary,
    },

    roleText: {
        color: COLORS.white,
        fontWeight: "bold",
    },

    login: {
        color: COLORS.primary,
        textAlign: "center",
        marginTop: 20,
        fontSize: 15,
    },
});