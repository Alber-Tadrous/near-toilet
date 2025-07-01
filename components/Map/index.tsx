import React, { forwardRef } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { MapProps, MapRef } from '@/types/map';
import { MapProvider, useMapContext } from './MapProvider';
import { MapErrorBoundary } from './MapErrorBoundary';
import { MapLoadingOverlay } from './MapLoadingOverlay';
import { NativeMap } from './NativeMap';
import { WebMap } from './WebMap';

const MapComponent = forwardRef<MapRef, MapProps>((props, ref) => {
  const { isLoading, error, platform } = useMapContext();

  const MapImplementation = platform === 'web' ? WebMap : NativeMap;

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