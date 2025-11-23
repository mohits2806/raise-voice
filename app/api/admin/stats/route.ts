import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requireAdmin } from '@/lib/admin-middleware';
import dbConnect from '@/lib/mongodb';
import Issue from '@/models/Issue';
import User from '@/models/User';

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

        // Get statistics
        const [
            totalUsers,
            totalIssues,
            openIssues,
            inProgressIssues,
            resolvedIssues,
            recentIssues,
        ] = await Promise.all([
            User.countDocuments(),
            Issue.countDocuments(),
            Issue.countDocuments({ status: 'open' }),
            Issue.countDocuments({ status: 'in-progress' }),
            Issue.countDocuments({ status: 'resolved' }),
            Issue.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .populate('userId', 'name email')
                .lean(),
        ]);

        // Issues by category
        const issuesByCategory = await Issue.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ]);

        const stats = {
            users: {
                total: totalUsers,
            },
            issues: {
                total: totalIssues,
                open: openIssues,
                inProgress: inProgressIssues,
                resolved: resolvedIssues,
                byCategory: issuesByCategory.map((item) => ({
                    category: item._id,
                    count: item.count,
                })),
            },
            recentActivity: recentIssues.map((issue: any) => ({
                id: issue._id,
                title: issue.title,
                category: issue.category,
                status: issue.status,
                createdAt: issue.createdAt,
                user: {
                    name: issue.userId?.name || 'Unknown',
                    email: issue.userId?.email || '',
                },
            })),
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
