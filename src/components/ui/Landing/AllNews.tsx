"use client";
import React, { useState, useEffect } from "react";
import NewsCards from "./NewsCards";
import { NewsItem } from "@/app/type";

const AllNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use absolute URL in production or relative path
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? (process.env.NEXT_PUBLIC_SITE_URL || '') 
          : '';
        
        const response = await fetch(`${baseUrl}/news.json`, {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not valid JSON');
        }
        
        const data = await response.json();
        
        // Validate data structure
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format: expected an array');
        }
        
        setNews(data);
      } catch (err) {
        console.error("Error fetching news:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load news data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [mounted]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="mb-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mb-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading news...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
          <div className="text-center py-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
                Unable to Load News
              </h2>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle empty news array
  if (news.length === 0) {
    return (
      <div className="mb-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No news articles available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5">
      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
        <NewsCards news={news} />
      </div>
    </div>
  );
};

export default AllNews;
