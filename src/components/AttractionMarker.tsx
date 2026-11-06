import React, { useMemo } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { Attraction } from '../types/attraction';

interface AttractionMarkerProps {
  attraction: Attraction;
  onMarkerClick: (attraction: Attraction) => void;
}

const AttractionMarker: React.FC<AttractionMarkerProps> = ({ attraction, onMarkerClick }) => {
  const customIcon = useMemo(() => {
    return L.divIcon({
      className: 'bg-transparent border-none',
      html: `
        <div class="relative group cursor-pointer flex justify-center items-center w-12 h-12 animate-pop-in">

          <!-- Pulsing Ring -->
          <div class="absolute inset-0 bg-primary/30 rounded-full animate-pulse-soft scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <!-- Main Pin Body -->
          <div class="relative z-10 transform transition-all duration-300 cubic-bezier(0.175, 0.885, 0.32, 1.275) group-hover:scale-125 group-hover:-translate-y-2 origin-bottom">
            <svg width="44" height="44" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-lg filter">
                <path d="M20 0C11.1634 0 4 7.16344 4 16C4 26.5 20 40 20 40C20 40 36 26.5 36 16C36 7.16344 28.8366 0 20 0Z" fill="url(#paint0_linear_${attraction.id})"/>
                <circle cx="20" cy="16" r="6" fill="white"/>
                <defs>
                    <linearGradient id="paint0_linear_${attraction.id}" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#A78BFA"/> <!-- Soft Lavender -->
                        <stop offset="1" stop-color="#F472B6"/> <!-- Soft Pink -->
                    </linearGradient>
                </defs>
            </svg>
          </div>

          <!-- Shadow -->
          <div class="absolute bottom-1 w-4 h-1 bg-black/20 blur-[2px] rounded-full transition-all group-hover:w-6 group-hover:blur-[3px] group-hover:bg-black/10"></div>

        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 44], // Center bottom
      popupAnchor: [0, -44], // Above the pin
    });
  }, [attraction.id]);
  // One reading surface: selecting a marker opens the existing details dialog.
  // A second Leaflet popup used to remain beneath the header after closing it.
  return <Marker position={[attraction.location.lat, attraction.location.lng]} icon={customIcon}
    title={attraction.name} alt={attraction.name}
    eventHandlers={{
      click: () => onMarkerClick(attraction),
      keydown: (e: L.LeafletKeyboardEvent) => {
        if (e.originalEvent.key === 'Enter' || e.originalEvent.key === ' ') {
          e.originalEvent.preventDefault(); onMarkerClick(attraction);
        }
      }
    }} />;
};
export default AttractionMarker;
