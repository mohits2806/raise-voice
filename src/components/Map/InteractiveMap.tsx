"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { IIssue } from "@/types";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  ISSUE_CATEGORIES,
} from "@/lib/constants";
import LocationButton from "./LocationButton";

// Search suggestion interface
interface SearchSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// Search Bar Component with Autocomplete
function SearchBar({ onSearch }: { onSearch: (lat: number, lng: number, displayName: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      setSuggestions(data || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Suggestion error:", err);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setError(null);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer (300ms)
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch(parseFloat(suggestion.lat), parseFloat(suggestion.lon), suggestion.display_name);
  };

  // Handle search button click
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    setSuggestions([]);
    setShowSuggestions(false);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        onSearch(parseFloat(lat), parseFloat(lon), display_name);
      } else {
        setError("Location not found. Try a different search.");
      }
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, onSearch]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div ref={searchContainerRef} className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-[95%] max-w-3xl">
      <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Search Icon */}
        <div className="pl-4 pr-2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className="flex-1 py-3 px-2 text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
          disabled={isSearching}
        />

        {/* Loading indicator for suggestions */}
        {isLoadingSuggestions && (
          <div className="pr-2">
            <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSearching ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Search"
          )}
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-64 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 flex items-start gap-3"
            >
              <span className="text-blue-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span className="text-sm text-gray-700 line-clamp-2">{suggestion.display_name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

// Component to handle search location navigation
function SearchLocationController({ searchLocation }: { searchLocation: { lat: number; lng: number } | null }) {
  const map = useMap();

  useEffect(() => {
    if (searchLocation && map) {
      map.flyTo([searchLocation.lat, searchLocation.lng], 12, {
        duration: 1.5,
        easeLinearity: 0.5,
      });
    }
  }, [searchLocation, map]);

  return null;
}

interface InteractiveMapProps {
  issues: IIssue[];
  onMapClick?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  userLocation?: { lat: number; lng: number } | null;
  initialCenter?: { lat: number; lng: number };
  height?: string;
}

// Fix Leaflet default marker icon issue
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

