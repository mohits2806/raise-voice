export const ISSUE_CATEGORIES = [
    { value: 'water-supply', label: 'Water Supply', icon: '💧', color: '#3b82f6' },
    { value: 'puddle', label: 'Puddle/Drainage', icon: '🌊', color: '#06b6d4' },
    { value: 'road', label: 'Road Damage', icon: '🛣️', color: '#ef4444' },
    { value: 'garbage', label: 'Garbage/Waste', icon: '🗑️', color: '#84cc16' },
    { value: 'electricity', label: 'Electricity', icon: '⚡', color: '#eab308' },
    { value: 'streetlight', label: 'Street Light', icon: '💡', color: '#f59e0b' },
    { value: 'other', label: 'Other', icon: '📝', color: '#6b7280' },
] as const;

export const ISSUE_STATUSES = [
    { value: 'open', label: 'Open', color: 'bg-red-500' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-yellow-500' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-500' },
] as const;

export const DEFAULT_MAP_CENTER: [number, number] = [28.6139, 77.2090]; // Delhi, India
export const DEFAULT_MAP_ZOOM = 12;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGES_PER_ISSUE = 5;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export const APP_NAME = 'RaiseVoice';
export const APP_DESCRIPTION = 'Report community issues and make your voice heard';
