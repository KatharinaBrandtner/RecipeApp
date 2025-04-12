import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      {/* Dies stellt sicher, dass der Tabs-Navigator als Teil der App erscheint */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
