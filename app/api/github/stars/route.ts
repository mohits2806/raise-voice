import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://api.github.com/repos/mohits2806/raise-voice', {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error('Failed to fetch GitHub data');
        }

        const data = await response.json();

        return NextResponse.json({
            stars: data.stargazers_count,
            forks: data.forks_count,
            watchers: data.watchers_count,
        });
    } catch (error) {
        console.error('GitHub API error:', error);
        return NextResponse.json({ stars: 0 }, { status: 200 });
    }
}
