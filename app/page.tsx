'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Filter, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import IssueForm from '@/components/Issues/IssueForm';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from '@/lib/constants';

// Dynamic import to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(() => import('@/components/Map/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    search: '',
    nearMe: false,
    radius: 5, // km
  });

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, issues, userLocation]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/issues');
      const data = await response.json();
      setIssues(data.issues || []);
      setFilteredIssues(data.issues || []);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...issues];

    if (filters.category !== 'all') {
      filtered = filtered.filter((issue: any) => issue.category === filters.category);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter((issue: any) => issue.status === filters.status);
    }

    if (filters.search) {
      filtered = filtered.filter(
        (issue: any) =>
          issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          issue.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filter by nearby location
    if (filters.nearMe && userLocation) {
      filtered = filtered.filter((issue: any) => {
        const [lng, lat] = issue.location.coordinates;
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          lat,
          lng
        );
        return distance <= filters.radius;
      });
    }

    setFilteredIssues(filtered);
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    setSelectedLocation({ lat, lng });
    setShowIssueForm(true);
  };

  const handleCloseForm = () => {
    setShowIssueForm(false);
    setSelectedLocation(null);
    fetchIssues(); // Refresh issues after form close
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Make Your Voice Heard
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-6">
            Report community issues and help improve your neighborhood
          </p>
          {!session && (
            <button
              onClick={() => router.push('/auth/signup')}
              className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 transition shadow-lg"
            >
              Get Started
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-6 mb-6 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="all" className="bg-purple-900">All Categories</option>
              {ISSUE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-purple-900">
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="all" className="bg-purple-900">All Statuses</option>
              {ISSUE_STATUSES.map((status) => (
                <option key={status.value} value={status.value} className="bg-purple-900">
                  {status.label}
                </option>
              ))}
            </select>

            {userLocation && (
              <button
                onClick={() => setFilters({ ...filters, nearMe: !filters.nearMe })}
                className={`px-4 py-3 rounded-lg font-semibold transition ${
                  filters.nearMe
                    ? 'bg-white text-purple-600'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                📍 Near Me {filters.nearMe && `(${filters.radius}km)`}
              </button>
            )}

            {filters.nearMe && userLocation && (
              <select
                value={filters.radius}
                onChange={(e) => setFilters({ ...filters, radius: Number(e.target.value) })}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value={1} className="bg-purple-900">1 km</option>
                <option value={2} className="bg-purple-900">2 km</option>
                <option value={5} className="bg-purple-900">5 km</option>
                <option value={10} className="bg-purple-900">10 km</option>
                <option value={25} className="bg-purple-900">25 km</option>
              </select>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-white/80 text-sm">
            <span>
              Showing {filteredIssues.length} of {issues.length} issues
            </span>
            {session && (
              <button
                onClick={() => {
                  setSelectedLocation(null);
                  setShowIssueForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-white/90 transition font-semibold"
              >
                <Plus size={20} />
                Report Issue
              </button>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="glass rounded-2xl p-6 animate-fade-in">
          <InteractiveMap
            issues={filteredIssues}
            onMapClick={handleMapClick}
            selectedLocation={selectedLocation}
            userLocation={userLocation}
            height="600px"
          />
          <p className="text-white/70 text-sm mt-4 text-center">
            {session
              ? 'Click on the map to place a marker and report an issue'
              : 'Sign in to report issues'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="glass rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">{issues.length}</div>
            <div className="text-white/70 text-sm">Total Issues</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {issues.filter((i: any) => i.status === 'resolved').length}
            </div>
            <div className="text-white/70 text-sm">Resolved</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {issues.filter((i: any) => i.status === 'in-progress').length}
            </div>
            <div className="text-white/70 text-sm">In Progress</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {issues.filter((i: any) => i.status === 'open').length}
            </div>
            <div className="text-white/70 text-sm">Open</div>
          </div>
        </div>
      </div>

      {/* Issue Form Modal */}
      {showIssueForm && <IssueForm onClose={handleCloseForm} selectedLocation={selectedLocation} />}
    </div>
  );
}
