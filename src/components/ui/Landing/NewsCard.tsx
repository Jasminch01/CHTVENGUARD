import Image from "next/image";
import React, { SetStateAction, useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  image: string;
  category: string;
  tags?: string[];
}

interface NewsCardsProps {
  news: NewsItem[];
}

const RightSidebar: React.FC<{ news: NewsItem[] }> = ({ news }) => {
  const [activeTab, setActiveTab] = useState<"popular" | "latest" | "trending">(
    "popular"
  );

  const tabs = [
    { key: "popular", label: "জনপ্রিয়" },
    { key: "latest", label: "সর্বশেষ" },
    { key: "trending", label: "ট্রেন্ডিং" },
  ];

  const getTabNews = () => {
    switch (activeTab) {
      case "popular":
        return news.slice(0, 8);
      case "latest":
        return news.slice(2, 10);
      case "trending":
        return news.slice(4, 12);
      default:
        return news.slice(0, 8);
    }
  };

  return (
    <div className="sticky top-4 bg-white">
      {/* Advertisement Space */}
      <div className="bg-gray-100 border border-gray-300 p-4 mb-6 text-center">
        <div className="text-gray-500 text-sm">বিজ্ঞাপন</div>
        <div className="h-32 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center mt-2 rounded">
          <span className="text-gray-400">বিজ্ঞাপন</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border border-gray-300 mb-6">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(
                  tab.key as SetStateAction<"popular" | "latest" | "trending">
                )
              }
              className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? "bg-red-600 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          <div className="space-y-4">
            {getTabNews().map((item, index) => (
              <div
                key={item.id}
                className="flex space-x-3 pb-4 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-red-600 text-white text-xs font-bold rounded">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 mb-1 hover:text-red-600 cursor-pointer transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>
                      {new Date(item.publishedAt).toLocaleDateString("bn-BD")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weather Widget */}
      {/* <div className="bg-blue-50 border border-blue-200 p-4 mb-6 rounded-lg">
        <h3 className="text-lg font-bold text-blue-800 mb-3">আবহাওয়া</h3>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-900">৩২°C</div>
          <div className="text-sm text-blue-700">চট্টগ্রাম</div>
          <div className="text-xs text-blue-600 mt-1">আংশিক মেঘলা</div>
        </div>
      </div> */}
    </div>
  );
};

const NewsCards: React.FC<NewsCardsProps> = ({ news }) => {
  if (!news || news.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No news articles available
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="w-full bg-white">
      <div className="flex gap-6">
        {/* Left Main Content */}
        <div className="flex-1">
          {/* Main Featured News Section */}
          <div className="mb-8">
            <div className="flex flex-row-reverse h-[400px] gap-5">
              <div className="flex-1">
                <Image
                  src={"/news1.jpeg"}
                  width={500}
                  height={500}
                  alt={news[0]?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-xl lg:text-3xl font-bold text-gray-900 leading-tight mb-4">
                  {news[0]?.title}
                </h1>
                <p className="text-gray-700 text-base leading-relaxed mb-4">
                  {truncateContent(news[0]?.content || "", 100)}
                </p>
              </div>
            </div>
          </div>

          {/* Two Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-300">
            {news.slice(1, 3).map((item, index) => (
              <div
                key={item.id}
                className={`flex flex-row-reverse h-48 ${
                  index === 0 ? "border-r" : "border-l"
                }`}
              >
                <div className="flex-1">
                  <Image
                    src={"/news1.jpeg"}
                    width={400}
                    height={250}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight mb-3 line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {truncateContent(item.content, 120)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Three Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-300">
            {news.slice(3).map((item, index, array) => (
              <div
                key={item.id}
                className={`flex items-start flex-row-reverse gap-3 ${
                  index > 0 && index < array.length - 1
                    ? "md:border-l md:border-r md:border-gray-200 md:px-6"
                    : ""
                }`}
              >
                <div className="flex-shrink-0">
                  <Image
                    src={"/news1.jpeg"}
                    width={500}
                    height={100}
                    alt={item.title}
                    className="w-24 h-24 md:w-32 md:h-32 object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>

          {/* Regular News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {news.slice(6, 12).map((item) => (
              <div key={item.id} className="">
                <div className="p-4">
                  <div className="mb-2">
                    <span className="bg-purple-600 text-white px-2 py-1 text-xs font-semibold rounded">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight mb-3 line-clamp-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">
                    {truncateContent(item.content, 120)}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <span className="font-medium truncate">{item.author}</span>
                    <span>•</span>
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional News Section */}
          {news.length > 12 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-red-600 pb-2">
                আরও সংবাদ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.slice(12).map((item) => (
                  <div
                    key={item.id}
                    className="flex space-x-4 p-4 border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="bg-orange-600 text-white px-2 py-1 text-xs font-semibold rounded">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 leading-tight mb-2 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                        {truncateContent(item.content, 100)}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <span className="font-medium">{item.author}</span>
                        <span>•</span>
                        <span>{formatDate(item.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 hidden lg:block">
          <RightSidebar news={news} />
        </div>
      </div>
    </div>
  );
};

export default NewsCards;
