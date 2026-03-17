import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const subscription = await req.json();

        if (!subscription || !subscription.endpoint || !subscription.keys) {
            console.error('Invalid subscription object received');
            return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
        }

        await dbConnect();

        // Check if subscription already exists for this user
        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const subscriptionExists = user.pushSubscriptions?.some(
            (sub: any) => sub.endpoint === subscription.endpoint
        );

        if (!subscriptionExists) {
            await User.findByIdAndUpdate(session.user.id, {
                $push: { pushSubscriptions: subscription }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Subscription error:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}
