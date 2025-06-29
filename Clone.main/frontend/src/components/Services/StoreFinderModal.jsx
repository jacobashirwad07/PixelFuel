import React from 'react';
import './StoreFinderModal.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const stores = [
  { name: 'PixelFuel Store 1', lat: 12.9716, lng: 77.5946 },
  { name: 'PixelFuel Store 2', lat: 13.0827, lng: 80.2707 },
  { name: 'PixelFuel Store 3', lat: 19.0760, lng: 72.8777 },
  { name: 'PixelFuel Store 4', lat: 28.7041, lng: 77.1025 },
  { name: 'PixelFuel Store 5', lat: 22.5726, lng: 88.3639 },
];

const StoreFinderModal = ({ onClose }) => (
  <div className="store-modal-overlay">
    <div className="store-modal">
      <button className="close-modal" onClick={onClose}>×</button>
      <h3>Find Nearest Store</h3>
      <MapContainer center={[20.5937, 78.9629]} zoom={4.5} style={{ height: '350px', width: '100%', borderRadius: '12px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {stores.map((store, idx) => (
          <Marker key={idx} position={[store.lat, store.lng]}>
            <Popup>{store.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  </div>
);

export default StoreFinderModal;
