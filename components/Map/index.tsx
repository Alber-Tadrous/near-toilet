import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { MapProps, MapRef } from '@/types/map';
import { MapProvider, useMapContext } from './MapProvider';
import { MapErrorBoundary } from './MapErrorBoundary';
import { MapLoadingOverlay } from './MapLoadingOverlay';
import { MapImplementation } from './MapImplementation';

const MapComponent = forwardRef<MapRef, MapProps>((props, ref) => {
  const { isLoading, error } = useMapContext();
  
  // Debug log for markers
  React.useEffect(() => {
    console.log('Map markers updated:', props.markers?.length || 0, props.markers);
  }, [props.markers]);

  return (
    <View style={[styles.container, props.style]}>
      <MapErrorBoundary>
        <MapImplementation ref={ref} {...props} />
        {isLoading && <MapLoadingOverlay />}
      </MapErrorBoundary>
    </View>
  );
});

MapComponent.displayName = 'MapComponent';

export const Map = forwardRef<MapRef, MapProps>((props, ref) => {
  return (
    <MapProvider>
      <MapComponent ref={ref} {...props} />
    </MapProvider>
  );
});

Map.displayName = 'Map';

// Export types and utilities
export type { MapProps, MapRef, MapRegion, MapMarker } from '@/types/map';
export { useMapContext } from './MapProvider';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});