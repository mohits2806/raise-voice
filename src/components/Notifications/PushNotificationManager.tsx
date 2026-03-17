"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default function PushNotificationManager() {
    const { data: session, status: sessionStatus } = useSession();
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window && sessionStatus === 'authenticated') {
            setIsSupported(true);
            registerServiceWorker();
        }

        // Listen for messages from Service Worker to play sound fallback
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'PLAY_NOTIFICATION_SOUND') {
                const audio = new Audio('/notification/notification.mp3');
                audio.play().catch(e => {
                    // Browsers might block auto-play until the user interacts with the page
                    console.log('Audio playback pending user interaction:', e.name);
                });
            }
        };

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', handleMessage);
            return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
        }
    }, [sessionStatus]);

    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none',
            });
            
            // Force a check for updates immediately
            await registration.update();
            
            const sub = await registration.pushManager.getSubscription();
            setSubscription(sub);

            if (sub) {
                syncSubscriptionWithBackend(sub);
            } else {
                subscribeToPush();
            }
        } catch (error) {
            console.error('Service worker registration failed:', error);
        }
    }

    async function syncSubscriptionWithBackend(sub: PushSubscription) {
        try {
            await fetch('/api/notifications/subscribe', {
                method: 'POST',
                body: JSON.stringify(sub),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (err) {
            console.error('Failed to sync existing subscription:', err);
        }
    }

    async function subscribeToPush() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                ),
            });

            setSubscription(sub);
            await syncSubscriptionWithBackend(sub);
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
        }
    }

    // This component doesn't render anything visible by default
    // It's just a manager for the background functionality
    return null;
}
