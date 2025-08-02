import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Attraction } from '../types/attraction';

// --- Context Shape ---
interface ItineraryContextType {
  itinerary: Attraction[];
  addAttractionToItinerary: (attraction: Attraction) => void;
  removeAttractionFromItinerary: (attractionId: string) => void;
  isAttractionInItinerary: (attractionId: string) => boolean;
}

// --- Context Creation ---
// The '!' non-null assertion is used here because the provider will always supply a value.
const ItineraryContext = createContext<ItineraryContextType>(null!);

// --- Custom Hook for easy consumption ---
export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
};

// --- Provider Component ---
interface ItineraryProviderProps {
  children: ReactNode;
}

export const ItineraryProvider = ({ children }: ItineraryProviderProps) => {
  const [itinerary, setItinerary] = useState<Attraction[]>([]);

  const addAttractionToItinerary = (attraction: Attraction) => {
    // Avoid adding duplicates
    if (!itinerary.some(item => item.id === attraction.id)) {
      setItinerary(prevItinerary => [...prevItinerary, attraction]);
    }
  };

  const removeAttractionFromItinerary = (attractionId: string) => {
    setItinerary(prevItinerary =>
      prevItinerary.filter(attraction => attraction.id !== attractionId)
    );
  };

  const isAttractionInItinerary = (attractionId: string): boolean => {
    return itinerary.some(attraction => attraction.id === attractionId);
  };

  const value = {
    itinerary,
    addAttractionToItinerary,
    removeAttractionFromItinerary,
    isAttractionInItinerary,
  };

  return (
    <ItineraryContext.Provider value={value}>
      {children}
    </ItineraryContext.Provider>
  );
};
