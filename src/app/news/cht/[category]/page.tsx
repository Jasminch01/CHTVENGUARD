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
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreNews, setHasMoreNews] = useState(true);
  const itemsPerPage = 6;

  const { category } = useParams();
  const categoryName = category?.toString();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setCurrentPage(0);
        setCategoryNews([]);

        // Fetch first page of category-specific news
        const categoryData = await getNewsByCategory(
          categoryName as string,
          0,
          itemsPerPage + 1
        ); // +1 for featured
        setCategoryNews(categoryData);

        // Check if there are more items
        setHasMoreNews(categoryData.length === itemsPerPage + 1);

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
    if (loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;

      // Fetch next page of news
      const newNews = await getNewsByCategory(
        categoryName as string,
        nextPage,
        itemsPerPage
      );

      if (newNews.length > 0) {
        setCategoryNews((prev) => [...prev, ...newNews]);
        setCurrentPage(nextPage);

        // Check if there are more items
        setHasMoreNews(newNews.length === itemsPerPage);
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
