import { socialLinksProps } from "@/app/type";
import { client } from "../../sanity.config";
import { NewsItems, VideoContent } from "./sanityTypes";

// Get all news items
export async function getNewsItems(): Promise<NewsItems[]> {
  const query = `
    *[_type == "newsItem"] | order(publishedAt desc) {
      _id,
      title,
      author,
      publishedAt,
      featuredImage {
        asset-> {
          _ref,
          _type,
          url
        },
        alt,
        hotspot
      },
      content[] {
        _type,
        _key,
        _type == "textBlock" => {
          text
        },
        _type == "imageBlock" => {
          image {
            asset-> {
              _ref,
              _type,
              url
            },
            alt,
            hotspot
          },
          alt,
          caption
        },
        _type == "youtubeBlock" => {
          url,
          title,
          caption
        }
      },
      category,
      tags
    }
  `;
  return await client.fetch(query);
}

// Get news items by category
export async function getNewsByCategory(
  category: string,
  page: number = 0,
  limit: number = 10,
  offset?: number
): Promise<NewsItems[]> {
  // Use offset if provided, otherwise calculate from page
  const start = offset !== undefined ? offset : page * limit;

  // Fixed: Now it actually fetches the number of items requested
  const query = `
    *[_type == "newsItem" && category == $category]
     | order(publishedAt desc)[${start}..${start + limit - 1}] {
      _id,
      title,
      author,
      publishedAt,
      featuredImage {
        asset-> {
          _ref,
          _type,
          url
        },
        alt,
        title,
        hotspot
      },
      content[] {
        _type,
        _key,
        _type == "textBlock" => {
          text
        },
        _type == "imageBlock" => {
          image {
            asset-> {
              _ref,
              _type,
              url
            },
            alt,
            hotspot
          },
          alt,
          caption
        },
        _type == "youtubeBlock" => {
          url,
          title,
          caption
        }
      },
      category,
      tags
    }
  `;

  return await client.fetch(query, { category });
}
// Get single news item by ID
export async function getNewsItem(id: string): Promise<NewsItems> {
  const query = `
    *[_type == "newsItem" && _id == $id][0] {
      _id,
      title,
      author,
      publishedAt,
      featuredImage {
        asset-> {
          _ref,
          _type,
          url
        },
        alt,
        title,
        hotspot
      },
      content[] {
        _type,
        _key,
        _type == "textBlock" => {
          text
        },
        _type == "imageBlock" => {
          image {
            asset-> {
              _ref,
              _type,
              url
            },
            alt,
            hotspot
          },
          alt,
          caption
        },
        _type == "youtubeBlock" => {
          url,
          title,
          caption
        },
          _type == "highlightBlock" => {
          text,
          backgroundColor,
          "customColorHex": customColor.hex,
          borderColor,
          "customBorderColorHex": customBorderColor.hex,
          padding
        }
      },
      category,
      tags
    }
  `;
  return await client.fetch(query, { id });
}

// Get recent news items (limit)
export async function getRecentNews(limit: number = 10): Promise<NewsItems[]> {
  const query = `
    *[_type == "newsItem"] | order(publishedAt desc) [0...$limit] {
      _id,
      title,
      author,
      publishedAt,
      featuredImage {
        asset-> {
          _ref,
          _type,
          url
        },
        alt,
        hotspot
      },
      category
    }
  `;
  return await client.fetch(query, { limit: limit - 1 });
}

export async function getRelatedNews(
  currentNewsId: string,
  category: string,
  limit: number = 5
): Promise<NewsItems[]> {
  const query = `
    *[_type == "newsItem" && category == $category && _id != $currentNewsId] | order(publishedAt desc) [0...$limit] {
      _id,
      title,
      author,
      publishedAt,
      featuredImage {
        asset-> {
          _ref,
          _type,
          url
        },
        alt,
        hotspot
      },
      category
    }
  `;

  return await client.fetch(query, {
    category,
    currentNewsId,
    limit: limit - 1,
  });
}

// Search news items
export async function searchNews(searchTerm: string): Promise<NewsItems[]> {
  const query = `
    *[_type == "newsItem" && (
      title match $searchTerm ||
      author match $searchTerm ||
      $searchTerm in tags
    )] | order(publishedAt desc) {
      _id,
      title,
      author,
      publishedAt,
      featuredImage {
        asset-> {
          _ref,
          _type,
          url
        },
        alt,
        hotspot
      },
      category,
      tags
    }
  `;
  return await client.fetch(query, { searchTerm: `*${searchTerm}*` });
}

