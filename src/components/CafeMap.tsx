import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import cafesData from '@/data/cafes.json';
import { Cafe } from '@/types/cafe';

// Custom emoji icons
const createEmojiIcon = (emoji: string, size: number = 30) => {
  return L.divIcon({
    html: `<div style="font-size: ${size}px; text-align: center; line-height: ${size}px;">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    className: 'emoji-icon'
  });
};

const userIcon = createEmojiIcon('📍', 25);
const cafeIcon = createEmojiIcon('☕', 25);

// Component to handle map events and updates
const MapController: React.FC<{
  selectedCafe: number | null;
  cafes: Cafe[];
}> = ({ selectedCafe, cafes }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCafe) {
      const cafe = cafes.find(c => c.id === selectedCafe);
      if (cafe) {
        map.setView([cafe.coordinates[1], cafe.coordinates[0]], 16, {
          animate: true,
          duration: 1
        });
      }
    }
  }, [selectedCafe, cafes, map]);

  return null;
};

interface CafeMapProps {
  selectedCafe?: number | null;
  onCafeSelect?: (cafeId: number) => void;
  onLocationUpdate?: (location: [number, number]) => void;
}

const CafeMap: React.FC<CafeMapProps> = ({ selectedCafe, onCafeSelect, onLocationUpdate }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [cafes] = useState<Cafe[]>(cafesData as Cafe[]);
  const [isLoading, setIsLoading] = useState(true);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setUserLocation(coords);
          onLocationUpdate?.(coords);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to San Francisco coordinates
          setUserLocation([37.7749, -122.4194]);
          onLocationUpdate?.([37.7749, -122.4194]);
          setIsLoading(false);
        }
      );
    } else {
      // Fallback to San Francisco coordinates
      setUserLocation([37.7749, -122.4194]);
      onLocationUpdate?.([37.7749, -122.4194]);
      setIsLoading(false);
    }
  }, []);

  if (isLoading || !userLocation) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground">Detecting location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <MapContainer
        center={userLocation}
        zoom={14}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            <div className="p-3 min-w-[180px]">
              <div className="font-medium text-sm mb-1">Your Location</div>
              <div className="text-xs text-muted-foreground">📍 You are here</div>
            </div>
          </Popup>
        </Marker>

        {/* Cafe markers */}
        {cafes.map((cafe) => (
          <Marker
            key={cafe.id}
            position={[cafe.coordinates[1], cafe.coordinates[0]]}
            icon={cafeIcon}
            eventHandlers={{
              click: () => onCafeSelect?.(cafe.id)
            }}
          >
            <Popup>
              <div className="p-3 min-w-[200px]">
                <h3 className="font-medium text-sm mb-2">{cafe.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  {cafe.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <span>⭐</span>
                    <span className="font-medium">{cafe.rating}</span>
                  </div>
                  <span className="text-muted-foreground">Open now</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Map controller for handling selected cafe */}
        <MapController selectedCafe={selectedCafe} cafes={cafes} />
      </MapContainer>
    </div>
  );
};

export default CafeMap;