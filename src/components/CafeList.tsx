import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, Star, MapPin } from 'lucide-react';
import cafesData from '@/data/cafes.json';
import { Cafe } from '@/types/cafe';

interface CafeListProps {
  selectedCafe?: number | null;
  onCafeSelect?: (cafeId: number) => void;
}

const CafeList: React.FC<CafeListProps> = ({ selectedCafe, onCafeSelect }) => {
  const cafes: Cafe[] = cafesData as Cafe[];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Coffee className="w-5 h-5 text-coffee-medium" />
        <h2 className="text-lg font-semibold text-coffee-bean">
          Nearby Cafes ({cafes.length})
        </h2>
      </div>
      
      <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {cafes.map((cafe) => (
          <Card
            key={cafe.id}
            className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedCafe === cafe.id 
                ? 'ring-2 ring-warm-orange bg-accent/50' 
                : 'hover:bg-accent/30'
            }`}
            onClick={() => onCafeSelect?.(cafe.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-coffee-bean mb-1">
                  {cafe.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {cafe.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warm-orange fill-current" />
                    <span className="text-sm font-medium text-coffee-medium">
                      {cafe.rating}
                    </span>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-coffee-light/20 text-coffee-medium hover:bg-coffee-light/30"
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    View on map
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CafeList;