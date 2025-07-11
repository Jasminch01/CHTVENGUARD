// "use client";
// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import NewsMainContent from "@/components/NewsMainContent";
// import NewsSidebar from "@/components/NewsSideBar";
// import { NewsItems } from "@/sanity/sanityTypes";
// import {
//   getNewsItem,
//   getRecentNews,
//   getRelatedNews,
// } from "@/sanity/sanityQueries";
// import Loading from "@/components/shared/Loading";
// import ErrorComponent from "@/components/shared/Error";

// const NewsDetailsContentpage = () => {
//   const { newsId } = useParams();
//   const [newsItem, setNewsItem] = useState<NewsItems | null>(null);
//   const [relatedNews, setRelatedNews] = useState<NewsItems[]>([]);
//   const [latestNews, setLatestNews] = useState<NewsItems[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   const id = newsId?.toString() as string;
//   useEffect(() => {
//     const fetchNews = async () => {
//       if (!id) return;

//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch main news item
//         const mainNewsItem = await getNewsItem(id);

//         if (!mainNewsItem) {
//           setError("News item not found");
//           return;
//         }

//         setNewsItem(mainNewsItem);

//         // Fetch related news and latest news in parallel
//         const [latestNewsData, relatedNewsData] = await Promise.all([
//           getRelatedNews(id, mainNewsItem.category, 5).catch((err) => {
//             console.error("Error fetching related news:", err);
//             return [];
//           }),
//           getRecentNews(3).catch((err) => {
//             console.error("Error fetching latest news:", err);
//             return [];
//           }),
//         ]);

//         setRelatedNews(relatedNewsData);
//         setLatestNews(latestNewsData);
//       } catch (error) {
//         console.error("Error fetching news:", error);
//         setError(error instanceof Error ? error.message : "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNews();
//   }, [id]);
//   if (loading) {
//     return <Loading loading={loading} />;
//   }
//   if (error) {
//     return <ErrorComponent error={error} />;
//   }

//   if (!newsItem) {
//     return (
//       <div className="max-w-4xl mx-auto p-4 h-screen flex justify-center items-center">
//         <div className="text-center">
//           <p className="text-lg font-semibold text-gray-600">
//             News item not found.
//           </p>
//           <button
//             onClick={() => window.history.back()}
//             className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="">
//       <div className="max-w-7xl mx-auto mt-3 px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           <NewsMainContent newsItem={newsItem} latestNews={latestNews} />

//           <NewsSidebar relatedNews={relatedNews} category={newsItem.category} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewsDetailsContentpage;

// app/news/[newsId]/page.tsx
import { Metadata } from "next";
import { getNewsItem } from "@/sanity/sanityQueries";
import NewsDetailsContentpage from "@/components/shared/NewsDetailsContentpage";
import { ContentBlock } from "@/sanity/sanityTypes";

interface Props {
  params: { newsId: string };
}

// Helper function to extract text from content blocks
function extractTextFromContent(content: ContentBlock[]): string {
  if (!content || !Array.isArray(content)) return "";

  return content
    .filter((block) => block._type === "textBlock")
    .map((block) => block.text)
    .join(" ")
    .substring(0, 160); // Limit to 160 characters for description
}

// Helper function to get category display name
function getCategoryDisplayName(category: string): string {
  const categoryMap = {
    rangamati: "Rangamati",
    khagrachari: "Khagrachari",
    bandarban: "Bandarban",
    national: "National",
    international: "International",
    "press-release": "Press Release",
    opinion: "Opinion",
  };
  return categoryMap[category as keyof typeof categoryMap] || category;
}

// Generate dynamic metadata (runs on server)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const newsItem = await getNewsItem(params.newsId);

    if (!newsItem) {
      return {
        title: "News Not Found",
        description: "The requested news article could not be found.",
        robots: { index: false, follow: false },
      };
    }

    // Extract description from content blocks
    const description =
      extractTextFromContent(newsItem.content) ||
      `Read about ${newsItem.title} in ${getCategoryDisplayName(
        newsItem.category
      )}`;

    // Get featured image URL - make sure it's absolute
    const featuredImageUrl = newsItem.featuredImage?.asset?.url;
    const featuredImageAlt = newsItem.featuredImage?.alt || newsItem.title;

    // Ensure absolute URL for images
    const absoluteImageUrl = featuredImageUrl
      ? featuredImageUrl.startsWith("http")
        ? featuredImageUrl
        : `https:${featuredImageUrl}`
      : null;

    // Get absolute URL for canonical and og:url
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";
    const absoluteUrl = `${baseUrl}/news/${params.newsId}`;

    return {
      title: `${newsItem.title} | Your Site Name`,
      description: description,
      keywords: [
        newsItem.category,
        getCategoryDisplayName(newsItem.category),
        "news",
        "article",
      ],

      // Open Graph tags for social media
      openGraph: {
        title: newsItem.title,
        description: description,
        type: "article",
        publishedTime: newsItem.publishedAt,
        authors: [newsItem.author],
        section: getCategoryDisplayName(newsItem.category),
        tags: [newsItem.category, getCategoryDisplayName(newsItem.category)],
        images: absoluteImageUrl
          ? [
              {
                url: absoluteImageUrl,
                width: 1200,
                height: 630,
                alt: featuredImageAlt,
              },
            ]
          : [],
        url: absoluteUrl,
        siteName: "Your Site Name",
        locale: "en_US",
      },

      // Twitter Card
      twitter: {
        card: "summary_large_image",
        title: newsItem.title,
        description: description,
        images: absoluteImageUrl ? [absoluteImageUrl] : [],
        creator: `@${newsItem.author}`,
        site: "@yoursite", // Add your Twitter handle
      },

      // Additional SEO
      category: getCategoryDisplayName(newsItem.category),

      // Structured Data (JSON-LD) - moved to other section
      other: {
        "article:published_time": newsItem.publishedAt,
        "article:author": newsItem.author,
        "article:section": getCategoryDisplayName(newsItem.category),
        "article:tag": newsItem.category,
      },

      // Canonical URL
      alternates: {
        canonical: absoluteUrl,
      },

      // Additional meta tags for better social sharing
      metadataBase: new URL(baseUrl),
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "News Article | Your Site Name",
      description: "Read the latest news article on our website.",
    };
  }
}

// Server component wrapper - now properly handles the data fetching
export default async function NewsDetailsPage({ params }: Props) {
  // Pre-fetch the news item on the server for better performance
  const newsItem = await getNewsItem(params.newsId).catch(() => null);

  return (
    <>
      {/* Add JSON-LD structured data for better SEO */}
      {newsItem && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              headline: newsItem.title,
              description: extractTextFromContent(newsItem.content),
              image: newsItem.featuredImage?.asset?.url
                ? [newsItem.featuredImage.asset.url]
                : [],
              datePublished: newsItem.publishedAt,
              author: {
                "@type": "Person",
                name: newsItem.author,
              },
              publisher: {
                "@type": "Organization",
                name: "Your Site Name",
                logo: {
                  "@type": "ImageObject",
                  url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
                },
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/news/${params.newsId}`,
              },
            }),
          }}
        />
      )}
      <NewsDetailsContentpage newsId={params.newsId} />
    </>
  );
}
