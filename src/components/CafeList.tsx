import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin } from 'lucide-react';
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
    <div className="h-full flex flex-col">
      <div className="mb-4 pb-3 border-b border-border">
        <h2 className="text-sm font-semibold tracking-tight mb-1">
          Nearby Cafes
        </h2>
        <p className="text-xs text-muted-foreground">
          {sortedCafes.length} locations
        </p>
      </div>
      
      <div className="flex-1 space-y-2 overflow-y-auto pr-1 cafe-list">
        {sortedCafes.map((cafe) => {
          const distance = userLocation 
            ? calculateDistance(
                userLocation[0], userLocation[1],
                cafe.coordinates[1], cafe.coordinates[0]
              )
            : null;

          const isSelected = selectedCafe === cafe.id;

          return (
            <button
              key={cafe.id}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-muted shadow-sm' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
              onClick={() => onCafeSelect?.(cafe.id)}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-medium text-sm leading-tight">
                  {cafe.name}
                </h3>
                {distance && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistance(distance)}
                  </span>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {cafe.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs">⭐</span>
                    <span className="text-xs font-medium">
                      {cafe.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">Open</span>
                  </div>
                </div>
                
                {isSelected && (
                  <span className="flex items-center gap-1 text-xs text-primary">
                    <MapPin className="w-3 h-3" />
                    Selected
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Custom scrollbar styles */}
      <style>{`
        .cafe-list::-webkit-scrollbar {
          width: 4px;
        }
        .cafe-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .cafe-list::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 2px;
        }
        .cafe-list::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
};

export default CafeList;