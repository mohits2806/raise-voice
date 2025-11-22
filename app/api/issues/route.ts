import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Issue from '@/models/Issue';
import { createIssueSchema } from '@/lib/validations';

// GET: Fetch all issues with optional filtering
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50');

        await dbConnect();

        let query: any = {};

        if (category && category !== 'all') {
            query.category = category;
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        const issues = await Issue.find(query)
            .populate('userId', 'name email image')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json({ issues }, { status: 200 });
    } catch (error) {
        console.error('Fetch issues error:', error);
        return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
    }
}

// POST: Create a new issue
export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate input
        const validatedData = createIssueSchema.parse(body);

        await dbConnect();

        // Create new issue
        const issue = await Issue.create({
            title: validatedData.title,
            description: validatedData.description,
            category: validatedData.category,
            location: {
                type: 'Point',
                coordinates: [validatedData.longitude, validatedData.latitude],
            },
            address: validatedData.address,
            images: validatedData.images || [],
            userId: session.user.id,
            status: 'open',
        });

        const populatedIssue = await Issue.findById(issue._id).populate('userId', 'name email image');

        return NextResponse.json({ issue: populatedIssue }, { status: 201 });
    } catch (error: unknown) {
        console.error('Create issue error:', error);

        if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
            return NextResponse.json({ error: (error as any).errors[0].message }, { status: 400 });
        }

        return NextResponse.json({ error: 'Failed to create issue' }, { status: 500 });
    }
}
