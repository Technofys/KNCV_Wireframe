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

async function runReflowTests() {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new', args: ['--no-sandbox'] });
  const results = [];

  for (const p of pages) {
    const page = await browser.newPage();
    // 320px viewport (WCAG 1.4.10 Reflow / 400% zoom)
    await page.setViewport({ width: 320, height: 640 });
    await page.goto('http://localhost:3000/' + p, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 200)));

    const overflow320 = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollW = Math.max(doc.scrollWidth, body.scrollWidth);
      const clientW = doc.clientWidth;
      const overflowingElements = [];
      document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > clientW + 3) {
          overflowingElements.push({
            tag: el.tagName,
            cls: el.className,
            id: el.id,
            right: Math.round(r.right),
            width: Math.round(r.width)
          });
        }
      });
      return {
        hasOverflow: scrollW > clientW + 2,
        scrollW,
        clientW,
        overflowCount: overflowingElements.length,
        topOverflowing: overflowingElements.slice(0, 5)
      };
    });

    results.push({ page: p, overflow320 });
    if (overflow320.hasOverflow) {
      console.log(`[FAIL] ${p}: scrollWidth ${overflow320.scrollW}px > clientWidth ${overflow320.clientW}px (${overflow320.overflowCount} overflowing elements)`);
      console.log('Sample elements:', overflow320.topOverflowing);
    } else {
      console.log(`[PASS] ${p}: No 320px reflow overflow`);
    }

    await page.close();
  }

  await browser.close();
}

runReflowTests().catch(console.error);
