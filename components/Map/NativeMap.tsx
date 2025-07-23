import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { MapProps, MapRef, MapRegion, MapMarker } from '@/types/map';
import { useMapContext } from './MapProvider';

// Conditionally import react-native-maps
let MapView: any;
let Marker: any;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  try {
    const maps = require('react-native-maps');
    MapView = maps.default || maps.MapView;
    Marker = maps.Marker;
    PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
  } catch (error) {
    console.warn('react-native-maps not available:', error);
  }
}

// Fallback component when maps are not available
const MapFallback = ({ style }: { style?: any }) => (
  <View style={[styles.fallback, style]}>
    <Text style={styles.fallbackText}>Map not available</Text>
    <Text style={styles.fallbackSubtext}>
      Maps are only available on native platforms
    </Text>
  </View>
);

export const NativeMap = forwardRef<MapRef, MapProps>(({
  style,
  region,
  markers = [],
  showsUserLocation = false,
  showsMyLocationButton = false,
  onRegionChange,
  onRegionChangeComplete,
  onMarkerPress,
  onPress,
  mapType = 'standard',
  zoomEnabled = true,
  scrollEnabled = true,
  rotateEnabled = true,
  pitchEnabled = true,
  children,
}, ref) => {
  const { setError, clearError } = useMapContext();
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!MapView) {
      setError({
        code: 'MAP_NOT_AVAILABLE',
        message: 'Native map component is not available on this platform',
      });
    } else {
      clearError();
    }
  }, [setError, clearError]);

  useImperativeHandle(ref, () => ({
    animateToRegion: (region: MapRegion, duration = 1000) => {
      if (mapRef.current && MapView) {
        mapRef.current.animateToRegion(region, duration);
      }
    },
    animateToCoordinate: (coordinate: { latitude: number; longitude: number }, duration = 1000) => {
      if (mapRef.current && MapView) {
        mapRef.current.animateToCoordinate(coordinate, duration);
      }
    },
    fitToMarkers: (markers: MapMarker[], animated = true) => {
      if (mapRef.current && MapView && markers.length > 0) {
        const coordinates = markers.map(marker => marker.coordinate);
        mapRef.current.fitToCoordinates(coordinates, {
          animated,
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        });
      }
    },
    getMapBoundaries: async () => {
      if (mapRef.current && MapView) {
        return await mapRef.current.getMapBoundaries();
      }
      throw new Error('Map reference not available');
    },
  }));

  if (!MapView) {
    return <MapFallback style={style} />;
  }

  // Wrap MapView in error boundary
  const renderMapView = () => {
    try {
      return (
        <MapView
          ref={mapRef}
          style={style}
          provider={PROVIDER_GOOGLE}
          region={region}
          showsUserLocation={showsUserLocation}
          showsMyLocationButton={showsMyLocationButton}
          onRegionChange={handleRegionChange}
          onRegionChangeComplete={handleRegionChangeComplete}
          onPress={handleMapPress}
          mapType={mapType}
          zoomEnabled={zoomEnabled}
          scrollEnabled={scrollEnabled}
          rotateEnabled={rotateEnabled}
          pitchEnabled={pitchEnabled}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              onPress={() => handleMarkerPress(marker)}
            />
          ))}
          {children}
        </MapView>
      );
    } catch (error) {
      console.error('MapView render error:', error);
      return <MapFallback style={style} />;
    }
  };

  const handleRegionChange = (region: any) => {
    try {
    const mapRegion: MapRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    };
    onRegionChange?.(mapRegion);
    } catch (error) {
      console.error('Region change error:', error);
    }
  };

  const handleRegionChangeComplete = (region: any) => {
    try {
    const mapRegion: MapRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    };
    onRegionChangeComplete?.(mapRegion);
    } catch (error) {
      console.error('Region change complete error:', error);
    }
  };

  const handleMarkerPress = (marker: MapMarker) => {
    try {
    onMarkerPress?.(marker);
    } catch (error) {
      console.error('Marker press error:', error);
    }
  };

  const handleMapPress = (event: any) => {
    try {
    const coordinate = event.nativeEvent.coordinate;
    onPress?.(coordinate);
    } catch (error) {
      console.error('Map press error:', error);
    }
  };

  return renderMapView();
});

NativeMap.displayName = 'NativeMap';

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  fallbackText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374751',
    marginBottom: 8,
  },
  fallbackSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});