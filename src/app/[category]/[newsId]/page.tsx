/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import { getNewsItem } from "@/sanity/sanityQueries";
import NewsDetailsContentpage from "@/components/shared/NewsDetailsContentpage";
import { ContentBlock, TextBlock } from "@/sanity/sanityTypes";

interface Props {
  params: Promise<{ newsId: string }>;
}

// Helper function to extract text from Sanity rich text blocks
function extractTextFromContent(content: ContentBlock[]): string {
  if (!content || !Array.isArray(content)) {
    return "";
  }

  const textBlocks = content.filter(
    (block): block is TextBlock => block._type === "textBlock"
  );

  if (textBlocks.length === 0) {
    return "";
  }

  const extractedText = textBlocks
    .map((block) => {
      // Handle Sanity's rich text structure
      if (block.text && Array.isArray(block.text)) {
        return block.text
          .map((textBlock: any) => {
            if (textBlock._type === "block" && textBlock.children) {
              return textBlock.children
                .filter((child: any) => child._type === "span")
                .map((span: any) => span.text || "")
                .join("");
            }
            return "";
          })
          .join(" ");
      }
      // Fallback for simple string content
      return typeof block.text === "string" ? block.text : "";
    })
    .filter(Boolean) // Remove empty strings
    .join(" ")
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim();

  // Return first 160 characters for meta description, ensuring it doesn't cut off mid-word
  if (extractedText.length <= 160) return extractedText;

  const truncated = extractedText.substring(0, 157);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 140
    ? truncated.substring(0, lastSpace) + "..."
    : truncated + "...";
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
    const { newsId } = await params;
    const newsItem = await getNewsItem(newsId);

    if (!newsItem) {
      return {
        title: "News Not Found | chtvanguard",
        description: "The requested news article could not be found.",
        robots: { index: false, follow: false },
      };
    }

    // Extract description from content blocks
    const contentDescription = extractTextFromContent(newsItem.content || []);

    const baseDescription =
      contentDescription ||
      `Read about ${newsItem.title} in ${getCategoryDisplayName(
        newsItem.category
      )}`;

    // Ensure description is at least 50 characters for better social sharing
    const finalDescription =
      baseDescription.length < 50
        ? `${baseDescription} - Read more about this ${getCategoryDisplayName(
            newsItem.category
          ).toLowerCase()} news story.`
        : baseDescription;

    // Get featured image URL - make sure it's absolute
    const featuredImageUrl = newsItem.featuredImage?.asset?.url;
    const featuredImageAlt = newsItem.featuredImage?.alt || newsItem.title;

    // Fix: Ensure absolute URL for images with proper protocol
    const absoluteImageUrl = featuredImageUrl
      ? featuredImageUrl.startsWith("http")
        ? featuredImageUrl
        : featuredImageUrl.startsWith("//")
        ? `https:${featuredImageUrl}`
        : `https://${featuredImageUrl}`
      : null;

    // Fix: Use production domain consistently
    const baseUrl = "https://www.chtvanguard.com";
    const absoluteUrl = `${baseUrl}/news/${newsId}`;

    return {
      title: `${newsItem.title} | chtvanguard`,
      description: finalDescription,
      keywords: [
        newsItem.category,
        getCategoryDisplayName(newsItem.category),
        "news",
        "article",
        "chtvanguard",
      ],

      // Fix: Simplified and clean Open Graph tags
      openGraph: {
        title: newsItem.title,
        description: finalDescription,
        type: "article",
        publishedTime: newsItem.publishedAt,
        authors: [newsItem.author || "chtvanguard"],
        section: getCategoryDisplayName(newsItem.category),
        tags: [newsItem.category, getCategoryDisplayName(newsItem.category)],
        images: absoluteImageUrl
          ? [
              {
                url: absoluteImageUrl,
                width: 1200,
                height: 630,
                alt: featuredImageAlt,
                type: "image/jpeg", // Add image type
              },
            ]
          : [
              {
                url: `${baseUrl}/default-news-image.jpg`, // Fallback image
                width: 1200,
                height: 630,
                alt: "chtvanguard news",
                type: "image/jpeg",
              },
            ],
        url: absoluteUrl,
        siteName: "chtvanguard",
        locale: "en_US",
      },

      // Fix: Simplified Twitter Card
      twitter: {
        card: "summary_large_image",
        title: newsItem.title,
        description: finalDescription,
        images: absoluteImageUrl
          ? [absoluteImageUrl]
          : [`${baseUrl}/default-news-image.jpg`],
        creator: newsItem.author ? `@${newsItem.author}` : "@chtvanguard",
        site: "@chtvanguard",
      },

      // Additional SEO
      category: getCategoryDisplayName(newsItem.category),

      // Fix: Remove redundant meta tags from 'other' section
      // These are already handled by openGraph and twitter objects above
      other: {
        "article:published_time": newsItem.publishedAt,
        "article:author": newsItem.author || "chtvanguard",
        "article:section": getCategoryDisplayName(newsItem.category),
        "article:tag": newsItem.category,
      },

      // Canonical URL - Fix: Use production domain
      alternates: {
        canonical: absoluteUrl,
      },

      // Fix: Set metadataBase to production domain
      metadataBase: new URL(baseUrl),

      // Fix: Add robots meta for better crawling
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "News Article | chtvanguard",
      description: "Read the latest news article on chtvanguard.",
    };
  }
}

// Server component wrapper - now properly handles the data fetching
export default async function NewsDetailsPage({ params }: Props) {
  // Pre-fetch the news item on the server for better performance
  const { newsId } = await params;
  const newsItem = await getNewsItem(newsId).catch(() => null);

  // Extract description for JSON-LD
  const contentDescription = newsItem
    ? extractTextFromContent(newsItem.content || [])
    : "";

  const finalDescription =
    contentDescription ||
    `Read about ${newsItem?.title} in ${getCategoryDisplayName(
      newsItem?.category || ""
    )}`;

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
              description: finalDescription,
              image: newsItem.featuredImage?.asset?.url
                ? [
                    newsItem.featuredImage.asset.url.startsWith("http")
                      ? newsItem.featuredImage.asset.url
                      : `https:${newsItem.featuredImage.asset.url}`,
                  ]
                : [`https://www.chtvanguard.com/default-news-image.jpg`],
              datePublished: newsItem.publishedAt,
              dateModified: newsItem.publishedAt, // Add modified date
              author: {
                "@type": "Person",
                name: newsItem.author || "chtvanguard",
              },
              publisher: {
                "@type": "Organization",
                name: "chtvanguard",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.chtvanguard.com/logo.png",
                  width: 200,
                  height: 60,
                },
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://www.chtvanguard.com/news/${newsId}`,
              },
              articleSection: getCategoryDisplayName(newsItem.category),
              wordCount: extractTextFromContent(newsItem.content || []).split(
                " "
              ).length,
              isAccessibleForFree: true, // Add accessibility info
              genre: getCategoryDisplayName(newsItem.category),
            }),
          }}
        />
      )}
      <NewsDetailsContentpage newsId={newsId} />
    </>
  );
}
