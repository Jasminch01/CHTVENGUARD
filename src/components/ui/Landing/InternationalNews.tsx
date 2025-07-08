"use client";
import ErrorComponent from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import { getNewsByCategory } from "@/sanity/sanityQueries";
import { NewsItems } from "@/sanity/sanityTypes";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";

const InternationalNews = () => {
  const [internationalNews, setinternationalNews] = useState<NewsItems[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getNewsByCategory("international");
        setinternationalNews(res);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);
  const getTextContent = (content: NewsItems["content"]) => {
    if (!content || content.length === 0) return "";

    // Find the first text block and return its text
    const textBlock = content.find((block) => block._type === "textBlock");
    return textBlock?.text || "";
  };

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <div className="mt-[4rem]">
      <div className="max-w-7xl mx-auto pb-5">
        <div className="md:mb-2 border-l-4 border-red-500 pl-3">
          <h1 className="text-2xl font-bold">আন্তর্জাতিক</h1>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex flex-col lg:flex-row">
            {/* Main Content */}
            <div className="lg:pr-3 relative">
              {/* Horizontal divider for mobile */}
              <div className="lg:hidden w-full border-b my-6"></div>

              {internationalNews.length === 0 ? (
                <div className="text-center py-8">Not found</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 lg:border-t lg:border-b pt-10 pb-5">
                  {/* Main featured article - spans 3 rows on desktop */}
                  {internationalNews[0] && (
                    <Link
                      href={`/news/bandarban/${internationalNews[0]._id}`}
                      key={internationalNews[0]._id}
                      className="md:row-span-3"
                    >
                      <div className="flex flex-col gap-4 h-full group lg:border-r lg:pr-4">
                        {internationalNews[0]?.featuredImage && (
                          <div className="flex-1 relative overflow-hidden">
                            <Image
                              src={
                                internationalNews[0]?.featuredImage.asset.url
                              }
                              width={500}
                              height={500}
                              alt={
                                internationalNews[0].featuredImage?.alt ||
                                internationalNews[0].title
                              }
                              className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                            />
                          </div>
                        )}
                        <div className="flex-shrink-0">
                          <h2 className="text-xl lg:text-2xl font-bold leading-tight group-hover:text-blue-500 mb-2">
                            {internationalNews[0]?.title}
                          </h2>
                          <p className="text-gray-600 line-clamp-3">
                            {getTextContent(internationalNews[0]?.content)}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <IoMdTime />
                            <p className="text-sm text-gray-500">
                              {internationalNews[0]?.publishedAt &&
                                new Date(
                                  internationalNews[0].publishedAt
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
                  {internationalNews.slice(1, 7).map((newsItem, index) => {
                    const rowNumber = Math.floor(index / 3) + 1;
                    const isFirstRow = rowNumber === 1;
                    const isSecondRow = rowNumber === 2;
                    const isLastInRow = (index + 1) % 3 === 0;
                    return (
                      <Link
                        href={`/news/bandarban/${newsItem._id}`}
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
                          className={`flex h-full flex-row-reverse gap-3 border-b md:border-b-0 pb-4 md:pb-0 mb-4 md:mb-0 relative group ${
                            (isFirstRow || isSecondRow) && !isLastInRow
                              ? "after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-px md:after:bg-gray-400 md:dark:after:bg-gray-700"
                              : ""
                          } ${
                            index === 0 || index === 1 || index === 2
                              ? "md:before:content-[''] md:before:absolute md:before:-right-2 md:before:top-0 md:before:h-full md:before:w-px md:before:bg-gray-400 md:dark:before:bg-gray-700"
                              : ""
                          }`}
                        >
                          {newsItem?.featuredImage && (
                            <div className="flex-1 overflow-hidden">
                              <Image
                                src={newsItem.featuredImage.asset.url}
                                width={300}
                                height={300}
                                alt={
                                  newsItem.featuredImage?.alt || newsItem.title
                                }
                                className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold leading-tight group-hover:text-blue-500 line-clamp-3">
                              {newsItem?.title}
                            </h3>
                            <div className="flex items-center gap-1 mt-2">
                              <IoMdTime />
                              <p className="text-sm text-gray-500">
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
    </div>
  );
};

export default InternationalNews;
