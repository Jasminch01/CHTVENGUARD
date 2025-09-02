/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import { getNewsItem } from "@/sanity/sanityQueries";
import NewsDetailsContentpage from "@/components/shared/NewsDetailsContentpage";
import { ContentBlock, TextBlock } from "@/sanity/sanityTypes";

interface Props {
  params: Promise<{ newsId: string }>;
}

// FIXED: More robust base URL function with proper production handling
function getBaseUrl(): string {
  // Always use custom domain in production
  if (process.env.NODE_ENV === "production") {
    return "https://www.chtvanguard.com";
  }

  // Development environment
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // Preview/staging environments (Vercel)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback
  return "https://www.chtvanguard.com";
}

// FIXED: More robust text extraction with better error handling
function extractTextFromContent(content: ContentBlock[]): string {
  if (!content || !Array.isArray(content)) {
    return "";
  }

  try {
    const textBlocks = content.filter(
      (block): block is TextBlock => block._type === "textBlock"
    );

    if (textBlocks.length === 0) {
      return "";
    }

    const extractedText = textBlocks
      .map((block) => {
        if (!block.text) return "";

        // Handle Sanity's rich text structure
        if (Array.isArray(block.text)) {
          return block.text
            .map((textBlock: any) => {
              if (
                textBlock._type === "block" &&
                Array.isArray(textBlock.children)
              ) {
                return textBlock.children
                  .filter((child: any) => child._type === "span" && child.text)
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
  } catch (error) {
    console.error("Error extracting text from content:", error);
    return "";
  }
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

// FIXED: More robust image URL handling
function getAbsoluteImageUrl(
  imageUrl: string | undefined,
  baseUrl: string
): string {
  if (!imageUrl) {
    return `${baseUrl}/default-news-image.jpg`;
  }

  // Already absolute URL
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Protocol-relative URL
  if (imageUrl.startsWith("//")) {
    return `https:${imageUrl}`;
  }

  // Relative URL
  if (imageUrl.startsWith("/")) {
    return `${baseUrl}${imageUrl}`;
  }

  // Sanity CDN URLs (common pattern)
  if (imageUrl.includes("sanity")) {
    return `https://${imageUrl}`;
  }

  // Default case
  return `${baseUrl}/${imageUrl}`;
}

// FIXED: Generate dynamic metadata with better error handling and debugging
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { newsId } = await params;

    // FIXED: Better error handling for data fetching
    const newsItem = await getNewsItem(newsId).catch((error) => {
      console.error(`Error fetching news item ${newsId}:`, error);
      return null;
    });

    if (!newsItem) {
      return {
        title: "News Not Found | CHT Vanguard",
        description: "The requested news article could not be found.",
        robots: { index: false, follow: false },
        metadataBase: new URL("https://www.chtvanguard.com"),
      };
    }

    // Get the correct base URL
    const baseUrl = getBaseUrl();

    // DEBUG: Add logging to understand what's happening
    console.log("=== METADATA GENERATION DEBUG ===");
    console.log("News ID:", newsId);
    console.log("News Title:", newsItem.title);
    console.log("Base URL:", baseUrl);
    console.log("Category:", newsItem.category);
    console.log("Featured Image:", newsItem.featuredImage?.asset?.url);
    console.log("Environment:", {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      VERCEL_URL: process.env.VERCEL_URL ? "Set" : "Not set",
    });

    // Extract description from content blocks
    const contentDescription = extractTextFromContent(newsItem.content || []);
    const categoryDisplay = getCategoryDisplayName(newsItem.category);

    const baseDescription =
      contentDescription ||
      `Read about ${newsItem.title} in ${categoryDisplay} news section.`;

    // Ensure description is at least 50 characters for better social sharing
    const finalDescription =
      baseDescription.length < 50
        ? `${baseDescription} - Get the latest ${categoryDisplay.toLowerCase()} news and updates from CHT Vanguard.`
        : baseDescription;

    // FIXED: Better image URL handling
    const featuredImageUrl = getAbsoluteImageUrl(
      newsItem.featuredImage?.asset?.url,
      baseUrl
    );
    const featuredImageAlt = newsItem.featuredImage?.alt || newsItem.title;

    // FIXED: Always use absolute URLs
    const absoluteUrl = `${baseUrl}/news/${newsItem.category}/${newsId}`;
    const canonicalUrl = absoluteUrl;

    console.log("Generated URLs:", {
      canonical: canonicalUrl,
      image: featuredImageUrl,
      og: absoluteUrl,
    });
    console.log("================================");

    // FIXED: Force metadataBase and use consistent URLs
    const metadata: Metadata = {
      title: `${newsItem.title} | CHT Vanguard`,
      description: finalDescription,
      keywords: [
        newsItem.category,
        categoryDisplay,
        "news",
        "article",
        "CHT Vanguard",
        "Chittagong Hill Tracts",
        "Bangladesh news",
      ].join(", "),

      // CRITICAL FIX: Always set metadataBase to your custom domain
      metadataBase: new URL("https://www.chtvanguard.com"),

      // Open Graph tags with absolute URLs
      openGraph: {
        title: newsItem.title,
        description: finalDescription,
        type: "article",
        publishedTime: newsItem.publishedAt,
        modifiedTime: newsItem.publishedAt,
        authors: [newsItem.author || "CHT Vanguard"],
        section: categoryDisplay,
        tags: [newsItem.category, categoryDisplay, "news"],
        images: [
          {
            url: featuredImageUrl,
            width: 1200,
            height: 630,
            alt: featuredImageAlt,
            type: "image/jpeg",
          },
        ],
        url: absoluteUrl,
        siteName: "CHT Vanguard",
        locale: "en_US",
      },

      // Twitter Card
      twitter: {
        card: "summary_large_image",
        title: newsItem.title,
        description: finalDescription,
        images: [featuredImageUrl],
        creator: newsItem.author ? `@${newsItem.author}` : "@chtvanguard",
        site: "@chtvanguard",
      },

      // Additional SEO
      category: categoryDisplay,
      authors: [{ name: newsItem.author || "CHT Vanguard" }],

      // Article-specific meta tags
      other: {
        "article:published_time": newsItem.publishedAt,
        "article:modified_time": newsItem.publishedAt,
        "article:author": newsItem.author || "CHT Vanguard",
        "article:section": categoryDisplay,
        "article:tag": [newsItem.category, categoryDisplay].join(","),
        "og:image:secure_url": featuredImageUrl,
        "og:image:type": "image/jpeg",
        "og:image:width": "1200",
        "og:image:height": "630",
      },

      // CRITICAL: Canonical URL - always use custom domain
      alternates: {
        canonical: canonicalUrl,
      },

      // Robots meta for better crawling
      robots: {
        index: true,
        follow: true,
        noarchive: false,
        nositelinkssearchbox: false,
        noimageindex: false,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },

      // Additional verification
      verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      },
    };

    return metadata;
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "News Article | CHT Vanguard",
      description:
        "Read the latest news article on CHT Vanguard - Your trusted source for Chittagong Hill Tracts news.",
      metadataBase: new URL("https://www.chtvanguard.com"),
    };
  }
}

// FIXED: Server component with better error handling
export default async function NewsDetailsPage({ params }: Props) {
  try {
    // Pre-fetch the news item on the server for better performance
    const { newsId } = await params;
    const newsItem = await getNewsItem(newsId).catch((error) => {
      console.error(`Error fetching news item in component ${newsId}:`, error);
      return null;
    });

    // Get the correct base URL
    const baseUrl = getBaseUrl();

    // FIXED: Better structured data generation
    const generateStructuredData = () => {
      if (!newsItem) return null;

      // Extract description for JSON-LD
      const contentDescription = extractTextFromContent(newsItem.content || []);
      const finalDescription =
        contentDescription ||
        `Read about ${newsItem.title} in ${getCategoryDisplayName(
          newsItem.category
        )} news section.`;

      const imageUrl = getAbsoluteImageUrl(
        newsItem.featuredImage?.asset?.url,
        baseUrl
      );

      return {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: newsItem.title,
        description: finalDescription,
        image: [imageUrl],
        datePublished: newsItem.publishedAt,
        dateModified: newsItem.publishedAt,
        author: {
          "@type": "Person",
          name: newsItem.author || "CHT Vanguard",
          url: `${baseUrl}/author/${(newsItem.author || "cht-vanguard")
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
        },
        publisher: {
          "@type": "Organization",
          name: "CHT Vanguard",
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
            width: 200,
            height: 60,
          },
          sameAs: [
            "https://facebook.com/chtvanguard",
            "https://twitter.com/chtvanguard",
            "https://instagram.com/chtvanguard",
          ],
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${baseUrl}/news/${newsItem.category}/${newsId}`,
        },
        articleSection: getCategoryDisplayName(newsItem.category),
        wordCount: contentDescription.split(" ").filter(Boolean).length,
        isAccessibleForFree: true,
        genre: getCategoryDisplayName(newsItem.category),
        about: {
          "@type": "Thing",
          name: getCategoryDisplayName(newsItem.category),
        },
        locationCreated: {
          "@type": "Place",
          name: "Chittagong Hill Tracts, Bangladesh",
        },
        inLanguage: "en-US",
      };
    };

    const structuredData = generateStructuredData();

    return (
      <>
        {/* FIXED: Better structured data with error handling */}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        )}

        {/* FIXED: Add additional meta tags in head */}
        {newsItem && (
          <>
            {/* Preload critical resources */}
            <link
              rel="preload"
              href={getAbsoluteImageUrl(
                newsItem.featuredImage?.asset?.url,
                baseUrl
              )}
              as="image"
            />

            {/* Additional verification and meta tags */}
            <meta name="format-detection" content="telephone=no" />
            <meta name="theme-color" content="#ffffff" />
          </>
        )}

        <NewsDetailsContentpage newsId={newsId} />
      </>
    );
  } catch (error) {
    console.error("Error in NewsDetailsPage component:", error);
    return <NewsDetailsContentpage newsId={(await params).newsId} />;
  }
}
