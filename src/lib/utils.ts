import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/[ö]/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
  });
}

export function formatDateShort(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'short',
  });
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('sv-SE').format(num);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getIconUrl(iconName: string, color?: string): string {
  const baseColor = color || 'ffffff';
  return `https://cdn.simpleicons.org/${iconName}/${baseColor}`;
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getPortfolioUrl(slug: string, customDomain?: string): string {
  if (customDomain) {
    return `https://${customDomain}`;
  }
  return `https://${slug}.portfolyo.se`;
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'God natt';
  if (hour < 12) return 'God morgon';
  if (hour < 18) return 'God eftermiddag';
  return 'God kväll';
}
