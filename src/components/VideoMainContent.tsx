/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Image from "next/image";
// import Link from "next/link";
import { IoMdTime, IoMdShare, IoMdCopy, IoMdPlay } from "react-icons/io";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { VideoContent } from "@/sanity/sanityTypes";
import Link from "next/link";

interface VideoMainContentProps {
  videoItem: VideoContent;
  latestVideos: VideoContent[];
}

const VideoMainContent: React.FC<VideoMainContentProps> = ({
  videoItem,
  latestVideos,
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

  // Helper function to extract YouTube thumbnail
  const getYouTubeThumbnail = (url: string): string => {
    const videoId = getYouTubeVideoId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : "/video-placeholder.jpg";
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

  // Function to process description blocks
  const renderDescriptionBlocks = (blocks: VideoContent["description"]) => {
    if (!blocks || !Array.isArray(blocks)) return null;

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
        default:
          return null;
      }
    });
  };

  // Get current URL for sharing
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(videoItem.title);

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
          title: videoItem.title,
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

  const videoId = getYouTubeVideoId(videoItem.youtubeBlock?.url || "");

  return (
    <div className="lg:col-span-3 lg:border-r md:pr-6">
      {/* Video Header */}
      <div className="border-b pb-5">
        <h1 className="text-3xl font-bold mt-3">{videoItem.title}</h1>
      </div>

      {/* Author, Date and Share Icons */}
      <div className="text-gray-500 my-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex flex-col space-y-1">
            <p className="font-medium">{videoItem.author}</p>
            <div className="flex items-center gap-2">
              <IoMdTime />
              <p className="text-sm">
                {new Date(videoItem.publishedAt).toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}{" "}
                -{" "}
                {new Date(videoItem.publishedAt).toLocaleTimeString("bn-BD", {
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

      {/* Video Player */}
      {videoId ? (
        <div className="mb-6">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={videoItem.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        // Fallback if video ID cannot be extracted
        <div className="mb-6">
          <div className="relative">
            <Image
              src={getYouTubeThumbnail(videoItem.youtubeBlock?.url || "")}
              width={800}
              height={450}
              alt={videoItem.title}
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition-colors duration-300 opacity-90">
                <IoMdPlay className="text-white text-4xl ml-1" />
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-red-500 mt-2">
            Video could not be loaded. Please check the URL.
          </p>
        </div>
      )}

      {/* Video Description */}
      {videoItem.description && videoItem.description.length > 0 && (
        <div className="mb-12">
          {renderDescriptionBlocks(videoItem.description)}
        </div>
      )}

      {/* Latest Videos Section */}
      <div className="pb-10">
        <div className="border-l-4 pl-3 border-l-red-600">
          <h3 className="text-2xl font-bold">সর্বশেষ ভিডিও</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-b py-8 mt-3">
          {latestVideos.length > 0 ? (
            latestVideos.slice(0, 3).map((video, index) => (
              <div key={video._id} className="relative">
                <Link
                  href={`/video/${video._id}`}
                  className="block group transition-all duration-300 h-full cursor-pointer"
                >
                  <div className=" cursor-pointer">
                    <div className="flex-shrink-0 relative">
                      <Image
                        src={getYouTubeThumbnail(video.youtubeBlock?.url || "")}
                        width={500}
                        height={280}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl mt-3 font-medium line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        <IoMdTime />
                        <p className="text-xs text-gray-500">
                          {new Date(video.publishedAt).toLocaleDateString(
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

                {(index + 1) % 3 !== 0 && (
                  <div className="hidden md:block absolute top-0 right-0 h-full w-px transform translate-x-3"></div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-xl col-span-3">
              কোন সর্বশেষ ভিডিও পাওয়া যায়নি।
            </p>
          )}
        </div>
        ;
      </div>
    </div>
  );
};

export default VideoMainContent;
