// Empty stub for native-only modules
module.exports = {};

// Also provide ES6 export for compatibility
export default {};

// Common native module exports that might be expected
export const requireNativeComponent = () => null;
export const NativeModules = {};
export const Platform = { OS: 'web' };
export const Dimensions = { get: () => ({ width: 0, height: 0 }) };