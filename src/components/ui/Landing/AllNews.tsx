"use client";
import React, { useState, useEffect } from "react";
import NewsCards from "./NewsCards";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  image: string;
  category: string;
  tags?: string[];
}

const AllNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/news.json");
        if (!response.ok) {
          throw new Error("Failed to fetch news data");
        }
        const data: NewsItem[] = await response.json();
        console.log(data);
        setNews(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="mt-[7rem] border-t border-gray-100 mb-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
          <div className="text-center py-8">Loading news...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-[7rem] border-t border-gray-100 mb-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[7rem] border-t border-gray-100 mb-5">
      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
        <NewsCards news={news} />
      </div>
    </div>
  );
};

export default AllNews;
