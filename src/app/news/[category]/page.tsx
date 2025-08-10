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
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMoreNews, setHasMoreNews] = useState(true);
  const itemsPerPage = 7;

  const { category } = useParams();
  const categoryName = category?.toString();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        setCurrentOffset(0);
        setCategoryNews([]);
        setHasMoreNews(true);

        // Fetch first batch of category-specific news
        const categoryData = await getNewsByCategory(
          categoryName as string,
          0,
          itemsPerPage
        );

        if (Array.isArray(categoryData)) {
          setCategoryNews(categoryData);

          // Check if we have more items
          if (categoryData.length < itemsPerPage) {
            setHasMoreNews(false);
          } else {
            // Check if there's more data by fetching 1 item from next position
            const nextBatchCheck = await getNewsByCategory(
              categoryName as string,
              0, // page doesn't matter
              1, // just check for 1 item
              itemsPerPage // start from position after current batch
            );
            setHasMoreNews(
              Array.isArray(nextBatchCheck) && nextBatchCheck.length > 0
            );
          }
        } else {
          setCategoryNews([]);
          setHasMoreNews(false);
        }

        // Fetch recent news for sidebar
        const recentData = await getRecentNews(10);
        setAllNews(Array.isArray(recentData) ? recentData : []);
      } catch (err) {
        console.error("Error fetching category news:", err);
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
    if (loadingMore || !hasMoreNews || !categoryName) return;

    try {
      setLoadingMore(true);
      setError(null);
      const nextOffset = currentOffset + itemsPerPage;

      // Fetch next batch of items using offset
      const newNews = await getNewsByCategory(
        categoryName as string,
        0, // page doesn't matter
        itemsPerPage, // fetch 6 items
        nextOffset // start from the correct offset
      );

      if (Array.isArray(newNews) && newNews.length > 0) {
        // Add the new items to existing ones
        setCategoryNews((prev) => [...prev, ...newNews]);
        setCurrentOffset(nextOffset);

        // Check if we have more items
        if (newNews.length < itemsPerPage) {
          // If we got fewer than itemsPerPage items, no more items exist
          setHasMoreNews(false);
        } else {
          // Check if there's another batch after this one
          const nextBatchCheck = await getNewsByCategory(
            categoryName as string,
            0, // page doesn't matter
            1, // just check for 1 item
            nextOffset + itemsPerPage // check from next position
          );
          setHasMoreNews(
            Array.isArray(nextBatchCheck) && nextBatchCheck.length > 0
          );
        }
      } else {
        // No more items to load
        setHasMoreNews(false);
      }
    } catch (err) {
      console.error("Error loading more category news:", err);
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
          <p className="text-gray-600">
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
