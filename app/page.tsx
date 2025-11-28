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
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-12 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4 sm:mb-6">
            <span className="text-gradient">Make Your Voice Heard</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto"
            style={{ color: 'rgb(var(--text-secondary))' }}>
            Report community issues and help improve your neighborhood with our interactive mapping platform
          </p>
          {!session && (
            <button
              onClick={() => router.push('/auth/signup')}
              className="btn-primary text-base sm:text-lg animate-bounce-in"
            >
              Get Started Today
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="glass-light rounded-2xl p-4 sm:p-6 mb-6 animate-fade-in" 
          style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search 
                  className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300" 
                  size={20}
                  style={{ color: 'rgb(var(--text-tertiary))' }}
                />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-xl font-medium transition-all duration-300"
                  style={{
                    backgroundColor: 'rgb(var(--bg-tertiary))',
                    border: '2px solid rgb(var(--border-primary))',
                    color: 'rgb(var(--text-primary))',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgb(var(--accent-primary))'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgb(var(--border-primary))'}
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-4 py-3 rounded-xl font-medium transition-all duration-300"
                style={{
                  backgroundColor: 'rgb(var(--bg-tertiary))',
                  border: '2px solid rgb(var(--border-primary))',
                  color: 'rgb(var(--text-primary))',
                }}
              >
                <option value="all">All Categories</option>
                {ISSUE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-3 rounded-xl font-medium transition-all duration-300"
                style={{
                  backgroundColor: 'rgb(var(--bg-tertiary))',
                  border: '2px solid rgb(var(--border-primary))',
                  color: 'rgb(var(--text-primary))',
                }}
              >
                <option value="all">All Statuses</option>
                {ISSUE_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm font-medium pt-2"
              style={{ color: 'rgb(var(--text-secondary))' }}>
              <span>
                Showing <span className="font-bold" style={{ color: 'rgb(var(--accent-primary))' }}>
                  {filteredIssues.length}
                </span> of {issues.length} issues
              </span>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="animate-fade-in mb-8" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
          <InteractiveMap
            issues={filteredIssues}
            onMapClick={handleMapClick}
            selectedLocation={selectedLocation}
            userLocation={userLocation}
            height="600px"
          />
          <p className="text-center text-sm mt-4" style={{ color: 'rgb(var(--text-tertiary))' }}>
            {session
              ? 'Click on the map to place a marker and raise an issue'
              : 'Sign in to raise issues and help improve your community'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 stagger-children">
          <div className="card group cursor-default">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2 text-gradient-primary">
                {issues.length}
              </div>
              <div className="text-sm sm:text-base font-medium" style={{ color: 'rgb(var(--text-secondary))' }}>
                Total Issues
              </div>
            </div>
          </div>
          
          <div className="card group cursor-default">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'rgb(var(--accent-success))' }}>
                {issues.filter((i: any) => i.status === 'resolved').length}
              </div>
              <div className="text-sm sm:text-base font-medium" style={{ color: 'rgb(var(--text-secondary))' }}>
                Resolved
              </div>
            </div>
          </div>
          
          <div className="card group cursor-default">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'rgb(var(--accent-warning))' }}>
                {issues.filter((i: any) => i.status === 'in-progress').length}
              </div>
              <div className="text-sm sm:text-base font-medium" style={{ color: 'rgb(var(--text-secondary))' }}>
                In Progress
              </div>
            </div>
          </div>
          
          <div className="card group cursor-default">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'rgb(var(--accent-error))' }}>
                {issues.filter((i: any) => i.status === 'open').length}
              </div>
              <div className="text-sm sm:text-base font-medium" style={{ color: 'rgb(var(--text-secondary))' }}>
                Open
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Form Modal */}
      {showIssueForm && <IssueForm onClose={handleCloseForm} selectedLocation={selectedLocation} />}
    </div>
  );
}
