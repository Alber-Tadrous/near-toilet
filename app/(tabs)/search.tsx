import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { restroomService } from '@/lib/restrooms';
import { Database } from '@/types/database';
import { Search, MapPin, Star, Clock, Accessibility } from 'lucide-react-native';

type Restroom = Database['public']['Tables']['restrooms']['Row'];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Restroom[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, we'll search by filtering address/name
      // In a real app, you'd implement full-text search in the database
      const results = await restroomService.getNearbyRestrooms(37.78825, -122.4324, 50000);
      const filtered = results?.filter(restroom => 
        restroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restroom.address.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search restrooms');
    } finally {
      setLoading(false);
    }
  };

  const RestroomCard = ({ restroom }: { restroom: Restroom }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{restroom.name}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {restroom.status === 'active' ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.cardRow}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.cardText}>{restroom.address}</Text>
        </View>
        
        {restroom.operating_hours && (
          <View style={styles.cardRow}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.cardText}>{restroom.operating_hours}</Text>
          </View>
        )}
        
        {restroom.accessibility_features.length > 0 && (
          <View style={styles.cardRow}>
            <Accessibility size={16} color="#059669" />
            <Text style={styles.cardTextGreen}>Accessible</Text>
          </View>
        )}
        
        {restroom.description && (
          <Text style={styles.cardDescription}>{restroom.description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Restrooms</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by location, name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={[styles.searchButton, loading && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.searchButtonText}>
            {loading ? 'Searching...' : 'Search'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
        {searchResults.length === 0 && searchQuery.trim() !== '' && !loading && (
          <View style={styles.emptyState}>
            <Search size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No restrooms found</Text>
            <Text style={styles.emptyStateSubtext}>Try searching with different keywords</Text>
          </View>
        )}

        {searchResults.map((restroom) => (
          <RestroomCard key={restroom.id} restroom={restroom} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  searchButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  results: {
    flex: 1,
    padding: 16,
  },
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  cardContent: {
    gap: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  cardTextGreen: {
    fontSize: 14,
    color: '#059669',
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: '#374751',
    marginTop: 4,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});