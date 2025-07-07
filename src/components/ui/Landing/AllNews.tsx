"use client";
import React, { useState, useEffect } from "react";
import NewsCards from "./NewsCards";
import { getNewsItemsAllCategories } from "@/sanity/sanityQueries";
import { NewsItems } from "@/sanity/sanityTypes";

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
    return (
      <div className="mb-5">
        <div className="max-w-7xl h-screen flex justify-center items-center mx-auto px-4 lg:px-0 py-8">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Loading news...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-5">
        <div className="max-w-7xl h-screen flex justify-center items-center mx-auto px-4 lg:px-0">
          <div className="text-center py-8">
            <div className="">
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
                Somthing is Wrong
              </h2>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200 cursor-pointer"
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
