import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const countries = searchParams.get('countries') || '72,22,17,12,4,74,110,6,7,5,25,37,35,42,139,43,44,36,46,178,145,59,66,23,92,94,68,87,193,170,52,143,61,10,56';
  const importance = searchParams.get('importance') || 'low,medium,high';
  
  try {
    const startDate = `${date}T00:00:00.000+07:00`;
    const endDate = `${date}T23:59:59.999+07:00`;
    
    const url = `https://endpoints.investing.com/pd-instruments/v1/calendars/economic/events/occurrences?domain_id=1&limit=200&start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}&country_ids=${countries}&importance=${importance}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 300 } // Cache 5 phút
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching economic events:', error);
    return NextResponse.json({ events: [] }, { status: 500 });
  }
}
