import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";

import ResourceCard from "../components/ResourceCard";
import COLORS from "../constants/colors";

export default function HomeScreen({ navigation }) {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>
                Welcome 👋
            </Text>

            <Text style={styles.subtitle}>
                Find and share study resources
            </Text>

            <TextInput
                placeholder="Search resources..."
                placeholderTextColor="#94A3B8"
                style={styles.search}
            />

            <TouchableOpacity
                style={{
                    backgroundColor: COLORS.primary,
                    padding: 14,
                    borderRadius: 10,
                    marginBottom: 20,
                }}
                onPress={() => navigation.navigate("Upload")}
            >
                <Text
                    style={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    Upload Resource
                </Text>
            </TouchableOpacity>

            <Text style={styles.section}>
                Latest Resources
            </Text>

            <ResourceCard
                title="DBMS Notes"
                uploader="Alumni"
                likes={15}
                comments={4}
            />

            <ResourceCard
                title="Operating System Lab"
                uploader="Student"
                likes={9}
                comments={2}
            />

            <ResourceCard
                title="Python Interview Questions"
                uploader="Faculty"
                likes={22}
                comments={8}
            />
        </ScrollView>
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
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 20,
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

    section: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
});
