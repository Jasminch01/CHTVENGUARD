import { client } from "../../sanity.config";
import {  NewsItems } from "./sanityTypes";

// Get all news items
export async function getNewsItems(): Promise<NewsItems[]> {
  const query = `
    *[_type == "newsItem"] | order(publishedAt desc) {
      _id,
      title,
      author,
      publishedAt,
      featuredImage {
        asset->,
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
            asset->,
            hotspot
          },
          alt,
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
export async function getNewsByCategory(category: string): Promise<NewsItems[]> {
  const query = `
    *[_type == "newsItem" && category == $category] | order(publishedAt desc) {
      _id,
      title,
      author,
      publishedAt,
      featuredImage {
        asset->,
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
            asset->,
            hotspot
          },
          alt,
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
export async function getNewsItem(id: string): Promise<NewsItems | null> {
  const query = `
    *[_type == "newsItem" && _id == $id][0] {
      _id,
      title,
      author,
      publishedAt,
      featuredImage {
        asset->,
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
            asset->,
            hotspot
          },
          alt,
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
        asset->,
        alt,
        hotspot
      },
      category,
      tags
    }
  `;
  return await client.fetch(query, { limit: limit - 1 });
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
        asset->,
        alt,
        hotspot
      },
      category,
      tags
    }
  `;
  return await client.fetch(query, { searchTerm: `*${searchTerm}*` });
}
