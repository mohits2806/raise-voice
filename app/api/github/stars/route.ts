import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch('https://api.github.com/repos/mohits2806/raise-voice', {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'RaiseVoice-App', // GitHub recommends User-Agent header
            },
            signal: controller.signal,
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.warn(`GitHub API returned ${response.status}: ${response.statusText}`);
            return NextResponse.json({ stars: 0 }, { status: 200 });
        }

        const data = await response.json();

        return NextResponse.json({
            stars: data.stargazers_count || 0,
            forks: data.forks_count || 0,
            watchers: data.watchers_count || 0,
        });
    } catch (error) {
        // Silently fail - don't crash the app if GitHub is unreachable
        if (error instanceof Error && error.name === 'AbortError') {
            console.warn('GitHub API request timed out');
        } else {
            console.warn('GitHub API error (non-critical):', error instanceof Error ? error.message : 'Unknown error');
        }
        
        // Return 0 stars gracefully - Footer will still work
        return NextResponse.json({ stars: 0 }, { status: 200 });
    }
}
