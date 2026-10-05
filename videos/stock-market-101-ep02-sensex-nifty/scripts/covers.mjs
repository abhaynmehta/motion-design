// Render the series covers (film/cover.html?ep=N) to renders/covers/cover_epNN.png (1080x1920), then compose
// renders/covers/grid_preview.jpg: how the first nine posts sit on the profile grid (3:4 centre crops, newest top-left).
//   node scripts/covers.mjs [--eps 1-9]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
const ROOT = process.cwd();
const { chromium } = createRequire(path.join(ROOT, 'package.json'))('playwright');
const arg = process.argv.indexOf('--eps'), [a, b] = (arg > 0 ? process.argv[arg + 1] : '1-9').split('-').map(Number);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(0);
const port = server.address().port, out = path.join(ROOT, 'renders/covers');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
for (let ep = a; ep <= (b || a); ep++) {
  await page.goto(`http://localhost:${port}/film/cover.html?ep=${ep}`);
  await page.waitForSelector('body[data-ready="1"]');
  const f = path.join(out, `cover_ep${String(ep).padStart(2, '0')}.png`);
  await page.locator('#c').screenshot({ path: f });
  console.log('wrote', path.relative(ROOT, f));
}
await browser.close(); server.close();
const py = `
import glob
from PIL import Image
fs = sorted(glob.glob('${out}/cover_ep*.png'))[::-1]          # newest first, like the profile grid
cw, ch, g = 360, 480, 4
rows = (len(fs) + 2) // 3
im = Image.new('RGB', (3 * cw + 2 * g, rows * ch + (rows - 1) * g), (0, 0, 0))
for i, f in enumerate(fs):
    c = Image.open(f).convert('RGB').crop((0, 240, 1080, 1680)).resize((cw, ch), Image.LANCZOS)
    im.paste(c, ((i % 3) * (cw + g), (i // 3) * (ch + g)))
im.save('${out}/grid_preview.jpg', quality=92)
print('wrote renders/covers/grid_preview.jpg', im.size)
`;
console.log(spawnSync('python3', ['-c', py], { encoding: 'utf8' }).stdout.trim());
