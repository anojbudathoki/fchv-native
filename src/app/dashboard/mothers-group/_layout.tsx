import { Stack } from "expo-router";

export default function MothersGroupLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="mothers-group-meeting-form" />
        </Stack>
    );
}
