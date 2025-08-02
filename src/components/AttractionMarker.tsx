import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Attraction } from '../types/attraction';
import { truncateAtWordBoundary } from '../utils/text';

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
      eventHandlers={{
        keydown: handleKeyboardInteraction,
        popupopen: handlePopupOpen,
      }}
    >
      <Popup>
      <div className="w-40 sm:w-48 bg-card-background text-text-primary rounded-lg shadow-lg overflow-hidden">
          {isPopupImageLoading && !popupImageError && imageUrl && (
            <div className="w-full h-24 bg-gray-300 animate-pulse"></div>
          )}

          {imageUrl && (
            <img
              src={imageUrl}
              alt={attraction.name}
              className={`w-full h-24 object-cover ${isPopupImageLoading || popupImageError ? 'hidden' : 'block'}`}
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
            <div className="w-full h-24 flex items-center justify-center bg-gray-100">
              <span className="text-gray-500 text-xs">Image unavailable</span>
            </div>
          )}

          {!imageUrl && (
            <div className="w-full h-24 flex items-center justify-center bg-gray-100">
              <span className="text-gray-500 text-xs">No image provided</span>
            </div>
          )}
          <div className="p-2">
            <h3 className="font-bold text-base mb-1 truncate">{attraction.name}</h3>
          <p className="text-xs text-muted-text mt-1 h-10 overflow-hidden">
            {truncateAtWordBoundary(attraction.description, 60)}...
          </p>
          <p className="text-sm font-semibold mt-1">Rating: {attraction.rating}/5</p>
          <button
            ref={viewMoreButtonRef}
            onClick={() => onMarkerClick(attraction)}
            className="text-xs text-primary hover:underline mt-1"
          >
            View More
          </button>
          </div>
      </div>
      </Popup>
    </Marker>
  );
};

export default AttractionMarker;
