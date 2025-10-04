# Find Nearby Cafes

A React-based web application that helps users discover local cafes near Bund Garden, Pune, India using an interactive map and real-time location detection.

## Features

- 🗺️ Interactive map with custom emoji markers using Leaflet.js
- 📍 Real-time user location detection
- ☕ List of 15 cafes sorted by proximity to user's location
- 🎯 Click on map markers or list items to highlight cafes
- 📱 Fully responsive design with smooth animations
- ⭐ Cafe ratings and descriptions

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Map Library**: Leaflet.js, React-Leaflet
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: shadcn/ui
- **Build Tool**: Vite
- **Routing**: React Router DOM

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd find-nearby-cafes
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
bun run dev
```

4. Open your browser and navigate to:
```
http://localhost:8080
```

### Build for Production

```bash
npm run build
# or
bun run build
```

The production build will be available in the `dist` directory.

## Running Test Cases

### Manual Testing Checklist

1. **Location Detection**:
   - Allow browser location access
   - Verify user marker appears on map
   - Check that location indicator shows in header

2. **Cafe List**:
   - Verify cafes are sorted by distance from user
   - Check that distance calculations are accurate
   - Confirm all cafe information displays correctly

3. **Map Interaction**:
   - Click on cafe markers - popup should appear
   - Click on list items - map should center on cafe
   - Verify smooth transitions and animations

4. **Responsive Design**:
   - Test on mobile devices (< 768px)
   - Test on tablets (768px - 1024px)
   - Test on desktop (> 1024px)

### Automated Tests

To run the distance calculation utility tests:

```bash
npm run test
# or
bun test
```

Example test for the Haversine formula implementation:

```typescript
import { calculateDistance, formatDistance } from './src/utils/distance';

describe('Distance Calculation', () => {
  test('calculates distance between two points correctly', () => {
    const distance = calculateDistance(
      18.5204, 73.8567,  // Bund Garden, Pune
      18.5314, 73.8446   // Koregaon Park
    );
    expect(distance).toBeCloseTo(1.8, 1);
  });

  test('formats distance correctly', () => {
    expect(formatDistance(0.5)).toBe('500m');
    expect(formatDistance(1.5)).toBe('1.5km');
  });
});
```

## Project Structure

```
src/
├── components/
│   ├── CafeCard.tsx         # Individual cafe display component
│   ├── CafeList.tsx         # List of all cafes sorted by distance
│   ├── CafeMap.tsx          # Interactive Leaflet map component
│   └── ui/                  # shadcn/ui components
├── hooks/
│   ├── useGeolocation.tsx   # Custom hook for user location
│   └── useCafeSelection.tsx # Custom hook for cafe selection state
├── pages/
│   ├── Index.tsx            # Main page component
│   └── NotFound.tsx         # 404 error page
├── data/
│   └── cafes.json           # Cafe data (15 cafes near Bund Garden, Pune)
├── types/
│   └── cafe.ts              # TypeScript interfaces
├── utils/
│   └── distance.ts          # Haversine formula for distance calculation
└── App.tsx                  # Root component with routing
```

## Design Choices & Assumptions

### State Management
- **Lifting State Up Pattern**: Used React's built-in hooks (`useState`, `useEffect`) instead of external state management libraries for simplicity
- **Custom Hooks**: Created `useGeolocation` and `useCafeSelection` to encapsulate reusable logic and separate concerns

### Location Data
- **Coordinates Format**: Stored as `[longitude, latitude]` to match GeoJSON standard
- **Default Location**: Falls back to Bund Garden, Pune (18.5204, 73.8567) if geolocation is denied
- **Distance Calculation**: Uses Haversine formula for accurate great-circle distance between coordinates

### Map Implementation
- **Leaflet.js**: Chosen for its lightweight footprint and extensive documentation
- **OpenStreetMap Tiles**: Free, open-source map tiles without API key requirements
- **Custom Markers**: Emoji-based icons (📍 for user, ☕ for cafes) for visual appeal

### Component Architecture
- **CafeCard**: Reusable component for consistent cafe display in both list and map
- **Modular Components**: Separated concerns (map, list, card) for better maintainability
- **TypeScript**: Strict typing for better developer experience and fewer runtime errors

### Performance Optimizations
- **Memoization**: Distance calculations are performed once during sorting
- **Conditional Rendering**: Map only renders after location is detected
- **Lazy Loading**: Routes are loaded on demand

### Styling
- **Tailwind CSS**: Utility-first approach for rapid development
- **Coffee Theme**: Warm browns and creams inspired by coffee culture
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 1024px
- **Smooth Animations**: CSS transitions for better user experience

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Requires geolocation API support

### Privacy & Security
- Location data never leaves the client
- No external API calls for cafe data
- No user tracking or analytics

## Future Enhancements

- Add search/filter functionality
- Integrate user reviews and photos
- Add directions to cafes
- Implement cafe opening hours
- Add real-time cafe data from external APIs
- Support for multiple cities

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
