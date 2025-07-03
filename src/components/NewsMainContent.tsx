import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NewsItem } from "@/app/type";
import { getCategoryNameInBangla } from "@/lib/utils";
import { IoMdTime, IoMdShare, IoMdCopy } from "react-icons/io";
import { FaFacebookF, FaWhatsapp} from "react-icons/fa";

interface NewsMainContentProps {
  newsItem: NewsItem;
  latestNews: NewsItem[];
}

const NewsMainContent: React.FC<NewsMainContentProps> = ({
  newsItem,
  latestNews,
}) => {
  const [copied, setCopied] = useState(false);

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

  // Get current URL for sharing
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(newsItem.title);

  // Social sharing functions
  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    window.open(whatsappUrl, "_blank");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsItem.title,
          url: currentUrl,
        });
      } catch (err) {
        console.error("Error sharing: ", err);
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  return (
    <div className="lg:col-span-3 lg:border-r md:pr-6">
      {/* News Header */}
      <div className="border-b pb-5">
        <span className="border-b pb-1">
          {getCategoryNameInBangla(newsItem.category)}
        </span>
        <h1 className="text-3xl font-bold mt-3">{newsItem.title}</h1>
      </div>

      {/* Author, Date and Share Icons */}
      <div className="text-gray-500 my-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex flex-col space-y-1">
            <p className="font-medium">{newsItem.author}</p>
            <div className="flex items-center gap-2">
              <IoMdTime />
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

          {/* Share Icons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={shareOnFacebook}
                className="p-2 rounded bg-gray-300 text-gray-900 cursor-pointer"
                title="Facebook এ শেয়ার করুন"
              >
                <FaFacebookF size={14} />
              </button>

              <button
                onClick={shareOnWhatsApp}
                className="p-2 rounded bg-gray-300 text-gray-900 cursor-pointer"
                title="WhatsApp এ শেয়ার করুন"
              >
                <FaWhatsapp size={14} />
              </button>

              <button
                onClick={handleNativeShare}
                className="p-2 rounded bg-gray-300 text-gray-900 cursor-pointer"
                title="শেয়ার করুন"
              >
                <IoMdShare size={14} />
              </button>

              <button
                onClick={copyToClipboard}
                className={`p-2 rounded bg-gray-300 text-gray-900 cursor-pointer`}
                title="লিংক কপি করুন"
              >
                {copied ? (
                  <p className="text-sm">Copyed</p>
                ) : (
                  <IoMdCopy size={14} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* News Image */}
      {newsItem.image && (
        <div className="mb-6">
          <Image
            src={newsItem.image ? `/${newsItem.image}` : "/news1.jpeg"}
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
                          src={
                            newsItem.image
                              ? `/${newsItem.image}`
                              : "/news1.jpeg"
                          }
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
