"use client";
import { NewsItem } from "@/app/type";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const KhagrachariNews = () => {
  const [rangamatiNews, setRangamatiNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/news.json");
        if (!response.ok) {
          throw new Error("Failed to fetch news data");
        }
        const data: NewsItem[] = await response.json();
        // Filter news for Rangamati category
        const filteredNews = data.filter(
          (item) => item.category.toLowerCase() === "khagrachari"
        );
        setRangamatiNews(filteredNews);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (error) {
    return (
      <div className="mt-[7rem] border-t border-gray-100 mb-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-[7rem] border-t dark:border-gray-700 border-gray-200 mb-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
          <div className="text-center py-8">Loading news...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[4rem] border-r">
      <div className="max-w-7xl mx-auto px-4 lg:px-0 pb-5">
        <div className="mb-2 border-l-4 border-red-500 pl-3">
          <h1 className="text-2xl font-bold">খাগড়াছড়ি</h1>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="lg:pr-3 relative">
            {/* Horizontal divider for mobile */}
            <div className="lg:hidden w-full border-b border-gray-200 my-6"></div>

            {rangamatiNews.length === 0 ? (
              <div className="text-center py-8">Not found</div>
            ) : (
              <div className="flex flex-col gap-5 border-t border-b pt-10 pb-5">
                <div className=" border-gray-200">
                  {rangamatiNews.slice(0, 1).map((newsItem) => (
                    <Link
                      key={newsItem.id}
                      href={`/news/rangamati/${newsItem.id}`}
                    >
                      <div className="flex flex-col gap-5 group border-b pb-10">
                        {newsItem.image && (
                          <div className="flex-1 relative overflow-hidden">
                            <Image
                              src={`/news1.jpeg`}
                              width={500}
                              height={500}
                              alt={newsItem.title}
                              className="w-full h-auto object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h2 className="mb-2 text-xl lg:text-3xl font-bold leading-tight group-hover:text-blue-500">
                            {newsItem.title}
                          </h2>
                          <div className="flex justify-between items-center text-gray-500">
                            <p className="line-clamp-2">{newsItem.content}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="">
                  {rangamatiNews.length === 0 ? (
                    <div className="text-center py-8">Not found</div>
                  ) : (
                    <div className="space-y-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
                      {rangamatiNews.slice(1, 4).map((newsItem, index) => (
                        <Link
                          href={`news/rangamati/${newsItem.id}`}
                          key={newsItem.id}
                        >
                          <div
                            className={`flex flex-col gap-5 group ${
                              index < 2
                                ? "lg:border-r lg:pr-5"
                                : ""
                            }`}
                          >
                            {newsItem.image && (
                              <div className="flex-1 overflow-hidden">
                                <Image
                                  src={`/news1.jpeg`}
                                  width={500}
                                  height={500}
                                  alt={newsItem.title}
                                  className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-500">
                                {newsItem.title}
                              </h2>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KhagrachariNews;
