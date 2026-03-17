import webpush from 'web-push';

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (publicKey && privateKey) {
    webpush.setVapidDetails(
        'mailto:notifications.raisevoice@gmail.com',
        publicKey,
        privateKey
    );
}

export interface PushNotificationPayload {
    title: string;
    body: string;
    icon?: string;
    data?: {
        url: string;
        [key: string]: any;
    };
}

export async function sendPushNotification(
    subscription: any,
    payload: PushNotificationPayload
) {
    try {
        await webpush.sendNotification(
            subscription,
            JSON.stringify(payload)
        );
        return { success: true };
    } catch (error: any) {
        console.error('Error sending push notification:', error);
        // If the subscription is no longer valid, we should return that info
        if (error.statusCode === 404 || error.statusCode === 410) {
            return { success: false, expired: true };
        }
        return { success: false, error: error.message };
    }
}

export async function sendPushToUser(
    user: any,
    payload: PushNotificationPayload
) {
    if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) {
        return { success: false, noSubscriptions: true };
    }

    const results = await Promise.all(
        user.pushSubscriptions.map(async (sub: any) => {
            const result = await sendPushNotification(sub, payload);
            return { sub, result };
        })
    );

    // Filter out expired subscriptions if any
    const expiredSubs = results
        .filter(r => r.result.expired)
        .map(r => r.sub.endpoint);

    if (expiredSubs.length > 0) {
        // We might want to remove these from the user model in the caller
        return { success: true, results, expiredSubs };
    }

    return { success: true, results };
}
