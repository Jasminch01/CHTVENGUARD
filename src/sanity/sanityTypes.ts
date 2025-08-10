export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
    url: string;
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

export interface YouTubeBlock {
  _type: "youtubeBlock";
  _key: string;
  url: string;
  title?: string;
  caption?: string;
}

export type ContentBlock = TextBlock | ImageBlock | YouTubeBlock;

export interface NewsItems {
  _id: string;
  _type: "newsItem";
  title: string;
  author: string;
  publishedAt: string;
  featured : boolean;
  featuredImage: SanityImage & {
    alt: string;
    title : string;
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
}

export interface NewsCardsProps {
  news: NewsItems[];
}
