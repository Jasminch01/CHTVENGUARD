"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Types
interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  createdAt?: string;
  author?: string;
}

interface CategorySection {
  title: string;
  category: string;
  news: NewsItem[];
}

const ChtNewspage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categorySections, setCategorySections] = useState<CategorySection[]>(
    []
  );

  // Fetch news data from news.json and filter by categories
  useEffect(() => {
    const fetchAndFilterNews = async () => {
      try {
        setLoading(true);

        // Fetch all news from news.json
        const response = await fetch("/news.json");
        if (!response.ok) {
          throw new Error("Failed to fetch news data");
        }

        const allNews: NewsItem[] = await response.json();

        // Define categories to filter
        const categories = [
          { title: "রাঙামাটি", category: "rangamati" },
          { title: "খাগড়াছড়ি", category: "khagrachari" },
          { title: "বান্দরবান", category: "bandarban" },
        ];

        // Filter news by category and limit to 12 items per category
        const categorySections = categories.map((cat) => {
          const filteredNews = allNews
            .filter(
              (news) =>
                news.category.toLowerCase() === cat.category.toLowerCase()
            )
            .slice(0, 12); // Limit to 12 items per category

          return {
            title: cat.title,
            category: cat.category,
            news: filteredNews,
          };
        });

        setCategorySections(categorySections);
        setError(null);
      } catch (err) {
        console.error("Error fetching and filtering news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterNews();
  }, []);

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full">
        <div className="text-center flex h-screen justify-center items-center py-8 text-red-500">
          <div>
            <p className="text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render each category section
  const renderCategorySection = (section: CategorySection) => {
    if (!section.news || section.news.length === 0) {
      return (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b pb-2">
            {section.title}
          </h2>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No news articles available for {section.title}
          </div>
        </div>
      );
    }

    return (
      <div className="mb-12">
        {/* Section Title */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b pb-2">
          {section.title}
        </h2>

        <div className="">
          {/* Main Featured News */}
          <div className="mb-6">
            <Link
              href={`/news/${section.news[0].category}/${section.news[0].id}`}
            >
              <div className="flex lg:flex-row-reverse flex-col xl:h-[300px] gap-5 group border-b pb-3">
                <div className="flex-1 relative overflow-hidden">
                  <Image
                    src={
                      section.news[0].image
                        ? `/${section.news[0].image}`
                        : "/news1.jpeg"
                    }
                    width={500}
                    height={500}
                    alt={section.news[0]?.title}
                    className="w-full lg:h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl lg:text-3xl font-bold leading-tight mb-4 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100">
                    {section.news[0]?.title}
                  </h3>
                  <p className="hidden lg:block text-base leading-relaxed mb-4 dark:text-gray-300">
                    {truncateContent(section.news[0]?.content || "", 150)}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Two Cards Section */}
          {section.news.length > 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-3 mb-6">
              {section.news.slice(1, 3).map((item, index) => (
                <Link key={item.id} href={`/news/cht/${item.category}/${item.id}`}>
                  <div
                    className={`flex flex-row-reverse gap-5 group ${
                      index === 0
                        ? "md:border-r md:border-b-0 md:border-gray-300 md:pr-6 border-b dark:md:border-gray-700"
                        : ""
                    }`}
                  >
                    <div className="flex-1 relative overflow-hidden">
                      <Image
                        src={item.image ? `/${item.image}` : "/news1.jpeg"}
                        width={400}
                        height={250}
                        alt={item.title}
                        className="w-full lg:h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xl font-bold leading-tight mb-3 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 hidden lg:block dark:text-gray-400 line-clamp-2 leading-relaxed text-justify">
                          {truncateContent(item.content, 50)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Six Cards Grid Section */}
          {section.news.length > 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 py-3 lg:border-b border-t border-gray-300 dark:border-gray-700">
              {section.news.slice(0, 6).map((item, index) => {
                const rowNumber = Math.floor(index / 3) + 1;
                const isFirstRow = rowNumber === 1;
                const isSecondRow = rowNumber === 2;
                const isLastInRow = (index + 1) % 3 === 0;

                return (
                  <Link
                    key={item.id}
                    href={`/news/cht/${item.category}/${item.id}`}
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
                          src={item.image ? `/${item.image}` : "/news1.jpeg"}
                          width={500}
                          height={100}
                          alt={item.title}
                          className="w-full h-auto object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-semibold text-gray-800 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100">
                          {item.title}
                        </h4>
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
    <div className="w-full max-w-7xl mx-auto px-4 lg:mt-[7rem]">
      {/* Category Sections */}
      {categorySections.map((section) => (
        <div key={section.category}>{renderCategorySection(section)}</div>
      ))}

      {/* No data state */}
      {categorySections.every((section) => section.news.length === 0) && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p className="text-xl mb-4">কোন সংবাদ পাওয়া যায়নি</p>
          <p>দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন</p>
        </div>
      )}
    </div>
  );
};

export default ChtNewspage;
