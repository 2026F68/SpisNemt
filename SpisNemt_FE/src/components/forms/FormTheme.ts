import { globalColors } from "@/src/theme";
import { StyleSheet } from "react-native";

export const formTheme = StyleSheet.create({
    formContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    formSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
    },
    formError: {
        color: globalColors.dangerColor,
        marginBottom: 10,
    },
    formInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
    },
    formButton: {
        backgroundColor: globalColors.primaryColor,
        padding: 15,
        borderRadius: 15,
        height: 50,
        paddingHorizontal: 15,
        justifyContent: "center",
        alignItems: "center",
    }
});