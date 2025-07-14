import { client } from "../../sanity.config";
import { NewsItems } from "./sanityTypes";

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
  limit: number = 10
): Promise<NewsItems[]> {
  const start = page * limit;

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

  // Remove duplicates based on _id and limit to 9 items
  const seenIds = new Set<string>();
  const uniqueNews: NewsItems[] = [];

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

  return uniqueNews;
}

export async function getFeaturedNewsItems(): Promise<NewsItems[]> {
  const query = `
    *[_type == "newsItem" && featured == true] {
      _id,
      title,
      author,
      publishedAt,
      featured,
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
    } | order(publishedAt desc)[0...4]
  `;

  const featuredNews = await client.fetch(query);
  return featuredNews;
}
