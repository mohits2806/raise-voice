'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { IIssue } from '@/types';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, ISSUE_CATEGORIES } from '@/lib/constants';

interface InteractiveMapProps {
  issues: IIssue[];
  onMapClick?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  userLocation?: { lat: number; lng: number } | null;
  initialCenter?: { lat: number; lng: number };
  height?: string;
}

// Fix Leaflet default marker icon issue
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

// Create custom marker icons based on issue status
const createCustomIcon = (category: string, status: string) => {
  const categoryData = ISSUE_CATEGORIES.find((c) => c.value === category);
  const color =
    status === 'resolved' ? '#10b981' : status === 'in-progress' ? '#f59e0b' : '#ef4444';

  return L.divIcon({
    className: 'custom-marker',
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
            ${categoryData?.icon || '📍'}
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
    className: 'custom-marker',
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

function MapClickHandler({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onClick) {
        onClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function InteractiveMap({
  issues,
  onMapClick,
  selectedLocation,
  userLocation,
  initialCenter,
  height = '600px',
}: InteractiveMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const containerIdRef = useRef(`map-${Math.random().toString(36).substr(2, 9)}`);
  const mapCenter = initialCenter || userLocation || DEFAULT_MAP_CENTER;

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
    <div id={containerIdRef.current} style={{ height }} className="w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={userLocation || initialCenter ? 13 : DEFAULT_MAP_ZOOM}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        scrollWheelZoom={true}
      >
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
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{issue.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {ISSUE_CATEGORIES.find((c) => c.value === issue.category)?.label}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded text-white ${
                        issue.status === 'resolved'
                          ? 'bg-green-500'
                          : issue.status === 'in-progress'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
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

        {/* Selected location marker */}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <div className="p-2">
                <p className="font-semibold">Selected Location</p>
                <p className="text-sm text-gray-600">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
