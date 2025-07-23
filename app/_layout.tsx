import 'react-native-url-polyfill/auto';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, Alert } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';

// Global error handler for unhandled promise rejections
if (Platform.OS !== 'web') {
  const originalHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('Global error handler:', error);
    if (isFatal) {
      Alert.alert(
        'Unexpected error occurred',
        'The app will restart to recover.',
        [{ text: 'OK', onPress: () => {} }]
      );
    }
    originalHandler(error, isFatal);
  });
}

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: any) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Prevent the default behavior (which would crash the app)
      event.preventDefault();
    };

    if (Platform.OS === 'web') {
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      return () => {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}