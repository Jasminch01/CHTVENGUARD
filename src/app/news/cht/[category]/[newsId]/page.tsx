// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Metadata } from "next";
// import { getNewsItem } from "@/sanity/sanityQueries";
// import NewsDetailsContentpage from "@/components/shared/NewsDetailsContentpage";
// import { ContentBlock, TextBlock } from "@/sanity/sanityTypes";

// interface Props {
//   params: Promise<{ newsId: string }>;
// }

// // Helper function to extract text from Sanity rich text blocks
// function extractTextFromContent(content: ContentBlock[]): string {
//   if (!content || !Array.isArray(content)) {
//     return "";
//   }

//   const textBlocks = content.filter(
//     (block): block is TextBlock => block._type === "textBlock"
//   );

//   if (textBlocks.length === 0) {
//     return "";
//   }

//   const extractedText = textBlocks
//     .map((block) => {
//       // Handle Sanity's rich text structure
//       if (block.text && Array.isArray(block.text)) {
//         return block.text
//           .map((textBlock: any) => {
//             if (textBlock._type === "block" && textBlock.children) {
//               return textBlock.children
//                 .filter((child: any) => child._type === "span")
//                 .map((span: any) => span.text || "")
//                 .join("");
//             }
//             return "";
//           })
//           .join(" ");
//       }
//       // Fallback for simple string content
//       return typeof block.text === "string" ? block.text : "";
//     })
//     .filter(Boolean) // Remove empty strings
//     .join(" ")
//     .replace(/\s+/g, " ") // Replace multiple spaces with single space
//     .trim();

//   // Return first 160 characters for meta description, ensuring it doesn't cut off mid-word
//   if (extractedText.length <= 160) return extractedText;

//   const truncated = extractedText.substring(0, 157);
//   const lastSpace = truncated.lastIndexOf(" ");
//   return lastSpace > 140
//     ? truncated.substring(0, lastSpace) + "..."
//     : truncated + "...";
// }

// // Helper function to get category display name
// function getCategoryDisplayName(category: string): string {
//   const categoryMap = {
//     rangamati: "Rangamati",
//     khagrachari: "Khagrachari",
//     bandarban: "Bandarban",
//     national: "National",
//     international: "International",
//     "press-release": "Press Release",
//     opinion: "Opinion",
//   };
//   return categoryMap[category as keyof typeof categoryMap] || category;
// }

// let description: string;

