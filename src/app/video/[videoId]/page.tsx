/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import { getVideoById } from "@/sanity/sanityQueries";
import { VideoContent } from "@/sanity/sanityTypes";
import VideoDetailsContentpage from "@/components/shared/VideoDetailsContent";

interface Props {
  params: Promise<{ videoId: string }>;
}

// Helper function to extract text from Sanity rich text blocks
function extractTextFromDescription(
  description: VideoContent["description"]
): string {
  if (!description || !Array.isArray(description)) {
    return "";
  }

  const textBlocks = description.filter(
    (block): block is any => block._type === "textBlock"
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

// Helper function to extract YouTube thumbnail
const getYouTubeThumbnail = (url: string): string => {
  const videoId = url?.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  );
  return videoId
    ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg`
    : "";
};

let description: string;

// Generate dynamic metadata (runs on server)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { videoId } = await params;
    const videoItem = await getVideoById(videoId);

    if (!videoItem) {
      return {
        title: "Video Not Found | chtvanguard",
        description: "The requested video could not be found.",
        robots: { index: false, follow: false },
      };
    }

    // Extract description from content blocks
    const contentDescription = extractTextFromDescription(
      videoItem.description || []
    );

    const baseDescription =
      contentDescription || `Watch ${videoItem.title} by ${videoItem.author}`;

    // Ensure description is at least 50 characters for better social sharing
    const finalDescription =
      baseDescription.length < 50
        ? `${baseDescription} - Watch this video on chtvanguard.`
        : baseDescription;

    description = finalDescription;

    // Get video thumbnail URL
    const thumbnailUrl = getYouTubeThumbnail(videoItem.youtubeBlock?.url || "");

    // Ensure absolute URL for images
    const absoluteImageUrl = thumbnailUrl
      ? thumbnailUrl.startsWith("http")
        ? thumbnailUrl
        : `https:${thumbnailUrl}`
      : null;

    // Get absolute URL for canonical and og:url
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://chtvanguard.com";
    const absoluteUrl = `${baseUrl}/videos/${videoId}`;

    return {
      title: `${videoItem.title} | chtvanguard`,
      description: finalDescription,
      keywords: ["video", "youtube", videoItem.author, "chtvanguard"],

      // Open Graph tags for social media
      openGraph: {
        title: videoItem.title,
        description: finalDescription,
        type: "video.other",
        // publishedTime: videoItem.publishedAt,
        // authors: [videoItem.author || "chtvanguard"],
        images: absoluteImageUrl
          ? [
              {
                url: absoluteImageUrl,
                width: 1280,
                height: 720,
                alt: videoItem.title,
              },
            ]
          : [],
        url: absoluteUrl,
        siteName: "chtvanguard",
        locale: "en_US",
        videos: videoItem.youtubeBlock?.url
          ? [
              {
                url: videoItem.youtubeBlock.url,
                type: "text/html",
                width: 1280,
                height: 720,
              },
            ]
          : [],
      },

      // Twitter Card
      twitter: {
        card: "player",
        title: videoItem.title,
        description: finalDescription,
        images: absoluteImageUrl ? [absoluteImageUrl] : [],
        creator: videoItem.author ? `@${videoItem.author}` : "@chtvanguard",
        site: "@chtvanguard",
        players: videoItem.youtubeBlock?.url
          ? [
              {
                playerUrl: `https://www.youtube.com/embed/${
                  videoItem.youtubeBlock.url.match(
                    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
                  )?.[1]
                }`,
                streamUrl: videoItem.youtubeBlock.url,
                width: 1280,
                height: 720,
              },
            ]
          : [],
      },

      // Additional SEO
      other: {
        "video:published_time": videoItem.publishedAt,
        "video:author": videoItem.author || "chtvanguard",
        // Add explicit meta tags for better social media support
        "og:title": videoItem.title,
        "og:description": finalDescription,
        "og:image": absoluteImageUrl || "",
        "og:url": absoluteUrl,
        "og:type": "video.other",
        "twitter:card": "player",
        "twitter:title": videoItem.title,
        "twitter:description": finalDescription,
        "twitter:image": absoluteImageUrl || "",
        "twitter:player": videoItem.youtubeBlock?.url
          ? `https://www.youtube.com/embed/${
              videoItem.youtubeBlock.url.match(
                /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
              )?.[1]
            }`
          : "",
        "twitter:player:width": "1280",
        "twitter:player:height": "720",
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
      title: "Video | chtvanguard",
      description: "Watch the latest video on chtvanguard.",
    };
  }
}

// Server component wrapper
export default async function VideoDetailsPage({ params }: Props) {
  // Pre-fetch the video item on the server for better performance
  const { videoId } = await params;
  const videoItem = await getVideoById(videoId).catch(() => null);

  return (
    <>
      {/* Add JSON-LD structured data for better SEO */}
      {videoItem && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: videoItem.title,
              description: description,
              thumbnailUrl: getYouTubeThumbnail(
                videoItem.youtubeBlock?.url || ""
              ),
              uploadDate: videoItem.publishedAt,
              contentUrl: videoItem.youtubeBlock?.url,
              embedUrl: videoItem.youtubeBlock?.url
                ? `https://www.youtube.com/embed/${
                    videoItem.youtubeBlock.url.match(
                      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
                    )?.[1]
                  }`
                : "",
              author: {
                "@type": "Person",
                name: videoItem.author || "chtvanguard",
              },
              publisher: {
                "@type": "Organization",
                name: "chtvanguard",
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
                }/videos/${videoId}`,
              },
            }),
          }}
        />
      )}
      <VideoDetailsContentpage videoId={videoId} />
    </>
  );
}
