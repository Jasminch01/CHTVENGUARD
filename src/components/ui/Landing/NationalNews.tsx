/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ErrorComponent from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import { getNewsByCategory } from "@/sanity/sanityQueries";
import { NewsItems } from "@/sanity/sanityTypes";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";

const NationalNews = () => {
  const [nationalNews, setNationalNews] = useState<NewsItems[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getNewsByCategory("national");
        setNationalNews(res);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Helper function to extract text from Sanity rich text blocks
  const getTextContent = (content: NewsItems["content"]): string => {
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
    return `/news/${newsItem.category}/${newsItem._id}`;
  };

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (loading) {
    return (
      <div className="mt-[7rem] border-t border-gray-100 dark:border-gray-700 mb-5">
        <Loading loading={loading} />
      </div>
    );
  }

  return (
    <div className="mt-[4rem]">
      <div className="max-w-7xl mx-auto lg:px-0 pb-5">
        <div className="md:mb-2 border-l-4 border-red-500 pl-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            জাতীয়
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="lg:pr-3 relative">
            {/* Horizontal divider for mobile */}
            <div className="lg:hidden w-full border-b border-gray-300 dark:border-gray-700 my-6"></div>

            {!nationalNews || nationalNews.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                কোন সংবাদ পাওয়া যায়নি
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 lg:border-t lg:border-b border-gray-300 dark:border-gray-700 pt-10 pb-5">
                {/* Main featured article - spans 3 rows on desktop */}
                {nationalNews[0] && (
                  <Link
                    href={getNewsUrl(nationalNews[0])}
                    key={nationalNews[0]._id}
                    className="md:row-span-3"
                  >
                    <div className="flex flex-col gap-4 h-full group lg:border-r border-gray-300 dark:border-gray-700 lg:pr-4">
                      {nationalNews[0]?.featuredImage?.asset?.url && (
                        <div className="flex-1 relative overflow-hidden">
                          <Image
                            src={nationalNews[0].featuredImage.asset.url}
                            width={500}
                            height={500}
                            alt={
                              nationalNews[0].featuredImage?.alt ||
                              nationalNews[0].title ||
                              "News image"
                            }
                            className="w-full h-[19rem] object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                            priority
                          />
                        </div>
                      )}
                      <div className="flex-shrink-0">
                        <h2 className="text-xl lg:text-2xl font-bold leading-tight group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100 mb-2">
                          {nationalNews[0]?.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                          {truncateContent(
                            getTextContent(nationalNews[0]?.content || []),
                            150
                          )}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-gray-500 dark:text-gray-400">
                          <IoMdTime className="text-sm flex-shrink-0" />
                          <p className="text-sm">
                            {nationalNews[0]?.publishedAt &&
                              formatDate(nationalNews[0].publishedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Secondary articles - 6 smaller cards */}
                {nationalNews.slice(1, 7).map((newsItem, index) => {
                  if (!newsItem || !newsItem._id) return null;

                  const rowNumber = Math.floor(index / 3) + 1;
                  const isFirstRow = rowNumber === 1;
                  const isSecondRow = rowNumber === 2;
                  const isLastInRow = (index + 1) % 3 === 0;

                  return (
                    <Link
                      href={getNewsUrl(newsItem)}
                      key={newsItem._id}
                      className={`
                        ${index === 0 ? "md:col-start-2 md:row-start-1" : ""}
                        ${index === 1 ? "md:col-start-2 md:row-start-2" : ""}
                        ${index === 2 ? "md:col-start-2 md:row-start-3" : ""}
                        ${index === 3 ? "md:col-start-3 md:row-start-1" : ""}
                        ${index === 4 ? "md:col-start-3 md:row-start-2" : ""}
                        ${index === 5 ? "md:col-start-3 md:row-start-3" : ""}
                      `}
                    >
                      <div
                        className={`flex h-full flex-row-reverse gap-3 border-b border-gray-200 dark:border-gray-700 md:border-b-0 pb-4 md:pb-0 mb-4 md:mb-0 relative group ${
                          (isFirstRow || isSecondRow) && !isLastInRow
                            ? "after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-px md:after:bg-gray-400 md:dark:after:bg-gray-700"
                            : ""
                        } ${
                          index === 0 || index === 1 || index === 2
                            ? "md:before:content-[''] md:before:absolute md:before:-right-2 md:before:top-0 md:before:h-full md:before:w-px md:before:bg-gray-400 md:dark:before:bg-gray-700"
                            : ""
                        }`}
                      >
                        {newsItem?.featuredImage?.asset?.url && (
                          <div className="flex-1 overflow-hidden">
                            <Image
                              src={newsItem.featuredImage.asset.url}
                              width={300}
                              height={300}
                              alt={
                                newsItem.featuredImage?.alt ||
                                newsItem.title ||
                                "News image"
                              }
                              className="w-full h-[90px] lg:h-[75px] xl:h-[120px] object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg lg:text-xl font-semibold leading-tight group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100 line-clamp-3 mb-2">
                            {newsItem?.title}
                          </h3>
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <IoMdTime className="text-xs flex-shrink-0" />
                            <p className="text-sm">
                              {newsItem?.publishedAt &&
                                formatDate(newsItem.publishedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NationalNews;
