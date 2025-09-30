# 🗺️ Find Nearby Cafes

A modern, interactive web application that helps users discover nearby cafes using real-time location tracking and an interactive map interface built with React and Leaflet.js.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-blue)

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Detailed File Explanations](#detailed-file-explanations)
- [How It Works](#how-it-works)
- [Setup Instructions](#setup-instructions)
- [Design System](#design-system)
- [State Management](#state-management)

## ✨ Features

### Core Features
- 📍 **Real-time Location Detection**: Uses browser Geolocation API to detect user's current position
- 🗺️ **Interactive Map**: Built with Leaflet.js and OpenStreetMap tiles
- ☕ **Cafe Discovery**: Displays 8 nearby cafes loaded from static JSON data
- 📌 **Custom Emoji Markers**: User location (📍) and cafe locations (☕)
- 💬 **Interactive Popups**: Click any marker to see detailed information
- 📋 **Synchronized Sidebar**: Cafe list that syncs with map interactions
- 📏 **Distance Calculation**: Shows distance from user to each cafe
- ↕️ **Smart Sorting**: Cafes automatically sorted by proximity to user

### Bonus Features
- 🎨 Modern, responsive design with coffee-inspired color palette
- ✨ Smooth animations and transitions
- 📱 Mobile-first responsive layout
- 🎯 Map panning to selected cafe locations
- 🔄 Real-time state synchronization between map and list

## 🛠 Technologies Used

- **React 18.3.1** - UI framework with functional components and hooks
- **TypeScript 5.x** - Type-safe development
- **Leaflet.js 1.9.4** - Interactive map library
- **React-Leaflet 4.2.1** - React bindings for Leaflet
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icon library
- **shadcn/ui** - High-quality UI components

## 📁 Project Structure

```
find-nearby-cafes/
├── public/
│   └── robots.txt                 # SEO robots configuration
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui component library
│   │   ├── CafeMap.tsx           # Main map component with Leaflet integration
│   │   └── CafeList.tsx          # Sidebar cafe list component
│   ├── data/
│   │   └── cafes.json            # Static cafe data (coordinates, names, ratings)
│   ├── pages/
│   │   ├── Index.tsx             # Main page component (orchestrator)
│   │   └── NotFound.tsx          # 404 error page
│   ├── types/
│   │   └── cafe.ts               # TypeScript interfaces for cafe data
│   ├── utils/
│   │   └── distance.ts           # Distance calculation utilities
│   ├── App.tsx                   # Root application component
│   ├── main.tsx                  # Application entry point
│   ├── index.css                 # Global styles and design system
│   └── vite-env.d.ts            # Vite TypeScript declarations
├── index.html                    # HTML entry point
├── tailwind.config.ts            # Tailwind CSS configuration
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## 📚 Detailed File Explanations

### Core Application Files

#### `src/main.tsx`
**Purpose**: Application entry point that mounts the React app to the DOM.

```typescript
// Creates the root React application and renders it
// Imports global styles and sets up React Router
```

**Key Responsibilities**:
- Imports global CSS styles
- Creates React root using `createRoot`
- Wraps app with `BrowserRouter` for routing
- Renders the main `App` component

---

#### `src/App.tsx`
**Purpose**: Root application component that sets up routing.

**Key Responsibilities**:
- Defines application routes using React Router
- Main route (`/`) renders the `Index` page
- Catch-all route (`*`) renders the `NotFound` page
- Provides top-level application structure

---

#### `src/pages/Index.tsx` (Main Orchestrator)
**Purpose**: Primary page component that coordinates all functionality.

**State Management**:
```typescript
const [selectedCafe, setSelectedCafe] = useState<number | null>(null);
const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
```

**Key Features**:
1. **State Coordination**: Manages shared state between map and list
2. **Cafe Selection**: Handles which cafe is currently selected
3. **Location Tracking**: Stores and propagates user location
4. **Layout Structure**: Implements responsive grid layout
   - Left sidebar (25% on desktop): `CafeList` component
   - Right main area (75% on desktop): `CafeMap` component

**Event Handlers**:
```typescript
handleCafeSelect(cafeId: number) // Toggles cafe selection
setUserLocation([lat, lng])      // Updates user location from map
```

**Component Tree**:
```
Index
├── Header (logo, title, location indicator)
├── Main Container
│   ├── CafeList (sidebar)
│   │   └── Receives: selectedCafe, userLocation
│   │   └── Emits: onCafeSelect
│   └── CafeMap (main area)
│       └── Receives: selectedCafe
│       └── Emits: onCafeSelect, onLocationUpdate
```

---

### Component Files

#### `src/components/CafeMap.tsx`
**Purpose**: Interactive Leaflet map with user location and cafe markers.

**Key Features**:

1. **Custom Emoji Markers**:
```typescript
const createEmojiIcon = (emoji: string, size: number = 30) => {
  return L.divIcon({
    html: `<div style="font-size: ${size}px; ...">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    className: 'emoji-icon'
  });
};

const userIcon = createEmojiIcon('📍', 25);  // User location
const cafeIcon = createEmojiIcon('☕', 25);  // Cafe locations
```

2. **Geolocation Detection**:
```typescript
useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setUserLocation(coords);
        onLocationUpdate?.(coords);  // Notify parent
      },
      (error) => {
        // Fallback to San Francisco coordinates
        setUserLocation([37.7749, -122.4194]);
      }
    );
  }
}, []);
```

3. **MapController Component**:
```typescript
// Internal component that handles map panning when cafe is selected
const MapController: React.FC<{selectedCafe, cafes}> = ({...}) => {
  const map = useMap();  // Access Leaflet map instance
  
  useEffect(() => {
    if (selectedCafe) {
      const cafe = cafes.find(c => c.id === selectedCafe);
      if (cafe) {
        map.setView([cafe.lat, cafe.lng], 16, {
          animate: true,
          duration: 1
        });
      }
    }
  }, [selectedCafe]);
};
```

4. **Map Structure**:
```typescript
<MapContainer center={userLocation} zoom={14}>
  <TileLayer url="https://.../openstreetmap.org/..." />
  
  {/* User marker */}
  <Marker position={userLocation} icon={userIcon}>
    <Popup>📍 You are here</Popup>
  </Marker>
  
  {/* Cafe markers */}
  {cafes.map(cafe => (
    <Marker 
      position={[cafe.lat, cafe.lng]} 
      icon={cafeIcon}
      eventHandlers={{click: () => onCafeSelect(cafe.id)}}
    >
      <Popup>{cafe.name}, {cafe.rating}⭐</Popup>
    </Marker>
  ))}
  
  <MapController selectedCafe={selectedCafe} cafes={cafes} />
</MapContainer>
```

**Props Interface**:
```typescript
interface CafeMapProps {
  selectedCafe?: number | null;           // Currently selected cafe ID
  onCafeSelect?: (cafeId: number) => void; // Callback when cafe clicked
  onLocationUpdate?: (location: [number, number]) => void; // Send location to parent
}
```

---

#### `src/components/CafeList.tsx`
**Purpose**: Sidebar displaying sorted list of nearby cafes.

**Key Features**:

1. **Distance-Based Sorting**:
```typescript
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
```

2. **Interactive Cards**:
```typescript
<Card
  className={`cursor-pointer transition-all ${
    selectedCafe === cafe.id 
      ? 'ring-2 ring-warm-orange bg-gradient-to-br scale-[1.02]' 
      : 'hover:bg-gradient-to-br hover:shadow-lg'
  }`}
  onClick={() => onCafeSelect?.(cafe.id)}
>
  {/* Cafe details */}
</Card>
```

3. **Information Display**:
   - Cafe name with ☕ emoji
   - Description text
   - Rating (⭐)
   - Distance from user (calculated in real-time)
   - "Open now" status indicator
   - Selection status badge

4. **Custom Scrollbar**:
```css
.cafe-list::-webkit-scrollbar {
  width: 6px;
}
.cafe-list::-webkit-scrollbar-thumb {
  background: hsl(var(--coffee-light));
  border-radius: 3px;
}
```

**Props Interface**:
```typescript
interface CafeListProps {
  selectedCafe?: number | null;
  onCafeSelect?: (cafeId: number) => void;
  userLocation?: [number, number] | null;
}
```

---

### Data & Type Files

#### `src/data/cafes.json`
**Purpose**: Static database of cafe locations and information.

**Data Structure**:
```json
[
  {
    "id": 1,
    "name": "Blue Bottle Coffee",
    "coordinates": [-122.4012, 37.7897],  // [longitude, latitude]
    "description": "Artisanal coffee in a minimalist space",
    "rating": 4.5
  },
  // ... 7 more cafes
]
```

**Fields Explained**:
- `id`: Unique identifier for each cafe (used for selection tracking)
- `name`: Display name of the cafe
- `coordinates`: [longitude, latitude] array for map positioning
- `description`: Short description displayed in popups and cards
- `rating`: Numerical rating (0-5 scale)

---

#### `src/types/cafe.ts`
**Purpose**: TypeScript interface definitions for type safety.

```typescript
export interface Cafe {
  id: number;
  name: string;
  coordinates: [number, number];  // [longitude, latitude]
  description: string;
  rating: number;
}
```

**Benefits**:
- Compile-time type checking
- IntelliSense autocomplete in IDEs
- Prevents runtime errors from incorrect data structures
- Documents expected data shape

---

### Utility Files

#### `src/utils/distance.ts`
**Purpose**: Calculate and format distances between coordinates.

**Haversine Formula Implementation**:
```typescript
export const calculateDistance = (
  lat1: number,  // User latitude
  lon1: number,  // User longitude
  lat2: number,  // Cafe latitude
  lon2: number   // Cafe longitude
): number => {
  const R = 6371; // Earth's radius in kilometers
  
  // Convert degrees to radians
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  // Haversine formula
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * 
    Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimals
};
```

**Distance Formatting**:
```typescript
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;  // Show meters
  }
  return `${distance}km`;  // Show kilometers
};
```

**Usage Example**:
```typescript
const distance = calculateDistance(37.7749, -122.4194, 37.7897, -122.4012);
// Result: 1.23 km

const formatted = formatDistance(distance);
// Result: "1.23km"
```

---

### Style & Configuration Files

#### `src/index.css`
**Purpose**: Global styles and design system tokens.

**Key Sections**:

1. **CSS Custom Properties (Design Tokens)**:
```css
:root {
  /* Coffee-inspired color palette */
  --coffee-bean: 30 20% 20%;      /* Dark brown */
  --coffee-medium: 30 30% 40%;    /* Medium brown */
  --coffee-light: 30 35% 75%;     /* Light brown */
  --warm-orange: 25 95% 53%;      /* Accent orange */
  --cream: 40 60% 95%;            /* Light cream */
  
  /* Semantic tokens */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --primary: 30 20% 20%;          /* Maps to coffee-bean */
  
  /* Shadows */
  --shadow-elevation: 0 4px 20px rgba(0, 0, 0, 0.08);
}
```

2. **Dark Mode Support**:
```css
.dark {
  --background: 30 15% 12%;
  --foreground: 40 60% 95%;
  /* ... other dark mode tokens */
}
```

3. **Custom Animations**:
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

4. **Leaflet Map Customization**:
```css
.leaflet-popup-content-wrapper {
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.emoji-icon {
  background: transparent !important;
  border: none !important;
  transition: transform 0.3s ease;
}

.emoji-icon:hover {
  transform: scale(1.2);
}
```

---

#### `tailwind.config.ts`
**Purpose**: Tailwind CSS configuration with custom theme extensions.

```typescript
export default {
  theme: {
    extend: {
      colors: {
        // Coffee color palette
        'coffee-bean': 'hsl(var(--coffee-bean))',
        'coffee-medium': 'hsl(var(--coffee-medium))',
        'coffee-light': 'hsl(var(--coffee-light))',
        'warm-orange': 'hsl(var(--warm-orange))',
        'warm-amber': 'hsl(var(--warm-amber))',
        'cream': 'hsl(var(--cream))',
        
        // Semantic colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ... other semantic tokens
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'elevation': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'bounce-in': 'bounce-in 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
}
```

---

#### `index.html`
**Purpose**: HTML entry point with SEO optimization.

**Key Elements**:

1. **Meta Tags for SEO**:
```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Find Nearby Cafes | Discover Coffee Spots Around You</title>
<meta name="description" content="Find nearby cafes with real-time location tracking..." />
```

2. **Google Fonts Import**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" />
```

3. **Leaflet CSS**:
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
```

---

## 🔄 How It Works

### Application Flow

1. **Initial Load**:
```
User visits app
    ↓
Index.tsx renders
    ↓
CafeMap.tsx mounts
    ↓
Geolocation API request
    ↓
User grants/denies permission
    ↓
If granted: Use real coordinates
If denied: Fallback to San Francisco (37.7749, -122.4194)
    ↓
Update userLocation state in Index.tsx
    ↓
Pass location to CafeList.tsx
    ↓
CafeList calculates distances & sorts cafes
    ↓
Both components render with user location
```

2. **User Interaction Flow - Clicking Cafe on Map**:
```
User clicks cafe marker on map
    ↓
CafeMap's Marker eventHandlers.click fires
    ↓
onCafeSelect(cafeId) called
    ↓
Index.tsx updates selectedCafe state
    ↓
State flows down to both components
    ↓
CafeList highlights selected cafe card
CafeMap's MapController pans to cafe location
    ↓
Map smoothly animates to cafe
Popup opens automatically
```

3. **User Interaction Flow - Clicking Cafe in List**:
```
User clicks cafe card in sidebar
    ↓
CafeList's Card onClick fires
    ↓
onCafeSelect(cafeId) called
    ↓
Index.tsx updates selectedCafe state
    ↓
State flows down to CafeMap
    ↓
MapController detects selectedCafe change
    ↓
map.setView() animates to cafe location
Card in list shows selected styling
```

### State Management Architecture

```
┌─────────────────────────────────────────────┐
│            Index.tsx (Parent)               │
│                                             │
│  State:                                     │
│  • selectedCafe: number | null              │
│  • userLocation: [lat, lng] | null          │
│                                             │
│  Handlers:                                  │
│  • handleCafeSelect(id)                     │
│  • setUserLocation([lat, lng])              │
└─────────────┬───────────────────┬───────────┘
              │                   │
     ┌────────▼────────┐    ┌────▼─────────┐
     │   CafeList      │    │   CafeMap    │
     │                 │    │              │
     │ Props:          │    │ Props:       │
     │ • selectedCafe  │    │ • selectedCafe│
     │ • userLocation  │    │              │
     │ • onCafeSelect  │    │ Emits:       │
     │                 │    │ • onCafeSelect│
     │                 │    │ • onLocationUpdate│
     └─────────────────┘    └──────────────┘
```

### Distance Calculation Flow

```
User location detected: [37.7749, -122.4194]
    ↓
For each cafe in cafes.json:
    ↓
Extract cafe coordinates: [37.7897, -122.4012]
    ↓
Call calculateDistance(userLat, userLon, cafeLat, cafeLon)
    ↓
Apply Haversine formula:
  1. Convert degrees to radians
  2. Calculate angular distance
  3. Multiply by Earth's radius (6371 km)
    ↓
Result: 1.23 km
    ↓
Store distance with cafe object
    ↓
Sort all cafes by distance (ascending)
    ↓
Render sorted list in CafeList component
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm installed
- Modern web browser with Geolocation API support

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd find-nearby-cafes
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

4. **Open in browser**:
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

---

## 🎨 Design System

### Color Palette

| Token | HSL Value | Usage | Hex |
|-------|-----------|-------|-----|
| `--coffee-bean` | 30 20% 20% | Primary text, headers | `#3D2F2F` |
| `--coffee-medium` | 30 30% 40% | Secondary text | `#735645` |
| `--coffee-light` | 30 35% 75% | Borders, dividers | `#C9B5A0` |
| `--warm-orange` | 25 95% 53% | Accent, CTAs | `#FA6B0E` |
| `--cream` | 40 60% 95% | Backgrounds | `#F9F5F0` |

### Typography

- **Headings**: `Playfair Display` (serif)
- **Body**: `Inter` (sans-serif)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing Scale

Following Tailwind's default spacing scale (4px base):
- `gap-2` = 8px
- `gap-4` = 16px
- `gap-8` = 32px
- `p-4` = 16px padding
- `p-6` = 24px padding

---

## 🧩 State Management

### Approach
This project uses **React Hooks** for state management:

- `useState`: Local component state
- `useEffect`: Side effects (geolocation, map updates)
- `useMap`: Leaflet-specific hook for map instance access

### State Flow Pattern

**Lifting State Up**: Shared state (selectedCafe, userLocation) is lifted to the nearest common ancestor (Index.tsx) and passed down via props.

**Event Callbacks**: Child components communicate with parent through callback props:
- `onCafeSelect(id)`: Notify parent of selection
- `onLocationUpdate(coords)`: Send location to parent

This pattern ensures:
- ✅ Single source of truth
- ✅ Unidirectional data flow
- ✅ Easy debugging
- ✅ Predictable state updates

---

## 🧪 Testing Considerations

### Manual Testing Checklist

1. **Geolocation**:
   - [ ] Allow location → Map centers on user
   - [ ] Deny location → Fallback to San Francisco
   - [ ] User marker (📍) visible on map

2. **Cafe Markers**:
   - [ ] All 8 cafes displayed with ☕ emoji
   - [ ] Click marker → Popup opens with cafe details
   - [ ] Hover marker → Emoji scales up

3. **Cafe List**:
   - [ ] Cafes sorted by distance (closest first)
   - [ ] Distance displayed correctly (m/km)
   - [ ] Click cafe → Map pans and highlights
   - [ ] Selected cafe has orange border

4. **Synchronization**:
   - [ ] Select cafe on map → List highlights same cafe
   - [ ] Select cafe in list → Map pans to location
   - [ ] Click same cafe again → Deselects

5. **Responsive Design**:
   - [ ] Desktop: Sidebar + Map side-by-side
   - [ ] Mobile: Stacked layout
   - [ ] All touch interactions work

### Automated Testing Ideas

```typescript
// Example test for distance calculation
import { calculateDistance, formatDistance } from '@/utils/distance';

describe('Distance utilities', () => {
  test('calculates distance between SF and Oakland', () => {
    const distance = calculateDistance(37.7749, -122.4194, 37.8044, -122.2712);
    expect(distance).toBeCloseTo(13.6, 1);
  });
  
  test('formats distance under 1km as meters', () => {
    expect(formatDistance(0.5)).toBe('500m');
  });
  
  test('formats distance over 1km as kilometers', () => {
    expect(formatDistance(2.34)).toBe('2.34km');
  });
});
```

---

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Requires HTTPS for Geolocation API (or localhost)

---

## 🔐 Privacy & Security

- **Geolocation**: Used only for displaying nearby cafes, never stored or transmitted
- **No Backend**: All data processing happens client-side
- **No Tracking**: No analytics or user tracking implemented
- **Static Data**: Cafe information hardcoded in JSON file

---

## 🚀 Deployment

### Deploy with Lovable

Click **Publish** in the Lovable editor to deploy instantly.

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to any static host (Vercel, Netlify, GitHub Pages)
```

---

## 📈 Future Enhancements

Potential features to add:

- [ ] Search/filter cafes by name
- [ ] Filter by rating or open hours
- [ ] User reviews and ratings
- [ ] Directions to selected cafe
- [ ] Save favorite cafes (requires backend)
- [ ] Real-time cafe data from API
- [ ] Clustering for large numbers of cafes
- [ ] Street view integration
- [ ] Social sharing features

---

## 📄 License

This project is part of the Lovable platform.

**Project URL**: https://lovable.dev/projects/3e15ff3b-6800-4fc3-a755-589dcfbef22e

---

## 🙋‍♂️ Support

For help with Lovable features:
- [Lovable Documentation](https://docs.lovable.dev/)
- [Lovable Discord Community](https://discord.gg/lovable)

For technical issues:
- Check browser console for errors
- Verify Geolocation permissions
- Ensure HTTPS connection (required for Geolocation API)

---

## 🎯 Learning Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [Leaflet.js Documentation](https://leafletjs.com/)
- [React-Leaflet Documentation](https://react-leaflet.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

---

Made with ☕ and React
