"use client";

import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { EconomicEvent, countryCoordinates } from "./types/economic-event";
import countryData from "./data/country.json";
import NewsList from "./components/news-list";
import FilterPanel from "./components/filter-panel";
import LoadingSpinner from "./components/loading-spinner";
import EventChartModal from "./components/event-chart-modal";
import IndicesView from "./components/indices-view";
import NewsView from "./components/news-view";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Tạo mapping từ country.json
const countryIdToCode: Record<number, string> = {};
const countryIdToName: Record<number, string> = {};

countryData.forEach((country) => {
  // Map country_id sang currency code (vì API trả về currency)
  countryIdToCode[country.country_id] = country.currency.substring(0, 2); // USD -> US, CAD -> CA, etc
  countryIdToName[country.country_id] = country.country;
});

// Override một số mapping đặc biệt
const currencyToCountryCode: Record<string, string> = {
  'USD': 'US',
  'CAD': 'CA',
  'MXN': 'MX',
  'EUR': 'EU', // Eurozone
  'CHF': 'CH',
  'ILS': 'IL',
  'AUD': 'AU',
  'JPY': 'JP',
  'SGD': 'SG',
  'CNY': 'CN',
  'NZD': 'NZ',
  'TWD': 'TW',
  'SAR': 'SA',
  'ZAR': 'ZA',
};

