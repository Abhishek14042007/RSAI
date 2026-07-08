import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import { loginUser } from "../services/authService";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill all fields.");
            return;
        }

        try {
            setLoading(true);

            const response = await loginUser(email, password);

            if (response.success) {
                await AsyncStorage.setItem("token", response.data.token);
                await AsyncStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );

                //Alert.alert("Success", response.message);

                navigation.replace("Home");
            } else {
                Alert.alert("Login Failed", response.message);
            }
        } catch (error) {
            Alert.alert(
                "Error",
                error.response?.data?.message || "Unable to connect to server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>RSAI</Text>

            <Text style={styles.subtitle}>
                Welcome Back 👋
            </Text>

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

            <CustomButton
                title="Login"
                loading={loading}
                onPress={handleLogin}
            />

            <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
            >
                <Text style={styles.register}>
                    Don't have an account? Register
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F172A",
        justifyContent: "center",
        padding: 25,
    },

    logo: {
        color: "#38BDF8",
        fontSize: 42,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },

    subtitle: {
        color: "#CBD5E1",
        textAlign: "center",
        fontSize: 18,
        marginBottom: 40,
    },

    register: {
        color: "#38BDF8",
        textAlign: "center",
        marginTop: 25,
        fontSize: 15,
    },
});