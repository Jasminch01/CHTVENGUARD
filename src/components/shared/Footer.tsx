import React from "react";
import Image from "next/image";

const Footer: React.FC = () => {
  const navigationLinks = [
    { name: "গোপনীয়তার নীতি", href: "#" },
    { name: "ব্যবহারের শর্তাবলি", href: "#" },
  ];

  return (
    <footer className="py-10 border-t-green-600 border-t-3">
      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        {/* Main Footer Content */}
        <div className="py-10 flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Editor Info */}
          <div className="mb-6 md:mb-0">
            <div className="flex justify-center md:justify-start">
              <Image
                src={`/brand.png`}
                width={300}
                height={30}
                alt="brand-logo"
                className="w-[190px] md:w-[215px] lg:w-[230px] xl:w-[240px]"
              />
            </div>
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
          </div>
        </div>
      </div>
      {/* Bottom Border */}
      <div className="border-t pt-10 flex items-center justify-center">
        <div className="text-center text-sm text-gray-500">
          © 2025 chtvanguard. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
