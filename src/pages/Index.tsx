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
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-coffee-medium to-warm-orange rounded-xl shadow-sm">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-coffee-bean">
                Find Nearby Cafes
              </h1>
              <p className="text-sm text-muted-foreground">
                Discover amazing coffee spots around you ☕
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-160px)]">
          {/* Cafe List Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-xl rounded-xl overflow-hidden">
              <div className="p-4 h-full">
                <CafeList 
                  selectedCafe={selectedCafe}
                  onCafeSelect={handleCafeSelect}
                />
              </div>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="h-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-xl rounded-xl overflow-hidden">
              <div className="p-4 h-full">
                <CafeMap 
                  selectedCafe={selectedCafe}
                  onCafeSelect={handleCafeSelect}
                />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
