/**
 * Utility functions for trading operations
 */

/**
 * Generate a safe tag for Kite orders (max 20 characters)
 * @param prefix - The prefix for the tag (e.g., "buy", "sell", "qbuy")
 * @param symbol - The trading symbol
 * @param timestamp - Optional timestamp to append
 * @returns A tag string that's guaranteed to be 20 characters or less
 */
export function generateOrderTag(
  prefix: string,
  symbol: string,
  timestamp?: number
): string {
  const ts = timestamp || Date.now();
  const shortSymbol = symbol.slice(0, 6); // Limit symbol to 6 chars
  const shortTimestamp = ts.toString().slice(-6); // Last 6 digits of timestamp
  
  // Calculate available space for prefix
  const usedSpace = shortSymbol.length + shortTimestamp.length + 2; // +2 for underscores
  const maxPrefixLength = 20 - usedSpace;
  const safePrefix = prefix.slice(0, Math.max(1, maxPrefixLength));
  
  return `${safePrefix}_${shortSymbol}_${shortTimestamp}`;
}

/**
 * Validate and truncate tag if necessary
 * @param tag - The tag to validate
 * @returns A tag that's guaranteed to be 20 characters or less
 */
export function validateTag(tag: string): string {
  return tag.length > 20 ? tag.slice(0, 20) : tag;
}

/**
 * Generate common order tags
 */
export const OrderTags = {
  buy: (symbol: string) => generateOrderTag("buy", symbol),
  sell: (symbol: string) => generateOrderTag("sell", symbol),
  quickBuy: (symbol: string) => generateOrderTag("qbuy", symbol),
  quickSell: (symbol: string) => generateOrderTag("qsell", symbol),
  limitBuy: (symbol: string) => generateOrderTag("lbuy", symbol),
  limitSell: (symbol: string) => generateOrderTag("lsell", symbol),
  stopLoss: (symbol: string) => generateOrderTag("sl", symbol),
} as const;
