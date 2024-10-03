"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import MaxWidthWrapper from "./max-width-wrapper";

import UserAvatar from "../user-avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import ToggleTheme from "./toggle-theme";
import { useUser } from "@/hook/useUser";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState<string>("");

  const { user } = useUser();

  const handleNavLinkClick = (link: NavLinkProps) => {
    setCurrentHash(link.href.split("#")[1]);
    setMobileMenuOpen(false);

    if (link.submenu) {
      setExpandedMenu(expandedMenu === link.title ? null : (link.title as any));
    } else {
      setIsOpen(false);
      setExpandedMenu(null);
    }
  };

  const pathname = usePathname();
  const router = useRouter();

  const session = useSession();

  //   const { setUser } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  useEffect(() => {
    setIsOpen(false);
    setExpandedMenu(null);
  }, [pathname]);

  const handleMenuClick = (link: NavLinkProps) => {
    if (link.submenu) {
      setExpandedMenu(expandedMenu === link.title ? null : (link.title as any));
    } else {
      setIsOpen(false);
      setExpandedMenu(null);
    }
  };

  //   const queryInput: any = useMemo(
  //     () => ({
  //       name: session?.data?.user?.name as string,
  //       email: session?.data?.user?.email as string,
  //       avatar: session?.data?.user?.image as string,
  //     }),
  //     [
  //       session?.data?.user?.email,
  //       session?.data?.user?.image,
  //       session?.data?.user?.name,
  //     ]
  //   );

  //   const { mutate: getUser, isLoading: isUserLoading } =
  //     trpc.getUser.useMutation();

  //   useEffect(() => {
  //     if (session?.data?.user) {
  //       getUser(queryInput);
  //     }
  //   }, [session.data?.user]);

  //   useEffect(() => {
  //     if (userData) {
  //       setUser(userData);
  //     }
  //   }, [userData, setUser]);

  // useEffect(() => {
  //   if (session?.status === "authenticated" && !userData) {
  //     setUser({
  //       name: "",
  //       email: "",
  //       avatar: "",
  //       createdAt: "",
  //       updatedAt: "",
  //       id: 0,
  //     });
  //   }
  // }, [session?.status, userData, setUser]);

  //   const session = {
  //     data: false,
  //   };

  const handleLogin = async () => {
    router.push("/login");
    // signIn("google", {
    //   callbackUrl: "/u",
    //   redirect: true,
    // });
  };

  return (
    <header className="fixed inset-x-0 top-1 z-50 mx-auto flex max-w-8xl items-center">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {session.data === null ? (
          <MaxWidthWrapper
            className="w-full px-1"
            padding="small"
            maxw="max-w-8xl"
          >
            <div className="relative mx-1 mt-4 flex items-center justify-between rounded-xl bg-background/[0.982] px-2 py-1 drop-shadow-md sm:mx-0 md:py-0  ">
              <Link
                href={"/"}
                aria-label="home"
                className="mr-4 flex items-center justify-center"
              >
                <div className="ml-2 md:ml-4">
                  <AppLogo />
                </div>
              </Link>

              {pathname.includes("/") && (
                <nav
                  role="navigation"
                  className="w-nav-menu static ml-4 hidden lg:flex"
                >
                  <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList>
                      {NAV_LINKS.map((link) => {
                        return (
                          <NavigationMenuItem key={link.href}>
                            <Link
                              href={link.href}
                              passHref
                              scroll={true}
                              onClick={() => handleNavLinkClick(link)}
                              className={cn(
                                navigationMenuTriggerStyle(),
                                "text-base",
                              )}
                            >
                              <span className="tracking-normal">
                                {link.title}
                              </span>
                              {link.submenu && (
                                <BiChevronDown className="ml-1" />
                              )}
                            </Link>
                            {link.submenu && expandedMenu === link.title && (
                              <div className="invisible absolute right-24 mt-2 w-48 rounded-lg p-2 opacity-0 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out group-hover:visible group-hover:opacity-100">
                                <div
                                  className="py-1"
                                  role="menu"
                                  aria-orientation="vertical"
                                  aria-labelledby="options-menu"
                                >
                                  {link.submenu.map((subItem) => (
                                    <Link
                                      key={subItem.path}
                                      href={subItem.path}
                                      className="block rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-zinc-200 hover:text-zinc-800"
                                      role="menuitem"
                                    >
                                      {subItem.title}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </NavigationMenuItem>
                        );
                      })}
                    </NavigationMenuList>
                  </NavigationMenu>
                </nav>
              )}

              <nav className="mb-2 flex items-center justify-center gap-x-6 px-1 pt-2">
                <ToggleTheme className="p-3" />
                {/* <Cart /> */}
                {/* <Button
                  className="group hidden w-full items-center justify-center gap-1.5 rounded-lg border border-green-900 bg-gradient-to-br from-green-900 to-blue-900 px-6 py-5 dark:border-green-900 dark:from-green-950 dark:to-blue-950 lg:flex"
                  onClick={handleLogin}
                >
                  <span className="text-zinc-200 dark:text-zinc-300">
                    Sign in
                  </span>
                  <HiMiniArrowLongRight className="h-5 w-5 text-zinc-200 transition-all group-hover:translate-x-1 dark:text-zinc-300" />
                </Button> */}

                <Button
                  variant="default"
                  className="group hidden w-full items-center justify-center gap-1.5 rounded-lg px-6 lg:flex"
                  onClick={handleLogin}
                  asChild
                >
                  <Link href="/login">Sign in</Link>
                </Button>

                <SheetTrigger asChild className="lg:hidden">
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    className="relative float-right flex cursor-pointer select-none p-2 text-2xl [-ms-user-select:none] [-webkit-tap-highlight-color:rgba(0,0,0,0)] [-webkit-user-select:none] [tap-highlight-color:rgba(0,0,0,0)] lg:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="menu"
                  >
                    <Menu className="h-6 w-6" />
                    </Button> */}

                  <Button
                    variant="ghost"
                    className="group  w-full items-center justify-center gap-1.5 rounded-lg px-6  relative float-right flex cursor-pointer select-none p-2 text-2xl [-ms-user-select:none] [-webkit-tap-highlight-color:rgba(0,0,0,0)] [-webkit-user-select:none] [tap-highlight-color:rgba(0,0,0,0)] lg:hidden "
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="menu"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
              </nav>
            </div>
          </MaxWidthWrapper>
        ) : (
          <MaxWidthWrapper className="px-2">
            <div className="relative mx-1 mt-4 flex items-center justify-between rounded-xl py-2 pl-4 px-2 shadow-sm backdrop-blur-xl sm:mx-0 md:py-1.5">
              <Link href={"/"} aria-label="home" className="mr-4">
                <div className="md:ml-4">
                  <AppLogo />
                </div>
              </Link>

              <nav
                role="navigation"
                className="w-nav-menu static ml-4 hidden lg:flex"
              >
                <NavigationMenu className="hidden lg:flex">
                  <NavigationMenuList>
                    {NAV_LINKS.map((link) => {
                      return (
                        <NavigationMenuItem key={link.href}>
                          <Link
                            href={link.href}
                            passHref
                            scroll={true}
                            onClick={() => handleNavLinkClick(link)}
                            className={cn(
                              navigationMenuTriggerStyle(),
                              "text-base",
                            )}
                          >
                            {link.title}
                            {link.submenu && <BiChevronDown className="ml-1" />}
                          </Link>
                          {link.submenu && expandedMenu === link.title && (
                            <div className="invisible absolute right-24 mt-2 w-48 rounded-lg bg-zinc-300 p-2 opacity-0 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out group-hover:visible group-hover:opacity-100">
                              <div
                                className="py-1"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="options-menu"
                              >
                                {link.submenu.map((subItem) => (
                                  <Link
                                    key={subItem.path}
                                    href={subItem.path}
                                    className="block rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-zinc-200 hover:text-zinc-800"
                                    role="menuitem"
                                  >
                                    {subItem.title}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </NavigationMenuItem>
                      );
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
              </nav>

              <nav className="flex items-center justify-end gap-x-3 md:gap-x-6">
                <ToggleTheme />
                {/* <Cart /> */}
                <UserAvatar />

                <SheetTrigger asChild className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative float-right flex cursor-pointer select-none p-2 text-2xl [-ms-user-select:none] [-webkit-tap-highlight-color:rgba(0,0,0,0)] [-webkit-user-select:none] [tap-highlight-color:rgba(0,0,0,0)] lg:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="menu"
                  >
                    {mobileMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </Button>
                </SheetTrigger>
              </nav>
            </div>
          </MaxWidthWrapper>
        )}

        <SheetContent side="left" className="h-full w-full p-3 pt-8">
          <SheetHeader>
            <SheetTitle>
              {" "}
              <Link href={"/"} onClick={() => setIsOpen(false)}>
                <AppLogo />
              </Link>
            </SheetTitle>
          </SheetHeader>

          <div
            className="fixed inset-0 top-16 z-50 mt-2 flex w-full flex-col items-center justify-start bg-opacity-95 md:top-20 lg:hidden lg:backdrop-blur-xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex w-full flex-col gap-8 px-3 py-5">
              <NavigationMenu className="grid w-full place-items-start">
                <NavigationMenuList className="mt-6 grid flex-1 gap-y-4 pt-4">
                  {NAV_LINKS.map((link) => (
                    <NavigationMenuItem
                      key={link.href}
                      className="flex w-full flex-col items-start"
                      onClick={() => handleMenuClick(link)}
                    >
                      <Link
                        href={link.href}
                        className="underline-indigo-600 w-full underline-offset-[5px] hover:underline"
                        passHref
                      >
                        <span className="ml-3 flex items-center text-base font-normal">
                          {link.title}
                          {link.submenu ? (
                            <BiChevronDown
                              className={`h-4 w-4 transition-transform ${
                                expandedMenu === link.title ? "rotate-180" : ""
                              } ml-2`}
                            />
                          ) : null}
                        </span>
                      </Link>
                      {link.submenu && expandedMenu === link.title && (
                        <div className="ml-6 mt-2 w-full space-y-2">
                          {link.submenu.map((subItem) => (
                            <Link
                              key={subItem.path}
                              href={subItem.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block w-full rounded-md p-2 text-sm text-gray-600 hover:bg-zinc-200 hover:text-[#ff6400]"
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

              {session.status === "authenticated" ? (
                <>
                  <Button
                    className="group flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border  sm:h-8 sm:w-36"
                    onClick={() => router.push(`/u/${user?.id.toString()}`)}
                  >
                    <span className="text-zinc-300 dark:text-zinc-900">
                      Profile
                    </span>
                    <User className="mr-2 h-4 w-4" />
                  </Button>

                  <Button
                    className="group flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border  sm:h-8 sm:w-36"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <span className="text-zinc-300 dark:text-zinc-900">
                      Log out
                    </span>
                    <HiMiniArrowLongRight className="h-5 w-5 text-zinc-200 transition-all group-hover:translate-x-1 dark:text-zinc-300" />
                  </Button>
                </>
              ) : (
                <Button
                  className="group flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border  sm:h-8 sm:w-36"
                  onClick={handleLogin}
                >
                  <span className="text-zinc-300 dark:text-zinc-900">
                    Sign in
                  </span>
                  <HiMiniArrowLongRight className="h-5 w-5 text-zinc-200 transition-all group-hover:translate-x-1 dark:text-zinc-300" />
                </Button>
              )}
            </div>
          </div>
          {/* )} */}
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
