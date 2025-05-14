import { SavedImagesProvider } from '@/context/SavedImagesContext';
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <SavedImagesProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Нэвтрэх" }} />
      </Stack>
    </SavedImagesProvider>
  );
}
