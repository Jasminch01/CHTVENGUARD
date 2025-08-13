/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ErrorComponent from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import { getRecentVideoItems } from "@/sanity/sanityQueries";
import { VideoContent } from "@/sanity/sanityTypes";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdPlay } from "react-icons/io";

const VideoNews = () => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await getRecentVideoItems();
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
    <div className="flex mt-10 xl:mt-20">
      {/* Left Main Content */}
      <div className="flex-1">
        <div className="mb-5 text-center py-4 bg-green-600">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold dark:text-gray-100 text-white">
            ভিডিও
          </h1>
        </div>
        <div className="">
          {/* Main Featured Video Section */}
          <div className="mb-3 flex flex-col lg:flex-row gap-3 sm:gap-5 h-auto">
            {/* Featured Video - Left Side */}
            <Link
              href={`/video/${videos[0]._id}`}
              className="flex-1 bg-gray-200 dark:bg-gray-300 p-2 sm:p-3"
            >
              <div className="flex flex-col gap-3 sm:gap-5 group h-full">
                <div className=" relative overflow-hidden">
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
                      <div className="bg-red-600 hover:bg-red-700 rounded-full p-3 sm:p-4 transition-colors duration-300 opacity-90 group-hover:opacity-100">
                        <IoMdPlay className="text-white text-2xl sm:text-3xl ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="">
                  <h1 className="text-lg sm:text-xl lg:text-3xl font-bold leading-tight group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-800">
                    {videos[0]?.title}
                  </h1>
                  <p className="hidden sm:block lg:block text-sm sm:text-base leading-relaxed dark:text-gray-800 mt-2">
                    {truncateContent(videos[0]?.description, 150)}
                  </p>
                </div>
              </div>
            </Link>

            {/* Three Video Cards Section - Right Side */}
            <div className="flex-1 flex flex-col gap-3 sm:gap-5">
              {videos.slice(1, 4).map((item) => (
                <Link
                  key={item._id}
                  href={`/video/${item._id}`}
                  className="dark:bg-gray-300 bg-gray-200 p-2 sm:p-3"
                >
                  <div className="flex flex-row gap-3 sm:gap-5 group h-full">
                    <div className="relative overflow-hidden">
                      <div className="relative h-full">
                        <Image
                          src={getYouTubeThumbnail(item?.youtubeBlock?.url)}
                          width={400}
                          height={250}
                          alt={item?.title || "Video thumbnail"}
                          className="w-20 h-16 sm:w-auto sm:h-[8rem] object-cover lg:group-hover:scale-105 duration-700 ease-in-out"
                        />
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-80">
                          <div className="bg-red-600 hover:bg-red-700 rounded-full p-1.5 sm:p-2 transition-colors duration-300">
                            <IoMdPlay className="text-white text-sm sm:text-lg ml-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div>
                        <h2 className="text-sm sm:text-lg lg:text-xl font-bold leading-tight group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-800 line-clamp-3">
                          {item.title}
                        </h2>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoNews;