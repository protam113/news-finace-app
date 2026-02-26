import { NextResponse } from 'next/server';

const GUARDIAN_API_KEY = 'd66f8b43-4a81-4002-bd21-50c74cb0a772';

export async function GET() {
  try {
    const url = new URL('https://content.guardianapis.com/search');
    url.searchParams.append('api-key', GUARDIAN_API_KEY);
    url.searchParams.append('show-fields', 'thumbnail,headline,trailText,byline,body');
    url.searchParams.append('page-size', '30');
    url.searchParams.append('order-by', 'newest');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform Guardian API response to our format
    const articles = (data.response?.results || []).map((item: any) => ({
      url: item.webUrl,
      linkText: item.webTitle,
      headline: item.fields?.headline || item.webTitle,
      trailText: item.fields?.trailText || item.webTitle,
      image: item.fields?.thumbnail || '',
      byline: item.fields?.byline || item.sectionName || '',
      webPublicationDate: item.webPublicationDate,
      sectionName: item.sectionName,
      pillarName: item.pillarName,
    }));
    
    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching Guardian news:', error);
    return NextResponse.json({ articles: [], error: 'Failed to fetch news' }, { status: 500 });
  }
}
