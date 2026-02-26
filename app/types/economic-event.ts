export interface EconomicEvent {
  category: string;
  country_id: number;
  currency: string;
  description: string;
  event_id: number;
  event_meta_title: string;
  event_translated: string;
  event_type?: string;
  importance: 'low' | 'medium' | 'high';
  long_name: string;
  page_link: string;
  short_name: string;
  source: string;
  source_url: string;
  event_cycle_suffix?: string;
}

export interface EconomicEventsResponse {
  events: EconomicEvent[];
}

// Map country_id sang country code (dựa trên world/country.json)
export const countryIdToCode: Record<number, string> = {
  5: 'US',   // United States
  6: 'CA',   // Canada (từ country.json)
  7: 'MX',   // Mexico
  10: 'IT',  // Italy
  12: 'CH',  // Switzerland
  17: 'DE',  // Germany
  23: 'IL',  // Israel
  25: 'AU',  // Australia
  35: 'JP',  // Japan
  36: 'SG',  // Singapore
  37: 'CN',  // China
  43: 'NZ',  // New Zealand
  46: 'TW',  // Taiwan
  52: 'SA',  // Saudi Arabia
  72: 'EU',  // Eurozone
  110: 'ZA', // South Africa
  
  // Thêm các country_id khác từ API investing.com
  4: 'US',   // United States (alternate)
  14: 'ES',  // Spain
  22: 'NZ',  // New Zealand (alternate)
  32: 'CA',  // Canada (alternate)
  39: 'IT',  // Italy (alternate)
  56: 'KR',  // South Korea
};

// Tọa độ các quốc gia
export const countryCoordinates: Record<string, [number, number]> = {
  AU: [133.7751, -25.2744],  // Australia
  CA: [-95.7129, 56.1304],   // Canada
  DE: [10.4515, 51.1657],    // Germany
  JP: [138.2529, 36.2048],   // Japan
  NZ: [174.8860, -40.9006],  // New Zealand
  IT: [12.5674, 41.8719],    // Italy
  ES: [-3.7492, 40.4637],    // Spain
  MX: [-102.5528, 23.6345],  // Mexico
  CN: [104.1954, 35.8617],   // China
  SG: [103.8198, 1.3521],    // Singapore
  ZA: [22.9375, -30.5595],   // South Africa
  US: [-95.7129, 37.0902],   // United States
  KR: [127.7669, 35.9078],   // South Korea
  CH: [8.2275, 46.8182],     // Switzerland
  IL: [34.8516, 31.0461],    // Israel
  TW: [120.9605, 23.6978],   // Taiwan
  SA: [45.0792, 23.8859],    // Saudi Arabia
  EU: [10.4515, 51.1657],    // Eurozone (dùng tọa độ Germany)
};
