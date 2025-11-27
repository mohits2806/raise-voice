import { auth } from '@/lib/auth';
import { requireAdmin } from '@/lib/admin-middleware';
import dbConnect from '@/lib/mongodb';
import Issue from '@/models/Issue';
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
        const { status } = body;

        if (!status || !['open', 'in-progress', 'resolved'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const issue = await Issue.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('userId', 'name email');

        if (!issue) {
            return NextResponse.json(
                { error: 'Issue not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ issue });
    } catch (error) {
        console.error('Admin update issue error:', error);
        return NextResponse.json(
            { error: 'Failed to update issue' },
            { status: 500 }
        );
    }
}

export async function DELETE(
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

        // Find issue first to get image URLs
        const issue = await Issue.findById(id);

        if (!issue) {
            return NextResponse.json(
                { error: 'Issue not found' },
                { status: 404 }
            );
        }

        // Delete images from Cloudinary if they exist
        if (issue.images && issue.images.length > 0) {
            try {
                for (const imageUrl of issue.images) {
                    // Extract public_id from Cloudinary URL
                    const urlParts = imageUrl.split('/');
                    const filename = urlParts[urlParts.length - 1];
                    const public_id = filename.split('.')[0];
                    
                    // Make request to delete endpoint
                    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/delete-image`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ public_id }),
                    });
                }
            } catch (imgError) {
                console.error('Error deleting images from Cloudinary:', imgError);
                // Continue with issue deletion even if image deletion fails
            }
        }

        // Delete the issue from database
        await Issue.findByIdAndDelete(id);

        return NextResponse.json(
            { message: 'Issue deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Admin delete issue error:', error);
        return NextResponse.json(
            { error: 'Failed to delete issue' },
            { status: 500 }
        );
    }
}
