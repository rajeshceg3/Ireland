import React, { createContext, useState, useContext, useEffect, useRef, ReactNode } from 'react';
import { Attraction } from '../types/attraction';

// --- Context Shape ---
interface ItineraryContextType {
  itinerary: Attraction[];
  saveStatus: string;
  exportRecovery: () => void;
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
  const key='ireland-itinerary.v1';
  const broken=useRef(false);
  const [saveStatus,setSaveStatus]=useState('This itinerary is only in this browser, not the cloud.');
  const [itinerary, setItinerary] = useState<Attraction[]>(()=>{
    try { const raw=localStorage.getItem(key);if(raw===null)return [];const d=JSON.parse(raw);if(!Array.isArray(d)||d.length>100||d.some(x=>!x||typeof x.id!=='string'||typeof x.name!=='string')||new Set(d.map(x=>x.id)).size!==d.length)throw Error();return d; }
    catch {broken.current=true;return []}
  });
  useEffect(()=>{if(broken.current){setSaveStatus('Unreadable earlier itinerary preserved. Editing is blocked. Export recovery before continuing in another browser.');return}try{localStorage.setItem(key,JSON.stringify(itinerary));setSaveStatus('Browser recovery copy saved. Not cloud-saved: download and import into the private home to keep it beyond this browser.')}catch{setSaveStatus('Browser save failed. Keep this page open and download a recovery copy now.')}},[itinerary]);
  const exportRecovery=()=>{try{const raw=broken.current?localStorage.getItem(key):JSON.stringify(itinerary);const blob=new Blob([JSON.stringify({schema:1,app:'ireland',raw},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ireland-itinerary-recovery.json';a.click();URL.revokeObjectURL(a.href);}catch{setSaveStatus('Recovery download failed. Keep this page open.')}};


  const addAttractionToItinerary = (attraction: Attraction) => {
    if(broken.current){setSaveStatus('Editing blocked: unreadable itinerary preserved. Export recovery first.');return}
    // Avoid adding duplicates
    if (!itinerary.some(item => item.id === attraction.id)) {
      setItinerary(prevItinerary => [...prevItinerary, attraction]);
    }
  };

  const removeAttractionFromItinerary = (attractionId: string) => {
    if(broken.current){setSaveStatus('Editing blocked: unreadable itinerary preserved. Export recovery first.');return}
    setItinerary(prevItinerary =>
      prevItinerary.filter(attraction => attraction.id !== attractionId)
    );
  };

  const isAttractionInItinerary = (attractionId: string): boolean => {
    return itinerary.some(attraction => attraction.id === attractionId);
  };

  const value = {
    itinerary,saveStatus,exportRecovery,
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
