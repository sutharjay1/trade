import { Color } from "@/type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "INR";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {},
) {
  const { currency = "INR", notation = "standard" } = options;

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

// utils.ts
export const getWindowSize = (): [number, number] => {
  return [window.innerWidth, window.innerHeight];
};

const COLORS = [
  "#F56565",
  "#ED8936",
  "#ECC94B",
  "#48BB78",
  "#38B2AC",
  "#4299E1",
  "#667EEA",
  "#9F7AEA",
  "#ED64A6",
  "#E53E3E",
  "#FC8181",
  "#B83280",
  "#D69E2E",
  "#F6AD55",
  "#38A169",
  "#319795",
  "#3182CE",
  "#805AD5",
  "#D53F8C",
  "#DD6B20",
  "#CBD5E0",
  "#F687B3",
  "#68D391",
  "#4FD1C5",
  "#63B3ED",
  "#A0AEC0",
  "#B794F4",
  "#F56565",
  "#ED8936",
  "#ECC94B",
  "#48BB78",
  "#38B2AC",
  "#4299E1",
  "#667EEA",
  "#9F7AEA",
  "#ED64A6",
  "#E53E3E",
  "#FC8181",
  "#F6E05E",
  "#C6F6D5",
  "#81E6D9",
  "#90CDF4",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function stockGraphColor(connectionId: string) {
  const hash = hashString(connectionId);
  return COLORS[hash % COLORS.length];
}

export function colorToCSS(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}

export const formatKey = (key: string) => {
  return key.replace(/([A-Z])/g, " $1").trim(); // Add space before uppercase letters
};
