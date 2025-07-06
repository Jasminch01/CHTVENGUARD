
// Updated interfaces with url included in asset
export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
    url: string; // Now includes url
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface TextBlock {
  _type: "textBlock";
  _key: string;
  text: string;
}

export interface ImageBlock {
  _type: "imageBlock";
  _key: string;
  image: SanityImage;
  alt: string;
  caption?: string;
}

export type ContentBlock = TextBlock | ImageBlock;

export interface NewsItems {
  _id: string;
  _type: "newsItem";
  title: string;
  author: string;
  publishedAt: string;
  featuredImage: SanityImage & {
    alt: string;
  };
  content: ContentBlock[];
  category:
    | "rangamati"
    | "khagrachari"
    | "bandarban"
    | "national"
    | "international"
    | "press-release"
    | "opinion";
  tags?: string[];
}

export interface NewsCardsProps {
  news: NewsItems[];
}