"use client";
import ErrorComponent from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import { getFeaturedNewsItems } from "@/sanity/sanityQueries";
import { NewsItems } from "@/sanity/sanityTypes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";

const FeaturedNews: React.FC = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsItems[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        setLoading(true);
        const news = await getFeaturedNewsItems();
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
    return (
      // <div className="w-full max-w-7xl mx-auto p-4">
      //   <div className="animate-pulse">

      //     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-3">
      //       {[...Array(4)].map((_, index) => (
      //         <div
      //           key={index}
      //           className={`flex flex-col gap-5 ${

      //             index < 3
      //               ? "md:border-r md:border-gray-300 md:pr-6 dark:md:border-gray-700"
      //               : ""
      //           } ${

      //             index < 3
      //               ? "border-b border-gray-300 pb-6 md:border-b-0 md:pb-0 dark:border-gray-700"
      //               : ""
      //           }`}
      //         >

      //           <div className="flex-1 relative overflow-hidden">
      //             <div className="w-full h-48 lg:h-60 bg-gray-200 dark:bg-gray-700"></div>
      //           </div>

      //           <div className="flex-1 flex flex-col justify-between">
      //             <div>

      //               <div className="space-y-2 mb-3">
      //                 <div className="h-5 bg-gray-200 dark:bg-gray-700 w-full"></div>
      //                 <div className="h-5 bg-gray-200 dark:bg-gray-700 w-4/5"></div>
      //                 <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      //               </div>

      //               <div className="flex items-center gap-1 mt-2">
      //                 <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700"></div>
      //                 <div className="h-4 bg-gray-200 dark:bg-gray-700 w-32"></div>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //       ))}
      //     </div>
      //   </div>
      // </div>
      <Loading loading={loading} />
    );
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (featuredNews.length === 0) {
    return <div className="w-full max-w-7xl mx-auto"></div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto mb-10 relative">
      {/* Gradient border wrapper */}
      <div className="bg-gradient-to-r from-red-500 to-green-500 p-[2px]">
        <div className="bg-white dark:bg-gray-900 p-4">
          {/* News grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {featuredNews.map((item, index) => (
              <Link key={item._id} href={`/news/${item.category}/${item._id}`}>
                <div
                  className={`flex flex-col gap-5 group ${
                    // First card - right border on md+ screens
                    index === 0
                      ? "md:border-r md:border-gray-300 md:pr-6 dark:md:border-gray-700"
                      : ""
                  } ${
                    // Second card - right border on md+ screens
                    index === 1
                      ? "md:border-r md:border-gray-300 md:pr-6 dark:md:border-gray-700"
                      : ""
                  } ${
                    // Third card - right border on md+ screens
                    index === 2
                      ? "md:border-r md:border-gray-300 md:pr-6 dark:md:border-gray-700"
                      : ""
                  } ${
                    // All cards except last - bottom border on mobile
                    index < featuredNews.length - 1
                      ? "border-b border-gray-300 pb-6 md:border-b-0 md:pb-0 dark:border-gray-700"
                      : ""
                  }`}
                >
                  <div className="flex-1 relative overflow-hidden">
                    <Image
                      src={item.featuredImage?.asset?.url || "/news1.jpeg"}
                      width={400}
                      height={250}
                      alt={item.featuredImage?.alt || item.title}
                      className="w-full h-[10rem] object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold leading-tight mb-3 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100">
                        {item.title}
                      </h2>
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
        </div>
      </div>
    </div>
  );
};

export default FeaturedNews;
