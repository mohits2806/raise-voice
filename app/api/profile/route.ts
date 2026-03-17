import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function PATCH(request: Request) {
    try {
        const session = await auth();
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, phone } = body;

        await dbConnect();

        // Update the user details
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: updateData },
            { new: true } // Return updated doc
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ 
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id.toString(),
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone
            }
        });
    } catch (error: any) {
        console.error('Profile update error:', error);

        // Handle MongoDB duplicate key error for phone number
        if (error.code === 11000 && error.keyPattern?.phone) {
            return NextResponse.json(
                { error: 'This phone number is already associated with another account.' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Failed to update profile' },
            { status: 500 }
        );
    }
}
