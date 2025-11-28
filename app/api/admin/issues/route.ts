import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requireAdmin } from '@/lib/admin-middleware';
import dbConnect from '@/lib/mongodb';
import Issue from '@/models/Issue';

export async function GET(req: NextRequest) {
    try {
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

        // Get query parameters
        const searchParams = req.nextUrl.searchParams;
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        // Build filter
        const filter: any = {};
        if (status) filter.status = status;
        if (category) filter.category = category;

        // Fetch issues with pagination
        // Note: Even admins only see anonymized data - 100% privacy policy
        const [issues, total] = await Promise.all([
            Issue.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', 'name email image')
                .lean(),
            Issue.countDocuments(filter),
        ]);

        // Always anonymize - never expose personal info
        const sanitizedIssues = issues.map((issue: any) => ({
            ...issue,
            userId: {
                _id: issue.userId._id,
                name: 'Anonymous User',
            }
        }));

        return NextResponse.json({
            issues: sanitizedIssues,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Admin issues error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch issues' },
            { status: 500 }
        );
    }
}
