"use client";
import React, { useEffect, useState } from "react";
import { NewsItems, VideoContent } from "@/sanity/sanityTypes";
import { getRecentNews, getVideoItems } from "@/sanity/sanityQueries";
import VideoContentPage from "@/components/shared/VideoContentPage";

const VideoPage = () => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [allNews, setAllNews] = useState<NewsItems[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const initialLoadItems = 7;
  const loadMoreItems = 6;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        setCurrentOffset(0);
        setVideos([]);
        setHasMoreVideos(true);

        // Fetch initial batch - fetch exactly 7 items for display
        const videoData = await getVideoItems(
          0, // page
          initialLoadItems // limit
        );

        if (Array.isArray(videoData)) {
          setVideos(videoData);

          // Check if we have more items by trying to fetch the next page
          // If we got fewer than initialLoadItems items, there are no more
          if (videoData.length < initialLoadItems) {
            setHasMoreVideos(false);
          } else {
            // Check if there's more data by fetching 1 item starting from offset 7
            const nextBatchCheck = await getVideoItems(
              0, // page doesn't matter
              1, // just check for 1 item
              initialLoadItems // start from position 7
            );
            setHasMoreVideos(
              Array.isArray(nextBatchCheck) && nextBatchCheck.length > 0
            );
          }
        } else {
          setVideos([]);
          setHasMoreVideos(false);
        }

        // Fetch recent news for sidebar
        const recentData = await getRecentNews(10);
        setAllNews(Array.isArray(recentData) ? recentData : []);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreVideos) return;

    try {
      setLoadingMore(true);
      setError(null);
      const nextOffset =
        currentOffset +
        (currentOffset === 0 ? initialLoadItems : loadMoreItems);

      // Fetch next batch of items using offset
      const newVideos = await getVideoItems(
        0, // page doesn't matter
        loadMoreItems, // fetch 6 items
        nextOffset // start from the correct offset
      );

      if (Array.isArray(newVideos) && newVideos.length > 0) {
        // Add the new items to existing ones
        setVideos((prev) => [...prev, ...newVideos]);
        setCurrentOffset(nextOffset);

        // Check if we have more items
        if (newVideos.length < loadMoreItems) {
          // If we got fewer than loadMoreItems items, no more items exist
          setHasMoreVideos(false);
        } else {
          // Check if there's another batch after this one
          const nextBatchCheck = await getVideoItems(
            0, // page doesn't matter
            1, // just check for 1 item
            nextOffset + loadMoreItems // check from next position
          );
          setHasMoreVideos(
            Array.isArray(nextBatchCheck) && nextBatchCheck.length > 0
          );
        }
      } else {
        // No more items to load
        setHasMoreVideos(false);
      }
    } catch (err) {
      console.error("Error loading more videos:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load more videos"
      );
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div>
      <VideoContentPage
        videos={videos}
        allNews={allNews}
        loading={loading}
        error={error}
        onLoadMore={handleLoadMore}
        hasMoreVideos={hasMoreVideos}
        loadingMore={loadingMore}
      />
    </div>
  );
};

export default VideoPage;
