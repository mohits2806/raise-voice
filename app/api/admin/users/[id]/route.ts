import { auth } from '@/lib/auth';
import { requireAdmin } from '@/lib/admin-middleware';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // Check authentication and admin role
        const session = await auth();
        const adminCheck = await requireAdmin(session);

        if (adminCheck) {
            return NextResponse.json(
                { error: adminCheck.error },
                { status: adminCheck.status }
            );
        }

        await dbConnect();

        const body = await req.json();
        const { role } = body;

        if (!role || !['user', 'admin'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role. Must be "user" or "admin"' },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Admin update user role error:', error);
        return NextResponse.json(
            { error: 'Failed to update user role' },
            { status: 500 }
        );
    }
}
