import { NewsItem } from "@/app/type";
import { SetStateAction, useState } from "react";

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
    <div className="sticky top-4 ">
      {/* Advertisement Space */}
      <div className="bg-gray-100 border border-gray-300 p-4 mb-6 text-center">
        <div className="text-gray-500 text-sm">বিজ্ঞাপন</div>
        <div className="h-32 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center mt-2 rounded">
          <span className="text-gray-400">বিজ্ঞাপন</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className=" border-gray-300 mb-6">
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
                  <h4 className="text-sm font-semibold leading-tight line-clamp-2 mb-1 hover:text-red-600 cursor-pointer transition-colors">
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

export default RightSidebar;
