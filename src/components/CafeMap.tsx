import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Coffee, Star } from 'lucide-react';
import cafesData from '@/data/cafes.json';
import { Cafe } from '@/types/cafe';

interface CafeMapProps {
  selectedCafe?: number | null;
  onCafeSelect?: (cafeId: number) => void;
}

const CafeMap: React.FC<CafeMapProps> = ({ selectedCafe, onCafeSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [cafes] = useState<Cafe[]>(cafesData as Cafe[]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isTokenSet, setIsTokenSet] = useState(false);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setUserLocation(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to San Francisco coordinates
          setUserLocation([-122.4194, 37.7749]);
        }
      );
    } else {
      // Fallback to San Francisco coordinates
      setUserLocation([-122.4194, 37.7749]);
    }
  }, []);

  // Initialize map when token is set and location is available
  useEffect(() => {
    if (!mapContainer.current || !isTokenSet || !userLocation) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: userLocation,
      zoom: 14,
      pitch: 30,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add user location marker
    const userMarkerElement = document.createElement('div');
    userMarkerElement.className = 'user-marker';
    userMarkerElement.innerHTML = `
      <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
    `;

    userMarker.current = new mapboxgl.Marker(userMarkerElement)
      .setLngLat(userLocation)
      .addTo(map.current);

    // Add cafe markers
    cafes.forEach((cafe) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'cafe-marker cursor-pointer transition-transform hover:scale-110';
      markerElement.innerHTML = `
        <div class="w-8 h-8 bg-coffee-medium rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
            <path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
      `;

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(cafe.coordinates)
        .addTo(map.current!);

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        className: 'cafe-popup'
      }).setHTML(`
        <div class="p-3">
          <h3 class="font-semibold text-coffee-bean mb-1">${cafe.name}</h3>
          <p class="text-sm text-muted-foreground mb-2">${cafe.description}</p>
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4 text-warm-orange" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span class="text-sm font-medium">${cafe.rating}</span>
          </div>
        </div>
      `);

      marker.setPopup(popup);

      // Handle marker click
      markerElement.addEventListener('click', () => {
        onCafeSelect?.(cafe.id);
      });

      markers.current[cafe.id] = marker;
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [userLocation, cafes, onCafeSelect, mapboxToken, isTokenSet]);

  // Handle selected cafe
  useEffect(() => {
    if (!map.current || !selectedCafe) return;

    const cafe = cafes.find(c => c.id === selectedCafe);
    if (cafe) {
      map.current.flyTo({
        center: cafe.coordinates,
        zoom: 16,
        duration: 1000
      });

      // Open popup for selected cafe
      const marker = markers.current[selectedCafe];
      if (marker) {
        marker.togglePopup();
      }
    }
  }, [selectedCafe, cafes]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setIsTokenSet(true);
    }
  };

  if (!isTokenSet) {
    return (
      <Card className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-md">
          <MapPin className="w-12 h-12 text-coffee-medium mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-coffee-bean mb-4">
            Enter Mapbox Token
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            To display the map, please enter your Mapbox public token. You can get one at{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-warm-orange hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <input
            type="text"
            placeholder="pk.ey..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="w-full p-3 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-warm-orange"
          />
          <button
            onClick={handleTokenSubmit}
            className="w-full bg-coffee-medium hover:bg-coffee-bean text-white py-2 px-4 rounded-lg transition-colors"
          >
            Load Map
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden shadow-lg" />
      {!userLocation && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-coffee-medium mx-auto mb-2 animate-pulse" />
            <p className="text-muted-foreground">Getting your location...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeMap;