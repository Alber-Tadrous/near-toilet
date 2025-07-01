# Cross-Platform Map Component

A comprehensive map component that works seamlessly across iOS, Android, and web platforms.

## Features

- **Cross-Platform**: Automatically detects platform and uses appropriate map implementation
- **Native Performance**: Uses `react-native-maps` for iOS/Android
- **Web Compatibility**: Uses `react-leaflet` for web platforms
- **Consistent API**: Same interface across all platforms
- **Error Handling**: Built-in error boundaries and loading states
- **TypeScript Support**: Full type safety and IntelliSense
- **Imperative API**: Programmatic control via ref methods

## Installation

The component uses the following dependencies:

```bash
# For native platforms
npm install react-native-maps

# For web platforms  
npm install leaflet react-leaflet @types/leaflet
```

## Basic Usage

```tsx
import React, { useRef } from 'react';
import { Map, MapRef, MapRegion } from '@/components/Map';

export default function MyMapScreen() {
  const mapRef = useRef<MapRef>(null);
  
  const region: MapRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const markers = [
    {
      id: '1',
      coordinate: { latitude: 37.78825, longitude: -122.4324 },
      title: 'San Francisco',
      description: 'A great city',
    },
  ];

  return (
    <Map
      ref={mapRef}
      style={{ flex: 1 }}
      region={region}
      markers={markers}
      showsUserLocation={true}
      onRegionChangeComplete={(region) => console.log(region)}
      onMarkerPress={(marker) => console.log(marker)}
    />
  );
}
```

## Props

### MapProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `style` | `ViewStyle` | - | Style for the map container |
| `region` | `MapRegion` | - | The region to display |
| `markers` | `MapMarker[]` | `[]` | Array of markers to display |
| `showsUserLocation` | `boolean` | `false` | Show user's current location |
| `showsMyLocationButton` | `boolean` | `false` | Show my location button (native only) |
| `onRegionChange` | `(region: MapRegion) => void` | - | Called when region changes |
| `onRegionChangeComplete` | `(region: MapRegion) => void` | - | Called when region change completes |
| `onMarkerPress` | `(marker: MapMarker) => void` | - | Called when marker is pressed |
| `onPress` | `(coordinate: {lat: number, lng: number}) => void` | - | Called when map is pressed |
| `mapType` | `'standard' \| 'satellite' \| 'hybrid' \| 'terrain'` | `'standard'` | Map display type |
| `zoomEnabled` | `boolean` | `true` | Enable zoom gestures |
| `scrollEnabled` | `boolean` | `true` | Enable scroll gestures |
| `rotateEnabled` | `boolean` | `true` | Enable rotation gestures (native only) |
| `pitchEnabled` | `boolean` | `true` | Enable pitch gestures (native only) |

## Imperative API

Access map methods via ref:

```tsx
const mapRef = useRef<MapRef>(null);

// Animate to region
mapRef.current?.animateToRegion({
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
}, 1000);

// Animate to coordinate
mapRef.current?.animateToCoordinate({
  latitude: 37.78825,
  longitude: -122.4324,
}, 1000);

// Fit to markers
mapRef.current?.fitToMarkers(markers, true);

// Get map boundaries
const boundaries = await mapRef.current?.getMapBoundaries();
```

## Platform-Specific Features

### Native (iOS/Android)
- Uses Google Maps provider
- Hardware-accelerated rendering
- Native gesture handling
- Satellite and hybrid map types
- 3D building rendering
- Rotation and pitch controls

### Web
- Uses OpenStreetMap tiles by default
- Satellite imagery via ArcGIS
- Terrain maps via OpenTopoMap
- Responsive design
- Touch and mouse interaction
- Keyboard navigation support

## Error Handling

The component includes comprehensive error handling:

```tsx
import { useMapContext } from '@/components/Map';

function MyComponent() {
  const { error, isLoading, clearError } = useMapContext();
  
  if (error) {
    return <ErrorComponent error={error} onRetry={clearError} />;
  }
  
  return <Map {...props} />;
}
```

## Customization

### Custom Markers

```tsx
const markers = [
  {
    id: '1',
    coordinate: { latitude: 37.78825, longitude: -122.4324 },
    title: 'Custom Marker',
    onPress: () => console.log('Custom action'),
  },
];
```

### Map Types

```tsx
<Map mapType="satellite" /> // Satellite imagery
<Map mapType="terrain" />   // Topographic map
<Map mapType="hybrid" />    // Satellite + labels (native only)
```

## Performance Tips

1. **Limit Markers**: For large datasets, implement clustering or virtualization
2. **Debounce Region Changes**: Avoid excessive API calls on region changes
3. **Optimize Re-renders**: Use `React.memo` for marker components
4. **Lazy Loading**: Load map component only when needed

## Troubleshooting

### Common Issues

1. **Map not displaying on web**: Ensure Leaflet CSS is loaded
2. **Markers not showing**: Check coordinate format and bounds
3. **Performance issues**: Reduce marker count or implement clustering
4. **Permission errors**: Handle location permission requests properly

### Debug Mode

Enable debug logging:

```tsx
// Add to your app's entry point
if (__DEV__) {
  console.log('Map debug mode enabled');
}
```

## Contributing

When contributing to the map component:

1. Test on all platforms (iOS, Android, Web)
2. Maintain API consistency across platforms
3. Add TypeScript types for new features
4. Update documentation for new props/methods
5. Include error handling for edge cases