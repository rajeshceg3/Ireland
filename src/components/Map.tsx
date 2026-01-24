import React, { useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Attraction } from '../types/attraction';
import { AttractionCategory } from '../config/categories';
import { MapPinOff } from 'lucide-react';

import AttractionMarker from './AttractionMarker';
import MapUpdater from './MapUpdater';


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
  const attractionsToDisplay = useMemo(() => {
    let filtered = activeCategoryFilter === "All"
      ? attractions
      : attractions.filter(attraction => attraction.category === activeCategoryFilter);

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(attraction =>
        attraction.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [attractions, activeCategoryFilter, searchTerm]);

  if (attractionsToDisplay.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-muted-text text-lg p-6 text-center bg-gray-50/50">
        <MapPinOff size={48} className="mb-4 opacity-50" />
        <h3 className="text-xl font-bold mb-2">No attractions found</h3>
        <p className="max-w-xs mx-auto">
            We couldn't find any attractions matching your current filters. Try changing the category or search term.
        </p>
      </div>
    );
  }

  return (
    <MapContainer center={[53.4, -7.9]} zoom={7} style={{ height: '100%', width: '100%' }} className="z-0">
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {attractionsToDisplay.map(attraction => (
        <AttractionMarker
          key={attraction.id}
          attraction={attraction}
          onMarkerClick={onMarkerClick}
        />
      ))}
      <MapUpdater attractions={attractionsToDisplay} />
    </MapContainer>
  );
};

export default MapComponent;
