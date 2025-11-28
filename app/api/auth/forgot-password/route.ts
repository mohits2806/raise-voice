import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateResetToken, hashToken } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        // IMPORTANT: Always return success (even if user not found) to prevent email enumeration
        if (!user) {
            console.log('Password reset requested for non-existent email:', email);
            return NextResponse.json(
                { 
                    message: 'If an account with that email exists, we sent a password reset link.',
                    success: true 
                },
                { status: 200 }
            );
        }

        // Generate reset token
        const resetToken = generateResetToken();
        const hashedToken = hashToken(resetToken);

        console.log('Forgot password - Generating token for:', user.email);
        console.log('Token details:', {
            plainToken: resetToken.substring(0, 10) + '...',
            hashedToken: hashedToken.substring(0, 20) + '...',
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
        });

        // Save hashed token and expiration to database
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
        await user.save();
        
        console.log('Token saved to database for user:', user._id);

        // Create reset URL
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

        // Send email
        try {
            await sendPasswordResetEmail({
                email: user.email,
                resetUrl,
                userName: user.name,
            });
        } catch (emailError) {
            console.error('Failed to send reset email:', emailError);
            // Clear the reset token if email fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            
            return NextResponse.json(
                { error: 'Failed to send reset email. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { 
                message: 'If an account with that email exists, we sent a password reset link.',
                success: true 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'An error occurred. Please try again.' },
            { status: 500 }
        );
    }
}
