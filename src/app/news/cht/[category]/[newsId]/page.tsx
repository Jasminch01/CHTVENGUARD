"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { NewsItem } from "@/app/type";
import NewsMainContent from "@/components/NewsMainContent";
import NewsSidebar from "@/components/NewsSideBar";

const NewsDetailsContentpage = () => {
  const { newsId } = useParams();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/news.json");
        if (!response.ok) {
          throw new Error("Failed to fetch news data");
        }
        const data: NewsItem[] = await response.json();

        // Find the specific news item by ID
        const foundNewsItem = data.find((item) => item.id === newsId);

        if (foundNewsItem) {
          setNewsItem(foundNewsItem);

          // Get related news from the same category, excluding current news
          const related = data
            .filter(
              (item) =>
                item.category === foundNewsItem.category &&
                item.id !== foundNewsItem.id
            )
            .slice(0, 5);

          setRelatedNews(related);

          // Get latest news (sorted by publishedAt, excluding current news)
          const latest = data
            .filter((item) => item.id !== foundNewsItem.id)
            .sort(
              (a, b) =>
                new Date(b.publishedAt).getTime() -
                new Date(a.publishedAt).getTime()
            )
            .slice(0, 6);

          setLatestNews(latest);
        } else {
          setError("News item not found");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    };

    if (newsId) {
      fetchNews();
    }
  }, [newsId]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }

  if (!newsItem) {
    return (
      <div className="max-w-4xl mx-auto p-4 h-screen">News item not found.</div>
    );
  }

  return (
    <div className="my-[7rem] border-t">
      <div className="max-w-7xl mx-auto mt-3 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <NewsMainContent newsItem={newsItem} latestNews={latestNews} />

          <NewsSidebar relatedNews={relatedNews} category={newsItem.category} />
        </div>
      </div>
    </div>
  );
};

export default NewsDetailsContentpage;
