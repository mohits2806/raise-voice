"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  GeoJSON,
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
  osm_id?: number;
  osm_type?: string;
  boundingbox?: string[];
}

// Search Bar Component with Autocomplete
function SearchBar({
  onSearch,
}: {
  onSearch: (
    lat: number,
    lng: number,
    displayName: string,
    osmId?: number,
    osmType?: string,
  ) => void;
}) {
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
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
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
    onSearch(
      parseFloat(suggestion.lat),
      parseFloat(suggestion.lon),
      suggestion.display_name,
      suggestion.osm_id,
      suggestion.osm_type,
    );
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
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name, osm_id, osm_type } = data[0];
        onSearch(
          parseFloat(lat),
          parseFloat(lon),
          display_name,
          osm_id,
          osm_type,
        );
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
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    <div
      ref={searchContainerRef}
      className="absolute top-4 right-4 z-[10] w-72"
    >
      <div
        className="flex items-center rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
        style={{
          backgroundColor: "rgb(var(--bg-primary))",
          border: "2px solid rgb(var(--border-secondary))",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Search Icon */}
        <div
          className="pl-3 pr-1.5"
          style={{ color: "rgb(var(--text-tertiary))" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Search location..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className="flex-1 py-2.5 px-1.5 focus:outline-none text-sm bg-transparent"
          style={{
            color: "rgb(var(--text-primary))",
          }}
          disabled={isSearching}
        />

        {/* Loading indicator for suggestions */}
        {isLoadingSuggestions && (
          <div
            className="pr-1.5"
            style={{ color: "rgb(var(--text-tertiary))" }}
          >
            <svg
              className="animate-spin h-3.5 w-3.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="px-3 py-2.5 font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          style={{
            background: "var(--gradient-primary)",
            color: "white",
          }}
        >
          {isSearching ? (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Go"
          )}
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="mt-1.5 rounded-xl overflow-hidden max-h-52 overflow-y-auto"
          style={{
            backgroundColor: "rgb(var(--bg-primary))",
            border: "2px solid rgb(var(--border-secondary))",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-3 py-2.5 text-left transition-colors duration-150 flex items-start gap-2"
              style={{
                borderBottom: "1px solid rgb(var(--border-primary))",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgb(var(--bg-secondary))")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <span
                style={{ color: "rgb(var(--accent-primary))" }}
                className="mt-0.5 flex-shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <span
                className="text-xs line-clamp-2"
                style={{ color: "rgb(var(--text-primary))" }}
              >
                {suggestion.display_name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="mt-1.5 px-3 py-2 rounded-lg text-xs"
          style={{
            backgroundColor: "rgba(var(--accent-error), 0.1)",
            border: "1px solid rgb(var(--accent-error))",
            color: "rgb(var(--accent-error))",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

// Component to handle search location navigation
function SearchLocationController({
  searchLocation,
}: {
  searchLocation: { lat: number; lng: number } | null;
}) {
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
  const [searchLocation, setSearchLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchMarkerLocation, setSearchMarkerLocation] = useState<{
    lat: number;
    lng: number;
    displayName: string;
    boundary?: GeoJSON.GeoJsonObject;
  } | null>(null);
  const containerIdRef = useRef(
    `map-${Math.random().toString(36).substr(2, 9)}`,
  );
  const mapCenter = initialCenter || userLocation || DEFAULT_MAP_CENTER;

  // Handle search location
  const handleSearch = useCallback(
    async (
      lat: number,
      lng: number,
      displayName: string,
      osmId?: number,
      osmType?: string,
    ) => {
      setSearchLocation({ lat, lng });

      // Try to fetch boundary polygon if we have osm_id and osm_type
      let boundary: GeoJSON.GeoJsonObject | undefined;
      if (osmId && osmType) {
        try {
          const boundaryResponse = await fetch(
            `https://nominatim.openstreetmap.org/details.php?osmtype=${osmType.charAt(0).toUpperCase()}&osmid=${osmId}&polygon_geojson=1&format=json`,
            {
              headers: {
                Accept: "application/json",
              },
            },
          );
          if (boundaryResponse.ok) {
            const boundaryData = await boundaryResponse.json();
            if (boundaryData.geometry && boundaryData.geometry.type) {
              boundary = boundaryData.geometry;
            }
          }
        } catch (err) {
          console.error("Failed to fetch boundary:", err);
        }
      }

      setSearchMarkerLocation({ lat, lng, displayName, boundary });
      // Reset animation trigger after a short delay to allow for subsequent searches
      setTimeout(() => setSearchLocation(null), 2000);
    },
    [],
  );

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
              "Unable to get your location. Please enable location services.",
            );
          },
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
                      className={`text-xs px-2 py-1 rounded text-white ${
                        issue.status === "resolved"
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

        {/* Search location boundary or fallback marker */}
        {searchMarkerLocation && searchMarkerLocation.boundary && (
          <GeoJSON
            key={`boundary-${searchMarkerLocation.lat}-${searchMarkerLocation.lng}`}
            data={searchMarkerLocation.boundary}
            style={{
              color: "rgb(139, 92, 246)",
              weight: 3,
              fillColor: "rgb(139, 92, 246)",
              fillOpacity: 0.1,
            }}
          >
            <Popup>
              <div className="p-2 max-w-xs">
                <p className="font-semibold text-purple-600">
                  🔍 {searchMarkerLocation.displayName.split(",")[0]}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {searchMarkerLocation.displayName}
                </p>
              </div>
            </Popup>
          </GeoJSON>
        )}

        {/* Fallback marker when no boundary available */}
        {searchMarkerLocation && !searchMarkerLocation.boundary && (
          <Marker
            position={[searchMarkerLocation.lat, searchMarkerLocation.lng]}
            icon={L.divIcon({
              className: "custom-marker",
              html: `
                <div style="position: relative;">
                  <div style="
                    background-color: #8b5cf6;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.5);
                  "></div>
                </div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          >
            <Popup>
              <div className="p-2 max-w-xs">
                <p className="font-semibold text-purple-600">
                  🔍 Searched Location
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {searchMarkerLocation.displayName}
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
