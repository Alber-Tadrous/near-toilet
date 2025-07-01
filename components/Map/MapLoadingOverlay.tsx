import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';

interface MapLoadingOverlayProps {
  message?: string;
}

export function MapLoadingOverlay({ message = 'Loading map...' }: MapLoadingOverlayProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <MapPin size={32} color="#2563EB" />
        <ActivityIndicator size="large" color="#2563EB" style={styles.spinner} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  spinner: {
    marginVertical: 16,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});