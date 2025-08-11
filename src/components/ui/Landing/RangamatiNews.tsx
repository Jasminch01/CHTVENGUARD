/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ErrorComponent from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import { getNewsByCategory } from "@/sanity/sanityQueries";
import { NewsItems, ContentBlock } from "@/sanity/sanityTypes";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";

const RangamatiNews = () => {
  const [rangamatiNews, setRangamatiNews] = useState<NewsItems[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getNewsByCategory("rangamati");
        setRangamatiNews(res);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Updated function to extract text content from rich text blocks
  const extractTextFromContent = (content: ContentBlock[]): string => {
    return content
      .filter((block) => block._type === "textBlock")
      .map((block) => {
        // Handle the new rich text editor structure
        if (Array.isArray(block.text)) {
          return block.text
            .filter((item: any) => item._type === 'block')
            .map((item: any) => {
              return item.children
                ?.filter((child: any) => child._type === 'span')
                ?.map((span: any) => span.text)
                ?.join('') || '';
            })
            .join(' ');
        }
        // Fallback for old simple text structure (if any still exists)
        return typeof block.text === 'string' ? block.text : '';
      })
      .join(" ");
  };

  // Helper function to get text content and truncate it
  const getTextContent = (content: NewsItems["content"]) => {
    if (!content || content.length === 0) return "";
    
    const fullText = extractTextFromContent(content);
    // Truncate to reasonable length for preview
    return fullText.length > 150 ? fullText.substring(0, 150) + "..." : fullText;
  };

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (loading) {
    return (
      <div className="mt-[7rem] border-t border-gray-100 mb-5">
        <Loading loading={loading} />
      </div>
    );
  }

  return (
    <div className="mt-[4rem] lg:border-r dark:lg:border-gray-700">
      <div className="max-w-7xl mx-auto pb-5">
        <div className="md:mb-2 border-l-4 border-red-500 pl-3">
          <h1 className="text-2xl font-bold dark:text-gray-100">রাঙ্গামাটি</h1>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="lg:pr-3 relative">
            {/* Horizontal divider for mobile */}
            <div className="lg:hidden w-full border-b border-gray-200 dark:border-gray-700 my-6"></div>

            {rangamatiNews.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>কোন সংবাদ পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 lg:border-t lg:border-b border-gray-200 dark:border-gray-700 pt-10 pb-5">
                {/* Main featured article - spans 3 rows on desktop */}
                {rangamatiNews[0] && (
                  <Link
                    href={`/news/rangamati/${rangamatiNews[0]._id}`}
                    key={rangamatiNews[0]._id}
                    className="md:row-span-3"
                  >
                    <div className="flex flex-col gap-4 h-full group lg:border-r border-gray-200 dark:border-gray-700 lg:pr-4">
                      {rangamatiNews[0]?.featuredImage && (
                        <div className="flex-1 relative overflow-hidden ">
                          <Image
                            src={rangamatiNews[0]?.featuredImage.asset.url}
                            width={500}
                            height={500}
                            alt={
                              rangamatiNews[0].featuredImage?.alt ||
                              rangamatiNews[0].title
                            }
                            className="w-full h-[19rem] object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        </div>
                      )}
                      <div className="flex-shrink-0">
                        <h2 className="text-xl lg:text-2xl font-bold leading-tight group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100 mb-2">
                          {rangamatiNews[0]?.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                          {getTextContent(rangamatiNews[0]?.content)}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <IoMdTime className="text-gray-500" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {rangamatiNews[0]?.publishedAt &&
                              new Date(
                                rangamatiNews[0].publishedAt
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
                )}

                {/* Secondary articles - 6 smaller cards */}
                {rangamatiNews.slice(1, 7).map((newsItem, index) => {
                  const rowNumber = Math.floor(index / 2) + 1; // Fixed calculation for 2 columns
                  const isFirstRow = rowNumber === 1;
                  const isSecondRow = rowNumber === 2;
                  const isThirdRow = rowNumber === 3;
                  return (
                    <Link
                      href={`/news/rangamati/${newsItem._id}`}
                      key={newsItem._id}
                      className={`
                        ${index === 0 ? "md:col-start-2 md:row-start-1" : ""}
                        ${index === 1 ? "md:col-start-3 md:row-start-1" : ""}
                        ${index === 2 ? "md:col-start-2 md:row-start-2" : ""}
                        ${index === 3 ? "md:col-start-3 md:row-start-2" : ""}
                        ${index === 4 ? "md:col-start-2 md:row-start-3" : ""}
                        ${index === 5 ? "md:col-start-3 md:row-start-3" : ""}
                      `}
                    >
                      <div
                        className={`flex h-full flex-row-reverse gap-3 border-b border-gray-200 dark:border-gray-700 md:border-b-0 pb-4 md:pb-0 mb-4 md:mb-0 relative group ${
                          // Bottom border styling for rows
                          (isFirstRow || isSecondRow) && !isThirdRow
                            ? "after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-px md:after:bg-gray-400 md:dark:after:bg-gray-600"
                            : ""
                        } ${
                          // Right border for first column in each row
                          index % 2 === 0
                            ? "md:before:content-[''] md:before:absolute md:before:-right-2 md:before:top-0 md:before:h-full md:before:w-px md:before:bg-gray-400 md:dark:before:bg-gray-600"
                            : ""
                        }`}
                      >
                        {newsItem?.featuredImage && (
                          <div className="flex-1 overflow-hidden ">
                            <Image
                              src={newsItem.featuredImage.asset.url}
                              width={300}
                              height={300}
                              alt={
                                newsItem.featuredImage?.alt || newsItem.title
                              }
                              className="w-full h-[90px] lg:w-[110px] lg:h-[75px] xl:w-[180px] xl:h-[120px] object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold leading-tight group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100 line-clamp-3 mb-2">
                            {newsItem?.title}
                          </h3>
                          <div className="flex items-center gap-1">
                            <IoMdTime className="text-gray-500 flex-shrink-0" size={14} />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {newsItem?.publishedAt &&
                                new Date(
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

export default RangamatiNews;