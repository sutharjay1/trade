"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { HiMiniArrowLongRight } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { H3, P } from "../ui/typography";
import { geistSans } from "@/lib/font";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Graphine Anion Pads", href: "/product" },
        { name: "Panty Liner", href: "/product" },
        { name: "Refill Pack", href: "/product" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "About", href: "https://tiptap.dev/docs/editor/about" },
        {
          name: "Contact us",
          href: "/contact",
        },
      ],
    },
    {
      title: "Connect",
      links: [
        {
          name: "Instagram",
          href: "https://www.instagram.com/tiptap.dev/",
        },
        {
          name: "Facebook",
          href: "https://www.facebook.com/tiptap.dev/",
        },
        {
          name: "LinkedIn",
          href: "https://www.linkedin.com/company/tiptapdev/",
        },
        { name: "X", href: "https://twitter.com/tiptap_editor" },
      ],
    },
  ];

  const baseLinks = [
    { name: "Privacy policy", href: "/privacy-policy" },
    { name: "Terms", href: "/terms-of-service" },
    { name: "Legal notice", href: "/legal-notice" },
  ];

  return (
    <footer
      className={cn(
        "relative mt-12 overflow-hidden rounded-t-4xl bg-gradient-to-br from-gray-900 to-black font-polySansMedian font-medium text-white selection:bg-teal-500/30 lg:rounded-t-8xl",
      )}
    >
      <div className="absolute inset-0 h-full w-full">
        <Image
          src="https://cdn.prod.website-files.com/645a9acecda2e0594fac6126/6679d424b15ec493e1500f69_gradient-noise-purple-azure-dark.jpg"
          alt="gradient"
          width={3600}
          height={1800}
          className="object-cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 pt-28 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-12 text-center">
          <H3
            className={cn(
              "mx-auto -mb-1 max-w-[60rem] text-balance text-center font-polySansMedian text-[2.7rem] font-medium leading-[2.65rem] tracking-[0.015rem] sm:leading-[2.9rem] md:mb-0 lg:text-7xl",
            )}
          >
            Over 20,000 success stories and counting…
          </H3>
          <P
            className={cn(
              geistSans.className,
              "mb-8 mt-0 text-[2.8rem] font-light sm:text-4xl lg:text-7xl [&:not(:first-child)]:mt-2",
            )}
          >
            begin yours today
          </P>

          <div className="mx-auto flex items-center justify-center">
            <Button
              className="group flex items-center justify-center gap-1.5 rounded-lg border border-green-900 bg-gradient-to-br from-green-950 to-blue-950 py-5 transition-opacity hover:opacity-90 dark:border-green-900 dark:from-green-950 dark:to-blue-950 sm:w-48"
              onClick={() => router.push("/product")}
            >
              <span className="text-zinc-200 dark:text-zinc-300">Buy Now </span>
              <HiMiniArrowLongRight className="h-5 w-5 text-zinc-200 transition-all group-hover:translate-x-1 dark:text-zinc-300" />
            </Button>
          </div>
        </div>

        <div
          className={cn(
            geistSans.className,
            "mb-6 ml-4 grid grid-cols-2 gap-8 font-medium md:grid-cols-3",
          )}
        >
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-lg font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 transition duration-150 ease-in-out hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relative mx-auto flex flex-col items-center justify-center gap-6 pt-4 font-sans font-normal leading-tight sm:flex-row sm:pt-6 lg:pt-8">
          <div className="absolute inset-x-0 top-[10%] h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>
          <div className="flex flex-col items-center justify-between sm:flex-row"></div>
          <P className="text-base text-gray-300 [&:not(:first-child)]:mt-0">
            © {currentYear} Femeraa
          </P>
          <div className="mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            {baseLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition-colors duration-200 hover:text-gray-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
