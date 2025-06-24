"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, Sun, Moon, Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Appbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(
    null
  );
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null
  );
  const [openMobileSubDropdown, setOpenMobileSubDropdown] = useState<
    string | null
  >(null);
  const [hoveredDesktopItem, setHoveredDesktopItem] = useState<string | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDesktopDropdown(null);
        setHoveredDesktopItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const toggleDesktopDropdown = (menu: string) => {
    setOpenDesktopDropdown(openDesktopDropdown === menu ? null : menu);
  };

  const toggleMobileDropdown = (menu: string) => {
    setOpenMobileDropdown(openMobileDropdown === menu ? null : menu);
  };

  const toggleMobileSubDropdown = (menu: string) => {
    setOpenMobileSubDropdown(openMobileSubDropdown === menu ? null : menu);
  };

  const handleNavigation = (route: string) => {
    router.push(route);
    setOpenDesktopDropdown(null);
    setHoveredDesktopItem(null);
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { menu: "প্রচ্ছদ", route: "/" },
    {
      menu: "সংবাদ",
      route: "/news",
      dropdown: [
        {
          menu: "পার্বত্য চট্টগ্রাম",
          route: "/cht",
          subItems: [
            { menu: "রাঙ্গামাটি", route: "/news/cht/rangamati" },
            { menu: "খাগড়াছড়ি", route: "/news/cht/khagrachari" },
            { menu: "বান্দরবান", route: "/news/cht/bandarban" },
          ],
        },
        {
          menu: "আন্তর্জাতিক",
          route: "/news/international",
        },
        {
          menu: "দেশ",
          route: "/news/national",
        },
      ],
    },
    { menu: "সংবাদ বিজ্ঞপ্তি", route: "/press-release" },
    { menu: "মতামত", route: "/opinion" },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Link className="flex items-center" href={"/"}>
              <Image
                src="/brand.png"
                width={300}
                height={300}
                alt="CHTVENGUARD Logo"
                className="w-[190px] md:w-[215px] lg:w-[230px] xl:w-[240px] cursor-pointer"
              />
            </Link>
          </div>

          {/* Search Bar (when open) */}
          {isSearchOpen && (
            <div className="flex-1 mx-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="অনুসন্ধান করুন..."
                  className="pr-10"
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}

          {/* Desktop Menu Items (when search is closed) */}
          {!isSearchOpen && (
            <div className="hidden md:flex flex-1 ml-10 h-full">
              <div className="flex h-full">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative h-full"
                    ref={index === 0 ? dropdownRef : null}
                  >
                    {item.dropdown ? (
                      <div className="h-full">
                        <button
                          onClick={() => toggleDesktopDropdown(item.menu)}
                          className="inline-flex items-center justify-center h-full px-4 text-lg font-medium focus:outline-none hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                        >
                          {item.menu}
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              openDesktopDropdown === item.menu
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>

                        {/* Main dropdown container */}
                        {openDesktopDropdown === item.menu && (
                          <div
                            className="absolute left-0 top-full w-56 bg-white dark:bg-gray-800 shadow-lg z-10 rounded-md"
                            ref={dropdownRef}
                          >
                            {item.dropdown.map((dropdownItem, idx) => (
                              <div
                                key={idx}
                                className="relative"
                                onMouseEnter={() =>
                                  setHoveredDesktopItem(`${item.menu}-${idx}`)
                                }
                                onMouseLeave={() => setHoveredDesktopItem(null)}
                              >
                                {/* Parent item */}
                                <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                                  <div className="flex justify-between items-center">
                                    <Link href={dropdownItem.route}>
                                      <button
                                        onClick={() =>
                                          !dropdownItem.subItems &&
                                          handleNavigation(dropdownItem.route)
                                        }
                                        className="text-lg font-medium text-gray-900 dark:text-gray-100 w-full text-left cursor-pointer"
                                      >
                                        {dropdownItem.menu}
                                      </button>
                                    </Link>
                                    {dropdownItem.subItems && (
                                      <ChevronDown className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    )}
                                  </div>

                                  {/* Child items (submenus) appear on hover of parent */}
                                  {dropdownItem.subItems &&
                                    hoveredDesktopItem ===
                                      `${item.menu}-${idx}` && (
                                      <div className="bg-gray-50 dark:bg-gray-700 mt-2 rounded">
                                        {dropdownItem.subItems.map(
                                          (subItem, subIdx) => (
                                            <Link
                                              key={subIdx}
                                              href={subItem.route}
                                            >
                                              <button
                                                className="block w-full text-left px-4 py-2 text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white border-b border-gray-200 dark:border-gray-600 last:border-b-0 first:rounded-t last:rounded-b cursor-pointer"
                                                onClick={() =>
                                                  handleNavigation(
                                                    subItem.route
                                                  )
                                                }
                                              >
                                                {subItem.menu}
                                              </button>
                                            </Link>
                                          )
                                        )}
                                      </div>
                                    )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.route}
                        className="inline-flex items-center justify-center h-full px-4 text-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                      >
                        {item.menu}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2">
            {/* Search Toggle Button */}
            <button onClick={toggleSearch} className={`hidden lg:block`}>
              {isSearchOpen ? (
                <X className="size-6" />
              ) : (
                <Search className="size-6" />
              )}
            </button>

            {/* Dark/Light Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="transition-all duration-200"
            >
              {theme === "dark" ? (
                <Sun className="size-6 text-yellow-500" />
              ) : (
                <Moon className="size-6" />
              )}
              <span className="sr-only">
                {theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"}
              </span>
            </Button>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="size-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-12">
                    {/* Mobile Search */}
                    <form
                      onSubmit={handleSearchSubmit}
                      className="relative px-3"
                    >
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="অনুসন্ধান করুন..."
                        className="pr-10"
                      />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      >
                        <Search className="size-5" />
                      </Button>
                    </form>

                    {/* Mobile Menu Items */}
                    <nav className="flex flex-col space-y-2">
                      {menuItems.map((item, index) => (
                        <div key={index}>
                          {item.dropdown ? (
                            <div>
                              {/* Main dropdown button */}
                              <Button
                                variant="ghost"
                                className="justify-between w-full h-auto py-3 text-base font-medium"
                                onClick={() => toggleMobileDropdown(item.menu)}
                              >
                                <span>{item.menu}</span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${
                                    openMobileDropdown === item.menu
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                />
                              </Button>

                              {/* Dropdown content */}
                              {openMobileDropdown === item.menu && (
                                <div className="ml-4 mt-2 space-y-1">
                                  {item.dropdown.map((dropdownItem, idx) => (
                                    <Link key={idx} href={dropdownItem.route}>
                                      <div >
                                        {/* Parent dropdown item */}
                                        <div className="flex items-center justify-between">
                                          <Button
                                            variant="ghost"
                                            className="justify-start flex-1 h-auto py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                            onClick={() => {
                                              if (!dropdownItem.subItems) {
                                                handleNavigation(
                                                  dropdownItem.route
                                                );
                                              }
                                            }}
                                          >
                                            {dropdownItem.menu}
                                          </Button>

                                          {/* Show dropdown icon only if item has subitems */}
                                          {dropdownItem.subItems && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-auto py-2 px-2 ml-2"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                toggleMobileSubDropdown(
                                                  `${item.menu}-${idx}`
                                                );
                                              }}
                                            >
                                              <ChevronDown
                                                className={`h-3 w-3 transition-transform ${
                                                  openMobileSubDropdown ===
                                                  `${item.menu}-${idx}`
                                                    ? "rotate-180"
                                                    : ""
                                                }`}
                                              />
                                            </Button>
                                          )}
                                        </div>

                                        {/* Subitems */}
                                        {dropdownItem.subItems &&
                                          openMobileSubDropdown ===
                                            `${item.menu}-${idx}` && (
                                            <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                              {dropdownItem.subItems.map(
                                                (subItem, subIdx) => (
                                                  <Button
                                                    key={subIdx}
                                                    variant="ghost"
                                                    className="justify-start w-full h-auto py-2 text-sm text-gray-600 dark:text-gray-400 pl-4 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    onClick={() =>
                                                      handleNavigation(
                                                        subItem.route
                                                      )
                                                    }
                                                  >
                                                    • {subItem.menu}
                                                  </Button>
                                                )
                                              )}
                                            </div>
                                          )}
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            /* Regular menu item */
                            <Button
                              variant="ghost"
                              className="justify-start w-full h-auto py-3 text-base font-medium"
                              onClick={() => handleNavigation(item.route)}
                            >
                              {item.menu}
                            </Button>
                          )}
                        </div>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Appbar;
