const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const axeCorePath = require.resolve('axe-core/axe.min.js');
const axeSource = fs.readFileSync(axeCorePath, 'utf8');

const pages = [
  'index.html',
  'home.html',
  'about.html',
  'community.html',
  'contact.html',
  'courses.html',
  'course-detail.html',
  'publications.html',
  'resources.html',
  'toolkits.html',
  'webinars.html',
  'simple/index.html', // if exists, else it will 404 or skip
  'simple/home.html',
  'simple/about.html',
  'simple/community.html',
  'simple/contact.html',
  'simple/courses.html',
  'simple/course-detail.html',
  'simple/publications.html',
  'simple/resources.html',
  'simple/toolkits.html',
  'simple/webinars.html'
];

const os = require('os');

async function run() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puppeteer-axe-'));
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    userDataDir: tempDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {};

  for (const pageName of pages) {
    const pageUrl = `http://localhost:3000/${pageName}`;
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      const resp = await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });
      if (resp.status() === 404) {
        console.log(`Skipping 404: ${pageName}`);
        await page.close();
        continue;
      }
      // Wait a moment for layout.js to finish DOM injection
      await page.evaluate(() => new Promise(r => setTimeout(r, 300)));

      // Inject axe
      await page.evaluate(axeSource);

      // Run axe with WCAG 2.2 AA tags
      const axeResult = await page.evaluate(async () => {
        return await window.axe.run({
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']
          }
        });
      });

      console.log(`[${pageName}] Violations: ${axeResult.violations.length}`);
      results[pageName] = {
        violations: axeResult.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          tags: v.tags,
          nodes: v.nodes.map(n => ({
            html: n.html.slice(0, 150),
            target: n.target,
            failureSummary: n.failureSummary
          }))
        })),
        passes: axeResult.passes.length,
        incomplete: axeResult.incomplete.length
      };

      await page.close();
    } catch (err) {
      console.error(`Error scanning ${pageName}:`, err.message);
    }
  }

  await browser.close();
  fs.writeFileSync('axe-baseline.json', JSON.stringify(results, null, 2));
  console.log('Saved baseline audit to axe-baseline.json');
}

run().catch(console.error);
