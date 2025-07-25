
import { NewsCardsProps } from "@/sanity/sanityTypes";
import Link from "next/link";
import React from "react";
import Marquee from "react-fast-marquee";

const BreakingNews: React.FC<NewsCardsProps> = ({ news }) => {
  return (
    <div className="relative  bg-red-800 text-white shadow-lg overflow-hidden mb-10">
      {/* Breaking News Label */}
      <div className="absolute left-0 top-0 bottom-0 bg-red-900 lg:px-6 px-3 flex items-center z-10 shadow-xl border-r-2 border-red-500">
        <div className="">
          <span className="font-bold lg:text-xl text-sm uppercase lg:tracking-wider whitespace-nowrap select-none">
            🚨 ব্রেকিং নিউজ
          </span>
        </div>
      </div>

      {/* Marquee Content */}
      <div className="lg:pl-44 py-4 overflow-hidden">
        <Marquee
          speed={30}
          gradient={false}
          pauseOnHover={true}
          pauseOnClick={true}
          className="h-full"
        >
          <div className="flex items-center">
            {news.map((item) => {
              return (
                <Link
                  key={item._id}
                  href={`/news/${item.category}/${item._id}`}
                  className="group flex items-center cursor-pointer"
                >
                  <div className="flex focus:outline-none border-0 outline-0">
                    <p className="lg:text-xl text-sm font-bold text-white hover:text-yellow-200 transition-colors duration-200 mr-5">
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