export default function Home() {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [tooltip, setTooltip] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<EconomicEvent[] | null>(null);
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'indices' | 'news'>('map');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    countryData.map(c => c.country_id.toString())
  );
  const [selectedImportance, setSelectedImportance] = useState<string[]>(['low', 'medium', 'high']);
  const [selectedChartEvent, setSelectedChartEvent] = useState<{ id: string; name: string } | null>(null);

  // Extract event ID from page_link (e.g., "/indices/us-30" -> extract ID from another source)
  // For now, we'll need to handle this differently since page_link doesn't contain numeric ID
  const extractEventId = (pageLink: string): string | null => {
    // This is a placeholder - you may need to map page_link to actual IDs
    // or get the ID from another field in the event data
    const match = pageLink.match(/\/(\d+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    // Chỉ fetch khi có ít nhất 1 country và 1 importance được chọn
    if (selectedCountries.length > 0 && selectedImportance.length > 0) {
      fetchEvents(selectedDate);
    } else {
      setEvents([]);
      setLoading(false);
    }
  }, [selectedDate, selectedCountries, selectedImportance]);

  const fetchEvents = async (date: string) => {
    setLoading(true);
    try {
      const countries = selectedCountries.join(',');
      const importance = selectedImportance.join(',');
      const response = await fetch(`/api/economic-events?date=${date}&countries=${countries}&importance=${importance}`);
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 0], zoom: 1 });
  };

  // Nhóm sự kiện theo quốc gia (dùng currency để map)
  const eventsByCountry = events.reduce((acc: Record<string, EconomicEvent[]>, event) => {
    const countryCode = currencyToCountryCode[event.currency];
    
    // Debug: log các currency không có trong mapping
    if (!countryCode) {
      console.log('Unknown currency:', event.currency, 'Country ID:', event.country_id);
      return acc;
    }
    
    if (!acc[countryCode]) {
      acc[countryCode] = [];
    }
    acc[countryCode].push(event);
    return acc;
  }, {});

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return '#EF4444'; // red
      case 'medium': return '#F59E0B'; // orange
      case 'low': return '#10B981'; // green
      default: return '#6B7280'; // gray
    }
  };

  return (
    <div className="relative w-screen h-screen bg-zinc-50 dark:bg-black overflow-hidden">
      {/* Date Picker */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-lg shadow-lg">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-black dark:text-white font-medium outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg shadow-lg font-medium transition-colors ${
            showFilters
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700'
          }`}
        >
           Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-20 left-4 z-10 w-80">
          <FilterPanel
            selectedCountries={selectedCountries}
            selectedImportance={selectedImportance}
            onCountriesChange={setSelectedCountries}
            onImportanceChange={setSelectedImportance}
          />
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-1 flex gap-1">
        <button
          onClick={() => setViewMode('map')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'map'
              ? 'bg-blue-500 text-white'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
          }`}
        >
           Map
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'list'
              ? 'bg-blue-500 text-white'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
          }`}
        >
           List
        </button>
        <button
          onClick={() => setViewMode('indices')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'indices'
              ? 'bg-blue-500 text-white'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
          }`}
        >
           Indices
        </button>
        <button
          onClick={() => setViewMode('news')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'news'
              ? 'bg-blue-500 text-white'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
          }`}
        >
           News
        </button>
      </div>

      {/* Zoom Controls - Only show in map mode */}
      {viewMode === 'map' && (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-lg shadow-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center text-xl font-bold text-black dark:text-white"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-lg shadow-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center text-xl font-bold text-black dark:text-white"
          >
            −
          </button>
          <button
            onClick={handleReset}
            className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-lg shadow-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center text-xs font-bold text-black dark:text-white"
          >
            ⟲
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && <LoadingSpinner />}

      {/* Country Tooltip - Only in map mode */}
      {viewMode === 'map' && tooltip && !selectedEvents && (
        <div className="absolute top-20 left-4 z-10 bg-white dark:bg-zinc-800 px-4 py-2 rounded-lg shadow-lg text-black dark:text-white font-medium">
          {tooltip}
        </div>
      )}

      {/* Events Sidebar - Only in map mode */}
      {viewMode === 'map' && selectedEvents && (
        <div className="absolute top-0 right-0 h-full w-96 bg-white dark:bg-zinc-800 shadow-2xl z-40 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                {selectedEvents.length} economic events
              </span>
            </div>
            <button
              onClick={() => setSelectedEvents(null)}
              className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-xl font-bold"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selectedEvents.map((event) => (
              <div key={event.event_id} className="border-b border-zinc-200 dark:border-zinc-700 pb-3 last:border-0">
                <div className="flex items-start gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    event.importance === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                    event.importance === 'medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                    'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  }`}>
                    {event.importance}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {event.currency}
                  </span>
                  <button
                    onClick={() => {
                      const eventId = extractEventId(event.page_link);
                      if (eventId) {
                        setSelectedChartEvent({ id: eventId, name: event.event_translated || event.short_name });
                      }
                    }}
                    className="ml-auto text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    📊 Chart
                  </button>
                </div>
                <a
                  href={`https://www.investing.com${event.page_link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-black dark:text-white mb-2 text-sm hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer block"
                >
                  {event.event_translated || event.short_name}
                </a>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                  {event.description}
                </p>
                <div className="text-xs text-zinc-500 dark:text-zinc-500">
                  {event.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart Modal */}
      {selectedChartEvent && (
        <EventChartModal
          eventId={selectedChartEvent.id}
          eventName={selectedChartEvent.name}
          onClose={() => setSelectedChartEvent(null)}
        />
      )}

      {/* Content Area */}
      {viewMode === 'map' ? (
        /* Map View */
        <div className="w-full h-full">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 147,
            }}
            width={800}
            height={600}
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              {/* Glow filter for high importance */}
              <filter id="glow-high" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Glow filter for medium importance */}
              <filter id="glow-medium" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates as [number, number]}
              onMoveEnd={(position) => setPosition(position)}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }: any) =>
                  geographies.map((geo: any) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#D6D6DA"
                      stroke="#FFF"
                      strokeWidth={0.5}
                      onMouseEnter={() => {
                        setTooltip(geo.properties.name);
                      }}
                      onMouseLeave={() => {
                        setTooltip("");
                      }}
                      style={{
                        default: { fill: "#D6D6DA", outline: "none" },
                        hover: { fill: "#F53", outline: "none", cursor: "pointer" },
                        pressed: { fill: "#E42", outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Event Markers */}
              {Object.entries(eventsByCountry).map(([country, countryEvents]) => {
                const coordinates = countryCoordinates[country];
                if (!coordinates) {
                  console.log('No coordinates for country:', country);
                  return null;
                }

                // Lấy importance cao nhất để quyết định màu
                const highestImportance = countryEvents.reduce((max, event) => {
                  if (event.importance === 'high') return 'high';
                  if (event.importance === 'medium' && max !== 'high') return 'medium';
                  return max;
                }, 'low' as string);

                const markerColor = getImportanceColor(highestImportance);
                const glowFilter = highestImportance === 'high' ? 'url(#glow-high)' : 
                                   highestImportance === 'medium' ? 'url(#glow-medium)' : 
                                   'none';

                return (
                  <Marker key={country} coordinates={coordinates}>
                    <g
                      onClick={() => setSelectedEvents(countryEvents)}
                      style={{ cursor: "pointer" }}
                      filter={glowFilter}
                    >
                      {/* Outer glow circles */}
                      {highestImportance === 'high' && (
                        <>
                          <circle
                            r={20}
                            fill={markerColor}
                            opacity={0.15}
                          />
                          <circle
                            r={14}
                            fill={markerColor}
                            opacity={0.25}
                          />
                        </>
                      )}
                      {highestImportance === 'medium' && (
                        <circle
                          r={14}
                          fill={markerColor}
                          opacity={0.2}
                        />
                      )}
                      
                      {/* Main marker */}
                      <circle
                        r={8}
                        fill={markerColor}
                        stroke="#FFF"
                        strokeWidth={2}
                      />
                      <circle
                        r={4}
                        fill="#FFF"
                      />
                      
                      {/* Event count */}
                      <text
                        textAnchor="middle"
                        y={-12}
                        style={{
                          fontFamily: "system-ui",
                          fill: "#000",
                          fontSize: "12px",
                          fontWeight: "bold",
                          filter: "none"
                        }}
                      >
                        {countryEvents.length}
                      </text>
                    </g>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="w-full h-full overflow-auto pt-20 px-4 pb-4">
          <div className="max-w-7xl mx-auto">
            <NewsList selectedDate={selectedDate} />
          </div>
        </div>
      ) : viewMode === 'indices' ? (
        /* Indices View */
        <IndicesView />
      ) : (
        /* News View */
        <NewsView />
      )}
    </div>
  );
}
