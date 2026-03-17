import { auth } from '@/lib/auth';
import { requireAdmin } from '@/lib/admin-middleware';
import dbConnect from '@/lib/mongodb';
import Issue from '@/models/Issue';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { sendIssueStatusUpdateNotification } from '@/lib/email';
import { sendPushToUser } from '@/lib/push';

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

        // Fetch current issue to get old status
        const currentIssue = await Issue.findById(id);
        if (!currentIssue) {
            return NextResponse.json(
                { error: 'Issue not found' },
                { status: 404 }
            );
        }
        const oldStatus = currentIssue.status;

        const issue = await Issue.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('userId', 'name email pushSubscriptions');

        if (!issue) {
            return NextResponse.json(
                { error: 'Issue not found' },
                { status: 404 }
            );
        }

        // Send status update notification to the user (fire and forget)
        const populatedUser = issue.userId as any;
        if (oldStatus !== status && populatedUser?.email) {
            // FIRE AND FORGET: Don't await the email sending to keep admin UI fast
            sendIssueStatusUpdateNotification({
                userEmail: populatedUser.email,
                userName: populatedUser.name || 'User',
                issue,
                oldStatus,
                newStatus: status,
            }).catch((err) => console.error('Failed to send status update notification:', err));

            // PUSH NOTIFICATION
            (async () => {
                try {
                    const statusEmoji: { [key: string]: string } = {
                        'open': '🟡',
                        'in-progress': '🔵',
                        'resolved': '🟢',
                    };
                    const emoji = statusEmoji[status] || '📢';
                    
                    await sendPushToUser(issue.userId, {
                        title: `Issue ${status.toUpperCase()}! ${emoji}`,
                        body: `Your report "${issue.title}" is now ${status}. Click to view details.`,
                        data: {
                            url: `${process.env.NEXT_PUBLIC_APP_URL}/issues/${issue._id}`
                        }
                    });
                } catch (pushErr) {
                    console.error('Failed to send status update push notification:', pushErr);
                }
            })();
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
                    // URL format: https://res.cloudinary.com/cloud/image/upload/v123456/folder/filename.ext
                    // public_id format: folder/filename (without extension)
                    const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\./);
                    if (matches && matches[1]) {
                        const public_id = matches[1];
                        console.log('Deleting image with public_id:', public_id);
                        
                        // Delete directly from Cloudinary
                        await deleteFromCloudinary(public_id);
                    }
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
