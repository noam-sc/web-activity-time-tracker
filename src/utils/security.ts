import { NO_FAVICON } from './consts';

/**
 * Security utilities for input validation and sanitization
 */

/**
 * Validates if a URL is safe for redirection
 * Only allows http/https protocols and optionally validates against whitelist
 */
export function isValidRedirectUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url);

    // Only allow http/https protocols to prevent javascript:, data:, etc.
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    // Check for dangerous schemes in the URL string (case-insensitive)
    const lowerUrl = url.toLowerCase();
    if (
      lowerUrl.includes('javascript:') ||
      lowerUrl.includes('data:') ||
      lowerUrl.includes('vbscript:') ||
      lowerUrl.includes('file:')
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitizes and validates favicon URLs
 * Returns NO_FAVICON constant for invalid URLs
 */
export function sanitizeFaviconUrl(favicon: string | null): string {
  if (!favicon || typeof favicon !== 'string') {
    return NO_FAVICON;
  }

  try {
    const url = new URL(favicon);

    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return NO_FAVICON;
    }

    // Check for dangerous schemes
    const lowerUrl = favicon.toLowerCase();
    if (
      lowerUrl.includes('javascript:') ||
      lowerUrl.includes('data:') ||
      lowerUrl.includes('vbscript:')
    ) {
      return NO_FAVICON;
    }

    return favicon;
  } catch {
    // Invalid URL
    return NO_FAVICON;
  }
}

/**
 * Sanitizes user input to prevent XSS and other injection attacks
 */
export function sanitizeUserInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove dangerous characters and scripts
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .trim()
    .substring(0, 1000); // Limit length to prevent DoS
}

/**
 * Validates backup data structure to prevent code injection
 */
export function isValidBackupData(data: any): boolean {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(item => {
    return (
      typeof item === 'object' &&
      item !== null &&
      typeof item.url === 'string' &&
      typeof item.summaryTime === 'number' &&
      item.summaryTime >= 0
    );
  });
}

/**
 * Sanitizes backup data to ensure safety
 */
export function sanitizeBackupData(data: any[]): any[] {
  return data.map(item => ({
    url: sanitizeUserInput(item.url || ''),
    summaryTime: Math.max(0, Math.floor(Number(item.summaryTime) || 0)),
    counter: Math.max(0, Math.floor(Number(item.counter) || 0)),
    favicon: sanitizeFaviconUrl(item.favicon),
    days: Array.isArray(item.days) ? item.days.map(sanitizeDayData) : [],
  }));
}

/**
 * Sanitizes day data within backup
 */
function sanitizeDayData(day: any): any {
  return {
    date: sanitizeUserInput(day.date || ''),
    summary: Math.max(0, Math.floor(Number(day.summary) || 0)),
    counter: Math.max(0, Math.floor(Number(day.counter) || 0)),
  };
}

/**
 * Validates that a message has the expected structure
 */
export function isValidMessage(message: any): boolean {
  return (
    message &&
    (typeof message === 'string' ||
      (typeof message === 'object' && (message.type || message.message)))
  );
}
