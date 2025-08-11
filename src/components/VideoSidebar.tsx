import React from "react";
import Link from "next/link";
import { IoMdTime} from "react-icons/io";
import { VideoContent } from "@/sanity/sanityTypes";

interface VideoSidebarProps {
  relatedVideos: VideoContent[];
}

const VideoSidebar: React.FC<VideoSidebarProps> = ({ relatedVideos }) => {

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

  return (
    <div className="lg:col-span-1">
      {/* Related Videos Section */}
      <div className="mt-14 pb-10">
        <div className="mb-4 border-b pb-3">
          <h3 className="text-2xl font-bold">আরও দেখুন</h3>
        </div>

        <div className="space-y-4">
          {relatedVideos && relatedVideos.length > 0 ? (
            relatedVideos.map((video) => {
              if (!video || !video._id) return null;
              return (
                <Link key={video._id} href={`/video/${video._id}`}>
                  <div className="group border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                    <div className="flex gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-lg group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100 line-clamp-3 leading-tight mb-2">
                          {video.title}
                        </h4>

                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <IoMdTime className="text-xs flex-shrink-0" />
                          <p className="text-xs">
                            {formatDate(video.publishedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <p className="text-lg">কোন সংশ্লিষ্ট ভিডিও পাওয়া যায়নি</p>
              <p className="text-sm mt-2">আরও ভিডিও দেখতে হোমপেজে যান</p>
            </div>
          )}
        </div>

        {/* Show "More Videos" link if there are related videos */}
        {relatedVideos && relatedVideos.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/video"
              className="block text-center bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 transition-colors duration-200 font-medium cursor-pointer"
            >
              আরও ভিডিও
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default VideoSidebar;
