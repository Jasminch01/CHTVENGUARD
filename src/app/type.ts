export interface NewsItem {
  date: string | number | Date;
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  image: string;
  category: string;
  tags?: string[];
}

export interface NewsCardsProps {
  news: NewsItem[];
}
