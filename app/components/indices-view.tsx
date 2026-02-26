"use client";

import { useState } from "react";
import EventChartModal from "./event-chart-modal";

interface Index {
  id: string;
  name: string;
  country: string;
  flag: string;
}

const indices: Index[] = [
  { id: "169", name: "Dow Jones", country: "United States", flag: "🇺🇸" },
  { id: "166", name: "S&P 500", country: "United States", flag: "🇺🇸" },
  { id: "14958", name: "Nasdaq", country: "United States", flag: "🇺🇸" },
  { id: "167", name: "Nasdaq 100", country: "United States", flag: "🇺🇸" },
  { id: "8839", name: "S&P 500 VIX", country: "United States", flag: "🇺🇸" },
  { id: "8873", name: "S&P 100", country: "United States", flag: "🇺🇸" },
  { id: "8874", name: "NYSE AMEX Composite", country: "United States", flag: "🇺🇸" },
  { id: "8880", name: "NYSE Composite", country: "United States", flag: "🇺🇸" },
  { id: "8907", name: "Small Cap 2000", country: "United States", flag: "🇺🇸" },
  { id: "8862", name: "DJ Utility", country: "United States", flag: "🇺🇸" },
  { id: "8895", name: "DJ Composite", country: "United States", flag: "🇺🇸" },
  { id: "8906", name: "DJ Transportation", country: "United States", flag: "🇺🇸" },
  { id: "8984", name: "S&P 500 Information Technology", country: "United States", flag: "🇺🇸" },
  { id: "8985", name: "S&P 500 Utilities", country: "United States", flag: "🇺🇸" },
  { id: "8986", name: "S&P 500 Telecom Services", country: "United States", flag: "🇺🇸" },
  { id: "8987", name: "S&P 500 Materials", country: "United States", flag: "🇺🇸" },
  { id: "8988", name: "S&P 500 Real Estate", country: "United States", flag: "🇺🇸" },
  { id: "23705", name: "NQ Bank", country: "United States", flag: "🇺🇸" },
  { id: "23706", name: "NQ Financial 100", country: "United States", flag: "🇺🇸" },
  { id: "23707", name: "NQ Other Finance", country: "United States", flag: "🇺🇸" },
];

export default function IndicesView() {
  const [selectedIndex, setSelectedIndex] = useState<{ id: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIndices = indices.filter(index =>
    index.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    index.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full overflow-auto pt-20 px-4 pb-4">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search indices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Indices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredIndices.map((index) => (
            <button
              key={index.id}
              onClick={() => setSelectedIndex({ id: index.id, name: index.name })}
              className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-all hover:scale-105 text-left"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{index.flag}</span>
                <span className="text-xs text-blue-500 dark:text-blue-400">📊 View Chart</span>
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-1">
                {index.name}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {index.country}
              </p>
            </button>
          ))}
        </div>

        {filteredIndices.length === 0 && (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            No indices found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Chart Modal */}
      {selectedIndex && (
        <EventChartModal
          eventId={selectedIndex.id}
          eventName={selectedIndex.name}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </div>
  );
}
