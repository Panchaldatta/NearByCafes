import { useState } from 'react';

export const useCafeSelection = () => {
  const [selectedCafe, setSelectedCafe] = useState<number | null>(null);

  const handleCafeSelect = (cafeId: number) => {
    setSelectedCafe(selectedCafe === cafeId ? null : cafeId);
  };

  return { selectedCafe, handleCafeSelect };
};
