import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Appbar from "@/components/shared/Appbar";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/shared/Footer";

const solaimanLipi = localFont({
  src: [
    {
      path: "/asset/font/SolaimanLipi_22-02-2012.ttf",
      weight: "400",
    },
    {
      path: "/asset/font/SolaimanLipi_Bold_10-03-12.ttf",
      weight: "700",
    },
  ],
});

export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: "CHTVENGUARD - Latest News from Chittagong Hill Tracts",
    template: "%s | CHTVENGUARD",
  },
  description:
    "Stay updated with the latest news from Chittagong Hill Tracts (CHT) including Rangamati, Khagrachari, and Bandarban. Your trusted source for local, national, and international news.",

  // Keywords for SEO
  keywords: [
    "CHT news",
    "Chittagong Hill Tracts",
    "Rangamati news",
    "Khagrachari news",
    "Bandarban news",
    "Bangladesh news",
    "tribal news",
    "indigenous news",
    "hill tracts news",
    "CHT updates",
    "পার্বত্য চট্টগ্রাম",
    "সংবাদ",
  ],

  // Author and creator information
  authors: [{ name: "CHTVENGUARD" }],
  creator: "CHTVENGUARD",
  publisher: "CHTVENGUARD",

  // Open Graph metadata for social sharing
  openGraph: {
    title: "CHTVENGUARD - Latest News from Chittagong Hill Tracts",
    description:
      "Stay updated with the latest news from Chittagong Hill Tracts (CHT) including Rangamati, Khagrachari, and Bandarban. Your trusted source for local, national, and international news.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://chtvenguard.com",
    siteName: "CHTVENGUARD",
    images: [
      {
        url: "/og-image.jpg", // Make sure to add this image to your public folder
        width: 1200,
        height: 630,
        alt: "CHTVENGUARD - CHT News Portal",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "CHTVENGUARD - Latest News from Chittagong Hill Tracts",
    description:
      "Stay updated with the latest news from Chittagong Hill Tracts (CHT) including Rangamati, Khagrachari, and Bandarban.",
    images: ["/og-image.jpg"], // Same image as Open Graph
    creator: "@chtvenguard", // Replace with your actual Twitter handle
    site: "@chtvenguard", // Replace with your actual Twitter handle
  },

  // Robots and indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical URL
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://chtvenguard.com"
  ),

  // Additional meta tags
  category: "News",
  classification: "News Portal",

  // Verification tags (add these if you have them)
  verification: {
    google: "your-google-verification-code", // Replace with actual code
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },

  // App-specific metadata
  applicationName: "CHTVENGUARD",
  referrer: "origin-when-cross-origin",

  // Language alternates (if you have multiple language versions)
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "bn-BD": "/bn",
    },
  },

  // Additional structured data
  other: {
    // Language
    "og:locale": "en_US",
    "og:locale:alternate": "bn_BD",

    // Article publisher info
    "article:publisher":
      process.env.NEXT_PUBLIC_SITE_URL || "https://chtvenguard.com",

    // Theme color for mobile browsers
    "theme-color": "#ffffff",
    "msapplication-TileColor": "#ffffff",

    // Apple-specific
    "apple-mobile-web-app-title": "CHTVENGUARD",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",

    // Microsoft-specific
    "msapplication-tooltip": "CHTVENGUARD - CHT News Portal",
    "msapplication-starturl": "/",

    // Content type
    "content-type": "text/html; charset=utf-8",

    // Security
    referrer: "origin-when-cross-origin",
  },

  // Manifest for PWA (if you have one)
  manifest: "/manifest.json",

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              name: "CHTVENGUARD",
              url:
                process.env.NEXT_PUBLIC_SITE_URL || "https://chtvenguard.com",
              logo: {
                "@type": "ImageObject",
                url: `${
                  process.env.NEXT_PUBLIC_SITE_URL || "https://chtvenguard.com"
                }/logo.png`,
                width: 200,
                height: 60,
              },
              sameAs: [
                "https://facebook.com/chtvenguard", // Replace with actual social links
                "https://twitter.com/chtvenguard",
                "https://instagram.com/chtvenguard",
              ],
              description:
                "Latest news from Chittagong Hill Tracts including Rangamati, Khagrachari, and Bandarban",
              foundingDate: "2024", // Replace with actual founding date
              address: {
                "@type": "PostalAddress",
                addressLocality: "Chittagong",
                addressCountry: "BD",
              },
              areaServed: {
                "@type": "Place",
                name: "Chittagong Hill Tracts, Bangladesh",
              },
            }),
          }}
        />

        {/* Structured Data - Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CHTVENGUARD",
              url:
                process.env.NEXT_PUBLIC_SITE_URL || "https://chtvenguard.com",
              description: "Latest news from Chittagong Hill Tracts",
              publisher: {
                "@type": "Organization",
                name: "CHTVENGUARD",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${
                    process.env.NEXT_PUBLIC_SITE_URL ||
                    "https://chtvenguard.com"
                  }/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>

      <body className={`${solaimanLipi.className} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="chtvenguard-theme"
        >
          <div className="min-h-screen bg-background text-foreground">
            <Appbar />
            <main className="pt-16">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
