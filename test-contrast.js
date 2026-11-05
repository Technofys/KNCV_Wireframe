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

async function run() {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new', args: ['--no-sandbox'] });

  for (const p of pages) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto('http://localhost:3000/' + p, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise(r => setTimeout(r, 200)));

    const items = await page.evaluate(() => {
      function luminance(r, g, b) {
        const a = [r, g, b].map(v => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      }

      function parseRgb(str) {
        const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!m) return null;
        return { r: parseInt(m[1]), g: parseInt(m[2]), b: parseInt(m[3]), a: m[4] !== undefined ? parseFloat(m[4]) : 1 };
      }

      function getEffectiveBg(el) {
        let curr = el;
        while (curr && curr !== document.documentElement) {
          const bg = window.getComputedStyle(curr).backgroundColor;
          const p = parseRgb(bg);
          if (p && p.a > 0.5) return p;
          curr = curr.parentElement;
        }
        return { r: 255, g: 255, b: 255, a: 1 };
      }

      function getRatio(c1, c2) {
        const l1 = luminance(c1.r, c1.g, c1.b);
        const l2 = luminance(c2.r, c2.g, c2.b);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      }

      const results = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      while (walker.nextNode()) {
        const el = walker.currentNode;
        // Check leaf text nodes
        const directText = Array.from(el.childNodes)
          .filter(n => n.nodeType === Node.TEXT_NODE)
          .map(n => n.textContent.trim())
          .join(' ')
          .trim();

        if (!directText) continue;
        if (el.offsetParent === null && el.tagName !== 'BODY') continue;

        const style = window.getComputedStyle(el);
        if (style.visibility === 'hidden' || style.display === 'none' || parseFloat(style.opacity) < 0.1) continue;

        const fg = parseRgb(style.color);
        if (!fg) continue;
        const bg = getEffectiveBg(el);

        const ratio = getRatio(fg, bg);
        const fontSize = parseFloat(style.fontSize);
        const fontWeight = parseInt(style.fontWeight) || 400;
        const isLarge = fontSize >= 24 || (fontSize >= 18.5 && fontWeight >= 700);
        const threshold = isLarge ? 3.0 : 4.5;

        if (ratio < threshold) {
          results.push({
            tag: el.tagName,
            cls: el.className,
            text: directText.slice(0, 40),
            ratio: Math.round(ratio * 100) / 100,
            threshold,
            color: style.color,
            bg: 'rgb(' + bg.r + ',' + bg.g + ',' + bg.b + ')'
          });
        }
      }
      return results;
    });

    if (items.length) {
      console.log(`Page [${p}] has ${items.length} low contrast items:`);
      items.forEach(it => console.log('  ', it));
    } else {
      console.log(`Page [${p}] OK`);
    }
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
