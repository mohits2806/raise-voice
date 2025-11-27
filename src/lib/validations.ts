import { z } from 'zod';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, MAX_IMAGES_PER_ISSUE } from './constants';

export const createIssueSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description cannot exceed 1000 characters'),
    category: z.enum(['water-supply', 'puddle', 'road', 'garbage', 'electricity', 'streetlight', 'other']),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().optional(),
    images: z.array(z.string().url()).max(MAX_IMAGES_PER_ISSUE, `Cannot upload more than ${MAX_IMAGES_PER_ISSUE} images`).optional(),
    isAnonymous: z.boolean().optional(),
});

export const updateIssueSchema = z.object({
    title: z.string().min(5).max(100).optional(),
    description: z.string().min(10).max(1000).optional(),
    status: z.enum(['open', 'in-progress', 'resolved']).optional(),
});

export const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

export const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export function validateImage(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
    }

    if (file.size > MAX_IMAGE_SIZE) {
        return { valid: false, error: `File size exceeds ${MAX_IMAGE_SIZE / 1024 / 1024}MB limit.` };
    }

    return { valid: true };
}
