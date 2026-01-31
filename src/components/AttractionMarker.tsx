import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Attraction } from '../types/attraction';

interface AttractionMarkerProps {
  attraction: Attraction;
  onMarkerClick: (attraction: Attraction) => void;
}

const AttractionMarker: React.FC<AttractionMarkerProps> = ({ attraction, onMarkerClick }) => {
  const [isPopupImageLoading, setIsPopupImageLoading] = useState(true);
  const [popupImageError, setPopupImageError] = useState(false);

  const markerRef = useRef<L.Marker>(null);
  const viewMoreButtonRef = useRef<HTMLButtonElement>(null);

  const imageUrl = useMemo(() =>
    attraction.photos && attraction.photos.length > 0 ? attraction.photos[0] : null
  , [attraction.photos]);

  useEffect(() => {
    setIsPopupImageLoading(true);
    setPopupImageError(false);
  }, [imageUrl]);

  // Custom DivIcon for the marker
  // Using a cleaner SVG and Tailwind classes for animation
  const customIcon = useMemo(() => {
    return L.divIcon({
      className: 'bg-transparent border-none',
      html: `
        <div class="relative group cursor-pointer flex justify-center items-center w-12 h-12 marker-pulse">

          <!-- Pulsing Ring (handled by CSS class now, but adding extra layer) -->
          <div class="absolute inset-0 bg-primary/20 rounded-full animate-pulse-slow scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <!-- Main Pin Body -->
          <div class="relative z-10 transform transition-all duration-300 cubic-bezier(0.175, 0.885, 0.32, 1.275) group-hover:scale-125 group-hover:-translate-y-2 origin-bottom">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-lg filter">
                <path d="M20 0C11.1634 0 4 7.16344 4 16C4 26.5 20 40 20 40C20 40 36 26.5 36 16C36 7.16344 28.8366 0 20 0Z" fill="url(#paint0_linear_${attraction.id})"/>
                <circle cx="20" cy="16" r="6" fill="white"/>
                <defs>
                    <linearGradient id="paint0_linear_${attraction.id}" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#818CF8"/>
                        <stop offset="1" stop-color="#6366F1"/>
                    </linearGradient>
                </defs>
            </svg>

             <!-- Category Icon Placeholder (optional) -->
          </div>

          <!-- Shadow -->
          <div class="absolute bottom-1 w-4 h-1 bg-black/30 blur-[2px] rounded-full transition-all group-hover:w-6 group-hover:blur-[3px] group-hover:bg-black/20"></div>

        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 44], // Center bottom
      popupAnchor: [0, -44], // Above the pin
    });
  }, [attraction.id]);

  const handleKeyboardInteraction = (e: L.LeafletKeyboardEvent) => {
    if (e.originalEvent.key === 'Enter' || e.originalEvent.key === ' ') {
      e.originalEvent.preventDefault();
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }
  };

  const handlePopupOpen = () => {
    setTimeout(() => {
      if (viewMoreButtonRef.current) {
        viewMoreButtonRef.current.focus();
      }
    }, 100);
  };

  return (
    <Marker
      key={attraction.id}
      position={[attraction.location.lat, attraction.location.lng]}
      ref={markerRef}
      icon={customIcon}
      eventHandlers={{
        keydown: handleKeyboardInteraction,
        popupopen: handlePopupOpen,
        click: () => onMarkerClick(attraction)
      }}
    >
      <Popup closeButton={false} className="custom-popup bg-transparent shadow-none border-none p-0">
        <div className="w-64 glass-panel rounded-2xl overflow-hidden font-sans ring-1 ring-white/40 shadow-xl m-1">
            {/* Image Section */}
            <div className="relative h-36 w-full bg-gray-100 dark:bg-slate-700 overflow-hidden group">
                {isPopupImageLoading && !popupImageError && imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                )}

                {imageUrl ? (
                    <img
                    src={imageUrl}
                    alt={attraction.name}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isPopupImageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => { setIsPopupImageLoading(false); setPopupImageError(false); }}
                    onError={() => { setIsPopupImageLoading(false); setPopupImageError(true); }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-slate-700">
                        <span className="text-gray-400 text-xs">No image</span>
                    </div>
                )}

                {/* Category Badge overlay */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white font-bold tracking-wide uppercase shadow-sm">
                    {attraction.category}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                <h3 className="font-bold text-sm mb-1.5 line-clamp-2 leading-snug text-text-primary">
                    {attraction.name}
                </h3>
                <div className="flex items-center gap-1 mb-3">
                    <span className="text-yellow-400 text-xs drop-shadow-sm">★</span>
                    <span className="text-xs font-bold text-muted-text">{attraction.rating}</span>
                </div>

                <button
                    ref={viewMoreButtonRef}
                    autoFocus
                    onClick={() => onMarkerClick(attraction)}
                    className="w-full py-2 bg-primary text-white rounded-lg text-xs font-bold transition-all hover:bg-primary-soft hover:text-primary hover:shadow-lg active:scale-95 flex items-center justify-center group/btn relative overflow-hidden"
                >
                    <span className="relative z-10">View Details</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"/>
                </button>
            </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default AttractionMarker;
