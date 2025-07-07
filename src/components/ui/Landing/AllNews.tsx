"use client";
import React, { useState, useEffect } from "react";
import NewsCards from "./NewsCards";
import { getNewsItemsAllCategories } from "@/sanity/sanityQueries";
import { NewsItems } from "@/sanity/sanityTypes";
import Loading from "@/components/shared/Loading";
import ErrorComponent from "@/components/shared/Error";

const AllNews: React.FC = () => {
  const [news, setNews] = useState<NewsItems[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getNewsItemsAllCategories();
        setNews(res);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <Loading loading={loading} />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  // Handle empty news array
  if (news.length === 0) {
    return (
      <div className="mb-5">
        <div className="max-w-7xl h-screen flex justify-center items-center mx-auto px-4 lg:px-0 py-8">
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No news articles available at the moment.
            </p>
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
