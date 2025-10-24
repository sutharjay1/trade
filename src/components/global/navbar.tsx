"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { HiMiniArrowLongRight } from "react-icons/hi2";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Menu, User, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { BiChevronDown } from "react-icons/bi";
import { AppLogo } from "./app-logo";

import UserAvatar from "../account-dropdown";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

import ToggleTheme from "./toggle-theme";
import { useUser } from "@/hook/useUser";
import { geistSans } from "@/lib/font";

interface NavLinkProps {
  href: string;
  title: string;
  submenu?: { title: string; path: string }[];
}

const NAV_LINKS: NavLinkProps[] = [
  { title: "Features", href: "/features" },

  { title: "Pricing", href: "/pricing" },
  { title: "Testimonials", href: "/testimonials" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    setIsOpen(false);
    setExpandedMenu(null);
  }, [pathname]);

  const handleMenuClick = (link: NavLinkProps) => {
    if (link.submenu) {
      setExpandedMenu(expandedMenu === link.title ? null : link.title);
    } else {
      setIsOpen(false);
      setExpandedMenu(null);
    }
  };

  const handleLogin = async () => {
    router.push("/login");
  };

  return (
    <header
      className={cn(
        "max-w-7xl mx-auto w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        geistSans.className,
      )}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-0">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          {/* Logo */}
          <Link href={session.data ? "/" : (user ? `/u/${user?.id}` : "/")} aria-label="home">
            <AppLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                {NAV_LINKS.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-sm font-medium transition-colors hover:text-primary"
                      )}
                    >
                      {link.title}
                      {link.submenu && <BiChevronDown className="ml-1 h-4 w-4" />}
                    </Link>
                    {link.submenu && expandedMenu === link.title && (
                      <div className="absolute top-full left-0 mt-2 w-48 rounded-md border bg-popover p-1 shadow-md">
                        {link.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            className="block rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <ToggleTheme />
            
            {session.data ? (
              <UserAvatar />
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={handleLogin}
                className="hidden lg:flex"
              >
                Sign in
              </Button>
            )}

            {/* Mobile menu trigger */}
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
          </div>

          <DrawerContent className="w-full ">
            <DrawerHeader className="pb-4">
              <DrawerTitle>
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <AppLogo />
                </Link>
              </DrawerTitle>
            </DrawerHeader>

            <div className="px-4 pb-4">
              {/* Navigation Links */}
              <nav className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <div key={link.href} className="space-y-1">
                    <Link
                      href={link.href}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                      onClick={() => handleMenuClick(link)}
                    >
                      <span>{link.title}</span>
                      {link.submenu && (
                        <BiChevronDown
                          className={`h-4 w-4 transition-transform ${
                            expandedMenu === link.title ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </Link>
                    {link.submenu && expandedMenu === link.title && (
                      <div className="ml-4 space-y-1">
                        {link.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            onClick={() => setIsOpen(false)}
                            className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                {session.data ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push(`/u/${user?.id.toString()}`);
                        setIsOpen(false);
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsOpen(false);
                      }}
                    >
                      <HiMiniArrowLongRight className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      handleLogin();
                      setIsOpen(false);
                    }}
                  >
                    <HiMiniArrowLongRight className="mr-2 h-4 w-4" />
                    Sign in
                  </Button>
                )}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
};

export default Header;
