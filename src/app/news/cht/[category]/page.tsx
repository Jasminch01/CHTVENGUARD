"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { NewsItems } from "@/sanity/sanityTypes";
import { getNewsByCategory, getRecentNews } from "@/sanity/sanityQueries";
import ChtCategoryNewspage from "@/components/shared/ChtCategoryNewsPage";

const Page = () => {
  const [categoryNews, setCategoryNews] = useState<NewsItems[]>([]);
  const [allNews, setAllNews] = useState<NewsItems[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreNews, setHasMoreNews] = useState(true);
  const itemsPerPage = 6;

  const { category } = useParams();
  const categoryName = category?.toString();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setCategoryNews([]);

        // Fetch initial batch of category-specific news
        // We fetch itemsPerPage + 1 extra to check if there are more items
        const categoryData = await getNewsByCategory(
          categoryName as string,
          0,
          itemsPerPage + 1 + 1 // +1 for featured, +1 to check if more exist
        );

        // Take only the items we need for display
        const itemsToDisplay = categoryData.slice(0, itemsPerPage + 1);
        setCategoryNews(itemsToDisplay);

        // Check if there are more items beyond what we're displaying
        setHasMoreNews(categoryData.length > itemsPerPage + 1);

        // Fetch recent news for sidebar
        const recentData = await getRecentNews(10);
        setAllNews(recentData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchNews();
    }
  }, [categoryName]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreNews) return;

    try {
      setLoadingMore(true);

      // Calculate the offset based on current items loaded
      const currentOffset = categoryNews.length;

      // Fetch next batch of news
      const newNews = await getNewsByCategory(
        categoryName as string,
        0, // Start from beginning
        currentOffset + itemsPerPage + 1 // Get all items up to next batch + 1 to check for more
      );

      if (newNews.length > currentOffset) {
        // Get only the new items (skip the ones we already have)
        const newItems = newNews.slice(currentOffset);
        const itemsToAdd = newItems.slice(0, itemsPerPage);

        setCategoryNews((prev) => [...prev, ...itemsToAdd]);

        // Check if there are more items beyond what we just loaded
        setHasMoreNews(newItems.length > itemsPerPage);
      } else {
        setHasMoreNews(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoadingMore(false);
    }
  };

  // Don't render if categoryName is undefined
  if (!categoryName) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Invalid category</div>
      </div>
    );
  }

  return (
    <div>
      <ChtCategoryNewspage
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
