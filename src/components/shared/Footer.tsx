"use client";
import React, { useState, useEffect, JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiTwitterXLine, RiWhatsappFill } from "react-icons/ri";
import { BiLogoGmail } from "react-icons/bi";
import {
  FaFacebookSquare,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTiktok,
  FaTelegramPlane,
} from "react-icons/fa";
import { socialLinks } from "@/sanity/sanityQueries";
import { socialLinksProps } from "@/app/type";

const Footer: React.FC = () => {
  const [socialMedia, setSocialMedia] = useState<socialLinksProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigationLinks = [
    { name: "গোপনীয়তার নীতি", href: "/privacy" },
    { name: "ব্যবহারের শর্তাবলি", href: "/terms-of-use" },
  ];

  // Icon mapping for different social platforms
  const getIconComponent = (social: string): JSX.Element => {
    const platformName = social.toLowerCase();

    if (platformName.includes("facebook")) {
      return (
        <div className = "p-1 rounded border border-gray-400 dark:border-gray-500">
          <FaFacebookSquare
            size={22}
            className="text-gray-600 dark:text-gray-400"
          />
        </div>
      );
    } else if (platformName.includes("instagram")) {
      return (
        <div className = "p-1 rounded border border-gray-400 dark:border-gray-500">
          <FaInstagram size={22} className="text-gray-600 dark:text-gray-400" />
        </div>
      );
    } else if (platformName.includes("twitter") || platformName.includes("x")) {
      return (
        <div className = "p-1 rounded border border-gray-400 dark:border-gray-500">
          <RiTwitterXLine
            size={22}
            className="text-gray-600 dark:text-gray-400"
          />
        </div>
      );
    } else if (platformName.includes("youtube")) {
      return (
        <div className = "p-1 rounded border border-gray-400 dark:border-gray-500">
          <FaYoutube size={22} className="text-gray-600 dark:text-gray-400" />
        </div>
      );
    } else if (platformName.includes("linkedin")) {
      return (
        <div className = "p-1 rounded border border-gray-400 dark:border-gray-500">
          <FaLinkedin size={22} className="text-gray-600 dark:text-gray-400" />
        </div>
      );
    } else if (platformName.includes("tiktok")) {
      return (
        <FaTiktok size={22} className="text-gray-600 dark:text-gray-400" />
      );
    } else if (platformName.includes("gmail")) {
      return (
        <div className = "p-1 rounded border border-gray-400 dark:border-gray-500">
          <BiLogoGmail size={22} className="text-gray-600 dark:text-gray-400" />
        </div>
      );
    } else if (platformName.includes("telegram")) {
      return (
        <div className = "p-1 rounded border border-gray-400 dark:border-gray-500">
          <FaTelegramPlane
            size={22}
            className="text-gray-600 dark:text-gray-400"
          />
        </div>
      );
    } else if (platformName.includes("whatsapp")) {
      return (
        <div className = "p-1 rounded border border-gray-400 dark:border-gray-500">
          <RiWhatsappFill
            size={21}
            className="text-gray-600 dark:text-gray-400"
          />
        </div>
      );
    }

    // Default fallback icon (you can customize this)
    return <div className="w-4 h-4 bg-gray-400 rounded"></div>;
  };

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        setLoading(true);
        const links: socialLinksProps[] = await socialLinks();
        setSocialMedia(links || []);
      } catch (error) {
        console.error("Error fetching social links:", error);
        setSocialMedia([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  return (
    <footer className="py-5 border-t-green-600 border-t-3 xl:mt-15 mt-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        {/* Main Footer Content */}
        <div className="py-10 flex flex-col md:flex-row justify-between items-end">
          {/* Logo and Editor Info */}
          <div className="mb-6 md:mb-0">
            <Link href={"/"}>
              <div className="flex justify-center md:justify-start">
                <Image
                  src={`/brand.png`}
                  width={300}
                  height={30}
                  alt="brand-logo"
                  className="w-[190px] md:w-[215px] lg:w-[230px] xl:w-[240px]"
                />
              </div>
            </Link>
          </div>
          {/* Dynamic Social Media Links */}
          <div className="mt-2 flex space-x-2 items-end md:justify-end justify-center">
            {loading ? (
              // Loading skeleton
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-[22px] h-[22px] bg-gray-300 animate-pulse rounded"
                  ></div>
                ))}
              </div>
            ) : (
              socialMedia
                .slice()
                .reverse()
                .map((social: socialLinksProps) => {
                  const isWhatsApp = social.social
                    ?.toLowerCase()
                    .includes("whatsapp");
                  const isGmail =
                    social.social?.toLowerCase().includes("gmail") ||
                    social.url?.includes("mailto:");

                  // Format WhatsApp URL for calling
                  const getWhatsAppCallUrl = (url: string) => {
                    // Extract phone number from WhatsApp URL
                    const phoneMatch = url.match(/(\d+)/);
                    if (phoneMatch) {
                      return `tel:+${phoneMatch[1]}`;
                    }
                    return url;
                  };

                  // Get the appropriate href
                  const getHref = () => {
                    if (isWhatsApp) {
                      return getWhatsAppCallUrl(social.url);
                    } else if (isGmail) {
                      return social.url.startsWith("mailto:")
                        ? social.url
                        : `mailto:${social.url}`;
                    }
                    return social.url;
                  };

                  return (
                    <Link
                      key={social._id}
                      href={getHref()}
                      target={isWhatsApp || isGmail ? "_self" : "_blank"}
                      rel={isWhatsApp || isGmail ? "" : "noopener noreferrer"}
                      title={social.social}
                      className="hover:scale-110 transition-transform duration-220"
                    >
                      {getIconComponent(social.social)}
                    </Link>
                  );
                })
            )}
          </div>
          {/* Navigation Links */}
          <div className="w-full md:w-auto">
            <nav className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
              {navigationLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="lg:text-lg text-sm dark:hover:text-white text-gray-500 transition-colors duration-220"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="border-t xl:pt-10 flex items-center justify-center">
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} chtvanguard. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
