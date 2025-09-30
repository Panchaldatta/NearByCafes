import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Coffee, MapPin } from 'lucide-react';
import CafeMap from '@/components/CafeMap';
import CafeList from '@/components/CafeList';

const Index = () => {
  const [selectedCafe, setSelectedCafe] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const handleCafeSelect = (cafeId: number) => {
    setSelectedCafe(selectedCafe === cafeId ? null : cafeId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Coffee className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  Find Nearby Cafes
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Discover coffee spots around you
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-xs">Location enabled</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6 h-[calc(100vh-120px)]">
          {/* Cafe List Sidebar */}
          <div className="lg:block">
            <Card className="h-full border-border shadow-sm overflow-hidden">
              <div className="p-4 h-full">
                <CafeList 
                  selectedCafe={selectedCafe}
                  onCafeSelect={handleCafeSelect}
                  userLocation={userLocation}
                />
              </div>
            </Card>
          </div>

          {/* Map */}
          <div>
            <Card className="h-full border-border shadow-sm overflow-hidden">
              <CafeMap 
                selectedCafe={selectedCafe}
                onCafeSelect={handleCafeSelect}
                onLocationUpdate={setUserLocation}
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
