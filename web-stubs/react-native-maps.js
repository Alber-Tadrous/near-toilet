import React from 'react';

// Enhanced web stub for react-native-maps with better compatibility
export default function MapView({ children, style, ...props }) {
  return React.createElement('div', {
    style: {
      backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    },
    ...props
  }, children);
}

export const Marker = ({ children, ...props }) => {
  return React.createElement('div', {
    style: {
      position: 'absolute',
      width: 20,
      height: 20,
      backgroundColor: 'red',
      borderRadius: '50%',
    },
    ...props
  }, children);
};

export const Callout = ({ children, ...props }) => {
  return React.createElement('div', {
    style: {
      backgroundColor: 'white',
      padding: 8,
      borderRadius: 4,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    ...props
  }, children);
};

export const Circle = () => null;
export const Polygon = () => null;
export const Polyline = () => null;
export const Overlay = () => null;
export const Heatmap = () => null;
export const Geojson = () => null;

// Provider constants
export const PROVIDER_GOOGLE = 'google';
export const PROVIDER_DEFAULT = 'default';

// Animation constants
export const AnimatedRegion = {
  timing: () => ({ start: () => {} }),
  spring: () => ({ start: () => {} }),
};

// Map types
export const MAP_TYPES = {
  STANDARD: 'standard',
  SATELLITE: 'satellite',
  HYBRID: 'hybrid',
  TERRAIN: 'terrain',
};

// Export all components as named exports as well
export {
  MapView as MapView,
  Marker as Marker,
  Callout as Callout,
};