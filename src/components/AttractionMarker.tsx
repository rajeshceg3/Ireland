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
  }, [imageUrl]); // Reset when the image URL changes

  // Custom DivIcon for the marker
  const customIcon = useMemo(() => {
    return L.divIcon({
      className: 'bg-transparent border-none',
      html: `
        <div class="relative group cursor-pointer flex justify-center items-center">
          <div class="absolute bottom-1 w-4 h-1 bg-black/20 blur-[2px] rounded-full"></div>
          <div class="absolute -inset-3 bg-primary/20 rounded-full animate-pulse-slow z-0"></div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="relative z-10 w-10 h-10 text-primary drop-shadow-lg transform transition-transform duration-300 ease-spring group-hover:scale-110 group-hover:-translate-y-2">
            <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  }, []);

  const handleKeyboardInteraction = (e: L.LeafletKeyboardEvent) => {
    if (e.originalEvent.key === 'Enter' || e.originalEvent.key === ' ') {
      e.originalEvent.preventDefault(); // Prevent default spacebar scroll
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }
  };

  const handlePopupOpen = () => {
    // Set timeout to allow popup to render before focusing
    setTimeout(() => {
      if (viewMoreButtonRef.current) {
        viewMoreButtonRef.current.focus();
      }
    }, 100); // A small delay is sometimes needed
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
      <Popup>
      <div className="w-48 sm:w-56 bg-card-background text-text-primary rounded-xl shadow-none overflow-hidden font-sans">
          {isPopupImageLoading && !popupImageError && imageUrl && (
            <div className="w-full h-28 bg-gray-200 animate-pulse"></div>
          )}

          {imageUrl && (
            <img
              src={imageUrl}
              alt={attraction.name}
              className={`w-full h-28 object-cover ${isPopupImageLoading || popupImageError ? 'hidden' : 'block'}`}
              onLoad={() => {
                setIsPopupImageLoading(false);
                setPopupImageError(false);
              }}
              onError={() => {
                setIsPopupImageLoading(false);
                setPopupImageError(true);
              }}
            />
          )}

          {popupImageError && imageUrl && (
            <div className="w-full h-28 flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-xs">Image unavailable</span>
            </div>
          )}

          {!imageUrl && (
            <div className="w-full h-28 flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-xs">No image provided</span>
            </div>
          )}
          <div className="p-3">
            <h3 className="font-bold text-sm mb-1 line-clamp-2 leading-tight">{attraction.name}</h3>
          <p className="text-xs text-muted-text mt-1 line-clamp-2">
            {attraction.description}
          </p>
          <div className="flex justify-between items-center mt-3">
             <span className="text-xs font-bold text-yellow-500 flex items-center gap-1">★ {attraction.rating}</span>
             <button
                ref={viewMoreButtonRef}
                onClick={() => onMarkerClick(attraction)}
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium hover:bg-primary hover:text-white transition-colors"
            >
                Details
            </button>
          </div>
          </div>
      </div>
      </Popup>
    </Marker>
  );
};

export default AttractionMarker;
