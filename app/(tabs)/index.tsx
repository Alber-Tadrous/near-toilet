import React, { useState, useEffect, useRef } from 'react';
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
import { Map, MapRef, MapRegion, MapMarker } from '@/components/Map';

type Restroom = Database['public']['Tables']['restrooms']['Row'];

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const { user } = useAuth();
  const mapRef = useRef<MapRef>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapRegion, setMapRegion] = useState<MapRegion>({
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

      const newRegion: MapRegion = {
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

  const handleRegionChangeComplete = (region: MapRegion) => {
    setMapRegion(region);
    loadNearbyRestrooms(region.latitude, region.longitude);
  };

  const handleMarkerPress = (marker: MapMarker) => {
    const restroom = restrooms.find(r => r.id === marker.id);
    if (restroom && Platform.OS !== 'web') {
      Alert.alert(
        restroom.name,
        `${restroom.address}\n\n${restroom.description || 'No description available'}`,
        [{ text: 'OK' }]
      );
    }
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

  return (
    <View style={styles.container}>
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

      {/* Status indicator for web */}
      {Platform.OS === 'web' && (
        <View style={styles.webStatus}>
          <Text style={styles.webStatusText}>
            {restrooms.length} restrooms found
          </Text>
        </View>
      )}
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
  webStatus: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  webStatusText: {
    fontSize: 14,
    color: '#374751',
    textAlign: 'center',
    fontWeight: '500',
  },
});