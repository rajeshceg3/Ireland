import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Attraction } from '../types/attraction';
import { AttractionCategory } from '../config/categories';

// Import for MarkerClusterGroup
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css'; // Default styling
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'; // Default styling
import AttractionMarker from './AttractionMarker';


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
      <MarkerClusterGroup>
        {attractionsToDisplay.map(attraction => (
          <AttractionMarker
            key={attraction.id}
            attraction={attraction}
            onMarkerClick={onMarkerClick}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapComponent;
