"use client";

// ============================================
// PORTFOLYO.SE - Accessibility Utilities
// WCAG 2.1 AA compliance helpers
// ============================================

import React, { useEffect, useRef } from 'react';

// ============================================
// SKIP LINK COMPONENT
// Allows keyboard users to skip navigation
// ============================================

interface SkipLinkProps {
  targetId?: string;
  children?: React.ReactNode;
}

export function SkipLink({
  targetId = 'main-content',
  children = 'Hoppa till innehåll'
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="
        sr-only focus:not-sr-only
        fixed top-4 left-4 z-[100]
        bg-white text-black
        px-4 py-2 rounded-lg
        font-medium
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
        transition-all
      "
    >
      {children}
    </a>
  );
}

// ============================================
// VISUALLY HIDDEN
// Hide content visually but keep for screen readers
// ============================================

interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export function VisuallyHidden({ children, as: Tag = 'span' }: VisuallyHiddenProps) {
  return (
    <Tag className="sr-only">
      {children}
    </Tag>
  );
}

// ============================================
// FOCUS TRAP
// Trap focus within a container (for modals)
// ============================================

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

export function FocusTrap({ children, active = true, initialFocusRef }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    // Focus initial element or first focusable
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else {
      const focusableElements = getFocusableElements(container);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, initialFocusRef]);

  return <div ref={containerRef}>{children}</div>;
}

// ============================================
// LIVE REGION
// Announce dynamic content to screen readers
// ============================================

interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive';
  atomic?: boolean;
}

export function LiveRegion({
  children,
  politeness = 'polite',
  atomic = true
}: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
}

// ============================================
// ANNOUNCE
// Announce a message to screen readers
// ============================================

let announceTimeout: ReturnType<typeof setTimeout>;

export function announce(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
  // Clear any pending announcements
  clearTimeout(announceTimeout);

  // Find or create the live region
  let liveRegion = document.getElementById('a11y-announcer');

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'a11y-announcer';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }

  // Clear and set message
  liveRegion.textContent = '';

  announceTimeout = setTimeout(() => {
    liveRegion!.textContent = message;
  }, 100);
}

// ============================================
// HELPERS
// ============================================

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
}

// ============================================
// HOOKS
// ============================================

/**
 * Hook to trap focus within a container
 */
export function useFocusTrap(active: boolean = true) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  return containerRef;
}

/**
 * Hook to restore focus when component unmounts
 */
export function useRestoreFocus() {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;

    return () => {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, []);
}

/**
 * Hook to manage keyboard navigation in a list
 */
export function useKeyboardNavigation<T extends HTMLElement>(
  items: T[],
  options: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical';
  } = {}
) {
  const { loop = true, orientation = 'vertical' } = options;
  const currentIndex = useRef(0);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

    if (event.key === nextKey) {
      event.preventDefault();
      if (loop) {
        currentIndex.current = (currentIndex.current + 1) % items.length;
      } else {
        currentIndex.current = Math.min(currentIndex.current + 1, items.length - 1);
      }
      items[currentIndex.current]?.focus();
    } else if (event.key === prevKey) {
      event.preventDefault();
      if (loop) {
        currentIndex.current = (currentIndex.current - 1 + items.length) % items.length;
      } else {
        currentIndex.current = Math.max(currentIndex.current - 1, 0);
      }
      items[currentIndex.current]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      currentIndex.current = 0;
      items[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      currentIndex.current = items.length - 1;
      items[items.length - 1]?.focus();
    }
  };

  return { handleKeyDown, currentIndex };
}

// ============================================
// ARIA HELPERS
// ============================================

/**
 * Generate unique IDs for ARIA relationships
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Create ARIA describedby/labelledby value from multiple IDs
 */
export function combineAriaIds(...ids: (string | undefined)[]): string | undefined {
  const filtered = ids.filter(Boolean);
  return filtered.length > 0 ? filtered.join(' ') : undefined;
}
