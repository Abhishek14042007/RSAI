import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function InputField({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = "default",
}) {
    const [hidePassword, setHidePassword] = useState(secureTextEntry);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#94A3B8"
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                secureTextEntry={hidePassword}
                style={styles.input}
            />

            {secureTextEntry && (
                <TouchableOpacity
                    onPress={() => setHidePassword(!hidePassword)}
                >
                    <Ionicons
                        name={hidePassword ? "eye-off" : "eye"}
                        size={22}
                        color="#CBD5E1"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1E293B",
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        flexDirection: "row",
        alignItems: "center",
    },

    input: {
        flex: 1,
        color: "white",
        paddingVertical: 15,
        fontSize: 16,
    },
});