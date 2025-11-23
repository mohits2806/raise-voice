import { Session } from 'next-auth';

/**
 * Admin middleware to check if the user has admin role
 * Use this to protect admin-only API routes
 */
export async function requireAdmin(session: Session | null) {
    if (!session || !session.user) {
        return {
            error: 'Unauthorized - Please sign in',
            status: 401,
        };
    }

    // Check if user has admin role
    if (session.user.role !== 'admin') {
        return {
            error: 'Forbidden - Admin access required',
            status: 403,
        };
    }

    return null; // No error, user is admin
}

/**
 * Type guard to check if user is admin
 */
export function isAdmin(session: Session | null): boolean {
    return session?.user?.role === 'admin';
}
