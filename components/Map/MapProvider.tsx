import React, { createContext, useContext, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { MapError } from '@/types/map';

interface MapContextType {
  isLoading: boolean;
  error: MapError | null;
  setLoading: (loading: boolean) => void;
  setError: (error: MapError | null) => void;
  clearError: () => void;
  platform: 'native' | 'web';
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<MapError | null>(null);

  const platform = Platform.OS === 'web' ? 'web' : 'native';

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const handleSetError = useCallback((error: MapError | null) => {
    setError(error);
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    isLoading,
    error,
    setLoading,
    setError: handleSetError,
    clearError,
    platform,
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
}