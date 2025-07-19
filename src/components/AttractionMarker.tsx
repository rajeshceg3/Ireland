import React, { useState, useEffect, useRef } from 'react';
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

  const imageUrl = attraction.photos && attraction.photos.length > 0 ? attraction.photos[0] : null;
  const markerRef = useRef<L.Marker>(null);

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
      // The "View More" button within the popup will handle onMarkerClick
    }
  };

  return (
    <Marker
      key={attraction.id}
      position={[attraction.location.lat, attraction.location.lng]}
      ref={markerRef}
      eventHandlers={{
        keydown: handleKeyboardInteraction,
      }}
    >
      <Popup>
      <div className="w-40 sm:w-48 bg-card-background text-text-primary rounded-lg shadow-lg overflow-hidden">
          {isPopupImageLoading && !popupImageError && imageUrl && (
            <div className="w-full h-24 bg-gray-300 animate-pulse"></div>
          )}

          {/* Single img tag to handle loading, display, and errors */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt={attraction.name}
              className={`w-full h-24 object-cover ${isPopupImageLoading || popupImageError ? 'hidden' : 'block'}`}
              onLoad={() => {
                setIsPopupImageLoading(false);
                setPopupImageError(false); // Ensure error is reset if image loads successfully
              }}
              onError={() => {
                setIsPopupImageLoading(false);
                setPopupImageError(true);
              }}
            />
          )}

          {/* Error display, shown if popupImageError is true for an existing imageUrl */}
          {popupImageError && imageUrl && (
            <div className="w-full h-24 flex items-center justify-center bg-gray-100">
              <span className="text-gray-500 text-xs">Image unavailable</span>
            </div>
          )}

          {/* Placeholder if no image URL was provided initially */}
          {!imageUrl && ( // This is the single, correct block for when no image URL exists.
            <div className="w-full h-24 flex items-center justify-center bg-gray-100">
              <span className="text-gray-500 text-xs">No image provided</span>
            </div>
          )}
          <div className="p-2">
            <h3 className="font-bold text-base mb-1 truncate">{attraction.name}</h3>
          <p className="text-xs text-muted-text mt-1 h-10 overflow-hidden">
            {attraction.description.substring(0, 60)}{attraction.description.length > 60 ? '...' : ''}
          </p>
          <p className="text-sm font-semibold mt-1">Rating: {attraction.rating}/5</p>
          <button
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
