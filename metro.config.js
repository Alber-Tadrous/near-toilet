const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure resolver.alias exists and place our custom aliases first
config.resolver.alias = {
  'react-native-maps': path.resolve(__dirname, 'web-stubs/react-native-maps.js'),
  'react-native-maps/lib/MapMarkerNativeComponent.js': path.resolve(__dirname, 'web-stubs/empty.js'),
  'react-native-maps/src/MapMarkerNativeComponent.ts': path.resolve(__dirname, 'web-stubs/empty.js'),
  'react-native-maps/src/MapMarkerNativeComponent': path.resolve(__dirname, 'web-stubs/empty.js'),
  'react-native/Libraries/Utilities/codegenNativeCommands': path.resolve(__dirname, 'web-stubs/empty.js'),
  'react-native/Libraries/Components/View/ViewNativeComponent': path.resolve(__dirname, 'web-stubs/empty.js'),
  'react-native/Libraries/NativeComponent/NativeComponentRegistry': path.resolve(__dirname, 'web-stubs/empty.js'),
  ...config.resolver.alias,
};

// Add platform-specific extensions
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Ensure proper source extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx'];

module.exports = config;