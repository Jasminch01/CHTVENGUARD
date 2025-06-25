import { NewsItem } from "@/app/type";
import Link from "next/link";
import { SetStateAction, useState } from "react";

const RightSidebar: React.FC<{ news: NewsItem[] }> = ({ news }) => {
  const [activeTab, setActiveTab] = useState<"popular" | "latest" | "trending">(
    "popular"
  );

  const tabs = [
    { key: "popular", label: "জনপ্রিয়" },
    { key: "latest", label: "সর্বশেষ" },
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
    <div className="sticky top-20 ">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(
                  tab.key as SetStateAction<"popular" | "latest" | "trending">
                )
              }
              className={`flex-1 py-3 px-4 lg:text-xl text-lg font-semibold transition-colors ${
                activeTab === tab.key
                  ? "bg-red-700 text-white dark:text-gray-200"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="py-4">
          <div className="space-y-4">
            {getTabNews().map((item, index) => (
              <div
                key={item.id}
                className="flex space-x-3 pb-4 border-b last:border-b-0 group"
              >
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center text-white justify-center w-6 h-6 bg-red-700 text-xs font-bold">
                    {index + 1}
                  </span>
                </div>
                <Link href={`${item.category}/${item.id}`}>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold leading-tight line-clamp-2 mb-1 group-hover:text-blue-500 cursor-pointer transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
