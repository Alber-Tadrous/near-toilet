import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'small' | 'medium' | 'large';
}

export function Badge({ text, variant = 'neutral', size = 'medium' }: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: '#059669', color: '#FFFFFF' };
      case 'warning':
        return { backgroundColor: '#F59E0B', color: '#FFFFFF' };
      case 'error':
        return { backgroundColor: '#EF4444', color: '#FFFFFF' };
      case 'info':
        return { backgroundColor: '#2563EB', color: '#FFFFFF' };
      default:
        return { backgroundColor: '#6B7280', color: '#FFFFFF' };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 6, paddingVertical: 2, fontSize: 10 };
      case 'large':
        return { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14 };
      default:
        return { paddingHorizontal: 8, paddingVertical: 4, fontSize: 12 };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View style={[styles.badge, { backgroundColor: variantStyles.backgroundColor }, sizeStyles]}>
      <Text style={[styles.text, { color: variantStyles.color, fontSize: sizeStyles.fontSize }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});