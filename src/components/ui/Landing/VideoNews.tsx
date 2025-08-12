/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ErrorComponent from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import { getVideoItems } from "@/sanity/sanityQueries";
import { VideoContent } from "@/sanity/sanityTypes";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdTime, IoMdPlay } from "react-icons/io";

const VideoNews = () => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await getVideoItems(0, 9); // Fetch 9 videos to match layout (1 featured + 2 cards + 6 grid)
        if (Array.isArray(res)) {
          setVideos(res);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Helper function to extract YouTube thumbnail
  const getYouTubeThumbnail = (url: string): string => {
    const videoId = url?.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    );
    return videoId
      ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg`
      : "/video-placeholder.jpg";
  };

  // Helper function to extract text from video description and truncate
  const truncateContent = (
    description: VideoContent["description"],
    maxLength: number
  ) => {
    if (!description || !Array.isArray(description)) return "";

    const firstTextBlock = description.find(
      (block) => block._type === "textBlock"
    );
    if (!firstTextBlock || !firstTextBlock.text) return "";

    let fullText = "";
    if (Array.isArray(firstTextBlock.text)) {
      fullText = firstTextBlock.text
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
    } else if (typeof firstTextBlock.text === "string") {
      fullText = firstTextBlock.text;
    }

    return fullText.length > maxLength
      ? fullText.substring(0, maxLength) + "..."
      : fullText;
  };

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (loading) {
    return (
      <div className="mt-[7rem] border-t border-gray-100 mb-5">
        <Loading loading={loading} />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>কোন ভিডিও পাওয়া যায়নি</p>
      </div>
    );
  }

  return (
    <div className="flex mt-20">
      {/* Left Main Content */}
      <div className="flex-1">
        <div className="mb-10 border-l-4 border-red-500 pl-3">
          <h1 className="text-2xl font-bold dark:text-gray-100">ভিডিও</h1>
        </div>
        <div className="">
          {/* Main Featured Video Section */}
          <div className="mb-3">
            <Link href={`/video/${videos[0]._id}`}>
              <div className="flex lg:flex-row-reverse flex-col h-full gap-5 group border-b pb-3">
                <div className="flex-1 relative overflow-hidden">
                  <div className="relative">
                    <Image
                      src={getYouTubeThumbnail(videos[0]?.youtubeBlock?.url)}
                      width={500}
                      height={500}
                      alt={videos[0]?.title || "Video thumbnail"}
                      className="w-full h-auto object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
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
                  <h1 className="text-xl lg:text-3xl font-bold leading-tight mb-4 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100">
                    {videos[0]?.title}
                  </h1>
                  <p className="hidden lg:block text-base leading-relaxed mb-4 dark:text-gray-300">
                    {truncateContent(videos[0]?.description, 150)}
                  </p>
                  <div className="flex items-center gap-1">
                    <IoMdTime />
                    <p className="text-sm text-gray-500">
                      {new Date(videos[0].publishedAt).toLocaleDateString(
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
          </div>

          {/* Two Video Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-3">
            {videos.slice(1, 3).map((item, index) => (
              <Link key={item._id} href={`/video/${item._id}`}>
                <div
                  className={`flex flex-row-reverse gap-5 group ${
                    index === 0
                      ? "md:border-r md:border-b-0 md:border-gray-300 md:pr-6 border-b dark:md:border-gray-700"
                      : ""
                  }`}
                >
                  <div className="flex-1 relative overflow-hidden">
                    <div className="relative">
                      <Image
                        src={getYouTubeThumbnail(item?.youtubeBlock?.url)}
                        width={400}
                        height={250}
                        alt={item?.title || "Video thumbnail"}
                        className="w-full h-auto object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-80">
                        <div className="bg-red-600 hover:bg-red-700 rounded-full p-2 transition-colors duration-300">
                          <IoMdPlay className="text-white text-lg ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold leading-tight mb-3 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100">
                        {item.title}
                      </h2>
                      <p className="text-gray-600 hidden lg:block dark:text-gray-400 line-clamp-2 leading-relaxed text-justify">
                        {truncateContent(item.description, 50)}
                      </p>
                      <div className="flex items-center gap-1">
                        <IoMdTime />
                        <p className="text-sm text-gray-500 mt-2">
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

          {/* Three Video Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 py-3 border-t border-b border-gray-300 dark:border-gray-700">
            {videos.slice(3).map((item, index) => {
              const isLastInRow = (index + 1) % 3 === 0;

              return (
                <Link key={item._id} href={`/video/${item._id}`}>
                  <div
                    className={`flex h-full flex-row-reverse gap-5 group ${
                      index % 2 === 0 ? "lg:pr-1" : "lg:pl-1"
                    } relative ${
                      // Right border (except last card in each row)
                      !isLastInRow
                        ? "lg:before:content-[''] lg:before:absolute lg:before:-right-2 lg:before:top-0 lg:before:h-full lg:before:w-px lg:before:bg-gray-400 dark:lg:before:bg-gray-700"
                        : ""
                    }`}
                  >
                    <div className="flex-1 relative overflow-hidden">
                      <div className="relative">
                        <Image
                          src={getYouTubeThumbnail(item?.youtubeBlock?.url)}
                          width={500}
                          height={100}
                          alt={item?.title || "Video thumbnail"}
                          className="w-full h-auto object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-80">
                          <div className="bg-red-600 hover:bg-red-700 rounded-full p-1 transition-colors duration-300">
                            <IoMdPlay className="text-white text-xs ml-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100">
                        {item.title}
                      </h2>
                      <div className="flex items-center gap-1">
                        <IoMdTime />
                        <p className="text-xs text-gray-500">
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
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoNews;
