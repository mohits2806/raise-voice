import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hashToken } from '@/lib/tokens';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            );
        }

        if (typeof password !== 'string' || password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Hash the token to match stored version
        const hashedToken = hashToken(token);
        
        console.log('Reset password attempt:', {
            receivedToken: token.substring(0, 10) + '...',
            hashedToken: hashedToken.substring(0, 20) + '...',
            currentTime: new Date().toISOString(),
        });

        // Find user with valid reset token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Token not expired
        }).select('+password +resetPasswordToken +resetPasswordExpires');

        console.log('User found:', !!user);
        if (user) {
            console.log('Token expiry:', user.resetPasswordExpires ? new Date(user.resetPasswordExpires).toISOString() : 'none');
        }

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return NextResponse.json(
            { 
                message: 'Password reset successful', 
                success: true 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'An error occurred. Please try again.' },
            { status: 500 }
        );
    }
}
