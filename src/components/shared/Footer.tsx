import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RiTwitterXLine } from "react-icons/ri";
import { FaFacebookSquare, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  const navigationLinks = [
    { name: "গোপনীয়তার নীতি", href: "/privacy" },
    { name: "ব্যবহারের শর্তাবলি", href: "/terms-of-use" },
  ];

  return (
    <footer className="xl:py-10 py-5 border-t-green-600 border-t-3 xl:mt-20 mt-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        {/* Main Footer Content */}
        <div className="py-10 flex flex-col md:flex-row justify-between items-center">
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

          {/* Navigation Links */}
          <div className="w-full md:w-auto">
            <nav className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
              {navigationLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="lg:text-lg text-sm dark:hover:text-white text-gray-500 transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="mt-2 flex space-x-2 items-end md:justify-end justify-center">
              <Link
                href={`https://www.facebook.com/chtvanguard`}
                target="_blank"
              >
                <FaFacebookSquare
                  size={18}
                  className="text-gray-600 dark:text-gray-400"
                />
              </Link>
              <Link
                href={`https://www.instagram.com/chtvanguardonline`}
                target="_blank"
              >
                <FaInstagram
                  size={18}
                  className="text-gray-600 dark:text-gray-400"
                />
              </Link>
              <Link href={`https://x.com/cht_vanguard`} target="_blank">
                <RiTwitterXLine
                  size={18}
                  className="text-gray-600 dark:text-gray-400"
                />
              </Link>
              <Link
                href={`https://www.youtube.com/@chtvanguard`}
                target="_blank"
              >
                <FaYoutube
                  size={18}
                  className="text-gray-600 dark:text-gray-400"
                />
              </Link>
            </div>
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
