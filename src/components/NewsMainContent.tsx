import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NewsItem } from "@/app/type";
import { getCategoryNameInBangla } from "@/lib/utils";

interface NewsMainContentProps {
  newsItem: NewsItem;
  latestNews: NewsItem[];
}

const NewsMainContent: React.FC<NewsMainContentProps> = ({
  newsItem,
  latestNews,
}) => {
  // Function to split content into paragraphs of 4 lines each
  const formatContentIntoParagraphs = (content: string) => {
    const sentences = content
      .split(/(?<=[।.!?])\s+/)
      .filter((sentence) => sentence.trim().length > 0);

    const paragraphs = [];
    for (let i = 0; i < sentences.length; i += 4) {
      const paragraph = sentences.slice(i, i + 4).join(" ");
      if (paragraph.trim()) {
        paragraphs.push(paragraph);
      }
    }

    return paragraphs;
  };

  const contentParagraphs = formatContentIntoParagraphs(newsItem.content);

  return (
    <div className="lg:col-span-3 lg:border-r md:pr-6">
      {/* News Header */}
      <div className="border-b pb-5">
        <span className="border-b pb-1">
          {getCategoryNameInBangla(newsItem.category)}
        </span>
        <h1 className="text-3xl font-bold mt-3">{newsItem.title}</h1>
      </div>

      {/* Author and Date */}
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

      {/* News Image */}
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

      {/* News Content */}
      <div className="space-y-6 mb-12">
        {contentParagraphs.map((paragraph, index) => (
          <p key={index} className="text-xl leading-relaxed text-justify">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Latest News Section */}
      <div className="pb-10">
        <div className="border-l-4 pl-3 border-l-green-600">
          <h3 className="text-2xl font-bold">সর্বশেষ খবর</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-b py-8 mt-3">
          {latestNews.length > 0 ? (
            latestNews.slice(0, 3).map((news, index) => (
              <div key={news.id} className="relative">
                <Link
                  href={`/news/${news.category}/${news.id}`}
                  className="block group transition-all duration-300 h-full"
                >
                  <div className="">
                    {news.image && (
                      <div className="flex-shrink-0">
                        <Image
                          src="/news1.jpeg"
                          width={500}
                          height={500}
                          alt={news.title}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-xl mt-3 font-medium line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                        {news.title}
                      </h4>
                    </div>
                  </div>
                </Link>
                {/* Right Border for cards */}
                {(index + 1) % 3 !== 0 && (
                  <div className="hidden md:block absolute top-0 right-0 h-full w-px transform translate-x-3"></div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-xl col-span-3">
              কোন সর্বশেষ খবর পাওয়া যায়নি।
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsMainContent;
