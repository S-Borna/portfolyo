'use client';

// ============================================
// PORTFOLYO.SE - Security Shield
// Anti-DevTools, Anti-Scraping, Anti-Bot
// ============================================

export function initSecurityShield() {
  if (typeof window === 'undefined') return;

  // 1. Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // 2. Disable keyboard shortcuts for DevTools
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I / Cmd+Option+I (DevTools)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+J / Cmd+Option+J (Console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+C / Cmd+Option+C (Inspect Element)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      return false;
    }
    // Ctrl+U / Cmd+U (View Source)
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault();
      return false;
    }
    // Ctrl+S / Cmd+S (Save Page)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      return false;
    }
  });

  // 3. DevTools detection via debugger timing
  let devtoolsOpen = false;
  const threshold = 160;

  const detectDevTools = () => {
    const start = performance.now();
    debugger;
    const end = performance.now();
    
    if (end - start > threshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        onDevToolsDetected();
      }
    } else {
      devtoolsOpen = false;
    }
  };

  // 4. DevTools detection via console.log timing
  const detectViaConsole = () => {
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: function() {
        onDevToolsDetected();
        return '';
      }
    });
    console.log('%c', element);
  };

  // 5. DevTools detection via window size difference
  const detectViaWindowSize = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    
    if (widthThreshold || heightThreshold) {
      onDevToolsDetected();
    }
  };

  // 6. Action when DevTools detected
  const onDevToolsDetected = () => {
    // Clear sensitive content
    document.body.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: #0b0d12;
        color: white;
        font-family: system-ui, sans-serif;
        text-align: center;
        padding: 2rem;
      ">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">🛡️ Skyddad sida</h1>
        <p style="color: #94a3b8; max-width: 400px;">
          Denna sida är skyddad. Vänligen stäng utvecklarverktygen och ladda om sidan.
        </p>
      </div>
    `;
    
    // Prevent further interaction
    document.addEventListener('keydown', (e) => e.preventDefault());
  };

  // 7. Disable text selection on sensitive areas
  const style = document.createElement('style');
  style.textContent = `
    .no-select {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    body {
      -webkit-touch-callout: none;
    }
  `;
  document.head.appendChild(style);

  // 8. Disable drag on images
  document.addEventListener('dragstart', (e) => {
    if (e.target instanceof HTMLImageElement) {
      e.preventDefault();
    }
  });

  // 9. Console warning message
  console.log(
    '%c⚠️ VARNING!',
    'color: red; font-size: 40px; font-weight: bold;'
  );
  console.log(
    '%cDetta är en skyddad webbplats. All obehörig åtkomst loggas och kan leda till rättsliga åtgärder.',
    'color: #94a3b8; font-size: 14px;'
  );

  // Run detection (less aggressive - only on suspicious activity)
  // Uncomment for stricter protection:
  // setInterval(detectDevTools, 1000);
  setInterval(detectViaWindowSize, 2000);
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
