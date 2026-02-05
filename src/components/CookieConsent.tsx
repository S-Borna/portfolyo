'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Icons } from '@/components/ui';

const { X, Settings, Check } = Icons;

export type CookiePreferences = {
  necessary: boolean; // Always true
  functional: boolean;
  analytics: boolean;
  timestamp: number;
};

const COOKIE_CONSENT_KEY = 'cookie_consent';
const COOKIE_CONSENT_VERSION = 1;

const defaultPreferences: CookiePreferences = {
  necessary: true,
  functional: false,
  analytics: false,
  timestamp: 0,
};

export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    // Check if consent is still valid (within 1 year)
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (Date.now() - parsed.timestamp > oneYear) {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      return null;
    }
    
    return parsed;
  } catch {
    return null;
  }
}

export function setCookiePreferences(prefs: Omit<CookiePreferences, 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  
  const fullPrefs: CookiePreferences = {
    ...prefs,
    necessary: true, // Always true
    timestamp: Date.now(),
  };
  
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(fullPrefs));
  
  // Set cookie for server-side access
  document.cookie = `cookie_consent=${JSON.stringify(fullPrefs)}; max-age=${365 * 24 * 60 * 60}; path=/; SameSite=Lax`;
  
  // Dispatch custom event for analytics initialization
  window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: fullPrefs }));
  
  // Handle analytics based on preferences
  if (fullPrefs.analytics) {
    initializeAnalytics();
  } else {
    disableAnalytics();
  }
}

function initializeAnalytics() {
  // Initialize Google Analytics if consent given
  // This is a placeholder - implement actual GA initialization
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      analytics_storage: 'granted',
    });
  }
}

function disableAnalytics() {
  // Disable Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      analytics_storage: 'denied',
    });
  }
  
  // Remove GA cookies
  const gaCookies = document.cookie.split(';').filter(c => c.trim().startsWith('_ga'));
  gaCookies.forEach(cookie => {
    const name = cookie.split('=')[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = getCookiePreferences();
    if (!existing) {
      // Small delay before showing banner
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setPreferences(existing);
    }
  }, []);

  const handleAcceptAll = () => {
    const prefs = {
      necessary: true,
      functional: true,
      analytics: true,
    };
    setCookiePreferences(prefs);
    setPreferences({ ...prefs, timestamp: Date.now() });
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    const prefs = {
      necessary: true,
      functional: false,
      analytics: false,
    };
    setCookiePreferences(prefs);
    setPreferences({ ...prefs, timestamp: Date.now() });
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    setCookiePreferences(preferences);
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 bg-white shadow-2xl border border-slate-200">
              {!showSettings ? (
                // Main banner
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Vi använder cookies 🍪
                    </h3>
                    <p className="text-sm text-slate-600">
                      Vi använder cookies för att ge dig bästa möjliga upplevelse. 
                      Vissa cookies är nödvändiga, medan andra hjälper oss förbättra sidan.{' '}
                      <Link href="/cookies" className="text-slate-900 underline hover:text-slate-700">
                        Läs mer
                      </Link>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(true)}
                      leftIcon={<Settings className="h-4 w-4" />}
                    >
                      Anpassa
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleAcceptNecessary}
                    >
                      Endast nödvändiga
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAcceptAll}
                    >
                      Acceptera alla
                    </Button>
                  </div>
                </div>
              ) : (
                // Settings panel
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Cookie-inställningar
                    </h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-slate-500" />
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* Necessary */}
                    <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">Strikt nödvändiga</h4>
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Alltid aktiv</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          Krävs för att webbplatsen ska fungera. Inkluderar inloggning och säkerhet.
                        </p>
                      </div>
                      <div className="w-12 h-7 bg-emerald-500 rounded-full flex items-center justify-end px-1">
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-emerald-500" />
                        </div>
                      </div>
                    </div>

                    {/* Functional */}
                    <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1 mr-4">
                        <h4 className="font-medium text-slate-900">Funktionscookies</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Sparar dina preferenser som tema och språk för en bättre upplevelse.
                        </p>
                      </div>
                      <button
                        onClick={() => setPreferences(p => ({ ...p, functional: !p.functional }))}
                        className={`w-12 h-7 rounded-full transition-colors flex items-center ${
                          preferences.functional ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                        } px-1`}
                      >
                        <div className="w-5 h-5 bg-white rounded-full shadow" />
                      </button>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1 mr-4">
                        <h4 className="font-medium text-slate-900">Analyscookies</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Hjälper oss förstå hur du använder sidan så vi kan förbättra den. Data anonymiseras.
                        </p>
                      </div>
                      <button
                        onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                        className={`w-12 h-7 rounded-full transition-colors flex items-center ${
                          preferences.analytics ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                        } px-1`}
                      >
                        <div className="w-5 h-5 bg-white rounded-full shadow" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleAcceptNecessary}
                    >
                      Endast nödvändiga
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSavePreferences}
                    >
                      Spara inställningar
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to check if a specific cookie category is allowed
export function useCookieConsent(category: 'functional' | 'analytics'): boolean {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const prefs = getCookiePreferences();
      setAllowed(prefs ? prefs[category] : false);
    };

    checkConsent();

    // Listen for consent updates
    const handleUpdate = (e: CustomEvent<CookiePreferences>) => {
      setAllowed(e.detail[category]);
    };

    window.addEventListener('cookieConsentUpdated', handleUpdate as EventListener);
    return () => window.removeEventListener('cookieConsentUpdated', handleUpdate as EventListener);
  }, [category]);

  return allowed;
}

// Button to open cookie settings (for footer)
export function CookieSettingsButton({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    // Remove stored consent to show banner again
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    document.cookie = `cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    // Force re-render by reloading
    window.location.reload();
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleClick}
      className={`hover:text-white transition-colors ${className || 'text-slate-400'}`}
    >
      Cookie-inställningar
    </button>
  );
}

export default CookieConsentBanner;
