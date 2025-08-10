"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { NewsItems } from "@/sanity/sanityTypes";
import { getNewsByCategory, getRecentNews } from "@/sanity/sanityQueries";
import ChtCategoryNewspage from "@/components/shared/ChtCategoryNewsPage";

// Helper function to get category display name
function getCategoryDisplayName(category: string): string {
  const categoryMap = {
    rangamati: "রাঙামাটি",
    khagrachari: "খাগড়াছড়ি",
    bandarban: "বান্দরবান",
  };
  return categoryMap[category as keyof typeof categoryMap] || category;
}

// Validate if category is valid CHT category
function isValidChtCategory(category: string): boolean {
  const validCategories = ["rangamati", "khagrachari", "bandarban"];
  return validCategories.includes(category);
}

const Page = () => {
  const [categoryNews, setCategoryNews] = useState<NewsItems[]>([]);
  const [allNews, setAllNews] = useState<NewsItems[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMoreNews, setHasMoreNews] = useState(true);
  const initialLoadItems = 7;
  const loadMoreItems = 6;

  console.log(categoryNews);

  const { category } = useParams();
  const categoryName = category?.toString();

  useEffect(() => {
    const fetchNews = async () => {
      if (!categoryName) return;

      // Validate CHT category
      if (!isValidChtCategory(categoryName)) {
        setError("Invalid CHT category");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setCurrentOffset(0);
        setCategoryNews([]);
        setHasMoreNews(true);

        // Fetch initial batch - fetch exactly 7 items for display
        const categoryData = await getNewsByCategory(
          categoryName,
          0,
          initialLoadItems
        );

        if (Array.isArray(categoryData)) {
          setCategoryNews(categoryData);

          // Check if we have more items by trying to fetch the next page
          // If we got fewer than initialLoadItems items, there are no more
          if (categoryData.length < initialLoadItems) {
            setHasMoreNews(false);
          } else {
            // Check if there's more data by fetching 1 item starting from offset 7
            const nextBatchCheck = await getNewsByCategory(
              categoryName,
              0, // page doesn't matter
              1, // just check for 1 item
              initialLoadItems // start from position 7
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
        console.error("Error fetching CHT category news:", err);
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
      const nextOffset =
        currentOffset +
        (currentOffset === 0 ? initialLoadItems : loadMoreItems);

      // Fetch next batch of items using offset
      const newNews = await getNewsByCategory(
        categoryName,
        0, // page doesn't matter
        loadMoreItems, // fetch 6 items
        nextOffset // start from the correct offset
      );

      if (Array.isArray(newNews) && newNews.length > 0) {
        // Add the new items to existing ones
        setCategoryNews((prev) => [...prev, ...newNews]);
        setCurrentOffset(nextOffset);

        // Check if we have more items
        if (newNews.length < loadMoreItems) {
          // If we got fewer than loadMoreItems items, no more items exist
          setHasMoreNews(false);
        } else {
          // Check if there's another batch after this one
          const nextBatchCheck = await getNewsByCategory(
            categoryName,
            0, // page doesn't matter
            1, // just check for 1 item
            nextOffset + loadMoreItems // check from next position
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
      console.error("Error loading more CHT news:", err);
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
            The requested CHT category could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Invalid CHT category
  if (!isValidChtCategory(categoryName)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Invalid CHT Category
          </h1>
          <p className="text-gray-600">
            Valid categories are: Rangamati, Khagrachari, Bandarban
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ChtCategoryNewspage
        categoryName={categoryName}
        categoryDisplayName={getCategoryDisplayName(categoryName)}
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
