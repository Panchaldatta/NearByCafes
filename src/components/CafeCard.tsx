import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Cafe } from '@/types/cafe';
import { formatDistance } from '@/utils/distance';

interface CafeCardProps {
  cafe: Cafe;
  distance: number | null;
  isSelected: boolean;
  onSelect: () => void;
}

const CafeCard: React.FC<CafeCardProps> = ({ cafe, distance, isSelected, onSelect }) => {
  return (
    <button
      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-muted shadow-sm' 
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      }`}
      onClick={onSelect}
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
};

export default CafeCard;
