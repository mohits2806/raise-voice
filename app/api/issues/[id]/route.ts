import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Issue from '@/models/Issue';
import { NextRequest, NextResponse } from 'next/server';
import { updateIssueSchema } from '@/lib/validations';
import { deleteFromCloudinary } from '@/lib/cloudinary';

// GET: Fetch issue by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();

        const issue = await Issue.findById(id).populate('userId', 'name email image');

        if (!issue) {
            return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
        }

        // Always anonymize - never expose personal info (100% anonymous USP)
        const responseIssue = issue.toObject();
        responseIssue.userId = {
            _id: responseIssue.userId._id,
            name: 'Anonymous User',
            image: undefined,
        } as any;

        return NextResponse.json({ issue: responseIssue }, { status: 200 });
    } catch (error) {
        console.error('Fetch issue error:', error);
        return NextResponse.json({ error: 'Failed to fetch issue' }, { status: 500 });
    }
}

// PATCH: Update issue
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate input
        const validatedData = updateIssueSchema.parse(body);

        await dbConnect();

        const issue = await Issue.findById(id);

        if (!issue) {
            return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
        }

        // Check if user owns the issue
        if (issue.userId.toString() !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Update issue
        const updatedIssue = await Issue.findByIdAndUpdate(
            id,
            { $set: validatedData },
            { new: true, runValidators: true }
        ).populate('userId', 'name email image');

        return NextResponse.json({ issue: updatedIssue }, { status: 200 });
    } catch (error: unknown) {
        console.error('Update issue error:', error);

        if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
            return NextResponse.json({ error: (error as any).errors[0].message }, { status: 400 });
        }

        return NextResponse.json({ error: 'Failed to update issue' }, { status: 500 });
    }
}

// DELETE: Delete issue
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const issueToDelete = await Issue.findById(id);

        if (!issueToDelete) {
            return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
        }

        // Check if user owns the issue
        if (issueToDelete.userId.toString() !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Delete images from Cloudinary if they exist
        if (issueToDelete.images && issueToDelete.images.length > 0) {
            try {
                for (const imageUrl of issueToDelete.images) {
                    // Extract public_id from Cloudinary URL
                    // URL format: https://res.cloudinary.com/cloud/image/upload/v123456/folder/filename.ext
                    // public_id format: folder/filename (without extension)
                    const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\./);                    if (matches && matches[1]) {
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

        await Issue.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Issue deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Delete issue error:', error);
        return NextResponse.json({ error: 'Failed to delete issue' }, { status: 500 });
    }
}