// Create custom marker icons based on issue status
const createCustomIcon = (category: string, status: string) => {
  const categoryData = ISSUE_CATEGORIES.find((c) => c.value === category);
  const color =
    status === "resolved"
      ? "#10b981"
      : status === "in-progress"
        ? "#f59e0b"
        : "#ef4444";

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative;">
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 16px;">
            ${categoryData?.icon || "📍"}
          </span>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Create user location marker icon
const createUserLocationIcon = () => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative;">
        <div style="
          background-color: #3b82f6;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(59, 130, 246, 0.2);
          animation: pulse 2s infinite;
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

// Create search location marker icon
const createSearchMarkerIcon = () => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative;">
        <div style="
          background-color: #8b5cf6;
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 3px 10px rgba(139, 92, 246, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 16px;">🔍</span>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

function MapClickHandler({
  onClick,
}: {
  onClick?: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      if (onClick) {
        onClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// Component to handle map panning
function MapController({
  userLocation,
  shouldCenter,
}: {
  userLocation: { lat: number; lng: number } | null | undefined;
  shouldCenter: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (shouldCenter && userLocation && map) {
      // Wait for map to be ready before flying
      map.whenReady(() => {
        try {
          map.flyTo([userLocation.lat, userLocation.lng], 15, {
            duration: 1.5,
            easeLinearity: 0.5,
          });
        } catch (error) {
          console.error("Error flying to location:", error);
        }
      });
    }
  }, [shouldCenter, userLocation, map]);

  return null;
}

export default function InteractiveMap({
  issues,
  onMapClick,
  selectedLocation,
  userLocation,
  initialCenter,
  height = "600px",
}: InteractiveMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [shouldCenterOnUser, setShouldCenterOnUser] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [hasCenteredOnce, setHasCenteredOnce] = useState(false);
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchMarkerLocation, setSearchMarkerLocation] = useState<{ lat: number; lng: number; displayName: string } | null>(null);
  const containerIdRef = useRef(
    `map-${Math.random().toString(36).substr(2, 9)}`
  );
  const mapCenter = initialCenter || userLocation || DEFAULT_MAP_CENTER;

  // Handle search location
  const handleSearch = useCallback((lat: number, lng: number, displayName: string) => {
    setSearchLocation({ lat, lng });
    setSearchMarkerLocation({ lat, lng, displayName });
    // Reset animation trigger after a short delay to allow for subsequent searches
    setTimeout(() => setSearchLocation(null), 2000);
  }, []);

  // Auto-center on user location when available
  useEffect(() => {
    if (userLocation && !hasCenteredOnce) {
      setShouldCenterOnUser(true);
      setHasCenteredOnce(true);
      // Reset flag after animation to allow manual panning
      const timer = setTimeout(() => setShouldCenterOnUser(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [userLocation, hasCenteredOnce]);

  const handleLocationClick = () => {
    if (userLocation) {
      setShouldCenterOnUser(true);
      setTimeout(() => setShouldCenterOnUser(false), 100);
    } else {
      setIsGettingLocation(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setIsGettingLocation(false);
            // Location will be handled by parent component
          },
          (error) => {
            console.error("Geolocation error:", error);
            setIsGettingLocation(false);
            alert(
              "Unable to get your location. Please enable location services."
            );
          }
        );
      } else {
        setIsGettingLocation(false);
        alert("Geolocation is not supported by your browser.");
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        style={{ height }}
        className="w-full bg-gray-100 rounded-lg flex items-center justify-center"
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div
      id={containerIdRef.current}
      className="relative w-full rounded-2xl overflow-hidden"
      style={{ height, boxShadow: "var(--shadow-xl)" }}
    >
      <MapContainer
        center={mapCenter}
        zoom={userLocation || initialCenter ? 13 : DEFAULT_MAP_ZOOM}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        scrollWheelZoom={true}
      >
        <MapController
          userLocation={userLocation}
          shouldCenter={shouldCenterOnUser}
        />
        <SearchLocationController searchLocation={searchLocation} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {onMapClick && <MapClickHandler onClick={onMapClick} />}

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserLocationIcon()}
          >
            <Popup>
              <div className="p-2">
                <p className="font-semibold text-blue-600">📍 Your Location</p>
                <p className="text-sm text-gray-600">
                  {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Render issue markers */}
        {issues.map((issue: any) => {
          const [lng, lat] = issue.location.coordinates;
          return (
            <Marker
              key={issue._id.toString()}
              position={[lat, lng]}
              icon={createCustomIcon(issue.category, issue.status)}
            >
              <Popup maxWidth={300}>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-1">{issue.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {issue.description}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {
                        ISSUE_CATEGORIES.find((c) => c.value === issue.category)
                          ?.label
                      }
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded text-white ${issue.status === "resolved"
                        ? "bg-green-500"
                        : issue.status === "in-progress"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                        }`}
                    >
                      {issue.status}
                    </span>
                  </div>
                  {issue.images && issue.images.length > 0 && (
                    <img
                      src={issue.images[0]}
                      alt={issue.title}
                      className="w-full h-32 object-cover rounded mt-2"
                    />
                  )}
                  <a
                    href={`/issues/${issue._id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-2 block"
                  >
                    View Details →
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Search location marker */}
        {searchMarkerLocation && (
          <Marker
            position={[searchMarkerLocation.lat, searchMarkerLocation.lng]}
            icon={createSearchMarkerIcon()}
          >
            <Popup>
              <div className="p-2 max-w-xs">
                <p className="font-semibold text-purple-600">🔍 Searched Location</p>
                <p className="text-sm text-gray-700 mt-1">{searchMarkerLocation.displayName}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {searchMarkerLocation.lat.toFixed(6)}, {searchMarkerLocation.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Selected location marker */}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <div className="p-2">
                <p className="font-semibold">Selected Location</p>
                <p className="text-sm text-gray-600">
                  {selectedLocation.lat.toFixed(6)},{" "}
                  {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Floating Location Button */}
      <div className="absolute bottom-6 right-6 z-[10]">
        <LocationButton
          onLocationClick={handleLocationClick}
          isGettingLocation={isGettingLocation}
        />
      </div>
    </div>
  );
}
