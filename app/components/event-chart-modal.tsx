"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EventChartModalProps {
  eventId: string | null;
  eventName: string;
  onClose: () => void;
}

interface ChartDataPoint {
  date: string;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

export default function EventChartModal({ eventId, eventName, onClose }: EventChartModalProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.investing.com/api/financialdata/${eventId}/historical/chart/?interval=P1D&pointscount=160`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }
        
        const data = await response.json();
        
        // Convert data array to chart format
        // Format: [timestamp, open, high, low, close, volume, ?]
        const formattedData = data.data.map((item: number[]) => ({
          date: new Date(item[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          open: item[1],
          high: item[2],
          low: item[3],
          close: item[4],
          volume: item[5],
        }));
        
        setChartData(formattedData);
      } catch (err) {
        console.error('Error fetching chart:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [eventId]);

  if (!eventId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            {eventName}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-zinc-600 dark:text-zinc-400">Loading chart...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-64">
              <div className="text-red-500">Error: {error}</div>
            </div>
          )}

          {!loading && !error && chartData.length > 0 && (
            <div className="space-y-4">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Latest Close</div>
                  <div className="text-lg font-bold text-zinc-900 dark:text-white">
                    {chartData[chartData.length - 1]?.close.toFixed(2)}
                  </div>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">High</div>
                  <div className="text-lg font-bold text-green-500">
                    {Math.max(...chartData.map(d => d.high)).toFixed(2)}
                  </div>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Low</div>
                  <div className="text-lg font-bold text-red-500">
                    {Math.min(...chartData.map(d => d.low)).toFixed(2)}
                  </div>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Change</div>
                  <div className={`text-lg font-bold ${
                    chartData[chartData.length - 1]?.close > chartData[0]?.close 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {((chartData[chartData.length - 1]?.close - chartData[0]?.close) / chartData[0]?.close * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