// // Generate dynamic metadata (runs on server)
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   try {
//     const { newsId } = await params;
//     const newsItem = await getNewsItem(newsId);

//     if (!newsItem) {
//       return {
//         title: "News Not Found | chtvanguard",
//         description: "The requested news article could not be found.",
//         robots: { index: false, follow: false },
//       };
//     }

//     // Extract description from content blocks
//     const contentDescription = extractTextFromContent(newsItem.content || []);

//     const baseDescription =
//       contentDescription ||
//       `Read about ${newsItem.title} in ${getCategoryDisplayName(
//         newsItem.category
//       )}`;

//     // Ensure description is at least 50 characters for better social sharing
//     const finalDescription =
//       baseDescription.length < 50
//         ? `${baseDescription} - Read more about this ${getCategoryDisplayName(
//             newsItem.category
//           ).toLowerCase()} news story.`
//         : baseDescription;

//     description = finalDescription;

//     // Get featured image URL - make sure it's absolute
//     const featuredImageUrl = newsItem.featuredImage?.asset?.url;
//     const featuredImageAlt = newsItem.featuredImage?.alt || newsItem.title;

//     // Ensure absolute URL for images
//     const absoluteImageUrl = featuredImageUrl
//       ? featuredImageUrl.startsWith("http")
//         ? featuredImageUrl
//         : `https:${featuredImageUrl}`
//       : null;

//     // Get absolute URL for canonical and og:url
//     const baseUrl =
//       process.env.NEXT_PUBLIC_SITE_URL || "https://chtvanguard.com";
//     const absoluteUrl = `${baseUrl}/news/${newsId}`;

//     return {
//       title: `${newsItem.title} | chtvanguard`,
//       description: finalDescription,
//       keywords: [
//         newsItem.category,
//         getCategoryDisplayName(newsItem.category),
//         "news",
//         "article",
//         "chtvanguard",
//       ],

//       // Open Graph tags for social media
//       openGraph: {
//         title: newsItem.title,
//         description: finalDescription,
//         type: "article",
//         publishedTime: newsItem.publishedAt,
//         authors: [newsItem.author || "chtvanguard"],
//         section: getCategoryDisplayName(newsItem.category),
//         tags: [newsItem.category, getCategoryDisplayName(newsItem.category)],
//         images: absoluteImageUrl
//           ? [
//               {
//                 url: absoluteImageUrl,
//                 width: 1200,
//                 height: 630,
//                 alt: featuredImageAlt,
//               },
//             ]
//           : [],
//         url: absoluteUrl,
//         siteName: "chtvanguard",
//         locale: "en_US",
//       },

//       // Twitter Card
//       twitter: {
//         card: "summary_large_image",
//         title: newsItem.title,
//         description: finalDescription,
//         images: absoluteImageUrl ? [absoluteImageUrl] : [],
//         creator: newsItem.author ? `@${newsItem.author}` : "@chtvanguard",
//         site: "@chtvanguard",
//       },

//       // Additional SEO
//       category: getCategoryDisplayName(newsItem.category),

//       // Structured Data (JSON-LD) - moved to other section
//       other: {
//         "article:published_time": newsItem.publishedAt,
//         "article:author": newsItem.author || "chtvanguard",
//         "article:section": getCategoryDisplayName(newsItem.category),
//         "article:tag": newsItem.category,
//         // Add explicit meta tags for better social media support
//         "og:title": newsItem.title,
//         "og:description": finalDescription,
//         "og:image": absoluteImageUrl || "",
//         "og:url": absoluteUrl,
//         "og:type": "article",
//         "twitter:card": "summary_large_image",
//         "twitter:title": newsItem.title,
//         "twitter:description": finalDescription,
//         "twitter:image": absoluteImageUrl || "",
//       },

//       // Canonical URL
//       alternates: {
//         canonical: absoluteUrl,
//       },

//       // Additional meta tags for better social sharing
//       metadataBase: new URL(baseUrl),
//     };
//   } catch (error) {
//     console.error("Error generating metadata:", error);
//     return {
//       title: "News Article | chtvanguard",
//       description: "Read the latest news article on chtvanguard.",
//     };
//   }
// }

// // Server component wrapper - now properly handles the data fetching
// export default async function NewsDetailsPage({ params }: Props) {
//   // Pre-fetch the news item on the server for better performance
//   const { newsId } = await params;
//   const newsItem = await getNewsItem(newsId).catch(() => null);

//   return (
//     <>
//       {/* Add JSON-LD structured data for better SEO */}
//       {newsItem && (
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "NewsArticle",
//               headline: newsItem.title,
//               description: description,
//               image: newsItem.featuredImage?.asset?.url
//                 ? [newsItem.featuredImage.asset.url]
//                 : [],
//               datePublished: newsItem.publishedAt,
//               author: {
//                 "@type": "Person",
//                 name: newsItem.author || "chtvanguard",
//               },
//               publisher: {
//                 "@type": "Organization",
//                 name: "chtvanguard",
//                 logo: {
//                   "@type": "ImageObject",
//                   url: `${
//                     process.env.NEXT_PUBLIC_SITE_URL ||
//                     "https://chtvanguard.com"
//                   }/logo.png`,
//                 },
//               },
//               mainEntityOfPage: {
//                 "@type": "WebPage",
//                 "@id": `${
//                   process.env.NEXT_PUBLIC_SITE_URL || "https://chtvanguard.com"
//                 }/news/${newsId}`,
//               },
//               articleSection: getCategoryDisplayName(newsItem.category),
//               wordCount: extractTextFromContent(newsItem.content || []).split(
//                 " "
//               ).length,
//             }),
//           }}
//         />
//       )}
//       <NewsDetailsContentpage newsId={newsId} />
//     </>
//   );
// }

import { Metadata } from "next";
import { getNewsItem } from "@/sanity/sanityQueries";
import NewsDetailsContentpage from "@/components/shared/NewsDetailsContentpage";
import { ContentBlock, TextBlock } from "@/sanity/sanityTypes";

interface Props {
  params: Promise<{ newsId: string }>;
}

// Helper function to extract text from content blocks
function extractTextFromContent(content: ContentBlock[]): string {
  if (!content || !Array.isArray(content)) {
    console.log("No content or content is not an array");
    return "";
  }

  const textBlocks = content.filter(
    (block): block is TextBlock => block._type === "textBlock"
  );

  if (textBlocks.length === 0) {
    console.log("No text blocks found");
    return "";
  }

  const extractedText = textBlocks
    .map((block) => {
      return block.text || "";
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

    console.log("Fetching news item for ID:", newsId); // Debug log
    const newsItem = await getNewsItem(newsId);

    console.log("News item fetched:", newsItem); // Debug log

    if (!newsItem) {
      console.log("No news item found for ID:", newsId);
      return {
        title: "News Not Found",
        description: "The requested news article could not be found.",
        robots: { index: false, follow: false },
      };
    }

    // Debug the newsItem structure
    console.log("News item title:", newsItem.title);
    console.log("News item featuredImage:", newsItem.featuredImage);
    console.log("News item content:", newsItem.content);

    // Extract description from content blocks
    const contentDescription = extractTextFromContent(newsItem.content || []);
    console.log("Content description extracted:", contentDescription);

    const description =
      contentDescription ||
      `Read about ${newsItem.title} in ${getCategoryDisplayName(
        newsItem.category
      )}`;

    // Ensure description is at least 50 characters for better social sharing
    const finalDescription =
      description.length < 50
        ? `${description} - Read more about this ${getCategoryDisplayName(
            newsItem.category
          ).toLowerCase()} news story.`
        : description;

    console.log("Final description:", finalDescription);

    // Get featured image URL - handle both possible structures
    const featuredImageUrl = newsItem.featuredImage?.asset?.url;
    const featuredImageAlt =
      newsItem.featuredImage?.alt ||
      newsItem.featuredImage?.title ||
      newsItem.title;

    console.log("Featured image URL:", featuredImageUrl);
    console.log("Featured image alt:", featuredImageAlt);

    // Ensure absolute URL for images
    let absoluteImageUrl: string;
    if (featuredImageUrl) {
      absoluteImageUrl = featuredImageUrl.startsWith("http")
        ? featuredImageUrl
        : `https:${featuredImageUrl}`;
    } else {
      // Fallback to a default image
      absoluteImageUrl = `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://chtvanguard.com"
      }/default-og-image.jpg`;
    }

    console.log("Absolute image URL:", absoluteImageUrl);

    // Get absolute URL for canonical and og:url
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://chtvanguard.com";
    const absoluteUrl = `${baseUrl}/news/${newsId}`;

    console.log("Base URL:", baseUrl);
    console.log("Absolute URL:", absoluteUrl);

    const metadata: Metadata = {
      title: `${newsItem.title} | CHT Vanguard`,
      description: finalDescription,

      // Basic meta tags
      keywords: [
        newsItem.category,
        getCategoryDisplayName(newsItem.category),
        "news",
        "article",
        "CHT Vanguard",
      ],

      // Open Graph tags for social media
      openGraph: {
        title: newsItem.title,
        description: finalDescription,
        type: "article",
        publishedTime: newsItem.publishedAt,
        authors: [newsItem.author],
        section: getCategoryDisplayName(newsItem.category),
        tags: [newsItem.category, getCategoryDisplayName(newsItem.category)],
        images: [
          {
            url: absoluteImageUrl,
            width: 1200,
            height: 630,
            alt: featuredImageAlt,
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
        images: [absoluteImageUrl],
        creator: `@${newsItem.author}`,
        site: "@chtvanguard",
      },

      // Canonical URL
      alternates: {
        canonical: absoluteUrl,
      },

      // Set the metadata base
      metadataBase: new URL(baseUrl),

      // Additional meta for better SEO
      category: getCategoryDisplayName(newsItem.category),
    };

    console.log("Generated metadata:", metadata);
    return metadata;
  } catch (error) {
    console.error("Error generating metadata:", error);
    console.error("Error details:", error);
    return {
      title: "News Article | CHT Vanguard",
      description: "Read the latest news article on CHT Vanguard.",
    };
  }
}

// Server component wrapper
export default async function NewsDetailsPage({ params }: Props) {
  const { newsId } = await params;
  const newsItem = await getNewsItem(newsId).catch((error) => {
    console.error("Error fetching news item:", error);
    return null;
  });

  // Generate description for JSON-LD
  const contentDescription = newsItem?.content
    ? extractTextFromContent(newsItem.content)
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
                : [],
              datePublished: newsItem.publishedAt,
              author: {
                "@type": "Person",
                name: newsItem.author,
              },
              publisher: {
                "@type": "Organization",
                name: "CHT Vanguard",
                logo: {
                  "@type": "ImageObject",
                  url: `${
                    process.env.NEXT_PUBLIC_SITE_URL ||
                    "https://chtvanguard.com"
                  }/logo.png`,
                },
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `${
                  process.env.NEXT_PUBLIC_SITE_URL || "https://chtvanguard.com"
                }/news/${newsId}`,
              },
            }),
          }}
        />
      )}

      {/* Debug component - only shows in development */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            background: "black",
            color: "white",
            padding: "10px",
            fontSize: "12px",
            maxWidth: "300px",
            zIndex: 9999,
            overflow: "auto",
            maxHeight: "50vh",
          }}
        >
          <h3>Metadata Debug Info</h3>
          <div>
            <strong>News ID:</strong> {newsId}
          </div>
          <div>
            <strong>News Item Found:</strong> {newsItem ? "Yes" : "No"}
          </div>

          {newsItem && (
            <>
              <div>
                <strong>Title:</strong> {newsItem.title || "Missing"}
              </div>
              <div>
                <strong>Author:</strong> {newsItem.author || "Missing"}
              </div>
              <div>
                <strong>Category:</strong> {newsItem.category || "Missing"}
              </div>
              <div>
                <strong>Published:</strong> {newsItem.publishedAt || "Missing"}
              </div>
              <div>
                <strong>Featured Image URL:</strong>
                <br />
                {newsItem.featuredImage?.asset?.url || "Missing"}
              </div>
              <div>
                <strong>Featured Image Alt:</strong>
                <br />
                {newsItem.featuredImage?.alt || "Missing"}
              </div>
              <div>
                <strong>Content Blocks:</strong> {newsItem.content?.length || 0}
              </div>
            </>
          )}
        </div>
      )}

      <NewsDetailsContentpage newsId={newsId} />
    </>
  );
}
