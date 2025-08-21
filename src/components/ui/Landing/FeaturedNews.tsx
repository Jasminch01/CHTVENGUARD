/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ErrorComponent from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import { getFeaturedNewsItems } from "@/sanity/sanityQueries";
import { NewsItems, VideoContent } from "@/sanity/sanityTypes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";
import { FaPlay } from "react-icons/fa";

// Union type for mixed content
type FeaturedItem = NewsItems | VideoContent;

const FeaturedNews: React.FC = () => {
  const [featuredNews, setFeaturedNews] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Function to get YouTube thumbnail URL
  const getYouTubeThumbnail = (url: string): string => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      // Try maxresdefault first, fallback to hqdefault if that fails
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return "/video-placeholder.jpg"; // fallback image
  };

  // Function to extract text content from rich text blocks
  const extractTextFromContent = (content: any[] | undefined): string => {
    if (!content || !Array.isArray(content)) return "";

    return content
      .filter((block) => block._type === "textBlock")
      .map((block) => {
        // Handle the new rich text editor structure
        if (Array.isArray(block.text)) {
          return block.text
            .filter((item: any) => item._type === "block")
            .map((item: any) => {
              return (
                item.children
                  ?.filter((child: any) => child._type === "span")
                  ?.map((span: any) => span.text)
                  ?.join("") || ""
              );
            })
            .join(" ");
        }
        // Fallback for old simple text structure (if any still exists)
        return typeof block.text === "string" ? block.text : "";
      })
      .join(" ");
  };

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Type guard to check if item is a video
  const isVideoContent = (item: FeaturedItem): item is VideoContent => {
    return (
      (item as any)._type === "videocontent" ||
      (item as VideoContent).youtubeBlock !== undefined
    );
  };

  // Function to get the appropriate link for each item type
  const getItemLink = (item: FeaturedItem): string => {
    if (isVideoContent(item)) {
      return `/video/${item._id}`;
    } else {
      const newsItem = item as NewsItems;
      return `/news/${newsItem.category}/${newsItem._id}`;
    }
  };

  // Function to get content for excerpt based on item type
  const getItemContent = (item: FeaturedItem): any[] | undefined => {
    if (isVideoContent(item)) {
      return item.description as any[];
    } else {
      return (item as NewsItems).content as any[];
    }
  };

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        setLoading(true);
        const news = await getFeaturedNewsItems(); // This should now return both news and videos
        // console.log("Fetched featured items:", news); // Debug log
        setFeaturedNews(news);
      } catch (err) {
        setError("Failed to fetch featured news");
        console.error("Error fetching featured news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedNews();
  }, []);

  if (loading) {
    return <Loading loading={loading} />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (featuredNews.length === 0) {
    return <div className="w-full max-w-7xl mx-auto"></div>;
  }

  // Helper function to get border classes for each card
  const getBorderClasses = (index: number, totalItems: number) => {
    const classes = [];

    // Right borders for desktop (all except last)
    if (index < totalItems - 1) {
      classes.push(
        "md:border-r md:border-gray-300 md:pr-6 dark:md:border-gray-700"
      );
    }

    // Bottom borders for mobile (all except last)
    if (index < totalItems - 1) {
      classes.push(
        "border-b border-gray-300 pb-6 md:border-b-0 md:pb-0 dark:border-gray-700"
      );
    }

    return classes.join(" ");
  };

  return (
    <div className="w-full max-w-7xl mx-auto mb-10 relative">
      {/* Gradient border wrapper */}
      <div className="bg-gradient-to-r from-red-500 to-green-500 p-[2px]">
        <div className="bg-white dark:bg-gray-900 p-4">
          {/* Content grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {featuredNews.slice(0, 4).map((item, index) => (
              <Link key={item._id} href={getItemLink(item)}>
                <div
                  className={`flex flex-col gap-5 group h-full ${getBorderClasses(
                    index,
                    Math.min(featuredNews.length, 4)
                  )}`}
                >
                  {/* Image/Video Thumbnail */}
                  <div className="flex-1 relative overflow-hidden">
                    {isVideoContent(item) ? (
                      // Video thumbnail with play button overlay
                      <>
                        {console.log(
                          "Video item:",
                          item,
                          "YouTube URL:",
                          item.youtubeBlock?.url
                        )}
                        <Image
                          src={
                            item.youtubeBlock?.url
                              ? getYouTubeThumbnail(item.youtubeBlock.url)
                              : "/video-placeholder.jpg"
                          }
                          width={400}
                          height={250}
                          alt={item.title}
                          className="w-full h-[10rem] object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            // Fallback to placeholder if YouTube thumbnail fails
                            // console.log(
                            //   "YouTube thumbnail failed, using placeholder"
                            // );
                            e.currentTarget.src = "/video-placeholder.jpg";
                          }}
                        />
                        {/* Play button overlay for videos */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition-all duration-700 transform group-hover:scale-110">
                            <FaPlay className="text-white text-xl ml-1" />
                          </div>
                        </div>
                      </>
                    ) : (
                      // Regular news image
                      <>
                        <Image
                          src={
                            (item as NewsItems).featuredImage?.asset?.url ||
                            "/news1.jpeg"
                          }
                          width={400}
                          height={250}
                          alt={
                            (item as NewsItems).featuredImage?.alt || item.title
                          }
                          className="w-full h-[10rem] object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                        />
                      </>
                    )}

                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h3 className="text-lg font-bold leading-tight mb-3 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100 line-clamp-3">
                        {item.title}
                      </h3>
                      {/* Description/Content Excerpt */}
                      {getItemContent(item) &&
                        getItemContent(item)!.length > 0 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {truncateContent(
                              extractTextFromContent(getItemContent(item)),
                              100
                            )}
                          </p>
                        )}

                      {/* Date */}
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mt-auto">
                        <IoMdTime size={14} />
                        <p className="text-xs">
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
        </div>
      </div>
    </div>
  );
};

export default FeaturedNews;
