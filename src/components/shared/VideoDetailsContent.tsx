"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VideoMainContent from "@/components/VideoMainContent";
import { VideoContent } from "@/sanity/sanityTypes";
import {
  getVideoById,
  getRelatedVideoItems,
  getRecentVideoItemsExcluding, // Import the new function
} from "@/sanity/sanityQueries";
import Loading from "@/components/shared/Loading";
import ErrorComponent from "@/components/shared/Error";
import VideoSidebar from "../VideoSidebar";

interface Props {
  videoId: string;
}

const VideoDetailsContentpage = ({ videoId }: Props) => {
  const router = useRouter();
  const [videoItem, setVideoItem] = useState<VideoContent | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<VideoContent[]>([]);
  const [latestVideos, setLatestVideos] = useState<VideoContent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch main video item
        const mainVideoItem = await getVideoById(videoId);

        if (!mainVideoItem) {
          setError("Video not found");
          return;
        }

        setVideoItem(mainVideoItem);

        // Fetch related videos and latest videos in parallel
        const [relatedVideosData, latestVideosData] = await Promise.all([
          // Use the new function that excludes the current video
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          getRelatedVideoItems(videoId).catch((err: any) => {
            console.error("Error fetching related videos:", err);
            return [];
          }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          getRecentVideoItemsExcluding(videoId).catch((err: any) => {
            console.error("Error fetching latest videos:", err);
            return [];
          }),
        ]);

        setRelatedVideos(relatedVideosData);
        setLatestVideos(latestVideosData);
      } catch (error) {
        console.error("Error fetching video:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  // Update document title dynamically for better client-side navigation
  useEffect(() => {
    if (videoItem) {
      document.title = `${videoItem.title} | chtvanguard`;
    }
  }, [videoItem]);

  if (loading) {
    return <Loading loading={loading} />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!videoItem) {
    return (
      <div className="max-w-4xl mx-auto h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-600">
            Video not found.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto mt-3 px-5 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <VideoMainContent videoItem={videoItem} latestVideos={latestVideos} />
          <VideoSidebar relatedVideos={relatedVideos} />
        </div>
      </div>
    </div>
  );
};

export default VideoDetailsContentpage;
