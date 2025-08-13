/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCategoryNameInBangla } from "@/lib/utils";
import { IoMdTime, IoMdShare, IoMdCopy } from "react-icons/io";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { ContentBlock, NewsItems } from "@/sanity/sanityTypes";

interface NewsMainContentProps {
  newsItem: NewsItems;
  latestNews: NewsItems[];
}

const NewsMainContent: React.FC<NewsMainContentProps> = ({
  newsItem,
  latestNews,
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(1); // 1 = normal, 1.25 = large, 1.5 = extra large, etc.

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Font size control functions
  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 0.25, 2)); // Max 2x size
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 0.25, 0.75)); // Min 0.75x size
  };

  // Function to render rich text content
  const renderRichText = (richTextArray: any[], key: string) => {
    return richTextArray.map((block, index) => {
      if (block._type === "block") {
        const textContent =
          block.children
            ?.filter((child: any) => child._type === "span")
            ?.map((span: any) => {
              let text = span.text || "";

              // Apply formatting based on marks
              if (span.marks && span.marks.length > 0) {
                span.marks.forEach((mark: string) => {
                  switch (mark) {
                    case "strong":
                      text = `<strong>${text}</strong>`;
                      break;
                    case "em":
                      text = `<em>${text}</em>`;
                      break;
                    case "underline":
                      text = `<u>${text}</u>`;
                      break;
                    case "strike-through":
                      text = `<s>${text}</s>`;
                      break;
                    case "code":
                      text = `<code class="bg-gray-100 px-1 rounded">${text}</code>`;
                      break;
                  }
                });
              }

              return text;
            })
            ?.join("") || "";

        // Handle different block styles
        const baseStyle = { fontSize: `${fontSize * 1.25}rem` };
        const commonClasses = "leading-relaxed text-justify my-4";

        switch (block.style) {
          case "h1":
            return (
              <h1
                key={`${key}-${index}`}
                className="text-3xl font-bold my-6"
                style={baseStyle}
                dangerouslySetInnerHTML={{ __html: textContent }}
              />
            );
          case "h2":
            return (
              <h2
                key={`${key}-${index}`}
                className="text-2xl font-bold my-5"
                style={baseStyle}
                dangerouslySetInnerHTML={{ __html: textContent }}
              />
            );
          case "h3":
            return (
              <h3
                key={`${key}-${index}`}
                className="text-xl font-bold my-4"
                style={baseStyle}
                dangerouslySetInnerHTML={{ __html: textContent }}
              />
            );
          case "h4":
            return (
              <h4
                key={`${key}-${index}`}
                className="text-lg font-bold my-3"
                style={baseStyle}
                dangerouslySetInnerHTML={{ __html: textContent }}
              />
            );
          case "blockquote":
            return (
              <blockquote
                key={`${key}-${index}`}
                className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-700"
                style={baseStyle}
                dangerouslySetInnerHTML={{ __html: textContent }}
              />
            );
          default:
            return (
              <p
                key={`${key}-${index}`}
                className={commonClasses}
                style={baseStyle}
                dangerouslySetInnerHTML={{ __html: textContent }}
              />
            );
        }
      }
      return null;
    });
  };

  // Function to render highlight block content
  const renderHighlightBlock = (block: any) => {
    const {
      backgroundColor,
      customColorHex, // This comes from the query alias
      borderColor,
      customBorderColorHex, // This comes from the query alias
      padding = "medium",
    } = block;

    // Determine background color
    const bgColor =
      backgroundColor === "custom" ? customColorHex : backgroundColor;

    // Determine border color and style
    const getBorderStyle = () => {
      if (borderColor === "none") return "none";
      if (borderColor === "custom") return `2px solid ${customBorderColorHex}`;
      return `2px solid ${borderColor}`;
    };

    // Rest of your function remains the same...
    const getPadding = () => {
      switch (padding) {
        case "small":
          return "8px 12px";
        case "large":
          return "20px 24px";
        default:
          return "12px 16px";
      }
    };

    const highlightStyle = {
      backgroundColor: bgColor || "#fff3cd",
      borderTop: getBorderStyle(), // Only top border
      borderBottom: "none", // Explicitly remove bottom border
      borderLeft: "none", // Explicitly remove left border
      borderRight: "none", // Explicitly remove right border
      padding: getPadding(),
      borderRadius: "0", // Remove all rounded corners
      margin: "16px 0",
      position: "relative" as const,
    };
    return (
      <div key={block._key} style={highlightStyle} className="highlight-block">
        {Array.isArray(block.text) ? (
          <div>{renderRichText(block.text, `highlight-${block._key}`)}</div>
        ) : (
          <p
            className="leading-relaxed text-justify my-0"
            style={{ fontSize: `${fontSize * 1.25}rem`, margin: 0 }}
          >
            {typeof block.text === "string" ? block.text : ""}
          </p>
        )}
      </div>
    );
  };

  // Function to process content blocks
  const renderContentBlocks = (blocks: ContentBlock[]) => {
    return blocks.map((block) => {
      switch (block._type) {
        case "textBlock":
          // Handle rich text editor content
          if (Array.isArray(block.text)) {
            return (
              <div key={block._key}>
                {renderRichText(block.text, block._key)}
              </div>
            );
          }
          // Fallback for old simple text structure
          return (
            <p
              key={block._key}
              className="leading-relaxed text-justify my-4"
              style={{ fontSize: `${fontSize * 1.25}rem` }}
            >
              {typeof block.text === "string" ? block.text : ""}
            </p>
          );

        case "highlightBlock":
          return renderHighlightBlock(block);

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
                  className="absolute top-0 left-0 w-full h-full"
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

          {/* Share Icons and Font Size Controls */}
          <div className="flex items-center gap-3">
            {/* Share Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={shareOnFacebook}
                className="p-2 rounded bg-gray-300 text-gray-900 cursor-pointer size-8 flex items-center justify-center"
                title="Facebook এ শেয়ার করুন"
              >
                <FaFacebookF size={14} />
              </button>

              <button
                onClick={shareOnWhatsApp}
                className="p-2 rounded bg-gray-300 text-gray-900 cursor-pointer size-8 flex items-center justify-center"
                title="WhatsApp এ শেয়ার করুন"
              >
                <FaWhatsapp size={14} />
              </button>

              <button
                onClick={handleNativeShare}
                className="p-2 rounded bg-gray-300 text-gray-900 cursor-pointer size-8 flex items-center justify-center"
                title="শেয়ার করুন"
              >
                <IoMdShare size={14} />
              </button>

              <button
                onClick={copyToClipboard}
                className="p-2 rounded bg-gray-300 text-gray-900 cursor-pointer size-8 flex items-center justify-center"
                title="লিংক কপি করুন"
              >
                {copied ? (
                  <span className="text-xs">✓</span>
                ) : (
                  <IoMdCopy size={14} />
                )}
              </button>

              <button
                onClick={decreaseFontSize}
                className="p-2 rounded bg-gray-300 text-gray-900 cursor-pointer size-8 flex items-center justify-center disabled:opacity-50"
                title="ফন্ট সাইজ ছোট করুন"
                disabled={fontSize <= 0.75}
              >
                <div className="flex items-center gap-0.5">
                  <span className="text-sm">অ</span>
                  <AiOutlineMinus size={10} />
                </div>
              </button>

              <button
                onClick={increaseFontSize}
                className="p-2 rounded bg-gray-300 text-gray-900 cursor-pointer size-8 flex items-center justify-center disabled:opacity-50"
                title="ফন্ট সাইজ বড় করুন"
                disabled={fontSize >= 2}
              >
                <div className="flex items-center gap-0.5">
                  <span className="text-sm">অ</span>
                  <AiOutlinePlus size={10} />
                </div>
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
          {/* Featured Image Title/Caption */}
          {newsItem.featuredImage.title && (
            <p className="text-center text-sm text-gray-600 mt-2 italic">
              {newsItem.featuredImage.title}
            </p>
          )}
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
                          className="w-full h-[12rem] object-cover"
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
