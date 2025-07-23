import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
  TouchableOpacity,
  Text,
  Animated,
  StatusBar,
} from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '@/context/AuthContext';
import { restroomService } from '@/lib/restrooms';
import { Database } from '@/types/database';
import { MapPin, Navigation, RefreshCw, ListFilter as Filter, List } from 'lucide-react-native';
import { Map, MapRef, MapRegion, MapMarker } from '@/components/Map';
import { RestroomCard } from '@/components/RestroomCard';

type Restroom = Database['public']['Tables']['restrooms']['Row'];

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const { user } = useAuth();
  const mapRef = useRef<MapRef>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const [selectedRestroom, setSelectedRestroom] = useState<Restroom | null>(null);
  const [mapRegion, setMapRegion] = useState<MapRegion>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showList ? height * 0.4 : height,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showList]);

  const getCurrentLocation = async () => {
    try {
      setDebugInfo('Requesting location permissions...');
      console.log('Requesting location permissions...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setDebugInfo('Location permission denied');
        console.log('Location permission denied');
        if (Platform.OS !== 'web') {
          Alert.alert('Permission denied', 'Location permission is required to show nearby restrooms');
        } else {
          console.warn('Location permission denied');
        }
        // Load sample data even without location
        await loadNearbyRestrooms(37.78825, -122.4324);
        return;
      }

      setDebugInfo('Getting current position...');
      console.log('Getting current position...');
      const currentLocation = await Location.getCurrentPositionAsync({});
      console.log('Current location:', currentLocation.coords);
      setDebugInfo(`Location: ${currentLocation.coords.latitude.toFixed(4)}, ${currentLocation.coords.longitude.toFixed(4)}`);
      setLocation(currentLocation);

      const newRegion: MapRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      console.log('Setting map region:', newRegion);
      setMapRegion(newRegion);

      await loadNearbyRestrooms(currentLocation.coords.latitude, currentLocation.coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      setDebugInfo(`Location error: ${error.message || 'Unknown error'}`);
      if (Platform.OS !== 'web') {
        Alert.alert('Error', 'Failed to get your location');
      }
      // Fallback to San Francisco coordinates
      await loadNearbyRestrooms(37.78825, -122.4324);
    }
  };

  const loadNearbyRestrooms = async (latitude: number, longitude: number) => {
    console.log('Loading nearby restrooms for:', { latitude, longitude });
    setDebugInfo(`Searching for restrooms near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}...`);
    setLoading(true);
    try {
      // Increase search radius to 10km for better results
      const nearbyRestrooms = await restroomService.getNearbyRestrooms(latitude, longitude, 10000);
      console.log('Found restrooms:', nearbyRestrooms?.length || 0, nearbyRestrooms);
      setDebugInfo(`Found ${nearbyRestrooms?.length || 0} restrooms in database`);
      setRestrooms(nearbyRestrooms || []);
      
      // Additional debug info
      if (nearbyRestrooms && nearbyRestrooms.length > 0) {
        const distances = nearbyRestrooms.map(r => {
          const distance = calculateDistance(latitude, longitude, r.latitude, r.longitude);
          return `${r.name}: ${distance.toFixed(2)}km`;
        });
        console.log('Restroom distances:', distances);
      }
    } catch (error) {
      console.error('Error loading restrooms:', error);
      setDebugInfo(`Database error: ${error.message || 'Failed to load restrooms'}`);
      if (Platform.OS !== 'web') {
        Alert.alert('Error', 'Failed to load nearby restrooms');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleRefresh = () => {
    if (location) {
      loadNearbyRestrooms(location.coords.latitude, location.coords.longitude);
    }
  };

  const handleMyLocation = () => {
    getCurrentLocation();
  };

  const handleRegionChangeComplete = (region: MapRegion) => {
    setMapRegion(region);
    loadNearbyRestrooms(region.latitude, region.longitude);
  };

  const handleMarkerPress = (marker: MapMarker) => {
    const restroom = restrooms.find(r => r.id === marker.id);
    if (restroom) {
      setSelectedRestroom(restroom);
      setShowList(true);
    }
  };

  const handleRestroomCardPress = (restroom: Restroom) => {
    setSelectedRestroom(restroom);
    if (mapRef.current) {
      mapRef.current.animateToCoordinate({
        latitude: restroom.latitude,
        longitude: restroom.longitude,
      });
    }
    setShowList(false);
  };

  const toggleListView = () => {
    setShowList(!showList);
    setSelectedRestroom(null);
  };

  // Convert restrooms to map markers
  const markers: MapMarker[] = restrooms.map((restroom) => ({
    id: restroom.id,
    coordinate: {
      latitude: restroom.latitude,
      longitude: restroom.longitude,
    },
    title: restroom.name,
    description: restroom.address,
  }));
  
  // Debug log for markers conversion
  useEffect(() => {
    console.log('Converting restrooms to markers:', {
      restroomsCount: restrooms.length,
      markersCount: markers.length,
      restrooms: restrooms.map(r => ({ id: r.id, name: r.name, lat: r.latitude, lng: r.longitude })),
      markers: markers.map(m => ({ id: m.id, title: m.title, lat: m.coordinate.latitude, lng: m.coordinate.longitude }))
    });
    setDebugInfo(`Displaying ${markers.length} markers on map`);
  }, [restrooms, markers]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Find Restrooms</Text>
          <Text style={styles.headerSubtitle}>
            {restrooms.length} nearby locations
          </Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <Map
        ref={mapRef}
        style={styles.map}
        region={mapRegion}
        markers={markers}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onRegionChangeComplete={handleRegionChangeComplete}
        onMarkerPress={handleMarkerPress}
        mapType="standard"
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={true}
        pitchEnabled={true}
      />

      {/* Floating Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, styles.listButton]} 
          onPress={toggleListView}
        >
          <List size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleMyLocation}>
          <Navigation size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.controlButton, loading && styles.controlButtonLoading]} 
          onPress={handleRefresh}
          disabled={loading}
        >
          <RefreshCw size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <Animated.View style={[styles.bottomSheet, { top: slideAnim }]}>
        <View style={styles.bottomSheetHandle} />
        <View style={styles.bottomSheetContent}>
          {selectedRestroom ? (
            <View style={styles.selectedRestroomContainer}>
              <Text style={styles.bottomSheetTitle}>Restroom Details</Text>
              <RestroomCard 
                restroom={selectedRestroom} 
                onPress={() => setSelectedRestroom(null)}
              />
            </View>
          ) : (
            <View style={styles.restroomListContainer}>
              <Text style={styles.bottomSheetTitle}>
                Nearby Restrooms ({restrooms.length})
              </Text>
              <View style={styles.restroomList}>
                {restrooms.slice(0, 5).map((restroom) => (
                  <RestroomCard
                    key={restroom.id}
                    restroom={restroom}
                    onPress={() => handleRestroomCardPress(restroom)}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Status indicator for web */}
      {Platform.OS === 'web' && (
        <View style={styles.webStatus}>
          <View style={styles.webStatusContent}>
            <MapPin size={16} color="#2563EB" />
            <Text style={styles.webStatusText}>
              {debugInfo}
            </Text>
          </View>
        </View>
      )}
      
      {/* Debug panel for development */}
      {__DEV__ && (
        <View style={styles.debugPanel}>
          <Text style={styles.debugText}>Debug Info:</Text>
          <Text style={styles.debugText}>• {debugInfo}</Text>
          <Text style={styles.debugText}>• Restrooms: {restrooms.length}</Text>
          <Text style={styles.debugText}>• Markers: {markers.length}</Text>
          <Text style={styles.debugText}>• Location: {location ? 'Available' : 'Not available'}</Text>
          <Text style={styles.debugText}>• Map Region: {mapRegion.latitude.toFixed(4)}, {mapRegion.longitude.toFixed(4)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  map: {
    width: width,
    height: height,
  },
  controls: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    gap: 12,
  },
  controlButton: {
    backgroundColor: '#2563EB',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  listButton: {
    backgroundColor: '#059669',
  },
  controlButtonLoading: {
    backgroundColor: '#9CA3AF',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  selectedRestroomContainer: {
    flex: 1,
  },
  restroomListContainer: {
    flex: 1,
  },
  restroomList: {
    flex: 1,
  },
  webStatus: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  webStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  webStatusText: {
    fontSize: 14,
    color: '#374751',
    fontWeight: '500',
  },
  debugPanel: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 12,
    maxHeight: 150,
  },
  debugText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 2,
  },
});