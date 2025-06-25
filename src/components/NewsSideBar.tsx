import React from "react";
import Link from "next/link";
import { NewsItem } from "@/app/type";
import { getCategoryNameInBangla } from "@/lib/utils";
import { IoMdTime } from "react-icons/io";

interface NewsSidebarProps {
  relatedNews: NewsItem[];
  category: string;
}

const NewsSidebar: React.FC<NewsSidebarProps> = ({ relatedNews, category }) => {
  return (
    <div className="lg:col-span-1 lg:mt-20">
      <div className="lg:sticky lg:top-[5rem]">
        <div className="">
          <h3 className="text-2xl font-bold mb-4 border-b pb-2">আরও পড়ুন</h3>

          <div className="space-y-4">
            {relatedNews.length > 0 ? (
              relatedNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.category}/${news.id}`}
                  className="block group"
                >
                  <div className="pb-4">
                    <div className="flex-1 pb-2 border-b">
                      <h4 className="text-xl  font-medium line-clamp-3 group-hover:text-blue-600 transition-colors duration-300">
                        {news.title}
                      </h4>
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
                href={`/news/${category}`}
                className="inline-block w-full text-center bg-green-700 text-white py-2 px-4 hover:bg-green-800 transition-colors duration-300 text-lg font-medium"
              >
                আরও {getCategoryNameInBangla(category)}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default NewsSidebar;
