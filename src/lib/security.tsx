'use client';

// ============================================
// PORTFOLYO.SE - Enterprise Security Shield
// Anti-DevTools, Anti-Scraping, Anti-Bot, Anti-Copy
// Version 2.0 - Maximum Protection
// ============================================

// Track security state
let securityTriggered = false;
let devtoolsWarnings = 0;
const MAX_WARNINGS = 3;

export function initSecurityShield() {
  if (typeof window === 'undefined') return;

  // ========================================
  // 1. DISABLE RIGHT-CLICK CONTEXT MENU
  // ========================================
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, { capture: true });

  // ========================================
  // 2. BLOCK ALL DEVTOOLS KEYBOARD SHORTCUTS
  // ========================================
  document.addEventListener('keydown', (e) => {
    const blockedKeys = [
      // F12 - DevTools
      e.key === 'F12',
      // Ctrl/Cmd + Shift + I - DevTools
      (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i'),
      // Ctrl/Cmd + Shift + J - Console
      (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j'),
      // Ctrl/Cmd + Shift + C - Inspect
      (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c'),
      // Ctrl/Cmd + Shift + K - Firefox Console
      (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'K' || e.key === 'k'),
      // Ctrl/Cmd + Shift + M - Responsive Mode
      (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'M' || e.key === 'm'),
      // Ctrl/Cmd + U - View Source
      (e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u'),
      // Ctrl/Cmd + S - Save Page
      (e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's'),
      // Ctrl/Cmd + P - Print (can reveal source)
      (e.ctrlKey || e.metaKey) && (e.key === 'P' || e.key === 'p'),
      // Ctrl/Cmd + Shift + E - Network tab (Firefox)
      (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e'),
      // F5/Ctrl+R with Shift - Hard reload with DevTools
      e.shiftKey && (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && (e.key === 'R' || e.key === 'r'))),
    ];

    if (blockedKeys.some(Boolean)) {
      e.preventDefault();
      e.stopPropagation();
      logSecurityEvent('blocked_shortcut', e.key);
      return false;
    }
  }, { capture: true });

  // ========================================
  // 3. DEVTOOLS DETECTION - MULTIPLE METHODS
  // ========================================
  
  // Method A: Window size difference (docked DevTools)
  let lastOuterWidth = window.outerWidth;
  let lastOuterHeight = window.outerHeight;
  
  const detectViaWindowSize = () => {
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    const sizeChanged = Math.abs(lastOuterWidth - window.outerWidth) > 100 || 
                        Math.abs(lastOuterHeight - window.outerHeight) > 100;
    
    // Threshold accounts for scrollbars and browser UI
    if ((widthDiff > 200 || heightDiff > 200) && sizeChanged) {
      onDevToolsWarning('window_size');
    }
    
    lastOuterWidth = window.outerWidth;
    lastOuterHeight = window.outerHeight;
  };

  // Method B: Console.log getter trap
  const detectViaConsoleLog = () => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'id', {
      get: function() {
        onDevToolsWarning('console_trap');
        return 'security-check';
      }
    });
    // Only log if console might be open (detected via other methods)
    if (devtoolsWarnings > 0) {
      console.log('%c', element);
    }
  };

  // Method C: Performance timing (debugger statement)
  const detectViaDebugger = () => {
    const start = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    const duration = performance.now() - start;
    
    // If debugger takes more than 100ms, DevTools is likely open
    if (duration > 100) {
      onDevToolsWarning('debugger_timing');
    }
  };

  // Method D: toString trap on function
  const detectViaToString = () => {
    const fn = function() {};
    fn.toString = function() {
      onDevToolsWarning('tostring_trap');
      return '';
    };
    console.log(fn);
  };

  // ========================================
  // 4. WARNING SYSTEM (GRADUAL RESPONSE)
  // ========================================
  const onDevToolsWarning = (method: string) => {
    devtoolsWarnings++;
    logSecurityEvent('devtools_warning', method);
    
    if (devtoolsWarnings >= MAX_WARNINGS && !securityTriggered) {
      onDevToolsDetected();
    }
  };

  // ========================================
  // 5. DEVTOOLS DETECTED - LOCKDOWN
  // ========================================
  const onDevToolsDetected = () => {
    if (securityTriggered) return;
    securityTriggered = true;
    
    logSecurityEvent('devtools_detected', 'lockdown');
    
    // Clear all sensitive content
    document.body.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: linear-gradient(135deg, #0b0d12 0%, #1a1a2e 100%);
        color: white;
        font-family: system-ui, -apple-system, sans-serif;
        text-align: center;
        padding: 2rem;
      ">
        <div style="
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          padding: 3rem;
          max-width: 500px;
        ">
          <div style="font-size: 4rem; margin-bottom: 1.5rem;">🛡️</div>
          <h1 style="font-size: 1.75rem; margin-bottom: 1rem; font-weight: 600;">
            Säkerhetssystem aktiverat
          </h1>
          <p style="color: #94a3b8; line-height: 1.6; margin-bottom: 1.5rem;">
            Utvecklarverktyg har detekterats. För att skydda innehållet på denna sida 
            har åtkomsten begränsats.
          </p>
          <p style="color: #64748b; font-size: 0.875rem;">
            Stäng utvecklarverktygen och <a href="/" style="color: #60a5fa; text-decoration: underline;">ladda om sidan</a>.
          </p>
          <p style="color: #475569; font-size: 0.75rem; margin-top: 2rem;">
            Incident-ID: ${generateIncidentId()}
          </p>
        </div>
      </div>
    `;
    
    // Clear all scripts
    document.querySelectorAll('script').forEach(s => s.remove());
    
    // Block all further keyboard input
    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, { capture: true });
    
    // Block all mouse events except clicking reload link
    document.addEventListener('mousedown', (e) => {
      if (!(e.target instanceof HTMLAnchorElement)) {
        e.preventDefault();
      }
    }, { capture: true });
  };

  // ========================================
  // 6. ANTI-COPY/PASTE PROTECTION
  // ========================================
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    logSecurityEvent('copy_attempt', '');
  }, { capture: true });
  
  document.addEventListener('cut', (e) => {
    e.preventDefault();
    logSecurityEvent('cut_attempt', '');
  }, { capture: true });

  // ========================================
  // 7. ANTI-SELECT & ANTI-DRAG
  // ========================================
  const securityStyles = document.createElement('style');
  securityStyles.id = 'security-styles';
  securityStyles.textContent = `
    /* Disable text selection on sensitive areas */
    .protected-content,
    [data-protected="true"] {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-touch-callout: none !important;
    }
    
    /* Disable image dragging */
    img {
      -webkit-user-drag: none !important;
      -khtml-user-drag: none !important;
      -moz-user-drag: none !important;
      -o-user-drag: none !important;
      user-drag: none !important;
      pointer-events: none;
    }
    
    /* Allow pointer events on linked images */
    a img {
      pointer-events: auto;
    }
    
    /* Disable print styling */
    @media print {
      body * {
        display: none !important;
      }
      body::after {
        content: "Utskrift är inaktiverad för denna sida.";
        display: block;
        text-align: center;
        padding: 100px;
        font-size: 24px;
      }
    }
  `;
  document.head.appendChild(securityStyles);

  // Disable drag events
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  }, { capture: true });

  // ========================================
  // 8. CONSOLE WARNING MESSAGE
  // ========================================
  const consoleStyles = [
    'color: #ef4444',
    'font-size: 32px',
    'font-weight: bold',
    'text-shadow: 2px 2px 4px rgba(0,0,0,0.3)',
  ].join(';');
  
  console.log('%c⛔ STOPP!', consoleStyles);
  console.log(
    '%cDetta är en säkrad webbplats. Utvecklarverktygen övervakas.',
    'color: #94a3b8; font-size: 14px; font-weight: 500;'
  );
  console.log(
    '%cObehörig åtkomst loggas och kan leda till rättsliga åtgärder enligt svensk lag.',
    'color: #64748b; font-size: 12px;'
  );
  console.log(
    '%c🛡️ PORTFOLYO.SE Security Shield v2.0',
    'color: #60a5fa; font-size: 11px;'
  );

  // ========================================
  // 9. IFRAME PROTECTION (CLICKJACKING)
  // ========================================
  if (window.self !== window.top) {
    // We're in an iframe - block it
    window.top?.location.replace(window.self.location.href);
  }

  // ========================================
  // 10. RUN DETECTION INTERVALS
  // ========================================
  setInterval(detectViaWindowSize, 1500);
  setInterval(detectViaConsoleLog, 3000);
  // detectViaDebugger is intensive, run less frequently
  setInterval(detectViaDebugger, 5000);
}

// ========================================
// SECURITY LOGGING
// ========================================
function logSecurityEvent(event: string, details: string) {
  // In production, this could send to a logging service
  const timestamp = new Date().toISOString();
  const log = { timestamp, event, details, url: window.location.href };
  
  // Store in sessionStorage for debugging
  const logs = JSON.parse(sessionStorage.getItem('security_logs') || '[]');
  logs.push(log);
  sessionStorage.setItem('security_logs', JSON.stringify(logs.slice(-50)));
}

function generateIncidentId(): string {
  return `PFY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

// Honeypot for bots - invisible form that only bots fill
export function HoneypotField() {
  return (
    <input
      type="text"
      name="website_url_hp"
      tabIndex={-1}
      autoComplete="off"
      style={{
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        opacity: 0,
      }}
    />
  );
}

// Check if honeypot was filled (indicates bot)
export function isBot(formData: FormData): boolean {
  const honeypot = formData.get('website_url_hp');
  return honeypot !== null && honeypot !== '';
}
