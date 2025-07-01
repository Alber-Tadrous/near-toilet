import React, { forwardRef } from 'react';
import { Platform } from 'react-native';
import { MapProps, MapRef } from '@/types/map';

// Dynamic import based on platform
const MapImplementation = forwardRef<MapRef, MapProps>((props, ref) => {
  if (Platform.OS === 'web') {
    const { WebMap } = require('./WebMap');
    return <WebMap ref={ref} {...props} />;
  } else {
    const { NativeMap } = require('./NativeMap');
    return <NativeMap ref={ref} {...props} />;
  }
});

MapImplementation.displayName = 'MapImplementation';

export { MapImplementation };