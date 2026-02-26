"use client";

import { useState, useEffect } from "react";
import { EconomicEvent } from "../types/economic-event";

interface NewsListProps {
  selectedDate?: string;
}

export default function NewsList({ selectedDate }: NewsListProps) {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const date = selectedDate || new Date().toISOString().split('T')[0];
    fetchEvents(date);
  }, [selectedDate]);

  const fetchEvents = async (date: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/economic-events?date=${date}`);
      const data = await response.json();
      // Sort by time if available
      const sortedEvents = (data.events || []).sort((a: EconomicEvent, b: EconomicEvent) => {
        return a.event_id - b.event_id;
      });
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getImportanceStars = (importance: string) => {
    switch (importance) {
      case 'high':
        return '★★★';
      case 'medium':
        return '★★☆';
      case 'low':
        return '★☆☆';
      default:
        return '☆☆☆';
    }
  };

  const getCurrencyColor = (currency: string) => {
    const colors: Record<string, string> = {
      'USD': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'EUR': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      'GBP': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'JPY': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      'AUD': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'CAD': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
      'CHF': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
      'NZD': 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
      'SGD': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
      'CNY': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    };
    return colors[currency] || 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-zinc-600 dark:text-zinc-400">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Currency
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Event
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Impact
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Source
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  No events for this date
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr
                  key={event.event_id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100">
                    All Day
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${getCurrencyColor(event.currency)}`}>
                      {event.currency}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100">
                    <div className="font-medium">{event.event_translated || event.short_name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                      {event.description}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <span className={`text-sm ${
                      event.importance === 'high' ? 'text-red-500' :
                      event.importance === 'medium' ? 'text-orange-500' :
                      'text-zinc-400'
                    }`}>
                      {getImportanceStars(event.importance)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {event.source}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
