"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoMdTime } from "react-icons/io";
import { NewsItems } from "@/sanity/sanityTypes";
import { getNewsByCategory } from "@/sanity/sanityQueries";
import Loading from "@/components/shared/Loading";
import ErrorComponent from "@/components/shared/Error";

interface CategorySection {
  title: string;
  category: string;
  news: NewsItems[];
}

const ChtNewspage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categorySections, setCategorySections] = useState<CategorySection[]>(
    []
  );
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before running effects
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch news data from Sanity and filter by categories
  useEffect(() => {
    // Don't run during SSR/prerendering
    if (!mounted || typeof window === "undefined") return;

    const fetchAndFilterNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Define categories to filter
        const categories = [
          { title: "রাঙামাটি", category: "rangamati" },
          { title: "খাগড়াছড়ি", category: "khagrachari" },
          { title: "বান্দরবান", category: "bandarban" },
        ];

        // Fetch news for each category with error handling
        const categorySections = await Promise.allSettled(
          categories.map(async (cat) => {
            try {
              const categoryNews = await getNewsByCategory(cat.category);
              return {
                title: cat.title,
                category: cat.category,
                news: Array.isArray(categoryNews)
                  ? categoryNews.slice(0, 12)
                  : [],
              };
            } catch (err) {
              console.error(`Error fetching news for ${cat.category}:`, err);
              return {
                title: cat.title,
                category: cat.category,
                news: [],
              };
            }
          })
        );

        // Handle settled promises
        const resolvedSections = categorySections.map((result, index) => {
          if (result.status === "fulfilled") {
            return result.value;
          } else {
            console.error(
              `Failed to fetch category ${categories[index].category}:`,
              result.reason
            );
            return {
              title: categories[index].title,
              category: categories[index].category,
              news: [],
            };
          }
        });

        setCategorySections(resolvedSections);
      } catch (err) {
        console.error("Error fetching and filtering news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterNews();
  }, [mounted]);

  // Helper function to get first text block content
  const getFirstTextContent = (content: NewsItems["content"]): string => {
    if (!content || !Array.isArray(content)) return "";
    const firstTextBlock = content.find((block) => block._type === "textBlock");
    return firstTextBlock?.text || "";
  };

  const truncateContent = (content: string, maxLength: number) => {
    if (!content || content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Don't render anything during SSR
  if (!mounted) {
    return null;
  }

  // Loading state
  if (loading) {
    return <Loading loading={loading} />;
  }

  // Error state
  if (error) {
    return <ErrorComponent error={error} />;
  }

  // Render each category section
  const renderCategorySection = (section: CategorySection) => {
    if (!section.news || section.news.length === 0) {
      return (
        <div className="mb-12" key={section.category}>
          <div className="md:mb-2 border-l-4 border-red-500 pl-3">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b pb-2">
              {section.title}
            </h2>
          </div>
          <div className="text-center flex justify-center items-center py-8 text-gray-500 dark:text-gray-400">
            No news articles available for {section.title}
          </div>
        </div>
      );
    }

    const firstNews = section.news[0];
    if (!firstNews) return null;

    return (
      <div className="mb-12" key={section.category}>
        {/* Section Title */}
        <div className="md:mb-2 border-l-4 border-red-500 pl-3">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b pb-2">
            {section.title}
          </h2>
        </div>

        <div className="">
          {/* Main Featured News */}
          <div className="mb-6">
            <Link href={`/news/${firstNews.category}/${firstNews._id}`}>
              <div className="flex lg:flex-row-reverse flex-col xl:h-[300px] gap-5 group border-b pb-3">
                <div className="flex-1 relative overflow-hidden">
                  <Image
                    src={firstNews.featuredImage?.asset?.url || "/news1.jpeg"}
                    width={500}
                    height={500}
                    alt={
                      firstNews.featuredImage?.alt ||
                      firstNews?.title ||
                      "News image"
                    }
                    className="w-full lg:h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl lg:text-3xl font-bold leading-tight mb-4 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100">
                    {firstNews?.title}
                  </h3>
                  <p className="hidden lg:block text-base leading-relaxed mb-4 dark:text-gray-300">
                    {truncateContent(
                      getFirstTextContent(firstNews?.content || []),
                      150
                    )}
                  </p>
                  <div className="flex items-center gap-1">
                    <IoMdTime />
                    <p className="text-xs text-gray-500">
                      {formatDate(firstNews.publishedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Two Cards Section */}
          {section.news.length > 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-3 mb-6">
              {section.news.slice(1, 3).map((item, index) => {
                if (!item) return null;
                return (
                  <Link
                    key={item._id}
                    href={`/news/cht/${item.category}/${item._id}`}
                  >
                    <div
                      className={`flex flex-row-reverse gap-5 group ${
                        index === 0
                          ? "md:border-r md:border-b-0 md:border-gray-300 md:pr-6 border-b dark:md:border-gray-700"
                          : ""
                      }`}
                    >
                      <div className="flex-1 relative overflow-hidden">
                        <Image
                          src={item.featuredImage?.asset?.url || "/news1.jpeg"}
                          width={400}
                          height={250}
                          alt={
                            item.featuredImage?.alt ||
                            item.title ||
                            "News image"
                          }
                          className="w-full lg:h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xl font-bold leading-tight mb-3 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 hidden lg:block dark:text-gray-400 line-clamp-2 leading-relaxed text-justify">
                            {truncateContent(
                              getFirstTextContent(item.content),
                              50
                            )}
                          </p>
                          <div className="flex items-center gap-1">
                            <IoMdTime />
                            <p className="text-xs text-gray-500">
                              {formatDate(item.publishedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Six Cards Grid Section */}
          {section.news.length > 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 py-3 lg:border-b border-t border-gray-300 dark:border-gray-700">
              {section.news.slice(0, 6).map((item, index) => {
                if (!item) return null;

                const rowNumber = Math.floor(index / 3) + 1;
                const isFirstRow = rowNumber === 1;
                const isSecondRow = rowNumber === 2;
                const isLastInRow = (index + 1) % 3 === 0;

                return (
                  <Link
                    key={item._id}
                    href={`/news/cht/${item.category}/${item._id}`}
                  >
                    <div
                      className={`flex h-full flex-row-reverse gap-5 border-b lg:border-b-0 pb-2 lg:pb-0 mb-1 ${
                        index % 2 === 0 ? "lg:pr-1" : "lg:pl-1"
                      } relative group ${
                        isFirstRow
                          ? "after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-full after:h-px lg:after:bg-gray-400 lg:dark:after:bg-gray-700"
                          : ""
                      } ${
                        (isFirstRow || isSecondRow) && !isLastInRow
                          ? "lg:before:content-[''] lg:before:absolute lg:before:-right-2 lg:before:top-0 lg:before:h-full lg:before:w-px lg:before:bg-gray-400 dark:lg:before:bg-gray-700"
                          : ""
                      }`}
                    >
                      <div className="flex-1 relative overflow-hidden">
                        <Image
                          src={item.featuredImage?.asset?.url || "/news1.jpeg"}
                          width={500}
                          height={100}
                          alt={
                            item.featuredImage?.alt ||
                            item.title ||
                            "News image"
                          }
                          className="w-full h-auto object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-semibold text-gray-800 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <IoMdTime />
                          <p className="text-xs text-gray-500">
                            {formatDate(item.publishedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* View More Button */}
          <div className="text-center mb-8">
            <Link
              href={`/news/cht/${section.category}`}
              className="inline-block px-6 py-3 bg-green-700 text-white hover:bg-green-800 transition-colors duration-300 font-medium"
            >
              আরও
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full px-4 lg:px-0 max-w-7xl mx-auto mt-8">
      {/* Category Sections */}
      {categorySections.map((section) => renderCategorySection(section))}

      {/* No data state */}
      {categorySections.every((section) => section.news.length === 0) && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400 flex justify-center items-center h-screen">
          <p className="text-xl mb-4">কোন সংবাদ পাওয়া যায়নি</p>
        </div>
      )}
    </div>
  );
};

export default ChtNewspage;
