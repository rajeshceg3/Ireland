import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Attraction } from '../types/attraction';

interface MapUpdaterProps {
  attractions: Attraction[];
}

const MapUpdater: React.FC<MapUpdaterProps> = ({ attractions }) => {
  const map = useMap();

  useEffect(() => {
    if (attractions.length === 0) {
      // Do not change view if no attractions are displayed
      return;
    }

    if (attractions.length === 1) {
      // If only one attraction, center the map on it
      const { lat, lng } = attractions[0].location;
      map.setView([lat, lng], 13); // Zoom level 13 is a reasonable default for a single point
    } else {
      // If multiple attractions, fit them all in the view
      const bounds = new L.LatLngBounds(
        attractions.map(attraction => [attraction.location.lat, attraction.location.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] }); // Add some padding around the markers
    }
  }, [attractions, map]);

  return null; // This component does not render anything
};

export default MapUpdater;
