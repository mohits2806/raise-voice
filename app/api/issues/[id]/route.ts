import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Issue from '@/models/Issue';
import { updateIssueSchema } from '@/lib/validations';

// GET: Fetch issue by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();

        const issue = await Issue.findById(id).populate('userId', 'name email image');

        if (!issue) {
            return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
        }

        return NextResponse.json({ issue }, { status: 200 });
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

        await Issue.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Issue deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Delete issue error:', error);
        return NextResponse.json({ error: 'Failed to delete issue' }, { status: 500 });
    }
}
