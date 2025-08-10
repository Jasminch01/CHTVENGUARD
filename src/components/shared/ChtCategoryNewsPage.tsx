/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getCategoryNameInBangla } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoMdTime } from "react-icons/io";
import { NewsItems } from "@/sanity/sanityTypes";
import ErrorComponent from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";

export interface CategoryNewspageProps {
  categoryName: string;
  categoryDisplayName?: string; // Optional prop for display name
  categoryNews: NewsItems[];
  allNews: NewsItems[];
  loading: boolean;
  error: string | null;
  onLoadMore?: () => Promise<void>;
  hasMoreNews?: boolean;
  loadingMore?: boolean;
}

const ChtCategoryNewspage: React.FC<CategoryNewspageProps> = ({
  categoryName,
  categoryDisplayName,
  categoryNews,
  allNews,
  loading,
  error,
  onLoadMore,
  hasMoreNews = false,
  loadingMore = false,
}) => {

  // Helper function to extract text from Sanity rich text blocks
  const getFirstTextContent = (content: NewsItems["content"]): string => {
    if (!content || !Array.isArray(content)) return "";

    const firstTextBlock = content.find((block) => block._type === "textBlock");
    if (!firstTextBlock || !firstTextBlock.text) return "";

    // Handle Sanity's rich text structure
    if (Array.isArray(firstTextBlock.text)) {
      return firstTextBlock.text
        .map((textBlock: any) => {
          if (textBlock._type === "block" && textBlock.children) {
            return textBlock.children
              .filter((child: any) => child._type === "span")
              .map((span: any) => span.text || "")
              .join("");
          }
          return "";
        })
        .join(" ")
        .trim();
    }

    // Fallback for simple string content
    return typeof firstTextBlock.text === "string" ? firstTextBlock.text : "";
  };

  // Helper function to truncate content
  const truncateContent = (content: string, maxLength: number) => {
    if (!content || content.length <= maxLength) return content;
    const truncated = content.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return lastSpace > maxLength * 0.8
      ? truncated.substring(0, lastSpace) + "..."
      : truncated + "...";
  };

  // Helper function to format date safely
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
      return "তারিখ অনুপলব্ধ";
    }
  };

  // Helper function to generate news URL
  const getNewsUrl = (newsItem: NewsItems) => {
    // For CHT categories, use the CHT prefix
    if (["rangamati", "khagrachari", "bandarban"].includes(newsItem.category)) {
      return `/news/cht/${newsItem.category}/${newsItem._id}`;
    }
    // For other categories, use standard structure
    return `/news/${newsItem.category}/${newsItem._id}`;
  };

  // Function to render news sections
  const renderNewsSections = () => {
    const sections = [];
    const newsItems = categoryNews.slice(1); // Skip first item (featured)

    if (newsItems.length === 0) {
      return null;
    }

    for (let i = 0; i < newsItems.length; i += 6) {
      const sectionItems = newsItems.slice(i, i + 6);
      const sectionIndex = Math.floor(i / 6);

      sections.push(
        <div
          key={`section-${sectionIndex}`}
          className={`${
            sectionIndex > 0
              ? "mt-8 pt-8 border-t border-gray-300 dark:border-gray-600"
              : ""
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sectionItems.map((newsItem, index) => {
              if (!newsItem || !newsItem._id) return null;

              const itemIndexInSection = index;
              // Check if this is the 5th or 6th item in the current section (index 4 or 5)
              const isLastTwoInSection = itemIndexInSection >= 4;

              // Show bottom border unless it's the 5th or 6th item in the section
              const shouldShowBottomBorder = !isLastTwoInSection;

              return (
                <Link href={getNewsUrl(newsItem)} key={newsItem._id}>
                  <div
                    className={`flex flex-row-reverse gap-3 lg:gap-5 w-full mb-1 pb-3 ${
                      itemIndexInSection % 2 === 0 ? "lg:pr-1" : "lg:pl-1"
                    } relative group ${
                      shouldShowBottomBorder
                        ? "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-gray-200 dark:after:bg-gray-700"
                        : ""
                    } ${
                      itemIndexInSection % 2 === 0
                        ? "lg:before:content-[''] lg:before:absolute lg:before:-right-2 lg:before:top-0 lg:before:h-full lg:before:w-px lg:before:bg-gray-200 dark:lg:before:bg-gray-700"
                        : ""
                    }`}
                  >
                    <div className="flex-1 overflow-hidden">
                      <Image
                        src={
                          newsItem.featuredImage?.asset?.url || "/news1.jpeg"
                        }
                        width={200}
                        height={120}
                        alt={
                          newsItem.featuredImage?.alt ||
                          newsItem.title ||
                          "News image"
                        }
                        className="w-[100px] h-[75px] lg:w-full lg:h-[75px] xl:h-[120px] object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                      />
                    </div>
                    <div className="flex-2 min-w-0">
                      <h2 className="text-sm lg:text-base xl:text-lg font-semibold mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100 line-clamp-3 leading-tight">
                        {newsItem.title}
                      </h2>
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <IoMdTime className="text-xs flex-shrink-0" />
                        <p className="text-xs">
                          {formatDate(newsItem.publishedAt)}
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

  if (loading) {
    return <Loading loading={loading} />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <div className="border-t mb-5">
      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
        <div className="border-b lg:mb-10">
          <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            {categoryDisplayName || getCategoryNameInBangla(categoryName)}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="lg:w-2/3 lg:pr-5 lg:border-r border-gray-300 dark:border-gray-700 relative">
            {/* Horizontal divider for mobile */}
            <div className="lg:hidden w-full border-b border-gray-300 dark:border-gray-700 my-6"></div>

            {!categoryNews || categoryNews.length === 0 ? (
              <div className="text-center flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <p className="text-xl mb-2">কোন সংবাদ পাওয়া যায়নি</p>
                <p className="text-sm">অনুগ্রহ করে পরে আবার চেষ্টা করুন</p>
              </div>
            ) : (
              <>
                {/* Featured News (First Item) */}
                <div className="border-b border-gray-300 dark:border-gray-700 pb-6 mb-6">
                  {categoryNews.slice(0, 1).map((newsItem) => {
                    if (!newsItem || !newsItem._id) return null;

                    return (
                      <Link key={newsItem._id} href={getNewsUrl(newsItem)}>
                        <div className="flex flex-col lg:flex-row-reverse gap-5 group">
                          <div className="flex-1 relative overflow-hidden">
                            <Image
                              src={
                                newsItem.featuredImage?.asset?.url ||
                                "/news1.jpeg"
                              }
                              width={500}
                              height={300}
                              alt={
                                newsItem.featuredImage?.alt ||
                                newsItem.title ||
                                "News image"
                              }
                              className="w-full h-auto lg:h-[300px] object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                              priority
                            />
                          </div>
                          <div className="flex-1">
                            <h2 className="mb-4 text-xl lg:text-3xl font-bold leading-tight group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100">
                              {newsItem.title}
                            </h2>
                            <div className="mb-4">
                              <p className="text-gray-600 dark:text-gray-300 line-clamp-4 leading-relaxed">
                                {truncateContent(
                                  getFirstTextContent(newsItem.content || []),
                                  200
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <IoMdTime className="text-sm" />
                              <p className="text-sm">
                                {formatDate(newsItem.publishedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* News Sections */}
                <div className="mt-5">
                  {categoryNews.length > 1 ? (
                    <>
                      {renderNewsSections()}

                      {/* Load More button or End message */}
                      {hasMoreNews && onLoadMore ? (
                        <div className="mt-8 pt-4 border-t border-gray-300 dark:border-gray-600">
                          <div className="flex justify-center">
                            <button
                              onClick={onLoadMore}
                              disabled={loadingMore}
                              className="px-6 py-3 bg-green-700 text-white hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                            >
                              {loadingMore ? "লোড হচ্ছে..." : "আরও দেখুন"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        // End border when no more news
                        categoryNews.length > 1 && (
                          <div className="mt-8 pt-4 border-t border-gray-300 dark:border-gray-600">
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                              সব খবর দেখানো হয়েছে
                            </div>
                          </div>
                        )
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      আর কোন সংবাদ নেই
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-1/3 lg:pl-5 mt-10 lg:mt-0">
            {/* Latest News Section */}
            <div className="rounded-lg sticky top-20">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                সর্বশেষ
              </h2>
              <div className="space-y-3">
                {allNews && allNews.length > 0 ? (
                  allNews.slice(0, 5).map((news) => {
                    if (!news || !news._id) return null;

                    return (
                      <Link key={news._id} href={getNewsUrl(news)}>
                        <div className="pb-4 border-b border-gray-200 dark:border-gray-700 group last:border-b-0 w-full">
                          <div className="flex gap-4 w-full">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-base lg:text-lg group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100 line-clamp-3 leading-tight mb-2">
                                {news.title}
                              </h3>
                              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <IoMdTime className="text-xs flex-shrink-0" />
                                <p className="text-xs">
                                  {formatDate(news.publishedAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 overflow-hidden">
                              <Image
                                src={
                                  news.featuredImage?.asset?.url ||
                                  "/news1.jpeg"
                                }
                                width={100}
                                height={75}
                                alt={
                                  news.featuredImage?.alt ||
                                  news.title ||
                                  "News image"
                                }
                                className="w-[100px] h-[75px] object-cover transition-transform duration-400 ease-out group-hover:scale-105"
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    কোন সাম্প্রতিক সংবাদ নেই
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChtCategoryNewspage;
