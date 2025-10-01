import React from 'react';
import cafesData from '@/data/cafes.json';
import { Cafe } from '@/types/cafe';
import { calculateDistance } from '@/utils/distance';
import CafeCard from '@/components/CafeCard';

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

          return (
            <CafeCard
              key={cafe.id}
              cafe={cafe}
              distance={distance}
              isSelected={selectedCafe === cafe.id}
              onSelect={() => onCafeSelect?.(cafe.id)}
            />
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