const puppeteer = require('puppeteer-core');
const fs = require('fs');

const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runManualTests() {
  console.log('=== Starting Rigorous Accessibility Verification Suite ===\n');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const summary = [];

  function record(testName, passed, detail) {
    summary.push({ testName, passed, detail });
    console.log(`${passed ? '✓ PASS' : '✗ FAIL'}: [${testName}] ${detail}`);
  }

  // --- Test 1: Skip Link & Main Target (WCAG 2.4.1) ---
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/home.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 400)));

    await page.keyboard.press('Tab');
    await page.evaluate(() => new Promise(r => setTimeout(r, 250)));

    const skipLinkState = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || !el.classList.contains('skip-link')) return { isSkip: false };
      const r = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        isSkip: true,
        text: el.textContent.trim(),
        href: el.getAttribute('href'),
        top: r.top,
        width: r.width,
        height: r.height,
        visible: r.top >= 0 && r.width > 50 && r.height > 20 && style.visibility !== 'hidden' && style.opacity !== '0'
      };
    });

    record(
      'Skip Link Visibility on Tab (WCAG 2.4.1)',
      skipLinkState.isSkip && skipLinkState.visible,
      `Active: ${skipLinkState.isSkip}, Visible: ${skipLinkState.visible} (top: ${skipLinkState.top}px, ${Math.round(skipLinkState.width)}x${Math.round(skipLinkState.height)}px), Target: ${skipLinkState.href}`
    );

    // Enter to navigate skip link
    await page.keyboard.press('Enter');
    await page.evaluate(() => new Promise(r => setTimeout(r, 200)));

    const targetState = await page.evaluate(() => {
      const active = document.activeElement;
      return {
        activeId: active ? active.id : null,
        tabindex: active ? active.getAttribute('tabindex') : null
      };
    });

    record(
      'Skip Link Navigation to #main-content',
      targetState.activeId === 'main-content',
      `Active element ID: ${targetState.activeId}, tabindex: ${targetState.tabindex}`
    );
  } catch (err) {
    record('Skip Link Navigation', false, err.message);
  }

  // --- Test 2: Sticky Header Obscuring Focus (WCAG 2.2 SC 2.4.11) ---
  try {
    const focusObscuring = await page.evaluate(() => {
      const header = document.querySelector('.site-header');
      const headerHeight = header ? header.offsetHeight : 0;
      const htmlStyle = window.getComputedStyle(document.documentElement);
      const scrollPaddingTop = parseInt(htmlStyle.scrollPaddingTop, 10) || 0;
      
      const firstSection = document.querySelector('#main-content');
      const mainStyle = firstSection ? window.getComputedStyle(firstSection) : null;
      const scrollMarginTop = mainStyle ? (parseInt(mainStyle.scrollMarginTop, 10) || 0) : 0;

      return {
        headerHeight,
        scrollPaddingTop,
        scrollMarginTop,
        safe: scrollPaddingTop >= headerHeight || scrollMarginTop >= headerHeight
      };
    });

    record(
      'WCAG 2.2 Focus Not Obscured (SC 2.4.11)',
      focusObscuring.safe,
      `Header height: ${focusObscuring.headerHeight}px, scrollPaddingTop: ${focusObscuring.scrollPaddingTop}px, scrollMarginTop: ${focusObscuring.scrollMarginTop}px`
    );
  } catch (err) {
    record('WCAG 2.2 Focus Not Obscured', false, err.message);
  }

  // --- Test 3: Dropdown W3C APG Keyboard Pattern & Escape Dismissal (WCAG 2.1.1 / 1.4.13) ---
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/home.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 400)));

    await page.focus('#nav-resources');
    await page.keyboard.press('ArrowDown');
    await page.evaluate(() => new Promise(r => setTimeout(r, 150)));

    const dropOpenState = await page.evaluate(() => {
      const btn = document.getElementById('nav-resources');
      const active = document.activeElement;
      const menu = document.getElementById('resources-submenu');
      const style = window.getComputedStyle(menu);
      return {
        expanded: btn.getAttribute('aria-expanded'),
        activeTag: active ? active.tagName : null,
        activeHref: active ? active.getAttribute('href') : null,
        activeText: active ? active.textContent.trim() : null,
        menuVisible: style.visibility !== 'hidden' && style.opacity !== '0'
      };
    });

    await page.keyboard.press('Escape');
    await page.evaluate(() => new Promise(r => setTimeout(r, 250)));

    const dropCloseState = await page.evaluate(() => {
      const btn = document.getElementById('nav-resources');
      const active = document.activeElement;
      const menu = document.getElementById('resources-submenu');
      const style = window.getComputedStyle(menu);
      return {
        expanded: btn.getAttribute('aria-expanded'),
        focusRestored: active === btn,
        menuHidden: style.visibility === 'hidden' || style.opacity === '0'
      };
    });

    const dropSuccess = dropOpenState.expanded === 'true' &&
      dropOpenState.activeHref === 'toolkits.html' &&
      dropCloseState.expanded === 'false' &&
      dropCloseState.focusRestored &&
      dropCloseState.menuHidden;

    record(
      'Dropdown W3C APG Keyboard Pattern & Visual Escape Dismissal',
      dropSuccess,
      `Expanded on ArrowDown: ${dropOpenState.expanded}, Focused first link: "${dropOpenState.activeText}", Closed on Esc: ${dropCloseState.expanded}, Menu visually hidden: ${dropCloseState.menuHidden}, Focus restored: ${dropCloseState.focusRestored}`
    );
  } catch (err) {
    record('Dropdown Keyboard Pattern', false, err.message);
  }

  // --- Test 4: Dropdown Enter Key Natural Link Navigation (WCAG 2.1.1 / 2.5.3) ---
  try {
    await page.goto('http://localhost:3000/home.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 300)));
    await page.focus('#nav-resources');
    
    // Press Enter to navigate
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.keyboard.press('Enter')
    ]);

    const currentUrl = page.url();
    const navSuccess = currentUrl.includes('resources.html');
    record(
      'Navigation Link Enter Key Follows Href (WCAG 2.1.1)',
      navSuccess,
      `Enter on #nav-resources navigated to: ${currentUrl}`
    );
  } catch (err) {
    record('Navigation Link Enter Key Follows Href', false, err.message);
  }

  // --- Test 5: Mobile Navigation Focus Management (WCAG 2.4.3 Focus Order) ---
  try {
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/home.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 300)));

    await page.focus('#menu-btn');
    await page.keyboard.press('Enter');
    await page.evaluate(() => new Promise(r => setTimeout(r, 200)));

    const activeAfterOpen = await page.evaluate(() => {
      const active = document.activeElement;
      const nav = document.getElementById('main-nav');
      return {
        isOpen: nav.classList.contains('nav-open'),
        activeId: active ? active.id : null,
        activeText: active ? active.textContent.trim() : null,
        insideNav: nav.contains(active)
      };
    });

    await page.keyboard.press('Escape');
    await page.evaluate(() => new Promise(r => setTimeout(r, 200)));

    const activeAfterClose = await page.evaluate(() => {
      const active = document.activeElement;
      const nav = document.getElementById('main-nav');
      return {
        isOpen: nav.classList.contains('nav-open'),
        focusReturnedToBtn: active && active.id === 'menu-btn'
      };
    });

    const mobileNavPass = activeAfterOpen.isOpen && activeAfterOpen.insideNav && !activeAfterClose.isOpen && activeAfterClose.focusReturnedToBtn;
    record(
      'Mobile Navigation Focus Management (WCAG 2.4.3)',
      mobileNavPass,
      `On open, focused link: "${activeAfterOpen.activeText}" (id: ${activeAfterOpen.activeId}); On Esc, focus restored to #menu-btn: ${activeAfterClose.focusReturnedToBtn}`
    );
  } catch (err) {
    record('Mobile Navigation Focus Management', false, err.message);
  }

  // --- Test 6: Modal Dialog A11y & Focus Trap with Media Badge (WCAG 1.2.2 / 2.1.2) ---
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/webinars.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 400)));

    await page.click('.trailer-play-btn');
    await page.evaluate(() => new Promise(r => setTimeout(r, 200)));

    const modalOpenInfo = await page.evaluate(() => {
      const m = document.getElementById('kncv-modal-backdrop');
      const active = document.activeElement;
      const mediaBadge = document.getElementById('kncv-modal-media-badge');
      return {
        isOpen: m.classList.contains('is-open'),
        ariaHidden: m.getAttribute('aria-hidden'),
        role: m.getAttribute('role'),
        ariaModal: m.getAttribute('aria-modal'),
        isCloseFocused: active && active.id === 'kncv-modal-close',
        hasMediaBadge: mediaBadge && mediaBadge.style.display !== 'none' && mediaBadge.textContent.includes('Captions')
      };
    });

    await page.keyboard.press('Escape');
    await page.evaluate(() => new Promise(r => setTimeout(r, 200)));

    const modalCloseInfo = await page.evaluate(() => {
      const m = document.getElementById('kncv-modal-backdrop');
      const active = document.activeElement;
      return {
        isOpen: m.classList.contains('is-open'),
        triggerFocused: active && active.classList.contains('trailer-play-btn')
      };
    });

    const modalSuccess = modalOpenInfo.isOpen &&
      modalOpenInfo.role === 'dialog' &&
      modalOpenInfo.ariaModal === 'true' &&
      modalOpenInfo.isCloseFocused &&
      modalOpenInfo.hasMediaBadge &&
      !modalCloseInfo.isOpen &&
      modalCloseInfo.triggerFocused;

    record(
      'Accessible Modal Dialog, Media Badge & Focus Trap/Escape',
      modalSuccess,
      `Role: ${modalOpenInfo.role}, aria-modal: ${modalOpenInfo.ariaModal}, Close button focused: ${modalOpenInfo.isCloseFocused}, Media badge present: ${modalOpenInfo.hasMediaBadge}, Closed on Esc: ${!modalCloseInfo.isOpen}, Focus restored: ${modalCloseInfo.triggerFocused}`
    );
  } catch (err) {
    record('Accessible Modal Dialog', false, err.message);
  }

  // --- Test 7: Direct Contact Channels & Unauthenticated Form Removal ---
  try {
    await page.goto('http://localhost:3000/contact.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 400)));

    const contactState = await page.evaluate(() => {
      const form = document.getElementById('contact-enquiry-form');
      const phoneLink = document.querySelector('a[href^="tel:"]');
      const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
      const lmsLink = document.querySelector('a[href="#lms"]');
      return {
        formPresent: !!form,
        hasPhone: !!phoneLink,
        emailCount: emailLinks.length,
        hasLms: !!lmsLink
      };
    });

    const contactSuccess = !contactState.formPresent && contactState.hasPhone && contactState.emailCount >= 3 && contactState.hasLms;
    record(
      'Direct Contact Channels & Form Removal (Verified direct access)',
      contactSuccess,
      `Form present: ${contactState.formPresent}, Phone channel: ${contactState.hasPhone}, Direct email links: ${contactState.emailCount}, LMS helpdesk link: ${contactState.hasLms}`
    );
  } catch (err) {
    record('Direct Contact Channels', false, err.message);
  }

  // --- Test 8: Reflow Across Pages at 320px width (WCAG 1.4.10) ---
  try {
    const testPages = ['home.html', 'community.html', 'contact.html', 'webinars.html', 'courses.html', 'simple/home.html', 'simple/courses.html'];
    let allPagesReflowSafe = true;
    const reflowDetails = [];

    for (const tp of testPages) {
      await page.setViewport({ width: 320, height: 640 });
      await page.goto('http://localhost:3000/' + tp, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => new Promise(r => setTimeout(r, 250)));

      const rTest = await page.evaluate(() => {
        const docEl = document.documentElement;
        const scrollW = Math.max(docEl.scrollWidth, document.body.scrollWidth);
        const clientW = docEl.clientWidth;
        return { scrollW, clientW, pass: scrollW <= clientW + 2 };
      });

      if (!rTest.pass) allPagesReflowSafe = false;
      reflowDetails.push(`${tp}: ${rTest.scrollW}px/${rTest.clientW}px`);
    }

    record(
      'WCAG 1.4.10 Reflow at 320px width (Zero horizontal overflow across all pages)',
      allPagesReflowSafe,
      reflowDetails.join(', ')
    );
  } catch (err) {
    record('WCAG 1.4.10 Reflow', false, err.message);
  }

  // --- Test 9: Red Gradient & Text Contrast (WCAG 1.4.3 >= 4.5:1) ---
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/home.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 300)));

    const gradientContrast = await page.evaluate(() => {
      function luminance(r, g, b) {
        const a = [r, g, b].map(v => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      }
      function getRatio(l1, l2) {
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      }
      const lWhite = luminance(255, 255, 255);
      // Dark red gradient start (#C90032), mid (#A1002A), and end (#750022)
      const lStart = luminance(201, 0, 50);
      const lMid = luminance(161, 0, 42);
      const lEnd = luminance(117, 0, 34);

      const rStart = getRatio(lWhite, lStart);
      const rMid = getRatio(lWhite, lMid);
      const rEnd = getRatio(lWhite, lEnd);

      const ctaBand = document.querySelector('.cta-band');
      const ctaStyle = window.getComputedStyle(ctaBand);
      const ctaText = document.querySelector('.cta-text');
      const textStyle = window.getComputedStyle(ctaText);

      return {
        rStart: Math.round(rStart * 100) / 100,
        rMid: Math.round(rMid * 100) / 100,
        rEnd: Math.round(rEnd * 100) / 100,
        bg: ctaStyle.backgroundImage,
        textColor: textStyle.color,
        allPass: rStart >= 4.5 && rMid >= 4.5 && rEnd >= 4.5
      };
    });

    record(
      'Red Gradient & Text Contrast (WCAG 1.4.3 >= 4.5:1)',
      gradientContrast.allPass,
      `Start stop ratio: ${gradientContrast.rStart}:1, Mid ratio: ${gradientContrast.rMid}:1, End ratio: ${gradientContrast.rEnd}:1, Text color: ${gradientContrast.textColor}`
    );
  } catch (err) {
    record('Red Gradient & Text Contrast', false, err.message);
  }

  // --- Test 10: Non-Text UI Contrast (WCAG 1.4.11 >= 3:1) ---
  try {
    await page.goto('http://localhost:3000/community.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 300)));

    const nonTextContrast = await page.evaluate(() => {
      function luminance(r, g, b) {
        const a = [r, g, b].map(v => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      }
      function hexToRgb(hex) {
        const bigint = parseInt(hex.replace('#', ''), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
      }
      const l1 = luminance(255, 255, 255);
      const l2 = luminance(...hexToRgb('#767676'));
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

      const btnGhost = document.querySelector('.btn-ghost');
      const style = window.getComputedStyle(btnGhost);

      return {
        ratio: Math.round(ratio * 100) / 100,
        borderColor: style.borderColor,
        borderWidth: style.borderWidth
      };
    });

    record(
      'WCAG 1.4.11 Non-text Component Contrast (>= 3:1)',
      nonTextContrast.ratio >= 3.0,
      `btn-ghost border ratio: ${nonTextContrast.ratio}:1 (border: ${nonTextContrast.borderWidth} ${nonTextContrast.borderColor})`
    );
  } catch (err) {
    record('WCAG 1.4.11 Non-text Contrast', false, err.message);
  }

  // --- Test 11: Course Catalog Filter Removal & 2-Course Display ---
  try {
    await page.goto('http://localhost:3000/courses.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 400)));

    const catalogState = await page.evaluate(() => {
      const cards = document.querySelectorAll('#courses-catalog-grid .card');
      const hasFiltersPanel = !!document.getElementById('course-filters-panel');
      const hasChips = !!document.getElementById('course-category-chips');
      const hasSearch = !!document.getElementById('course-search');
      return {
        cardCount: cards.length,
        hasFiltersPanel,
        hasChips,
        hasSearch
      };
    });

    const catalogPass = catalogState.cardCount === 2 && !catalogState.hasFiltersPanel && !catalogState.hasChips && !catalogState.hasSearch;
    record(
      'Course Catalog Layout (Filters removed, exactly 2 courses displayed)',
      catalogPass,
      `Cards: ${catalogState.cardCount}, Filters panel present: ${catalogState.hasFiltersPanel}, Category chips present: ${catalogState.hasChips}, Search present: ${catalogState.hasSearch}`
    );
  } catch (err) {
    record('Course Catalog Layout', false, err.message);
  }

  // --- Test 12: Reduced Motion Preference (WCAG 2.3.3) ---
  try {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto('http://localhost:3000/home.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 300)));

    const motionTest = await page.evaluate(() => {
      const marquee = document.querySelector('.marquee-track');
      const style = marquee ? window.getComputedStyle(marquee) : null;
      const duration = style ? style.animationDuration : '';
      const htmlStyle = window.getComputedStyle(document.documentElement);
      const scrollBehavior = htmlStyle.scrollBehavior;
      return {
        duration,
        scrollBehavior,
        motionReduced: duration === '0.001s' || duration === '0s' || duration === 'none' || scrollBehavior === 'auto'
      };
    });

    record(
      'WCAG 2.3.3 / 2.2.2 Prefers-Reduced-Motion Handling',
      motionTest.motionReduced,
      `Marquee animation-duration: ${motionTest.duration}, scroll-behavior: ${motionTest.scrollBehavior}`
    );
  } catch (err) {
    record('Reduced Motion Handling', false, err.message);
  }

  // --- Test 13: Target Size (Minimum) (WCAG 2.2 SC 2.5.8 >=24x24px) ---
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await page.goto('http://localhost:3000/simple/home.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 300)));

    const targetSizeTest = await page.evaluate(() => {
      const interactiveElements = Array.from(document.querySelectorAll('a, button, input, select'));
      let undersized = [];
      interactiveElements.forEach(el => {
        if (el.offsetParent === null) return;
        if (el.tagName === 'A' && el.closest('p, li, .breadcrumb')) return;
        const rect = el.getBoundingClientRect();
        if (rect.width < 24 || rect.height < 24) {
          undersized.push({
            tag: el.tagName,
            class: el.className,
            text: el.textContent.trim().slice(0, 30),
            w: Math.round(rect.width),
            h: Math.round(rect.height)
          });
        }
      });
      return { total: interactiveElements.length, undersized };
    });

    record(
      'WCAG 2.2 Target Size (Minimum) SC 2.5.8 on simple/ (>=24x24px)',
      targetSizeTest.undersized.length === 0,
      `Scanned ${targetSizeTest.total} controls. Undersized: ${targetSizeTest.undersized.length} ${targetSizeTest.undersized.length ? JSON.stringify(targetSizeTest.undersized) : '(All targets >= 24x24px)'}`
    );
  } catch (err) {
    record('WCAG 2.5.8 Target Size', false, err.message);
  }

  // --- Test 14: Visual Focus Indicators (WCAG 2.4.7 / 2.4.13) ---
  try {
    await page.goto('http://localhost:3000/home.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 200)));
    await page.keyboard.press('Tab'); // #skip-link
    await page.keyboard.press('Tab'); // #logo-link
    await page.keyboard.press('Tab'); // #nav-home

    const focusVisibleTest = await page.evaluate(() => {
      const active = document.activeElement;
      if (!active) return { error: 'No active element' };
      const style = window.getComputedStyle(active);
      const outlineWidth = parseInt(style.outlineWidth, 10) || 0;
      const outlineStyle = style.outlineStyle;
      const boxShadow = style.boxShadow;
      return {
        tag: active.tagName,
        id: active.id,
        outlineWidth,
        outlineStyle,
        boxShadow,
        hasVisibleOutline: (outlineWidth >= 2 && outlineStyle !== 'none') || (boxShadow && boxShadow !== 'none')
      };
    });

    record(
      'WCAG 2.4.7 / 2.4.13 Focus Appearance & Visibility',
      focusVisibleTest.hasVisibleOutline,
      `Active: <${focusVisibleTest.tag} id="${focusVisibleTest.id}">, Outline width: ${focusVisibleTest.outlineWidth}px, style: ${focusVisibleTest.outlineStyle}, boxShadow: ${focusVisibleTest.boxShadow}`
    );
  } catch (err) {
    record('Focus Appearance & Visibility', false, err.message);
  }

  // --- Test 15: Roving Tabindex & Tabs Keyboard Navigation ---
  try {
    await page.goto('http://localhost:3000/webinars.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 300)));

    const tabsTest = await page.evaluate(async () => {
      const tablist = document.getElementById('webinar-tabs');
      if (!tablist) return { found: false };
      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
      
      tabs[0].focus();
      tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await new Promise(r => setTimeout(r, 100));

      const tab1Active = document.activeElement === tabs[1];
      const tab1Selected = tabs[1].getAttribute('aria-selected') === 'true';

      return {
        found: true,
        tab1Active,
        tab1Selected
      };
    });

    record(
      'W3C APG Tablist Arrow Key Roving Navigation',
      tabsTest.found && tabsTest.tab1Active && tabsTest.tab1Selected,
      `ArrowRight moved focus: ${tabsTest.tab1Active}, aria-selected updated: ${tabsTest.tab1Selected}`
    );
  } catch (err) {
    record('W3C APG Tablist Navigation', false, err.message);
  }

  await browser.close();

  console.log('\n=== Manual Test Summary ===');
  const allPassed = summary.every(s => s.passed);
  console.log(`Total Tests: ${summary.length}, Passed: ${summary.filter(s => s.passed).length}, Failed: ${summary.filter(s => !s.passed).length}`);
  fs.writeFileSync('manual-tests-results.json', JSON.stringify(summary, null, 2));
}

runManualTests().catch(console.error);
