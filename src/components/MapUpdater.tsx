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
    const fit = () => { map.stop(); map.fitBounds(bounds, {paddingTopLeft:[50,190],paddingBottomRight:[50,140],maxZoom:13,animate:false}); };
    let zooming = false;
    let resizePending = false;
    const zoomStart = () => { zooming = true; };
    const zoomEnd = () => {
      zooming = false;
      if (resizePending) { resizePending = false; fit(); }
    };
    const resize = () => { if (zooming) resizePending = true; else fit(); };
    map.on('zoomstart', zoomStart);
    map.on('zoomend', zoomEnd);
    map.on('resize', resize);
    fit();
    return () => { map.off('resize', resize); map.off('zoomstart', zoomStart); map.off('zoomend', zoomEnd); };
  }, [attractions, map]);

  return null; // This component does not render anything
};

export default MapUpdater;
