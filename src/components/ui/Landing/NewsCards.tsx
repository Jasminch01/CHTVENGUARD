import Image from "next/image";
import RightSidebar from "./RightSiderbar";
import RangamatiNews from "./RangamatiNews";
import KhagrachariNews from "./KhagrachariNews";
import BreakingNews from "./BreakingNews";
import Link from "next/link";
import BandarbanNews from "./BandarbanNews";
import InternationalNews from "./InternationalNews";
import { IoMdTime } from "react-icons/io";
import { NewsCardsProps, ContentBlock } from "@/sanity/sanityTypes";
import NationalNews from "./NationalNews";
import FeaturedNews from "./FeaturedNews";

const NewsCards: React.FC<NewsCardsProps> = ({ news }) => {
  if (!news || news.length === 0) {
    return (
      <div className="text-center flex h-screen justify-center items-center py-8 text-gray-500 dark:text-gray-400">
        No news articles available
      </div>
    );
  }

  // Function to extract text content from content blocks
  const extractTextFromContent = (content: ContentBlock[]): string => {
    return content
      .filter((block) => block._type === "textBlock")
      .map((block) => block.text)
      .join(" ");
  };

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="w-full">
      <BreakingNews news={news} />
      <FeaturedNews />
      <div className="flex">
        {/* Left Main Content */}
        <div className="flex-1">
          <div className="lg:border-r lg:pr-3">
            {/* Main Featured News Section */}
            <div className="mb-3">
              <Link href={`/news/${news[0].category}/${news[0]._id}`}>
                <div className="flex lg:flex-row-reverse flex-col xl:h-[300px] gap-5 group border-b pb-3">
                  <div className="flex-1 relative overflow-hidden">
                    <Image
                      src={news[0].featuredImage?.asset?.url || "/news1.jpeg"}
                      width={500}
                      height={500}
                      alt={news[0].featuredImage?.alt || news[0]?.title}
                      className="w-full h-[19rem] object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl lg:text-3xl font-bold leading-tight mb-4 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100">
                      {news[0]?.title}
                    </h1>
                    <p className="hidden lg:block text-base leading-relaxed mb-4 dark:text-gray-300">
                      {truncateContent(
                        extractTextFromContent(news[0]?.content || []),
                        150
                      )}
                    </p>
                    <div className="flex items-center gap-1">
                      <IoMdTime />
                      <p className="text-sm text-gray-500">
                        {new Date(news[0].publishedAt).toLocaleDateString(
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
            </div>

            {/* Two Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-3">
              {news.slice(1, 3).map((item, index) => (
                <Link
                  key={item._id}
                  href={`/news/${item.category}/${item._id}`}
                >
                  <div
                    className={`flex flex-row-reverse gap-5 group  ${
                      index === 0
                        ? "md:border-r md:border-b-0 md:border-gray-300 md:pr-6 border-b dark:md:border-gray-700"
                        : ""
                    }`}
                  >
                    <div className="flex-1 relative overflow-hidden">
                      <Image
                        src={item.featuredImage?.asset?.url || "/news1.jpeg"}
                        width={400}
                        height={250}
                        alt={item.featuredImage?.alt || item.title}
                        className="w-full lg:h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-bold leading-tight mb-3 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100">
                          {item.title}
                        </h2>
                        <p className="text-gray-600 hidden lg:block dark:text-gray-400 line-clamp-2 leading-relaxed text-justify">
                          {truncateContent(
                            extractTextFromContent(item.content || []),
                            50
                          )}
                        </p>
                        <div className="flex items-center gap-1">
                          <IoMdTime />
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(item.publishedAt).toLocaleDateString(
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
                  </div>
                </Link>
              ))}
            </div>
            {/* Three Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 py-3 lg:border-b border-t border-gray-300 dark:border-gray-700">
              {news.slice(0, 6).map((item, index) => {
                const rowNumber = Math.floor(index / 3) + 1; // Calculate row number (1, 2, 3, etc.)
                const isFirstRow = rowNumber === 1;
                const isSecondRow = rowNumber === 2;
                const isLastInRow = (index + 1) % 3 === 0;

                return (
                  <Link
                    key={item._id}
                    href={`/news/${item.category}/${item._id}`}
                  >
                    <div
                      className={`flex  h-full flex-row-reverse gap-5 border-b lg:border-b-0 pb-2 lg:pb-0 mb-1 ${
                        index % 2 === 0 ? "lg:pr-1" : "lg:pl-1"
                      } relative group ${
                        // Bottom border only for first row
                        isFirstRow
                          ? "after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-full after:h-px lg:after:bg-gray-400 lg:dark:after:bg-gray-700 "
                          : ""
                      } ${
                        // Right border for first row (except last card) and second row (except last card)
                        (isFirstRow || isSecondRow) && !isLastInRow
                          ? "lg:before:content-[''] lg:before:absolute lg:before:-right-2 lg:before:top-0 lg:before:h-full lg:before:w-px lg:before:bg-gray-400 dark:lg:before:bg-gray-700"
                          : ""
                      }`}
                    >
                      <div className="flex-1 relative overflow-hidden">
                        <Image
                          src={item.featuredImage?.asset?.url || "/news1.jpeg"}
                          width={500}
                          height={100}
                          alt={item.featuredImage?.alt || item.title}
                          className="w-full h-[90px] lg:w-[110px] lg:h-[75px] xl:w-[180px] xl:h-[120px] object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100">
                          {item.title}
                        </h2>
                        <div className="flex items-center gap-1">
                          <IoMdTime />
                          <p className="text-xs text-gray-500">
                            {new Date(item.publishedAt).toLocaleDateString(
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
                );
              })}
            </div>
          </div>
          <RangamatiNews />
          <KhagrachariNews />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 hidden pl-3 lg:block">
          <RightSidebar news={news} />
        </div>
      </div>
      <BandarbanNews />
      <InternationalNews />
      <NationalNews />
    </div>
  );
};

export default NewsCards;
