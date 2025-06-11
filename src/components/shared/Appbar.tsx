// components/shared/Appbar.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Search, Sun, Moon, Menu, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useTheme } from "next-themes";
import Link from "next/link";

const Appbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Ensure component is mounted before rendering theme-dependent elements
  useEffect(() => {
    setMounted(true);
  }, []);

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
    // Handle search logic here
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const menuItems = ["প্রচ্ছদ", "সংবাদ", "সংবাদ বিজ্ঞপ্তি", "মতামত"];

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 border-b">
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
            <div className="hidden md:flex flex-1">
              <NavigationMenu className="ml-10">
                <NavigationMenuList className="space-x-1">
                  {menuItems.map((item, index) => (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuLink
                        href="#"
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      >
                        {item}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          )}

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2">
            {/* Search Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className={` hidden lg:block
                ${isSearchOpen ? "bg-primary text-primary-foreground" : ""}
             `}
            >
              {isSearchOpen ? (
                <X className="size-6" />
              ) : (
                <Search className="size-6" />
              )}
            </Button>

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
                    <form onSubmit={handleSearchSubmit} className="relative px-3">
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
                        <Button
                          key={index}
                          variant="ghost"
                          className="justify-start h-auto py-3 text-base font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                          asChild
                        >
                          <a href="#">{item}</a>
                        </Button>
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