export async function getNewsItemsAllCategories(): Promise<NewsItems[]> {
  const query = `
    *[_type == "newsItem" && defined(category)] {
      _id,
      title,
      author,
      publishedAt,
      featuredImage {
        asset-> {
          _ref,
          _type,
          url
        },
        alt,
        hotspot
      },
      content[] {
        _type,
        _key,
        _type == "textBlock" => {
          text
        },
        _type == "imageBlock" => {
          image {
            asset-> {
              _ref,
              _type,
              url
            },
            alt,
            hotspot
          },
          alt,
          caption
        },
        _type == "youtubeBlock" => {
          url,
          title,
          caption
        }
      },
      category,
      tags
    } | order(publishedAt desc)
  `;

  const allNews = await client.fetch(query);

  // First pass: Get one latest news item from each category
  const seenCategories = new Set<string>();
  const seenIds = new Set<string>();
  const uniqueNews: NewsItems[] = [];

  // Get the latest news from each category first
  for (const newsItem of allNews) {
    if (!seenCategories.has(newsItem.category) && uniqueNews.length < 9) {
      seenCategories.add(newsItem.category);
      seenIds.add(newsItem._id);
      uniqueNews.push(newsItem);
    }
  }

  // Second pass: If we have less than 9 items, fill remaining slots with more news
  if (uniqueNews.length < 9) {
    for (const newsItem of allNews) {
      if (!seenIds.has(newsItem._id) && uniqueNews.length < 9) {
        seenIds.add(newsItem._id);
        uniqueNews.push(newsItem);
      }

      // Break early if we have 9 items
      if (uniqueNews.length === 9) {
        break;
      }
    }
  }

  return uniqueNews;
}

export async function getFeaturedNewsItems(): Promise<
  (NewsItems | VideoContent)[]
> {
  const query = `
    *[(_type == "newsItem" || _type == "videocontent") && featured == true] | order(publishedAt desc)[0...4] {
      _id,
      _type,
      title,
      author,
      publishedAt,
      featured,
      // News-specific fields (only for newsItem type)
      _type == "newsItem" => {
        category,
        tags,
        featuredImage {
          asset-> {
            _ref,
            _type,
            url
          },
          alt,
          hotspot
        },
        content[] {
          _type,
          _key,
          _type == "textBlock" => {
            text
          },
          _type == "imageBlock" => {
            image {
              asset-> {
                _ref,
                _type,
                url
              },
              alt,
              hotspot
            },
            alt,
            caption
          },
          _type == "youtubeBlock" => {
            url,
            title,
            caption
          }
        }
      },
      // Video-specific fields (only for videocontent type)
      _type == "videocontent" => {
        youtubeBlock {
          url
        },
        description[] {
          _type,
          _key,
          _type == "textBlock" => {
            text
          }
        }
      }
    }
  `;

  const featuredItems = await client.fetch(query);
  return featuredItems;
}

//vido query
export async function getVideoItems(
  page: number = 0,
  limit: number = 10,
  offset?: number
): Promise<VideoContent[]> {
  // Use offset if provided, otherwise calculate from page
  const start = offset !== undefined ? offset : page * limit;

  const query = `
    *[_type == "videocontent"]
     | order(publishedAt desc)[${start}..${start + limit - 1}] {
      _id,
      title,
      author,
      publishedAt,
      featured,
      youtubeBlock {
        url
      },
      description[] {
        _type,
        _key,
        _type == "textBlock" => {
          text
        }
      }
    }
  `;

  return await client.fetch(query);
}

export async function getRelatedVideoItems(
  excludeId: string
): Promise<VideoContent[]> {
  const query = `
    *[_type == "videocontent" && _id != $excludeId] | order(publishedAt desc)[0...5] {
      _id,
      title,
      author,
      publishedAt,
      featured,
      youtubeBlock {
        url
      },
      description[] {
        _type,
        _key,
        _type == "textBlock" => {
          text
        }
      }
    }
  `;
  return await client.fetch(query, { excludeId });
}

export async function getVideoById(id: string): Promise<VideoContent | null> {
  const query = `
    *[_type == "videocontent" && _id == $id][0] {
      _id,
      title,
      author,
      publishedAt,
      featured,
      youtubeBlock {
        url
      },
      description[] {
        _type,
        _key,
        _type == "textBlock" => {
          text
        }
      }
    }
  `;
  return await client.fetch(query, { id });
}

// Query to fetch recent videos (limit)
export async function getRecentVideoItemsExcluding(
  excludeId: string,
  limit: number = 4
): Promise<VideoContent[]> {
  const query = `
    *[_type == "videocontent" && _id != $excludeId] | order(publishedAt desc)[0...$limit] {
      _id,
      title,
      author,
      publishedAt,
      featured,
      youtubeBlock {
        url
      },
      description[] {
        _type,
        _key,
        _type == "textBlock" => {
          text
        }
      }
    }
  `;

  return await client.fetch(query, {
    excludeId,
    limit: limit - 1,
  });
}

export async function getRecentVideoItems(
  limit: number = 4
): Promise<VideoContent[]> {
  // Ensure limit doesn't exceed 6
  const maxLimit = Math.min(limit, 4);

  const query = `
    *[_type == "videocontent"] | order(publishedAt desc)[0...${maxLimit}] {
      _id,
      title,
      author,
      publishedAt,
      featured,
      youtubeBlock {
        url
      },
      description[] {
        _type,
        _key,
        _type == "textBlock" => {
          text
        }
      }
    }
  `;

  return await client.fetch(query);
}

// In your sanity-queries file
export async function socialLinks(): Promise<socialLinksProps[]> {
  const query = `
    *[_type == "socials" && defined(url)] | order(_createdAt desc) {
      _id,
      social,
      url
    }
  `;

  try {
    return await client.fetch<socialLinksProps[]>(query);
  } catch (error) {
    console.error("Error fetching social links:", error);
    return [];
  }
}
