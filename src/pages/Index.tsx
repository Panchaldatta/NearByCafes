import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Coffee, MapPin } from 'lucide-react';
import CafeMap from '@/components/CafeMap';
import CafeList from '@/components/CafeList';

const Index = () => {
  const [selectedCafe, setSelectedCafe] = useState<number | null>(null);

  const handleCafeSelect = (cafeId: number) => {
    setSelectedCafe(selectedCafe === cafeId ? null : cafeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-coffee-medium to-warm-orange rounded-lg">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-coffee-bean">
                Find Nearby Cafes
              </h1>
              <p className="text-sm text-muted-foreground">
                Discover amazing coffee spots around you
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Cafe List */}
          <div className="lg:col-span-1">
            <Card className="h-full p-4 bg-card/50 backdrop-blur-sm">
              <CafeList 
                selectedCafe={selectedCafe}
                onCafeSelect={handleCafeSelect}
              />
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="h-full p-4 bg-card/50 backdrop-blur-sm">
              <CafeMap 
                selectedCafe={selectedCafe}
                onCafeSelect={handleCafeSelect}
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
