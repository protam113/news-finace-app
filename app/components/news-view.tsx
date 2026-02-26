"use client";

import { useState, useEffect } from "react";

interface NewsArticle {
  url: string;
  linkText: string;
  headline: string;
  trailText: string;
  image: string;
  byline: string;
  webPublicationDate: string;
  sectionName?: string;
  pillarName?: string;
}

export default function NewsView() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/guardian-news');
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-zinc-600 dark:text-zinc-400">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto pt-20 px-4 pb-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
          Most Viewed News
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02] group"
            >
              <div className="relative h-48 overflow-hidden bg-zinc-200 dark:bg-zinc-700">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.headline}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                {article.sectionName && (
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded mb-2">
                    {article.sectionName}
                  </span>
                )}
                
                <h2 className="font-bold text-lg text-zinc-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                  {article.headline}
                </h2>
                
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-3">
                  {stripHtml(article.trailText)}
                </p>
                
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-500">
                  {article.byline && (
                    <span className="truncate">{article.byline}</span>
                  )}
                  <span className="ml-auto">
                    {formatDate(article.webPublicationDate)}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            No news available
          </div>
        )}
      </div>
    </div>
  );
}
