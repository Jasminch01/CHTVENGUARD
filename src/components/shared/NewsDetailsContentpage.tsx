"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NewsMainContent from "@/components/NewsMainContent";
import NewsSidebar from "@/components/NewsSideBar";
import { NewsItems } from "@/sanity/sanityTypes";
import {
  getNewsItem,
  getRecentNews,
  getRelatedNews,
} from "@/sanity/sanityQueries";
import Loading from "@/components/shared/Loading";
import ErrorComponent from "@/components/shared/Error";

interface Props {
  newsId: string;
}

const NewsDetailsContentpage = ({ newsId }: Props) => {
  const router = useRouter();
  const [newsItem, setNewsItem] = useState<NewsItems | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItems[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItems[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      if (!newsId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch main news item
        const mainNewsItem = await getNewsItem(newsId);

        if (!mainNewsItem) {
          setError("News item not found");
          return;
        }

        setNewsItem(mainNewsItem);

        // Fetch related news and latest news in parallel
        const [relatedNewsData, latestNewsData] = await Promise.all([
          getRelatedNews(newsId, mainNewsItem.category, 5).catch((err) => {
            console.error("Error fetching related news:", err);
            return [];
          }),
          getRecentNews(3).catch((err) => {
            console.error("Error fetching latest news:", err);
            return [];
          }),
        ]);

        setRelatedNews(relatedNewsData);
        setLatestNews(latestNewsData);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  // Update document title dynamically for better client-side navigation
  useEffect(() => {
    if (newsItem) {
      document.title = `${newsItem.title} | Your Site Name`;
    }
  }, [newsItem]);

  if (loading) {
    return <Loading loading={loading} />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!newsItem) {
    return (
      <div className="max-w-4xl mx-auto p-4 h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-600">
            News item not found.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
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
