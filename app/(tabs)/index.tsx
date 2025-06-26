import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '@/context/AuthContext';
import { restroomService } from '@/lib/restrooms';
import { Database } from '@/types/database';
import { MapPin, Navigation, RefreshCw } from 'lucide-react-native';

type Restroom = Database['public']['Tables']['restrooms']['Row'];

const { width, height } = Dimensions.get('window');

// Conditionally import react-native-maps only for non-web platforms
let MapView: any;
let Marker: any;
let PROVIDER_GOOGLE: any;

// Enhanced platform detection and module loading
if (Platform.OS !== 'web') {
  try {
    const maps = require('react-native-maps');
    MapView = maps.default || maps.MapView;
    Marker = maps.Marker;
    PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
  } catch (error) {
    console.warn('react-native-maps not available:', error);
    // Fallback to null components
    MapView = null;
    Marker = null;
    PROVIDER_GOOGLE = null;
  }
} else {
  // For web, use the stub
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
}

export default function MapScreen() {
  const { user } = useAuth();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (Platform.OS !== 'web') {
          Alert.alert('Permission denied', 'Location permission is required to show nearby restrooms');
        } else {
          console.warn('Location permission denied');
        }
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const newRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setMapRegion(newRegion);

      // Load nearby restrooms
      await loadNearbyRestrooms(currentLocation.coords.latitude, currentLocation.coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      if (Platform.OS !== 'web') {
        Alert.alert('Error', 'Failed to get your location');
      }
    }
  };

  const loadNearbyRestrooms = async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      const nearbyRestrooms = await restroomService.getNearbyRestrooms(latitude, longitude, 5000);
      setRestrooms(nearbyRestrooms || []);
    } catch (error) {
      console.error('Error loading restrooms:', error);
      if (Platform.OS !== 'web') {
        Alert.alert('Error', 'Failed to load nearby restrooms');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (location) {
      loadNearbyRestrooms(location.coords.latitude, location.coords.longitude);
    }
  };

  const handleMyLocation = () => {
    getCurrentLocation();
  };

  // Enhanced web fallback with interactive elements
  if (Platform.OS === 'web' || !MapView) {
    return (
      <View style={styles.container}>
        <View style={styles.webMapContainer}>
          <View style={styles.webMapPlaceholder}>
            <MapPin size={48} color="#2563EB" />
            <Text style={styles.webMapText}>Interactive Map</Text>
            <Text style={styles.webMapSubtext}>
              {restrooms.length} restrooms found in your area
            </Text>
            <Text style={styles.webMapNote}>
              Full map functionality available on mobile devices
            </Text>
            
            {/* Show restroom list on web */}
            <View style={styles.webRestroomList}>
              {restrooms.slice(0, 3).map((restroom) => (
                <View key={restroom.id} style={styles.webRestroomItem}>
                  <Text style={styles.webRestroomName}>{restroom.name}</Text>
                  <Text style={styles.webRestroomAddress}>{restroom.address}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.controls}>
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onRegionChangeComplete={(region) => {
          setMapRegion(region);
          loadNearbyRestrooms(region.latitude, region.longitude);
        }}
      >
        {restrooms.map((restroom) => (
          <Marker
            key={restroom.id}
            coordinate={{
              latitude: restroom.latitude,
              longitude: restroom.longitude,
            }}
            title={restroom.name}
            description={restroom.address}
          />
        ))}
      </MapView>

      <View style={styles.controls}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  webMapContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  webMapText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  webMapSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  webMapNote: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  webRestroomList: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
  },
  webRestroomItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  webRestroomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  webRestroomAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  controls: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    gap: 12,
  },
  controlButton: {
    backgroundColor: '#2563EB',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlButtonLoading: {
    backgroundColor: '#9CA3AF',
  },
});