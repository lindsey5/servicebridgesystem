import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LocationUpdater = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      // Fly to the user's location and update the map view
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return null;
};

const Map = () => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    // Watch the user's position
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error("Error watching position:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Cleanup on component unmount
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <MapContainer
      center={position || [51.505, -0.09]} 
      zoom={20}
      scrollWheelZoom={true}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position && (
        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>
      )}
      {position && <LocationUpdater position={position} />} {/* Update map to center on the location */}
    </MapContainer>
  );
};

export default Map;
