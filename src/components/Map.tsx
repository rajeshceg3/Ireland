import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Attraction } from '../types/attraction';
import { AttractionCategory } from '../config/categories';

// Import for MarkerClusterGroup
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css'; // Default styling
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'; // Default styling


// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface MapComponentProps {
  attractions: Attraction[];
  onMarkerClick: (attraction: Attraction) => void;
  activeCategoryFilter: AttractionCategory;
  searchTerm: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  attractions,
  onMarkerClick,
  activeCategoryFilter,
  searchTerm
}) => {
  let attractionsToDisplay = activeCategoryFilter === "All"
    ? attractions
    : attractions.filter(attraction => attraction.category === activeCategoryFilter);

  if (searchTerm.trim() !== "") {
    attractionsToDisplay = attractionsToDisplay.filter(attraction =>
      attraction.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (attractionsToDisplay.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-text-primary text-lg p-4 text-center">
        No attractions match your current filters or search term.
      </div>
    );
  }

  return (
    <MapContainer center={[53.4, -7.9]} zoom={7} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup> {/* Wrap markers in MarkerClusterGroup */}
        {attractionsToDisplay.map(attraction => {
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

          // Make marker focusable - Leaflet markers are focusable by default if they have interactive elements like popups
          // or if keyboard: true is set on L.Marker options.
          // We are using eventHandlers, and the underlying L.Marker should still become focusable.
          // If not, one might need to access markerRef.current?.getElement()?.tabIndex = 0; in an effect,
          // but this is often handled by Leaflet if interactive.

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
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapComponent;
