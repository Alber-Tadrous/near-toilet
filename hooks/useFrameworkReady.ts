import { useEffect } from 'react';
import { Platform } from 'react-native';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    try {
      if (Platform.OS === 'web') {
        window.frameworkReady?.();
      }
    } catch (error) {
      console.error('Framework ready error:', error);
    }
  });
}
