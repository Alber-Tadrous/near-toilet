import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapProps, MapRef, MapRegion, MapMarker } from '@/types/map';
import { useMapContext } from './MapProvider';

// Leaflet imports for web
let MapContainer: any;
let TileLayer: any;
let Marker: any;
let Popup: any;
let useMap: any;
let useMapEvents: any;

// Leaflet CSS and icon setup
if (typeof window !== 'undefined') {
  try {
    require('leaflet/dist/leaflet.css');
    const L = require('leaflet');
    
    // Fix for default markers in Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const reactLeaflet = require('react-leaflet');
    MapContainer = reactLeaflet.MapContainer;
    TileLayer = reactLeaflet.TileLayer;
    Marker = reactLeaflet.Marker;
    Popup = reactLeaflet.Popup;
    useMap = reactLeaflet.useMap;
    useMapEvents = reactLeaflet.useMapEvents;
  } catch (error) {
    console.warn('Leaflet not available:', error);
  }
}

// Map controller component to handle imperative actions
function MapController({ 
  region, 
  onRegionChange, 
  onRegionChangeComplete, 
  onPress,
  mapRef 
}: {
  region?: MapRegion;
  onRegionChange?: (region: MapRegion) => void;
  onRegionChangeComplete?: (region: MapRegion) => void;
  onPress?: (coordinate: { latitude: number; longitude: number }) => void;
  mapRef: React.MutableRefObject<any>;
}) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  useEffect(() => {
    if (region && map) {
      map.setView([region.latitude, region.longitude], getZoomFromDelta(region.latitudeDelta));
    }
  }, [region, map]);

  useMapEvents({
    moveend: () => {
      if (map && onRegionChangeComplete) {
        const center = map.getCenter();
        const bounds = map.getBounds();
        const latitudeDelta = bounds.getNorth() - bounds.getSouth();
        const longitudeDelta = bounds.getEast() - bounds.getWest();
        
        onRegionChangeComplete({
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta,
          longitudeDelta,
        });
      }
    },
    move: () => {
      if (map && onRegionChange) {
        const center = map.getCenter();
        const bounds = map.getBounds();
        const latitudeDelta = bounds.getNorth() - bounds.getSouth();
        const longitudeDelta = bounds.getEast() - bounds.getWest();
        
        onRegionChange({
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta,
          longitudeDelta,
        });
      }
    },
    click: (e) => {
      if (onPress) {
        onPress({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      }
    },
  });

  return null;
}

// Helper function to convert latitude delta to zoom level
function getZoomFromDelta(latitudeDelta: number): number {
  return Math.round(Math.log(360 / latitudeDelta) / Math.LN2);
}

export const WebMap = forwardRef<MapRef, MapProps>(({
  style,
  region,
  markers = [],
  showsUserLocation = false,
  onRegionChange,
  onRegionChangeComplete,
  onMarkerPress,
  onPress,
  mapType = 'standard',
  zoomEnabled = true,
  scrollEnabled = true,
  children,
}, ref) => {
  const { setError, clearError, setLoading } = useMapContext();
  const mapRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!MapContainer) {
      setError({
        code: 'LEAFLET_NOT_AVAILABLE',
        message: 'Leaflet map library is not available',
      });
    } else {
      clearError();
    }
  }, [setError, clearError]);

  useImperativeHandle(ref, () => ({
    animateToRegion: (region: MapRegion, duration = 1000) => {
      if (mapRef.current) {
        mapRef.current.flyTo(
          [region.latitude, region.longitude],
          getZoomFromDelta(region.latitudeDelta),
          { duration: duration / 1000 }
        );
      }
    },
    animateToCoordinate: (coordinate: { latitude: number; longitude: number }, duration = 1000) => {
      if (mapRef.current) {
        mapRef.current.flyTo(
          [coordinate.latitude, coordinate.longitude],
          mapRef.current.getZoom(),
          { duration: duration / 1000 }
        );
      }
    },
    fitToMarkers: (markers: MapMarker[], animated = true) => {
      if (mapRef.current && markers.length > 0) {
        const L = require('leaflet');
        const group = new L.featureGroup(
          markers.map(marker => 
            L.marker([marker.coordinate.latitude, marker.coordinate.longitude])
          )
        );
        
        if (animated) {
          mapRef.current.flyToBounds(group.getBounds(), { padding: [20, 20] });
        } else {
          mapRef.current.fitBounds(group.getBounds(), { padding: [20, 20] });
        }
      }
    },
    getMapBoundaries: async () => {
      if (mapRef.current) {
        const bounds = mapRef.current.getBounds();
        return {
          northEast: {
            latitude: bounds.getNorth(),
            longitude: bounds.getEast(),
          },
          southWest: {
            latitude: bounds.getSouth(),
            longitude: bounds.getWest(),
          },
        };
      }
      throw new Error('Map reference not available');
    },
  }));

  if (!isClient || !MapContainer) {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <Text style={styles.fallbackText}>Loading map...</Text>
      </View>
    );
  }

  const defaultCenter: [number, number] = region 
    ? [region.latitude, region.longitude]
    : [37.78825, -122.4324];
  
  const defaultZoom = region ? getZoomFromDelta(region.latitudeDelta) : 13;

  const getTileLayerUrl = () => {
    switch (mapType) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getTileLayerAttribution = () => {
    switch (mapType) {
      case 'satellite':
        return '&copy; <a href="https://www.esri.com/">Esri</a>';
      case 'terrain':
        return '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>';
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    }
  };

  return (
    <View style={style}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={zoomEnabled}
        dragging={scrollEnabled}
        scrollWheelZoom={zoomEnabled}
        doubleClickZoom={zoomEnabled}
        touchZoom={zoomEnabled}
      >
        <MapController
          region={region}
          onRegionChange={onRegionChange}
          onRegionChangeComplete={onRegionChangeComplete}
          onPress={onPress}
          mapRef={mapRef}
        />
        
        <TileLayer
          url={getTileLayerUrl()}
          attribution={getTileLayerAttribution()}
        />
        
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.coordinate.latitude, marker.coordinate.longitude]}
            eventHandlers={{
              click: () => onMarkerPress?.(marker),
            }}
          >
            {(marker.title || marker.description) && (
              <Popup>
                {marker.title && <strong>{marker.title}</strong>}
                {marker.description && <div>{marker.description}</div>}
              </Popup>
            )}
          </Marker>
        ))}
        
        {children}
      </MapContainer>
    </View>
  );
});

WebMap.displayName = 'WebMap';

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  fallbackText: {
    fontSize: 16,
    color: '#666',
  },
});