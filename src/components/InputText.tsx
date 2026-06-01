import { Text, TextInput, View } from "react-native";

interface InputTextProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    errors: Record<string, string>;
    setErrors: (errors: Record<string, string>) => void;
    errorKey: string;
    multiline?: boolean;
    numberOfLines?: number;
}


export const InputText = ({
    label,
    placeholder,
    value,
    onChangeText,
    errors,
    setErrors,
    errorKey,
    multiline = false,
    numberOfLines = 1
}: InputTextProps) => {
    return (
        <View style={{ marginBottom: 20 }}>
            <Text
                style={{
                    color: "#334155",
                    fontSize: 17,
                    fontWeight: "500",
                    marginBottom: 8,
                }}
            >
                {label}
            </Text>
            <TextInput
                style={{
                    height: multiline ? (numberOfLines * 25 + 20) : 52,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: errors[errorKey] ? "#FDA4AF" : "#E2E8F0",
                    paddingHorizontal: 16,
                    // paddingTop: multiline ? 12 : 0,
                    fontSize: 15,
                    color: "#1E293B",
                    textAlignVertical: multiline ? "top" : "center",
                }}
                placeholder={placeholder}
                placeholderTextColor="#94A3B8"
                value={value}
                onChangeText={(text) => {
                    onChangeText(text);
                    if (errors[errorKey]) {
                        const newErrors = { ...errors };
                        delete newErrors[errorKey];
                        setErrors(newErrors);
                    }
                }}
                multiline={multiline}
                numberOfLines={numberOfLines}
            />
            {errors[errorKey] && (
                <Text
                    style={{
                        color: "#EF4444",
                        fontSize: 12,
                        marginTop: 4,
                        marginLeft: 2,
                    }}
                >
                    {errors[errorKey]}
                </Text>
            )}
        </View>
    );
};