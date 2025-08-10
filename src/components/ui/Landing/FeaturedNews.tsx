/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ErrorComponent from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import { getFeaturedNewsItems } from "@/sanity/sanityQueries";
import { NewsItems, ContentBlock } from "@/sanity/sanityTypes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";

const FeaturedNews: React.FC = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsItems[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to extract text content from rich text blocks (if needed for excerpts later)
  const extractTextFromContent = (content: ContentBlock[]): string => {
    return content
      .filter((block) => block._type === "textBlock")
      .map((block) => {
        // Handle the new rich text editor structure
        if (Array.isArray(block.text)) {
          return block.text
            .filter((item: any) => item._type === 'block')
            .map((item: any) => {
              return item.children
                ?.filter((child: any) => child._type === 'span')
                ?.map((span: any) => span.text)
                ?.join('') || '';
            })
            .join(' ');
        }
        // Fallback for old simple text structure (if any still exists)
        return typeof block.text === 'string' ? block.text : '';
      })
      .join(" ");
  };

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

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
      classes.push("md:border-r md:border-gray-300 md:pr-6 dark:md:border-gray-700");
    }
    
    // Bottom borders for mobile (all except last)
    if (index < totalItems - 1) {
      classes.push("border-b border-gray-300 pb-6 md:border-b-0 md:pb-0 dark:border-gray-700");
    }
    
    return classes.join(" ");
  };

  return (
    <div className="w-full max-w-7xl mx-auto mb-10 relative">
      {/* Gradient border wrapper */}
      <div className="bg-gradient-to-r from-red-500 to-green-500 p-[2px] rounded-lg">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-md">
          {/* News grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {featuredNews.slice(0, 4).map((item, index) => (
              <Link key={item._id} href={`/news/${item.category}/${item._id}`}>
                <div
                  className={`flex flex-col gap-5 group h-full ${getBorderClasses(
                    index,
                    Math.min(featuredNews.length, 4)
                  )}`}
                >
                  {/* Image */}
                  <div className="flex-1 relative overflow-hidden rounded-md">
                    <Image
                      src={item.featuredImage?.asset?.url || "/news1.jpeg"}
                      width={400}
                      height={250}
                      alt={item.featuredImage?.alt || item.title}
                      className="w-full h-[10rem] object-cover scale-100 group-hover:scale-105 transition-transform duration-400 ease-out"
                    />
                    {/* Overlay for better text readability if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold leading-tight mb-3 group-hover:text-blue-500 dark:group-hover:text-blue-400 dark:text-gray-100 line-clamp-3">
                        {item.title}
                      </h3>
                      
                      {/* Optional: Add excerpt if you want to show some content */}
                      {item.content && item.content.length > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {truncateContent(
                            extractTextFromContent(item.content),
                            80
                          )}
                        </p>
                      )}
                      
                      {/* Date */}
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
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