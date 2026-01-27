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
        <div class="relative group cursor-pointer flex justify-center items-center w-12 h-12">
          <!-- Shadow/Blur -->
          <div class="absolute bottom-2 w-6 h-1.5 bg-black/20 blur-[3px] rounded-full transition-all group-hover:w-8 group-hover:blur-[4px]"></div>

          <!-- Pulsing Ring -->
          <div class="absolute inset-0 bg-primary/30 rounded-full animate-pulse-slow scale-75 group-hover:scale-100 transition-transform"></div>

          <!-- Main Pin Body -->
          <div class="relative z-10 transform transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10 text-primary drop-shadow-md">
              <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
            <!-- Inner Dot (White) -->
            <div class="absolute top-[10px] left-[12px] w-4 h-4 bg-white rounded-full shadow-inner"></div>
             <!-- Category Icon Placeholder (optional, maybe too small) -->
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 44], // Center bottom
      popupAnchor: [0, -44], // Above the pin
    });
  }, []);

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
      <Popup closeButton={false} className="custom-popup">
        <div className="w-56 bg-white dark:bg-slate-800 text-text-primary rounded-xl shadow-xl overflow-hidden font-sans border border-gray-100 dark:border-gray-700">
            {/* Image Section */}
            <div className="relative h-32 w-full bg-gray-100 dark:bg-slate-700 overflow-hidden group">
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
                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-white font-bold tracking-wide uppercase">
                    {attraction.category}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-3">
                <h3 className="font-bold text-sm mb-1 line-clamp-2 leading-snug text-gray-800 dark:text-gray-100">
                    {attraction.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{attraction.rating}</span>
                </div>

                <button
                    ref={viewMoreButtonRef}
                    onClick={() => onMarkerClick(attraction)}
                    className="w-full py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center justify-center"
                >
                    View Details
                </button>
            </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default AttractionMarker;
