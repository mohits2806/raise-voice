import crypto from 'crypto';

/**
 * Generates a secure random token for password reset
 * @returns 32-byte hex string (64 characters)
 */
export function generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Hashes a token using SHA-256 for database storage
 * @param token - The plain text token
 * @returns Hashed token
 */
export function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Verifies if a token matches its hashed version
 * @param token - The plain text token
 * @param hashedToken - The hashed token from database
 * @returns True if tokens match
 */
export function verifyToken(token: string, hashedToken: string): boolean {
    const tokenHash = hashToken(token);
    return crypto.timingSafeEqual(
        Buffer.from(tokenHash),
        Buffer.from(hashedToken)
    );
}
