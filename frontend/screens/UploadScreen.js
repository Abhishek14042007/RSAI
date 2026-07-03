import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";
import COLORS from "../constants/colors";
import { uploadResource } from "../services/uploadService";

export default function UploadScreen() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [subject, setSubject] = useState("");
    const [semester, setSemester] = useState("");
    const [department, setDepartment] = useState("");

    const [pdf, setPdf] = useState(null);

    const pickPDF = async () => {

        const result = await DocumentPicker.getDocumentAsync({
            type: "application/pdf",
            copyToCacheDirectory: true,
        });

        if (!result.canceled) {
            setPdf(result.assets[0]);
            console.log(result.assets[0]);
        }
    };
    const handleUpload = async () => {
        if (!pdf) {
            alert("Please choose a PDF.");
            return;
        }

        try {

            const formData = new FormData();

            formData.append("title", title);
            formData.append("description", description);
            formData.append("subject", subject);
            formData.append("semester", semester);
            formData.append("department", department);
            formData.append("tags", "");

            formData.append("pdf", {
                uri: pdf.uri,
                name: pdf.name,
                type: "application/pdf",
            });

            const response = await uploadResource(formData);

            alert(response.message);

        } catch (error) {

            console.log(error.response?.data);

            alert(
                error.response?.data?.message ||
                "Upload failed."
            );

        }

    };

    return (
        <ScrollView style={styles.container}>

            <Text style={styles.heading}>
                Upload Resource
            </Text>

            <TextInput
                placeholder="Title"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                placeholder="Description"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                value={description}
                onChangeText={setDescription}
            />

            <TextInput
                placeholder="Subject"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
            />

            <TextInput
                placeholder="Semester"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                value={semester}
                onChangeText={setSemester}
            />

            <TextInput
                placeholder="Department"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                value={department}
                onChangeText={setDepartment}
            />

            <TouchableOpacity
                style={styles.pickButton}
                onPress={pickPDF}
            >
                <Text style={styles.pickText}>
                    {pdf ? pdf.name : "Choose PDF"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUpload}
            >
                <Text style={styles.uploadText}>
                    Upload
                </Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20
    },

    heading: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: "bold",
        marginVertical: 20
    },

    input: {
        backgroundColor: COLORS.card,
        color: COLORS.white,
        padding: 15,
        borderRadius: 12,
        marginBottom: 15
    },

    pickButton: {
        backgroundColor: "#334155",
        padding: 16,
        borderRadius: 12,
        marginBottom: 20
    },

    pickText: {
        color: "white",
        textAlign: "center"
    },

    uploadButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12
    },

    uploadText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16
    }

});