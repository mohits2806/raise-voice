'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share } from 'lucide-react';

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        
        // Detect if already installed (standalone mode)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                             (window.navigator as any).standalone === true;

        const checkDismissal = () => {
            const dismissedAt = localStorage.getItem('pwa-prompt-dismissed');
            if (dismissedAt) {
                const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours
                const timePassed = Date.now() - parseInt(dismissedAt, 10);
                if (timePassed < oneDayInMs) {
                    return false;
                }
            }
            return true;
        };

        if (isStandalone) {
            return; // Don't show if already installed
        }

        if (isIosDevice) {
            setIsIOS(true);
            // On iOS, we don't get beforeinstallprompt, so we just show it after a short delay if not dismissed
            if (checkDismissal()) {
                const timer = setTimeout(() => setShowPrompt(true), 4000);
                return () => clearTimeout(timer);
            }
            return;
        }

        const handler = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            
            if (checkDismissal()) {
                // Add a small delay so it doesn't pop up instantly on page load
                setTimeout(() => setShowPrompt(true), 2500);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the native install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setShowPrompt(false);
        }
        
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Save dismissal timestamp
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ y: 150, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 150, opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-[24rem] z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] p-5 overflow-hidden"
                >
                    {/* Decorative glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 dark:bg-indigo-500/30 blur-3xl rounded-full pointer-events-none" />
                    
                    <button 
                        onClick={handleDismiss}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 w-8 h-8 flex items-center justify-center rounded-full transition-colors z-20"
                        aria-label="Dismiss"
                    >
                        <X size={16} />
                    </button>

                    <div className="flex items-start gap-4 mb-5 relative z-10 pr-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
                            <Download className="text-white drop-shadow-md" size={28} />
                        </div>
                        <div className="flex flex-col justify-center min-h-[3.5rem]">
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
                                Install RaiseVoice
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                Add to home screen for an app-like experience and quick access.
                            </p>
                        </div>
                    </div>

                    {isIOS && !deferredPrompt ? (
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 text-sm text-slate-600 dark:text-slate-300 relative z-10 border border-slate-100 dark:border-slate-800">
                            <p className="flex items-center gap-2 mb-2 font-medium">
                                To install on iOS:
                            </p>
                            <ol className="list-decimal pl-5 space-y-2 opacity-90">
                                <li className="pl-1">
                                    Tap the <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-700 shadow-sm rounded-md px-1.5 py-0.5 mx-0.5 border border-slate-200 dark:border-slate-600 font-medium text-xs"><Share size={12}/> Share</span> button below.
                                </li>
                                <li className="pl-1">Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                            </ol>
                            <button
                                onClick={handleDismiss}
                                className="w-full mt-4 py-2.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 active:scale-[0.98] transition-all"
                            >
                                Got it
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3 relative z-10">
                            <button
                                onClick={handleDismiss}
                                className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
                            >
                                Not Now
                            </button>
                            <button
                                onClick={handleInstallClick}
                                className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all"
                            >
                                Install App
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
