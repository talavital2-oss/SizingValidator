import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Clamp a number between min and max values
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

/**
 * Format a number as an integer with locale-aware separators
 */
export function formatInt(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

/**
 * Format a number with specified decimal places
 */
export function formatNumber(n: number, decimals = 2): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: decimals })
}

/**
 * Convert GB to TB using 1024 ratio (vCenter convention)
 */
export function gbToTb(gb: number): number {
  return gb / 1024
}

/**
 * Convert GHz to THz
 */
export function ghzToThz(ghz: number): number {
  return ghz / 1000
}
