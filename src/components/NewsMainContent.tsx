import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCategoryNameInBangla } from "@/lib/utils";
import { IoMdTime, IoMdShare, IoMdCopy } from "react-icons/io";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { NewsItems, ContentBlock } from "@/sanity/sanityTypes";

interface NewsMainContentProps {
  newsItem: NewsItems;
  latestNews: NewsItems[];
}

const NewsMainContent: React.FC<NewsMainContentProps> = ({
  newsItem,
  latestNews,
}) => {
  const [copied, setCopied] = useState(false);

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
console.log(newsItem)
  // Function to process content blocks
  const renderContentBlocks = (blocks: ContentBlock[]) => {
    return blocks.map((block) => {
      switch (block._type) {
        case "textBlock":
          return (
            <p
              key={block._key}
              className="text-xl leading-relaxed text-justify my-4"
            >
              {block.text}
            </p>
          );
        case "imageBlock":
          return (
            <div key={block._key} className="my-6">
              {block.image?.asset?.url && (
                <Image
                  src={block.image.asset.url}
                  width={800}
                  height={500}
                  alt={block.alt || "News image"}
                  className="w-full h-auto"
                />
              )}
              {block.caption && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  {block.caption}
                </p>
              )}
            </div>
          );
        case "youtubeBlock":
          const videoId = getYouTubeVideoId(block.url);
          if (!videoId) {
            return (
              <div
                key={block._key}
                className="my-6 p-4 border border-red-200 rounded"
              >
                <p className="text-red-500">Invalid YouTube URL: {block.url}</p>
              </div>
            );
          }
          return (
            <div key={block._key} className="my-6">
              {block.title && (
                <h4 className="text-lg font-semibold mb-3">{block.title}</h4>
              )}
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={block.title || "YouTube video"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              {block.caption && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  {block.caption}
                </p>
              )}
            </div>
          );
        default:
          return null;
      }
    });
  };

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
                  <p className="text-sm">Copied</p>
                ) : (
                  <IoMdCopy size={14} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {newsItem.featuredImage?.asset?.url && (
        <div className="mb-6">
          <Image
            src={newsItem.featuredImage.asset.url}
            width={800}
            height={500}
            alt={newsItem.featuredImage.alt || newsItem.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* News Content */}
      <div className="mb-12">{renderContentBlocks(newsItem.content)}</div>

      {/* Latest News Section */}
      <div className="pb-10">
        <div className="border-l-4 pl-3 border-l-green-600">
          <h3 className="text-2xl font-bold">সর্বশেষ খবর</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-b py-8 mt-3">
          {latestNews.length > 0 ? (
            latestNews.slice(0, 3).map((news, index) => (
              <div key={news._id} className="relative">
                <Link
                  href={`/news/${news.category}/${news._id}`}
                  className="block group transition-all duration-300 h-full"
                >
                  <div className="">
                    {news.featuredImage?.asset?.url && (
                      <div className="flex-shrink-0">
                        <Image
                          src={news.featuredImage.asset.url}
                          width={500}
                          height={500}
                          alt={news.featuredImage.alt || news.title}
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
