import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Coffee, MapPin, Sparkles } from 'lucide-react';
import CafeMap from '@/components/CafeMap';
import CafeList from '@/components/CafeList';

const Index = () => {
  const [selectedCafe, setSelectedCafe] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const handleCafeSelect = (cafeId: number) => {
    setSelectedCafe(selectedCafe === cafeId ? null : cafeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-coffee-light/10">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-coffee-bean via-coffee-medium to-warm-orange rounded-2xl shadow-lg">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-warm-orange rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-coffee-bean font-display">
                  Find Nearby Cafes
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span>Discover amazing coffee spots around you</span>
                  <span className="animate-bounce">☕</span>
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Real-time location tracking</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8 h-[calc(100vh-180px)]">
          {/* Cafe List Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-gradient-to-br from-card/90 to-cream/30 backdrop-blur-md border border-border/30 shadow-elevation rounded-2xl overflow-hidden">
              <div className="p-6 h-full">
                <CafeList 
                  selectedCafe={selectedCafe}
                  onCafeSelect={handleCafeSelect}
                  userLocation={userLocation}
                />
              </div>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="h-full bg-gradient-to-br from-card/90 to-cream/30 backdrop-blur-md border border-border/30 shadow-elevation rounded-2xl overflow-hidden">
              <div className="p-6 h-full">
                <CafeMap 
                  selectedCafe={selectedCafe}
                  onCafeSelect={handleCafeSelect}
                  onLocationUpdate={setUserLocation}
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
