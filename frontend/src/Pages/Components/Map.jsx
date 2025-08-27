import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import axios from 'axios';

const LocationUpdater = ({ position, coordinates }) => {
    const map = useMap();
  
    useEffect(() => {
      if (position && coordinates) {
        // Add the route control without instructions
        const route = L.Routing.control({
          waypoints: [L.latLng(position), L.latLng(coordinates)],
          routeWhileDragging: true,
          lineOptions: {
            styles: [{ color: 'green', weight: 4 }],
          },
          addWaypoints: false, // Prevent user from adding waypoints
          createMarker: () => null, // Remove default markers
          show: false, // Disables the instruction control UI
        }).addTo(map);
  
        // Remove the instructions container
        const instructionsElement = document.querySelector('.leaflet-routing-container');
        if (instructionsElement) instructionsElement.style.display = 'none';
  
        return () => {
          map.removeControl(route);
        };
      }
    }, [position, coordinates, map]);
  
    return null;
  };
  

const Map = () => {
  const [position, setPosition] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(
          'https://nominatim.openstreetmap.org/search?q=503 Eagle St. Blk 5 G2 Village, Bgy. Pinagsama, Taguig, Metro Manila, Philippines&format=json'
        );
        console.log(response.data)
        if (response.data && response.data[0]) {
          const { lat, lon } = response.data[0];
          setCoordinates([lat, lon]);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    fetchCoordinates();
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error('Error watching position:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []); // Only run once on mount

  return (
    <MapContainer
      center={position || [51.505, -0.09]} // Fallback center if position is unavailable
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position && (
        <Marker position={position} draggable={false} ref={(markerRef) => {
            if (markerRef) {
              markerRef.openPopup(); // Automatically open the popup
            }
          }}>
          <Popup>You are here</Popup>
        </Marker>
      )}
      {coordinates && (
        <Marker position={coordinates} draggable={false} >
          <Popup>HAHAHAHA</Popup>
        </Marker>
      )}
      
      {/* Call the LocationUpdater component here */}
      <LocationUpdater position={position} coordinates={coordinates} />
    </MapContainer>
  );
};

export default Map;
