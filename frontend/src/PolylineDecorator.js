import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-polylinedecorator';

const PolylineDecorator = ({ positions, patterns, congestionLevel }) => {
  const mapRef = useRef(null); 
  
  useEffect(() => {
    // Get the Leaflet map instance from the ref
    const map = mapRef.current;

    // Create a Leaflet Polyline layer
    const polyline = L.polyline(positions);

    // Create a Leaflet PolylineDecorator layer
    const decorator = L.polylineDecorator(polyline, { patterns });

    // Add the PolylineDecorator layer to the map
    decorator.addTo(map);

    // Update the polyline color based on the congestion level
    const updatePolylineColor = () => {
      const congestionColors = {
        0: 'bg-green-500',
        1: 'bg-yellow-500',
        2: 'bg-red-500',
      };
      const colorClass = congestionColors[congestionLevel];
      polyline.setStyle({ color: 'transparent' });
      polyline.setStyle({ fillColor: 'transparent' });
      polyline.setStyle({ className: colorClass });
    };

    updatePolylineColor();

    return () => {
      
      decorator.removeFrom(map);
    };
  }, [positions, patterns, congestionLevel]);

  return <div ref={mapRef} style={{ display: 'none' }}></div>;
};

export default PolylineDecorator;