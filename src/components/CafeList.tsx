import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, MapPin, Clock } from 'lucide-react';
import cafesData from '@/data/cafes.json';
import { Cafe } from '@/types/cafe';
import { calculateDistance, formatDistance } from '@/utils/distance';

interface CafeListProps {
  selectedCafe?: number | null;
  onCafeSelect?: (cafeId: number) => void;
  userLocation?: [number, number] | null;
}

const CafeList: React.FC<CafeListProps> = ({ selectedCafe, onCafeSelect, userLocation }) => {
  const cafes: Cafe[] = cafesData as Cafe[];

  // Sort cafes by distance if user location is available
  const sortedCafes = userLocation 
    ? [...cafes].sort((a, b) => {
        const distanceA = calculateDistance(
          userLocation[0], userLocation[1],
          a.coordinates[1], a.coordinates[0]
        );
        const distanceB = calculateDistance(
          userLocation[0], userLocation[1],
          b.coordinates[1], b.coordinates[0]
        );
        return distanceA - distanceB;
      })
    : cafes;

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-coffee-medium to-warm-orange rounded-lg">
          <Coffee className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-coffee-bean font-display">
            Nearby Cafes
          </h2>
          <p className="text-sm text-muted-foreground">
            {sortedCafes.length} places to discover
          </p>
        </div>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto pr-2 cafe-list">
        {sortedCafes.map((cafe, index) => {
          const distance = userLocation 
            ? calculateDistance(
                userLocation[0], userLocation[1],
                cafe.coordinates[1], cafe.coordinates[0]
              )
            : null;

          return (
            <Card
              key={cafe.id}
              className={`group p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border rounded-xl animate-slide-up ${
                selectedCafe === cafe.id 
                  ? 'ring-2 ring-warm-orange bg-gradient-to-br from-warm-orange/10 to-warm-amber/5 border-warm-orange/30 shadow-lg scale-[1.02]' 
                  : 'hover:bg-gradient-to-br hover:from-card hover:to-cream/50 border-border/50 hover:border-coffee-light/50 hover:shadow-elevation'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onCafeSelect?.(cafe.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl group-hover:animate-bounce">☕</span>
                    <h3 className="font-semibold text-coffee-bean font-display">
                      {cafe.name}
                    </h3>
                    {distance && (
                      <Badge variant="secondary" className="text-xs bg-coffee-light/20 text-coffee-medium">
                        {formatDistance(distance)}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {cafe.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-warm-orange">⭐</span>
                        <span className="text-sm font-medium text-coffee-medium">
                          {cafe.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">Open now</span>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="secondary" 
                      className={`text-xs transition-all duration-300 ${
                        selectedCafe === cafe.id 
                          ? 'bg-warm-orange/20 text-warm-orange border-warm-orange/30' 
                          : 'bg-coffee-light/20 text-coffee-medium hover:bg-coffee-light/30 group-hover:bg-warm-orange/10 group-hover:text-warm-orange'
                      }`}
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      {selectedCafe === cafe.id ? 'Selected' : 'View on map'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {/* Custom scrollbar styles */}
      <style>{`
        .cafe-list::-webkit-scrollbar {
          width: 6px;
        }
        .cafe-list::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 3px;
        }
        .cafe-list::-webkit-scrollbar-thumb {
          background: hsl(var(--coffee-light));
          border-radius: 3px;
        }
        .cafe-list::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--coffee-medium));
        }
      `}</style>
    </div>
  );
};

export default CafeList;