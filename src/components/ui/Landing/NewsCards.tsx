import { NewsCardsProps } from "@/app/type";
import Image from "next/image";
import RightSidebar from "./RightSiderbar";

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
            <div className="flex lg:flex-row-reverse flex-col xl:h-[300px] gap-5 group">
              <div className="flex-1 relative overflow-hidden">
                <Image
                  src={"/news1.jpeg"}
                  width={500}
                  height={500}
                  alt={news[0]?.title}
                  className="w-full h-full object-cover  scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-xl lg:text-3xl font-bold leading-tight mb-4 group-hover:text-blue-500">
                  {news[0]?.title}
                </h1>
                <p className="hidden lg:block text-base leading-relaxed mb-4">
                  {truncateContent(news[0]?.content || "", 100)}
                </p>
              </div>
            </div>
          </div>

          {/* Two Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8">
            {news.slice(1, 3).map((item, index) => (
              <div
                key={item.id}
                className={`flex flex-row-reverse gap-5 group h-48 ${
                  index === 0 ? "md:border-r md:border-gray-300 md:pr-6" : ""
                }`}
              >
                <div className="flex-1 relative overflow-hidden">
                  <Image
                    src={"/news1.jpeg"}
                    width={400}
                    height={250}
                    alt={item.title}
                    className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-bold leading-tight mb-3 group-hover:text-blue-500">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed text-justify">
                      {truncateContent(item.content, 120)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Three Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 py-8 border-b border-t border-gray-300">
            {news.slice(3).map((item, index) => (
              <div
                key={item.id}
                className={`
        flex items-start flex-row-reverse group gap-3 relative
        ${index % 3 !== 2 ? "md:border-r md:border-gray-200" : ""}
        ${index % 3 === 1 ? "md:px-6" : index % 3 === 0 ? "md:pr-6" : ""}
      `}
              >
                <div className="flex-shrink-0 relative overflow-hidden">
                  <Image
                    src={"/news1.jpeg"}
                    width={500}
                    height={100}
                    alt={item.title}
                    className="w-24 h-24 md:w-32 md:h-32 object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-500">
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
