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

    const bounds = new L.LatLngBounds(attractions.map(a => [a.location.lat, a.location.lng]));
    // Keep every pin below the header/category controls and above the catalogue notice.
    map.fitBounds(bounds, {paddingTopLeft:[50,190],paddingBottomRight:[50,105],maxZoom:13,animate:false});
  }, [attractions, map]);

  return null; // This component does not render anything
};

export default MapUpdater;
