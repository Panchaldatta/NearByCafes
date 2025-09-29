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
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
        <Coffee className="w-5 h-5 text-coffee-medium" />
        <h2 className="text-lg font-semibold text-coffee-bean">
          Nearby Cafes ({cafes.length})
        </h2>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto pr-2">{/* Custom scrollbar styles */}
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
        {cafes.map((cafe) => (
          <Card
            key={cafe.id}
            className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md border rounded-xl ${
              selectedCafe === cafe.id 
                ? 'ring-2 ring-warm-orange bg-warm-orange/10 border-warm-orange/30 shadow-lg' 
                : 'hover:bg-accent/30 border-border/50 hover:border-coffee-light/50'
            }`}
            onClick={() => onCafeSelect?.(cafe.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">☕</span>
                  <h3 className="font-semibold text-coffee-bean">
                    {cafe.name}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {cafe.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-warm-orange">⭐</span>
                    <span className="text-sm font-medium text-coffee-medium">
                      {cafe.rating}
                    </span>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className={`text-xs transition-colors ${
                      selectedCafe === cafe.id 
                        ? 'bg-warm-orange/20 text-warm-orange border-warm-orange/30' 
                        : 'bg-coffee-light/20 text-coffee-medium hover:bg-coffee-light/30'
                    }`}
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedCafe === cafe.id ? 'Selected' : 'View on map'}
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