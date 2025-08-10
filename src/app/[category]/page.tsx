"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { NewsItems } from "@/sanity/sanityTypes";
import { getNewsByCategory, getRecentNews } from "@/sanity/sanityQueries";
import CategoryNewspage from "@/components/shared/CategoryNewsPage";

const Page = () => {
  const [categoryNews, setCategoryNews] = useState<NewsItems[]>([]);
  const [allNews, setAllNews] = useState<NewsItems[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreNews, setHasMoreNews] = useState(true);
  const itemsPerPage = 6;

  const { category } = useParams();
  const categoryName = category?.toString();

  useEffect(() => {
    const fetchNews = async () => {
      if (!categoryName) return;

      try {
        setLoading(true);
        setError(null);
        setCurrentPage(0);
        setCategoryNews([]);
        setHasMoreNews(true);

        // Fetch first page of category-specific news
        const categoryData = await getNewsByCategory(
          categoryName,
          0,
          itemsPerPage + 1
        ); // +1 to check if there are more items

        setCategoryNews(categoryData.slice(0, itemsPerPage));

        // Check if there are more items
        setHasMoreNews(categoryData.length > itemsPerPage);

        // Fetch recent news for sidebar
        const recentData = await getRecentNews(10);
        setAllNews(recentData);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [categoryName]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreNews || !categoryName) return;

    try {
      setLoadingMore(true);
      setError(null);
      const nextPage = currentPage + 1;

      // Fetch next page of news
      const newNews = await getNewsByCategory(
        categoryName,
        nextPage,
        itemsPerPage + 1
      ); // +1 to check if there are more items

      if (newNews.length > 0) {
        const newsToAdd = newNews.slice(0, itemsPerPage);
        setCategoryNews((prev) => [...prev, ...newsToAdd]);
        setCurrentPage(nextPage);

        // Check if there are more items
        setHasMoreNews(newNews.length > itemsPerPage);
      } else {
        setHasMoreNews(false);
      }
    } catch (err) {
      console.error("Error loading more news:", err);
      setError(err instanceof Error ? err.message : "Failed to load more news");
    } finally {
      setLoadingMore(false);
    }
  };

  // Don't render if categoryName is undefined
  if (!categoryName) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Invalid Category
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The requested category could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CategoryNewspage
        categoryName={categoryName}
        categoryNews={categoryNews}
        allNews={allNews}
        loading={loading}
        error={error}
        onLoadMore={handleLoadMore}
        hasMoreNews={hasMoreNews}
        loadingMore={loadingMore}
      />
    </div>
  );
};

export default Page;
