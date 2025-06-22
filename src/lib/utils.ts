import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCategoryNameInBangla = (category: string) => {
  // First remove any dashes from the category string
  const normalizedCategory = category.toLowerCase().replace(/-/g, "");

  const categoryMap: { [key: string]: string } = {
    rangamati: "রাঙামাটি",
    khagrachari: "খাগড়াছড়ি",
    bandarban: "বান্দরবান",
    chittagong: "চট্টগ্রাম",
    international: "আন্তর্জাতিক",
    national: "জাতীয়",
    pressrelease: "সংবাদ বিজ্ঞপ্তি", // Note: removed dash from key
    opinion: "মতামত",
  };

  return categoryMap[normalizedCategory] || category;
};
