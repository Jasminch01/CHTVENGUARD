"use client";
import { getCategoryNameInBangla } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { IoMdTime } from "react-icons/io";
import { NewsItems } from "@/sanity/sanityTypes";
import {
  getNewsByCategory,
  getRecentNews,
  searchNews,
} from "@/sanity/sanityQueries";

// Separate component for the search functionality
const SearchContent = () => {
  const [searchResults, setSearchResults] = useState<NewsItems[]>([]);
  const [allNews, setAllNews] = useState<NewsItems[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(9); // 1 featured + 8 grid items
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { category } = useParams();
  const searchParams = useSearchParams();
  const categoryName = category?.toString();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        // Get search query from URL parameters
        const queryParam = searchParams.get("q");
        const decodedQuery = queryParam ? decodeURIComponent(queryParam) : "";
        setSearchQuery(decodedQuery);

        let newsData: NewsItems[] = [];

        if (decodedQuery) {
          // Search for news with the query parameter
          newsData = await searchNews(decodedQuery);
        } else if (categoryName) {
          // If no search query, get news by category
          newsData = await getNewsByCategory(categoryName);
        } else {
          // Get recent news as fallback
          newsData = await getRecentNews(20);
        }

        setSearchResults(newsData);

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

    fetchNews();
  }, [categoryName, searchParams]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 8);
  };

  const hasMoreNews = displayCount < searchResults.length;

  // Function to render news sections in groups of 8
  const renderNewsSections = () => {
    const sections = [];
    const newsItems = searchResults.slice(1, displayCount); // Skip first item (featured)

    for (let i = 0; i < newsItems.length; i += 8) {
      const sectionItems = newsItems.slice(i, i + 8);
      const sectionIndex = Math.floor(i / 8);

      sections.push(
        <div
          key={`section-${sectionIndex}`}
          className={`${
            sectionIndex > 0
              ? "mt-8 pt-8 border-t-2 border-gray-300 dark:border-gray-600"
              : ""
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sectionItems.map((newsItem, index) => {
              const itemIndexInSection = index;
              // Check if this is the 7th or 8th item in the current section (index 6 or 7)
              const isLastTwoInSection = itemIndexInSection >= 6;

              // Show bottom border unless it's the 7th or 8th item in the section
              const shouldShowBottomBorder = !isLastTwoInSection;

              return (
                <Link
                  href={`/news/${newsItem.category}/${newsItem._id}`}
                  key={newsItem._id}
                >
                  <div
                    className={`flex flex-row-reverse gap-5 w-full mb-1 ${
                      itemIndexInSection % 2 === 0 ? "lg:pr-1" : "lg:pl-1"
                    } relative group ${
                      shouldShowBottomBorder
                        ? "after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-full after:h-px after:bg-gray-200 dark:after:bg-gray-700"
                        : ""
                    } ${
                      itemIndexInSection % 2 === 0
                        ? "lg:before:content-[''] lg:before:absolute lg:before:-right-2 lg:before:top-0 lg:before:h-full lg:before:w-px lg:before:bg-gray-200 dark:lg:before:bg-gray-700"
                        : ""
                    }`}
                  >
                    {newsItem.featuredImage && (
                      <div className="flex-1 overflow-hidden">
                        <Image
                          src={
                            newsItem.featuredImage.asset.url || "/news1.jpeg"
                          }
                          width={500}
                          height={500}
                          alt={newsItem.featuredImage.alt || newsItem.title}
                          className="w-[124px] h-auto lg:w-[110px] lg:h-[75px] xl:w-[180px] xl:h-[120px] object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-500">
                        {newsItem.title}
                      </h2>
                      <div className="flex items-center gap-1">
                        <IoMdTime />
                        <p className="text-xs text-gray-500">
                          {new Date(newsItem.publishedAt).toLocaleDateString(
                            "bn-BD",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              weekday: "long",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      );
    }

    return sections;
  };

  // Function to get page title based on search query or category
  const getPageTitle = () => {
    if (searchQuery) {
      return `"${searchQuery}" এর জন্য অনুসন্ধান ফলাফল`;
    }
    if (categoryName) {
      return getCategoryNameInBangla(categoryName);
    }
    return "সংবাদ";
  };

  // Function to get results count message
  const getResultsMessage = () => {
    if (searchQuery) {
      return `"${searchQuery}" এর জন্য ${searchResults.length} টি ফলাফল পাওয়া গেছে`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="border-t mb-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-t mb-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t mb-5">
      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
        <div className="border-b lg:mb-10">
          <h1 className="text-2xl font-bold mb-6">{getPageTitle()}</h1>
          {/* Show search results count */}
          {getResultsMessage() && (
            <p className="text-gray-600 mb-4 text-sm">{getResultsMessage()}</p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="lg:w-2/3 lg:pr-5 lg:border-r relative">
            {/* Horizontal divider for mobile */}
            <div className="lg:hidden w-full lg:border-b lg:my-6"></div>

            {searchResults.length === 0 ? (
              <div className="text-center flex items-center justify-center h-screen">
                {searchQuery ? (
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">
                      কোন ফলাফল পাওয়া যায়নি
                    </h2>
                    <p className="text-gray-600">
                      &quot;{searchQuery}&quot; এর জন্য কোন সংবাদ পাওয়া যায়নি।
                      অন্য শব্দ দিয়ে চেষ্টা করুন।
                    </p>
                  </div>
                ) : (
                  "Not found"
                )}
              </div>
            ) : (
              <>
                {/* Featured News (First Item) */}
                <div className="border-b">
                  {searchResults.slice(0, 1).map((newsItem) => (
                    <Link
                      key={newsItem._id}
                      href={`/news/${newsItem.category}/${newsItem._id}`}
                    >
                      <div className="flex flex-col lg:flex-row-reverse gap-5 mb-8 group">
                        {newsItem.featuredImage && (
                          <div className="flex-1 relative overflow-hidden">
                            <Image
                              src={
                                newsItem.featuredImage.asset.url ||
                                "/news1.jpeg"
                              }
                              width={500}
                              height={500}
                              alt={newsItem.featuredImage.alt || newsItem.title}
                              className="w-full h-auto object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h2 className="mb-2 text-xl lg:text-3xl font-bold leading-tight group-hover:text-blue-500">
                            {newsItem.title}
                          </h2>
                          <div className="flex items-center gap-1 mt-2">
                            <IoMdTime />
                            <p className="text-sm text-gray-500">
                              {new Date(
                                newsItem.publishedAt
                              ).toLocaleDateString("bn-BD", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                weekday: "long",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* News Sections */}
                <div className="mt-5">
                  {searchResults.length > 1 ? (
                    <>
                      {renderNewsSections()}

                      {/* Divider before Load More button */}
                      {hasMoreNews && (
                        <div className="mt-8 pt-4">
                          <div className="flex justify-center">
                            <button
                              onClick={handleLoadMore}
                              className="px-5 py-3 bg-green-700 text-white hover:bg-green-800 transition-colors duration-200 font-medium"
                            >
                              আরও দেখুন
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">No more news found</div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-1/3 lg:pl-5 mt-20 lg:mt-0">
            {/* Latest News Section */}
            <div className="rounded-lg sticky top-20">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b">সর্বশেষ</h2>
              <div className="space-y-3">
                {allNews.slice(0, 5).map((news) => (
                  <Link
                    key={news._id}
                    href={`/news/${news.category}/${news._id}`}
                  >
                    <div className="pb-4 border-b group last:border-b-0 w-full">
                      <div className="flex gap-4 w-full">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-lg group-hover:text-blue-500">
                            {news.title}
                          </h3>
                          <div className="flex items-center gap-1">
                            <IoMdTime />
                            <p className="text-xs text-gray-500">
                              {new Date(news.publishedAt).toLocaleDateString(
                                "bn-BD",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  weekday: "long",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 overflow-hidden">
                          <Image
                            src={
                              news.featuredImage?.asset?.url || "/news1.jpeg"
                            }
                            width={124}
                            height={83}
                            alt={news.featuredImage?.alt || news.title}
                            className="w-[124px] h-[83px] object-cover transition-transform duration-400 ease-out group-hover:scale-105"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading component for Suspense fallback
const SearchPageLoading = () => (
  <div className="border-t mb-5">
    <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
      <div className="text-center py-8">Loading...</div>
    </div>
  </div>
);

// Main component with Suspense wrapper
const Searchpage = () => {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchContent />
    </Suspense>
  );
};

export default Searchpage;