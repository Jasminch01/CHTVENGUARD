/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoMdTime, IoMdPlay } from "react-icons/io";
import { NewsItems, VideoContent } from "@/sanity/sanityTypes";
import ErrorComponent from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";

export interface VideoContentPageProps {
  videos: VideoContent[];
  allNews: NewsItems[];
  loading: boolean;
  error: string | null;
  onLoadMore?: () => Promise<void>;
  hasMoreVideos?: boolean;
  loadingMore?: boolean;
}

const VideoContentPage: React.FC<VideoContentPageProps> = ({
  videos,
  allNews,
  loading,
  error,
  onLoadMore,
  hasMoreVideos = false,
  loadingMore = false,
}) => {
  // Helper function to extract YouTube thumbnail
  const getYouTubeThumbnail = (url: string): string => {
    const videoId = url?.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    );
    return videoId
      ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg`
      : "/video-placeholder.jpg";
  };
  const getNewsUrl = (newsItem: NewsItems) => {
    // For CHT categories, use the CHT prefix
    if (["rangamati", "khagrachari", "bandarban"].includes(newsItem.category)) {
      return `/news/cht/${newsItem.category}/${newsItem._id}`;
    }
    // For other categories, use standard structure
    return `/news/${newsItem.category}/${newsItem._id}`;
  };
  // Helper function to extract text from video description
  const getFirstTextContent = (
    description: VideoContent["description"]
  ): string => {
    if (!description || !Array.isArray(description)) return "";

    const firstTextBlock = description.find(
      (block) => block._type === "textBlock"
    );
    if (!firstTextBlock || !firstTextBlock.text) return "";

    // Handle Sanity's rich text structure
    if (Array.isArray(firstTextBlock.text)) {
      return firstTextBlock.text
        .map((textBlock: any) => {
          if (textBlock._type === "block" && textBlock.children) {
            return textBlock.children
              .filter((child: any) => child._type === "span")
              .map((span: any) => span.text || "")
              .join("");
          }
          return "";
        })
        .join(" ")
        .trim();
    }

    return typeof firstTextBlock.text === "string" ? firstTextBlock.text : "";
  };

  // Helper function to truncate content
  const truncateContent = (content: string, maxLength: number) => {
    if (!content || content.length <= maxLength) return content;
    const truncated = content.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return lastSpace > maxLength * 0.8
      ? truncated.substring(0, lastSpace) + "..."
      : truncated + "...";
  };

  // Helper function to format date safely
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "তারিখ অনুপলব্ধ";
    }
  };

  // Helper function to generate video URL
  const getVideoUrl = (videoItem: VideoContent) => {
    return `/video/${videoItem._id}`;
  };

  // Function to render video sections
  const renderVideoSections = () => {
    const sections = [];
    const videoItems = videos.slice(1); // Skip first item (featured)

    if (videoItems.length === 0) {
      return null;
    }

    for (let i = 0; i < videoItems.length; i += 6) {
      const sectionItems = videoItems.slice(i, i + 6);
      const sectionIndex = Math.floor(i / 6);

      sections.push(
        <div
          key={`section-${sectionIndex}`}
          className={`${
            sectionIndex > 0
              ? "mt-8 pt-8 border-t border-gray-300 dark:border-gray-600"
              : ""
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sectionItems.map((videoItem, index) => {
              if (!videoItem || !videoItem._id) return null;

              const itemIndexInSection = index;
              const isLastTwoInSection = itemIndexInSection >= 4;
              const isLastItemInArray = i + index === videoItems.length - 1;
              const isSecondLastItemInArray =
                i + index === videoItems.length - 2;
              const shouldShowBottomBorder =
                !isLastTwoInSection &&
                !isLastItemInArray &&
                !isSecondLastItemInArray;

              return (
                <Link href={getVideoUrl(videoItem)} key={videoItem._id}>
                  <div
                    className={`flex flex-row-reverse gap-3 lg:gap-5 w-full mb-1 pb-3 ${
                      itemIndexInSection % 2 === 0 ? "lg:pr-1" : "lg:pl-1"
                    } relative group ${
                      shouldShowBottomBorder
                        ? "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-gray-200 dark:after:bg-gray-700"
                        : ""
                    } ${
                      itemIndexInSection % 2 === 0
                        ? "lg:before:content-[''] lg:before:absolute lg:before:-right-2 lg:before:top-0 lg:before:h-full lg:before:w-px lg:before:bg-gray-200 dark:lg:before:bg-gray-700"
                        : ""
                    }`}
                  >
                    <div className="flex-1 overflow-hidden relative">
                      <div className="">
                        <Image
                          src={getYouTubeThumbnail(videoItem.youtubeBlock?.url)}
                          width={200}
                          height={120}
                          alt={videoItem.title || "Video thumbnail"}
                          className="w-[100px] h-auto lg:w-full lg:h-[75px] xl:h-[120px] object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                       
                      </div>
                    </div>
                    <div className="flex-2 min-w-0">
                      <h2 className="text-sm lg:text-base xl:text-lg font-semibold mb-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100 line-clamp-3 leading-tight">
                        {videoItem.title}
                      </h2>
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <IoMdTime className="text-xs flex-shrink-0" />
                        <p className="text-xs">
                          {formatDate(videoItem.publishedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      );
    }

    return sections;
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <div className="border-t mb-5">
      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
        <div className="border-b lg:mb-10">
          <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            ভিডিও
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="lg:w-2/3 lg:pr-5 lg:border-r border-gray-300 dark:border-gray-700 relative">
            {/* Horizontal divider for mobile */}
            <div className="lg:hidden w-full border-b border-gray-300 dark:border-gray-700 my-6"></div>

            {!videos || videos.length === 0 ? (
              <div className="text-center flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <p className="text-xl mb-2">কোন ভিডিও পাওয়া যায়নি</p>
                <p className="text-sm">অনুগ্রহ করে পরে আবার চেষ্টা করুন</p>
              </div>
            ) : (
              <>
                {/* Featured Video (First Item) */}
                <div className="border-b border-gray-300 dark:border-gray-700 pb-6 mb-6">
                  {videos.slice(0, 1).map((videoItem) => {
                    if (!videoItem || !videoItem._id) return null;

                    return (
                      <Link key={videoItem._id} href={getVideoUrl(videoItem)}>
                        <div className="flex flex-col lg:flex-row-reverse gap-5 group">
                          <div className="flex-1 relative overflow-hidden">
                            <div className="relative">
                              <Image
                                src={getYouTubeThumbnail(
                                  videoItem.youtubeBlock?.url
                                )}
                                width={500}
                                height={300}
                                alt={videoItem.title || "Video thumbnail"}
                                className="w-full h-full object-center scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                                priority
                              />
                              {/* Play button overlay */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition-colors duration-300 opacity-90 group-hover:opacity-100">
                                  <IoMdPlay className="text-white text-3xl ml-1" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h2 className="mb-4 text-xl lg:text-3xl font-bold leading-tight group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100">
                              {videoItem.title}
                            </h2>
                            <div className="mb-4">
                              <p className="text-gray-600 dark:text-gray-300 line-clamp-4 leading-relaxed">
                                {truncateContent(
                                  getFirstTextContent(
                                    videoItem.description || []
                                  ),
                                  100
                                )}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <IoMdTime className="text-sm" />
                              <p className="text-sm">
                                {formatDate(videoItem.publishedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Video Sections */}
                <div className="mt-5">
                  {videos.length > 1 ? (
                    <>
                      {renderVideoSections()}

                      {/* Load More button or End message */}
                      {hasMoreVideos && onLoadMore ? (
                        <div className="mt-8 pt-4 border-t border-gray-300 dark:border-gray-600">
                          <div className="flex justify-center">
                            <button
                              onClick={onLoadMore}
                              disabled={loadingMore}
                              className="px-6 py-3 bg-green-700 text-white hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium rounded"
                            >
                              {loadingMore ? "লোড হচ্ছে..." : "আরও ভিডিও দেখুন"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        // End border when no more videos
                        videos.length > 1 && (
                          <div className="mt-8 pt-4 border-t border-gray-300 dark:border-gray-600">
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                              সব ভিডিও দেখানো হয়েছে
                            </div>
                          </div>
                        )
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      আর কোন ভিডিও নেই
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="lg:w-1/3 lg:pl-5 mt-10 lg:mt-0">
            {/* Latest News Section */}
            <div className="rounded-lg sticky top-20">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                সর্বশেষ
              </h2>
              <div className="space-y-3">
                {allNews && allNews.length > 0 ? (
                  allNews.slice(0, 5).map((news: NewsItems) => {
                    if (!news || !news._id) return null;

                    return (
                      <Link key={news._id} href={getNewsUrl(news)}>
                        <div className="pb-4 border-b border-gray-200 dark:border-gray-700 group last:border-b-0 w-full">
                          <div className="flex gap-4 w-full">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-base lg:text-lg group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100 line-clamp-3 leading-tight mb-2">
                                {news.title}
                              </h3>
                              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <IoMdTime className="text-xs flex-shrink-0" />
                                <p className="text-xs">
                                  {formatDate(news.publishedAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 overflow-hidden">
                              <Image
                                src={
                                  news.featuredImage?.asset?.url ||
                                  "/news1.jpeg"
                                }
                                width={100}
                                height={75}
                                alt={
                                  news.featuredImage?.alt ||
                                  news.title ||
                                  "News image"
                                }
                                className="w-[100px] h-[75px] object-cover transition-transform duration-400 ease-out group-hover:scale-105"
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    কোন সাম্প্রতিক সংবাদ নেই
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoContentPage;
