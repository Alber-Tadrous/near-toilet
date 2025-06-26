import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Star, Clock, Accessibility, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { Database } from '@/types/database';

type Restroom = Database['public']['Tables']['restrooms']['Row'];

interface RestroomCardProps {
  restroom: Restroom;
  onPress?: () => void;
}

export function RestroomCard({ restroom, onPress }: RestroomCardProps) {
  const isAccessible = restroom.accessibility_features.length > 0;
  const statusColor = restroom.status === 'active' ? '#059669' : '#EF4444';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {restroom.name}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>
            {restroom.status === 'active' ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.address} numberOfLines={2}>
            {restroom.address}
          </Text>
        </View>

        {restroom.operating_hours && (
          <View style={styles.row}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.text}>{restroom.operating_hours}</Text>
          </View>
        )}

        {isAccessible && (
          <View style={styles.row}>
            <Accessibility size={16} color="#059669" />
            <Text style={styles.accessibleText}>Accessible</Text>
          </View>
        )}

        {restroom.access_requirements && (
          <View style={styles.row}>
            <AlertTriangle size={16} color="#F59E0B" />
            <Text style={styles.requirementText}>{restroom.access_requirements}</Text>
          </View>
        )}

        {restroom.description && (
          <Text style={styles.description} numberOfLines={2}>
            {restroom.description}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.rating}>
          <Star size={14} color="#F59E0B" />
          <Text style={styles.ratingText}>4.2</Text>
          <Text style={styles.reviewCount}>(24)</Text>
        </View>
        <Text style={styles.distance}>0.3 km</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    gap: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  accessibleText: {
    fontSize: 14,
    color: '#059669',
    flex: 1,
  },
  requirementText: {
    fontSize: 14,
    color: '#F59E0B',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#374751',
    lineHeight: 20,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  distance: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});