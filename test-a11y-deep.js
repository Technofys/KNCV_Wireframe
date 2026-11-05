const puppeteer = require('puppeteer-core');
const fs = require('fs');
const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const pages = [
  'index.html', 'home.html', 'about.html', 'community.html', 'contact.html',
  'courses.html', 'course-detail.html', 'publications.html', 'resources.html',
  'toolkits.html', 'webinars.html',
  'simple/home.html', 'simple/about.html', 'simple/community.html', 'simple/contact.html',
  'simple/courses.html', 'simple/course-detail.html', 'simple/publications.html',
  'simple/resources.html', 'simple/toolkits.html', 'simple/webinars.html'
];

async function deepAudit() {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new', args: ['--no-sandbox'] });
  const findings = {};

  for (const pageName of pages) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    const url = 'http://localhost:3000/' + pageName;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 300)));

    const result = await page.evaluate((pName) => {
      const issues = [];

      // 1. Heading Hierarchy Check
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      let lastLevel = 0;
      headings.forEach((h) => {
        const level = parseInt(h.tagName[1], 10);
        if (lastLevel > 0 && level > lastLevel + 1) {
          issues.push({
            type: 'Heading Skip',
            detail: `Heading level jumped from H${lastLevel} to H${level}: "${h.textContent.trim().slice(0, 40)}"`,
            element: h.outerHTML.slice(0, 100)
          });
        }
        lastLevel = level;
      });

      // Exactly one H1?
      const h1s = document.querySelectorAll('h1');
      if (h1s.length === 0) {
        issues.push({ type: 'Missing H1', detail: 'No H1 found on page' });
      } else if (h1s.length > 1) {
        issues.push({ type: 'Multiple H1s', detail: `Found ${h1s.length} H1 headings` });
      }

      // 2. Images without alt or suspicious alt
      const imgs = Array.from(document.querySelectorAll('img'));
      imgs.forEach((img) => {
        if (!img.hasAttribute('alt')) {
          issues.push({
            type: 'Image missing alt',
            detail: `Image src="${img.getAttribute('src')}" has no alt attribute`,
            element: img.outerHTML.slice(0, 100)
          });
        }
      });

      // 3. Form elements without label
      const formControls = Array.from(document.querySelectorAll('input:not([type="hidden"]), select, textarea'));
      formControls.forEach((fc) => {
        const id = fc.id;
        const hasAriaLabel = fc.getAttribute('aria-label') || fc.getAttribute('aria-labelledby');
        const hasExplicitLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasImplicitLabel = fc.closest('label');
        if (!hasAriaLabel && !hasExplicitLabel && !hasImplicitLabel) {
          issues.push({
            type: 'Form control missing label',
            detail: `Control <${fc.tagName.toLowerCase()} id="${fc.id}" name="${fc.name}"> has no accessible label`,
            element: fc.outerHTML.slice(0, 100)
          });
        }
      });

      // 4. Interactive elements with empty accessible name
      const interactives = Array.from(document.querySelectorAll('a, button'));
      interactives.forEach((el) => {
        if (el.offsetParent === null && !el.classList.contains('skip-link')) return;
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledBy = el.getAttribute('aria-labelledby');
        const text = el.textContent.trim();
        const hasImgAlt = Array.from(el.querySelectorAll('img')).some(i => (i.getAttribute('alt') || '').trim());
        const hasSvgTitle = Array.from(el.querySelectorAll('svg title')).some(t => t.textContent.trim());

        if (!ariaLabel && !ariaLabelledBy && !text && !hasImgAlt && !hasSvgTitle) {
          issues.push({
            type: 'Interactive element missing accessible name',
            detail: `<${el.tagName.toLowerCase()} class="${el.className}"> has no visible text or aria-label`,
            element: el.outerHTML.slice(0, 120)
          });
        }
      });

      // 5. Target Size Check (WCAG 2.2 SC 2.5.8: 24x24px)
      interactives.forEach((el) => {
        if (el.offsetParent === null) return;
        if (el.tagName === 'A' && el.closest('p, li, .breadcrumb')) return; // inline exception
        const rect = el.getBoundingClientRect();
        if ((rect.width < 24 || rect.height < 24) && (rect.width > 0 && rect.height > 0)) {
          issues.push({
            type: 'Target size undersized (<24px)',
            detail: `<${el.tagName.toLowerCase()} class="${el.className}"> is ${Math.round(rect.width)}x${Math.round(rect.height)}px: "${el.textContent.trim().slice(0, 25)}"`,
            element: el.outerHTML.slice(0, 100)
          });
        }
      });

      // 6. Check landmark coverage
      const main = document.querySelector('main, [role="main"]');
      if (!main) {
        issues.push({ type: 'Missing main landmark', detail: 'Page has no <main> or [role="main"]' });
      }

      // 7. Check ARIA attribute validity
      const allWithAria = Array.from(document.querySelectorAll('*')).filter(el => {
        return Array.from(el.attributes).some(a => a.name.startsWith('aria-'));
      });
      allWithAria.forEach(el => {
        if (el.hasAttribute('aria-labelledby')) {
          const ids = el.getAttribute('aria-labelledby').split(/\s+/);
          ids.forEach(id => {
            if (!document.getElementById(id)) {
              issues.push({
                type: 'Broken aria-labelledby',
                detail: `ID "${id}" referenced by aria-labelledby not found in DOM`,
                element: el.outerHTML.slice(0, 100)
              });
            }
          });
        }
        if (el.hasAttribute('aria-describedby')) {
          const ids = el.getAttribute('aria-describedby').split(/\s+/);
          ids.forEach(id => {
            if (!document.getElementById(id)) {
              issues.push({
                type: 'Broken aria-describedby',
                detail: `ID "${id}" referenced by aria-describedby not found in DOM`,
                element: el.outerHTML.slice(0, 100)
              });
            }
          });
        }
        if (el.hasAttribute('aria-controls')) {
          const ids = el.getAttribute('aria-controls').split(/\s+/);
          ids.forEach(id => {
            if (!document.getElementById(id)) {
              issues.push({
                type: 'Broken aria-controls',
                detail: `ID "${id}" referenced by aria-controls not found in DOM`,
                element: el.outerHTML.slice(0, 100)
              });
            }
          });
        }
      });

      return issues;
    }, pageName);

    findings[pageName] = result;
    if (result.length > 0) {
      console.log(`\n[${pageName}] Found ${result.length} issue(s):`);
      result.forEach(i => console.log(`  - [${i.type}] ${i.detail}`));
    } else {
      console.log(`\n[${pageName}] No issues found.`);
    }

    await page.close();
  }

  await browser.close();
  fs.writeFileSync('deep-audit-results.json', JSON.stringify(findings, null, 2));
}

deepAudit().catch(console.error);
