import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Star, Clock, Accessibility, AlertTriangle, Users, Wifi } from 'lucide-react-native';
import { Database } from '@/types/database';

type Restroom = Database['public']['Tables']['restrooms']['Row'];

interface RestroomCardProps {
  restroom: Restroom;
  onPress?: () => void;
  compact?: boolean;
}

export function RestroomCard({ restroom, onPress, compact = false }: RestroomCardProps) {
  const isAccessible = restroom.accessibility_features.length > 0;
  const statusColor = restroom.status === 'active' ? '#059669' : '#EF4444';
  const rating = 4.2 + Math.random() * 0.6; // Mock rating
  const reviewCount = Math.floor(Math.random() * 50) + 10; // Mock review count
  const distance = (Math.random() * 2).toFixed(1); // Mock distance

  // Mock image based on restroom name
  const getRestroomImage = (name: string) => {
    const images = [
      'https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400',
    ];
    return images[name.length % images.length];
  };

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.compactContent}>
          <View style={styles.compactHeader}>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {restroom.name}
            </Text>
            <View style={[styles.compactStatus, { backgroundColor: statusColor }]}>
              <Text style={styles.compactStatusText}>
                {restroom.status === 'active' ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>
          <Text style={styles.compactAddress} numberOfLines={1}>
            {restroom.address}
          </Text>
          <View style={styles.compactFooter}>
            <View style={styles.compactRating}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.compactRatingText}>{rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.compactDistance}>{distance} km</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image 
        source={{ uri: getRestroomImage(restroom.name) }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {restroom.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>
                {restroom.status === 'active' ? 'Open' : 'Closed'}
              </Text>
            </View>
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

          <View style={styles.featuresRow}>
            {isAccessible && (
              <View style={styles.feature}>
                <Accessibility size={14} color="#059669" />
                <Text style={styles.featureText}>Accessible</Text>
              </View>
            )}
            
            {restroom.access_requirements && (
              <View style={styles.feature}>
                <AlertTriangle size={14} color="#F59E0B" />
                <Text style={styles.featureTextWarning}>Purchase Required</Text>
              </View>
            )}

            <View style={styles.feature}>
              <Users size={14} color="#6B7280" />
              <Text style={styles.featureText}>Public</Text>
            </View>

            <View style={styles.feature}>
              <Wifi size={14} color="#6B7280" />
              <Text style={styles.featureText}>WiFi</Text>
            </View>
          </View>

          {restroom.description && (
            <Text style={styles.description} numberOfLines={2}>
              {restroom.description}
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.rating}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({reviewCount})</Text>
          </View>
          <View style={styles.distanceContainer}>
            <Text style={styles.distance}>{distance} km away</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F3F4F6',
  },
  cardContent: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
    letterSpacing: -0.3,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    gap: 8,
    marginBottom: 16,
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
    lineHeight: 20,
  },
  text: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  featureTextWarning: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
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
    fontWeight: '600',
    color: '#1F2937',
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  // Compact styles
  compactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  compactContent: {
    gap: 6,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  compactStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  compactStatusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  compactAddress: {
    fontSize: 13,
    color: '#6B7280',
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  compactRatingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
  },
  compactDistance: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});