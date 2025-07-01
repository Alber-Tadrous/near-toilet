import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { restroomService } from '@/lib/restrooms';
import { Database } from '@/types/database';
import { Search, MapPin, ListFilter as Filter, SlidersHorizontal, X } from 'lucide-react-native';
import { RestroomCard } from '@/components/RestroomCard';

type Restroom = Database['public']['Tables']['restrooms']['Row'];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Restroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    accessibility: false,
    freeAccess: false,
    openNow: false,
    rating: 0,
  });

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

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const toggleFilter = (filterKey: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  const clearFilters = () => {
    setFilters({
      accessibility: false,
      freeAccess: false,
      openNow: false,
      rating: 0,
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value === true || value > 0).length;
  };

  const FilterChip = ({ 
    label, 
    active, 
    onPress 
  }: { 
    label: string; 
    active: boolean; 
    onPress: () => void; 
  }) => (
    <TouchableOpacity
      style={[styles.filterChip, active && styles.filterChipActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search Restrooms</Text>
        <Text style={styles.subtitle}>Find the perfect restroom for your needs</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by location, name, or landmark..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.searchActions}>
          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>
              {loading ? 'Searching...' : 'Search'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterToggle, getActiveFiltersCount() > 0 && styles.filterToggleActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={20} color={getActiveFiltersCount() > 0 ? "#FFFFFF" : "#6B7280"} />
            {getActiveFiltersCount() > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filters</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.filtersContent}>
            <FilterChip
              label="Wheelchair Accessible"
              active={filters.accessibility}
              onPress={() => toggleFilter('accessibility')}
            />
            <FilterChip
              label="Free Access"
              active={filters.freeAccess}
              onPress={() => toggleFilter('freeAccess')}
            />
            <FilterChip
              label="Open Now"
              active={filters.openNow}
              onPress={() => toggleFilter('openNow')}
            />
          </View>
        </View>
      )}

      {/* Results */}
      <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
        {searchResults.length === 0 && searchQuery.trim() !== '' && !loading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Search size={48} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyStateTitle}>No restrooms found</Text>
            <Text style={styles.emptyStateText}>
              Try searching with different keywords or adjust your filters
            </Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={clearFilters}>
              <Text style={styles.emptyStateButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        )}

        {searchQuery.trim() === '' && searchResults.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <MapPin size={48} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyStateTitle}>Start your search</Text>
            <Text style={styles.emptyStateText}>
              Enter a location, landmark, or business name to find nearby restrooms
            </Text>
          </View>
        )}

        {searchResults.map((restroom) => (
          <RestroomCard key={restroom.id} restroom={restroom} />
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 50,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  clearButton: {
    padding: 4,
  },
  searchActions: {
    flexDirection: 'row',
    gap: 12,
  },
  searchButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  filterToggle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterToggleActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  filtersContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  results: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
});