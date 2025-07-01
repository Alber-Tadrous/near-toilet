export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapMarker {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title?: string;
  description?: string;
  onPress?: () => void;
}

export interface MapProps {
  style?: any;
  region?: MapRegion;
  markers?: MapMarker[];
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
  onRegionChange?: (region: MapRegion) => void;
  onRegionChangeComplete?: (region: MapRegion) => void;
  onMarkerPress?: (marker: MapMarker) => void;
  onPress?: (coordinate: { latitude: number; longitude: number }) => void;
  mapType?: 'standard' | 'satellite' | 'hybrid' | 'terrain';
  zoomEnabled?: boolean;
  scrollEnabled?: boolean;
  rotateEnabled?: boolean;
  pitchEnabled?: boolean;
  children?: React.ReactNode;
}

export interface MapRef {
  animateToRegion: (region: MapRegion, duration?: number) => void;
  animateToCoordinate: (coordinate: { latitude: number; longitude: number }, duration?: number) => void;
  fitToMarkers: (markers: MapMarker[], animated?: boolean) => void;
  getMapBoundaries: () => Promise<{
    northEast: { latitude: number; longitude: number };
    southWest: { latitude: number; longitude: number };
  }>;
}

export interface MapError {
  code: string;
  message: string;
  details?: any;
}