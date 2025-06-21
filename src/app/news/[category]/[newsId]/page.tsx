"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NewsItem } from "@/app/type";

const NewsDetailsContentpage = () => {
  const { newsId } = useParams();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getCategoryNameInBangla = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      rangamati: "রাঙামাটি",
      khagrachari: "খাগড়াছড়ি",
      bandarban: "বান্দরবান",
      chittagong: "চট্টগ্রাম",
      international: "আন্তর্জাতিক",
      national: "জাতীয়",
    };

    return categoryMap[category.toLowerCase()] || category;
  };

  // Function to split content into paragraphs of 4 lines each
  const formatContentIntoParagraphs = (content: string) => {
    // Split content into sentences
    const sentences = content
      .split(/(?<=[।.!?])\s+/)
      .filter((sentence) => sentence.trim().length > 0);

    // Group sentences into paragraphs of 4 sentences each
    const paragraphs = [];
    for (let i = 0; i < sentences.length; i += 4) {
      const paragraph = sentences.slice(i, i + 4).join(" ");
      if (paragraph.trim()) {
        paragraphs.push(paragraph);
      }
    }

    return paragraphs;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/news.json");
        if (!response.ok) {
          throw new Error("Failed to fetch news data");
        }
        const data: NewsItem[] = await response.json();

        // Find the specific news item by ID
        const foundNewsItem = data.find((item) => item.id === newsId);

        if (foundNewsItem) {
          setNewsItem(foundNewsItem);

          // Get related news from the same category, excluding current news
          const related = data
            .filter(
              (item) =>
                item.category === foundNewsItem.category &&
                item.id !== foundNewsItem.id
            )
            .slice(0, 5); // Get first 5 related news

          setRelatedNews(related);
        } else {
          setError("News item not found");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    };

    if (newsId) {
      fetchNews();
    }
  }, [newsId]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }

  if (!newsItem) {
    return <div className="max-w-4xl mx-auto p-4">News item not found.</div>;
  }

  const contentParagraphs = formatContentIntoParagraphs(newsItem.content);

  return (
    <div className="mt-[7rem] border-t border-gray-100 mb-5">
      <div className="max-w-7xl mx-auto mt-3 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="border-b pb-5">
              <span className="border-b pb-1">
                {getCategoryNameInBangla(newsItem.category)}
              </span>
              <h1 className="text-3xl font-bold mt-3">{newsItem.title}</h1>
            </div>

            <div className="text-gray-500 my-3">
              <div className="flex flex-col space-y-1">
                <p className="font-medium">{newsItem.author}</p>
                <p className="text-sm">
                  {new Date(newsItem.publishedAt).toLocaleDateString("bn-BD", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}{" "}
                  -{" "}
                  {new Date(newsItem.publishedAt).toLocaleTimeString("bn-BD", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>

            {newsItem.image && (
              <div className="mb-6">
                <Image
                  src={`/news1.jpeg`}
                  width={800}
                  height={500}
                  alt={newsItem.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            <div className="space-y-6">
              {contentParagraphs.map((paragraph, index) => (
                <p key={index} className="text-xl leading-relaxed text-justify">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 mt-20">
            <div className="sticky top-[5rem]">
              <div className="">
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                  আরও পড়ুন
                </h3>

                <div className="space-y-4">
                  {relatedNews.length > 0 ? (
                    relatedNews.map((news) => (
                      <Link
                        key={news.id}
                        href={`/news/${news.category}/${news.id}`}
                        className="block group"
                      >
                        <div className="pb-4">
                          <div className="flex-1">
                            <h4 className="text-lg border-b pb-2 font-medium text-gray-900 line-clamp-3 group-hover:text-blue-600 transition-colors duration-300">
                              {news.title}
                            </h4>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      কোন সম্পর্কিত খবর পাওয়া যায়নি।
                    </p>
                  )}
                </div>

                {relatedNews.length > 0 && (
                  <div className="mt-6 pt-4">
                    <Link
                      href={`/news/${newsItem.category}`}
                      className="inline-block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 text-sm font-medium"
                    >
                      আরও {getCategoryNameInBangla(newsItem.category)} খবর
                    </Link>
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

export default NewsDetailsContentpage;
