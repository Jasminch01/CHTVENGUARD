import { NewsCardsProps } from "@/app/type";
import Link from "next/link";
import React from "react";
import Marquee from "react-fast-marquee";

const BreakingNews: React.FC<NewsCardsProps> = ({ news }) => {
  return (
    <div className="relative  bg-red-800 text-white shadow-lg overflow-hidden mb-10">
      {/* Breaking News Label */}
      <div className="absolute left-0 top-0 bottom-0 bg-red-900 px-6 flex items-center z-10 shadow-xl border-r-2 border-red-500">
        <div className="">
          <span className="font-bold text-xl uppercase tracking-wider whitespace-nowrap select-none">
            🚨 ব্রেকিং নিউজ
          </span>
        </div>
      </div>

      {/* Marquee Content */}
      <div className="pl-44 py-4 overflow-hidden">
        <Marquee
          speed={30}
          gradient={false}
          pauseOnHover={true}
          pauseOnClick={true}
          className="h-full"
        >
          <div className="flex items-center space-x-5">
            {news.map((item) => {
              return (
                <Link
                  key={item.id}
                  href={`/news/${item.category}/${item.id}`}
                  className="group flex items-center cursor-pointer"
                >
                  <div className="flex focus:outline-none border-0 outline-0">
                    <p className="text-xl font-bold text-white hover:text-yellow-200 transition-colors duration-200">
                      {item.title}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default BreakingNews;
