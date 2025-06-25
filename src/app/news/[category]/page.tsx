"use client";
import { NewsItem } from "@/app/type";
import { getCategoryNameInBangla } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";

const CategoryNewspage = () => {
  const [categoryNews, setCategoryNews] = useState<NewsItem[]>([]);
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { category } = useParams();
  const categoryName = category?.toString();

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
          (item) => item.category.toLowerCase() === categoryName
        );
        setCategoryNews(filteredNews);
        setAllNews(data); // Store all news for the sidebar
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [categoryName]);

  if (error) {
    return (
      <div className="lg:mt-[7rem] border-t mb-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (loading === null) {
    return (
      <div className="lg:mt-[7rem] border-t mb-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
          <div className="text-center py-8">Loading news...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:mt-[7rem] border-t mb-5">
      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
        <div className="lg:border-b lg:mb-10">
          <h1 className="text-2xl font-bold lg:mb-6">
            {getCategoryNameInBangla(categoryName as string)}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="lg:w-2/3 lg:pr-5 lg:border-r  relative">
            {/* Horizontal divider for mobile */}
            <div className="lg:hidden w-full border-b my-6"></div>

            {categoryNews.length === 0 ? (
              <div className="text-center py-8">Not found</div>
            ) : (
              <div className="border-b">
                {categoryNews.slice(0, 1).map((newsItem) => (
                  <Link
                    key={newsItem.id}
                    href={`/news/${newsItem.category}/${newsItem.id}`}
                  >
                    <div className="flex flex-col lg:flex-row-reverse gap-5 mb-8 group">
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
                          <p className="line-clamp-4">{newsItem.content}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <IoMdTime />
                          <p className="text-sm text-gray-500">
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
                ))}
              </div>
            )}

            <div className="mt-5">
              {categoryNews.length === 0 ? (
                <div className="text-center py-8">Not found</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {categoryNews.slice(1).map((newsItem, index) => (
                    <Link
                      href={`/news/${newsItem.category}/${newsItem.id}`}
                      key={newsItem.id}
                    >
                      <div
                        className={`flex flex-row-reverse gap-5 mb-1 ${
                          index % 2 === 0 ? "lg:pr-1" : "lg:pl-1"
                        } relative group after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-full after:h-px after:bg-gray-200 dark:after:bg-gray-700 ${
                          index % 2 === 0
                            ? "lg:before:content-[''] lg:before:absolute lg:before:-right-2 lg:before:top-0 lg:before:h-full lg:before:w-px lg:before:bg-gray-200 dark:lg:before:bg-gray-700"
                            : ""
                        }`}
                      >
                        {newsItem.image && (
                          <div className="flex-1 overflow-hidden">
                            <Image
                              src={
                                newsItem.image
                                  ? `/${newsItem.image}`
                                  : "/news1.jpeg"
                              }
                              width={500}
                              height={500}
                              alt={newsItem.title}
                              className="w-full h-auto object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
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
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-1/3 lg:pl-5">
            {/* Latest News Section */}
            <div className="rounded-lg">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b">সর্বশেষ</h2>
              <div className="space-y-3">
                {allNews
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(0, 5)
                  .map((news) => (
                    <div
                      key={news.id}
                      className="pb-4 border-b group last:border-b-0 w-full"
                    >
                      <div className="flex gap-4 w-full">
                        <div className="flex-1 min-w-0">
                          {" "}
                          {/* Added min-w-0 to prevent text overflow */}
                          <h3 className="font-medium text-lg group-hover:text-blue-500">
                            {news.title}
                          </h3>{" "}
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
                          {/* Added line-clamp for consistent height */}
                        </div>
                        <div className="flex-shrink-0 overflow-hidden">
                          {" "}
                          {/* Changed to flex-shrink-0 and added rounded */}
                          <Image
                            src={news.image ? `/${news.image}` : "/news1.jpeg"}
                            width={124}
                            height={83}
                            alt={news.title}
                            className="w-[124px] h-[83px] object-cover transition-transform duration-400 ease-out group-hover:scale-105"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNewspage;
