#!/usr/bin/env node
/**
 * Generate cover image URLs for all articles
 * Uses keyword-based Unsplash photo IDs (no API key needed)
 */
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = join(__dirname, '../src/content/posts');

// Pre-curated Unsplash photo IDs mapped to themes
const IMAGE_MAP = {
  'consciousness': 'NNNFKJ7KaAo',
  'mind': 'SqYmTDQYMjo',
  'brain': 'hZ1Xh4GTz3w',
  'tech': 'p0j-mE6mGo4',
  'robot': 'J7nOIXFRLL4',
  'robotics': '1485827404703-89b55f597d5b',
  'circuit': 'Z2Vhc4ZtD2s',
  'computer': '1550751827-0bd9ee3f3d2c',
  'neural': 'UWYo9sSSntA',
  'network': '1H_7Aw68Su8',
  'future': 'qWfKJvBhVZ0',
  'space': '1446776811953-b23d57bd21aa',
  'digital': 'iqeG5xA96M4',
  'virtual': 'wL4pSSnmX0w',
  'simulation': 'x_h0C9R1KLI',
  'philosophy': '90Y0uS1qBJU',
  'meaning': 'LEW2yX-2S5w',
  'human': 'iW3yXk0_0xI',
  'society': '1529154061117-5def1cb3c8ba',
  'work': 'vZ0sBBmDs3A',
  'education': 'gcc4LsJtLcM',
  'health': 'X0aY-qxrlMQ',
  'medicine': 'G85VuTpw6jg',
  'art': '8HqP6J3l6Kk',
  'music': 'Y3K6hY9Z6wA',
  'writing': 'k2K7LH2wK0I',
  'creative': '6VBr9L1l0Hw',
  'silicon': 'qWfKJvBhVZ0',
  'ai': 'WNoLnJo7tS8',
};

const CATEGORY_IMAGES = {
  'silicon-voice': 'SqYmTDQYMjo',
  'tech-obs': 'WNoLnJo7tS8',
  'future-lens': '1446776811953-b23d57bd21aa',
  'human-memo': 'iW3yXk0_0xI',
};

function getCoverImage(tags, category) {
  for (const tag of (tags || [])) {
    const tl = tag.toLowerCase();
    for (const [key, photoId] of Object.entries(IMAGE_MAP)) {
      if (tl.includes(key) || key.includes(tl)) {
        return 'https://images.unsplash.com/photo-' + photoId + '?w=1200&h=630&fit=crop&auto=format&q=80';
      }
    }
  }
  const catId = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['silicon-voice'];
  return 'https://images.unsplash.com/photo-' + catId + '?w=1200&h=630&fit=crop&auto=format&q=80';
}

async function getFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let currentArray = [];
  for (const line of lines) {
    const arrayMatch = line.match(/^\s+-\s+"([^"]+)"\s*$/);
    if (arrayMatch) { currentArray.push(arrayMatch[1]); continue; }
    if (currentKey && currentArray.length > 0) { fm[currentKey] = currentArray; currentArray = []; }
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      let val = kvMatch[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      fm[currentKey] = val;
      currentKey = null;
    }
  }
  if (currentKey && currentArray.length > 0) fm[currentKey] = currentArray;
  return fm;
}

function insertKey(content, key, value) {
  // Already has it?
  if (new RegExp('^' + key + ':', 'm').test(content)) return content;
  // Insert after tags: block
  const tagsBlock = content.match(/^tags:\n((?:\s+-\s+.*\n)*)/m);
  if (tagsBlock) {
    const arrStr = Array.isArray(value) ? '\n' + value.map(v => '  - "' + v + '"').join('\n') : ' "' + value + '"';
    return content.replace(tagsBlock[0], tagsBlock[0] + key + ':' + arrStr + '\n');
  }
  // Insert after first line of frontmatter
  return content.replace(/^---\n/, '---\n' + key + ': "' + value + '"\n');
}

async function main() {
  const files = await readdir(POSTS_DIR);
  let updated = 0, skipped = 0;
  for (const file of files.filter(f => f.endsWith('.md'))) {
    const filePath = join(POSTS_DIR, file);
    let content = await readFile(filePath, 'utf-8');
    if (content.includes('coverImage:')) { skipped++; continue; }
    const fm = await getFrontmatter(content);
    const url = getCoverImage(fm.tags || [], fm.category || 'silicon-voice');
    const newContent = insertKey(content, 'coverImage', url);
    if (newContent !== content) {
      await writeFile(filePath, newContent);
      updated++;
      const photoId = url.match(/photo-(.{11})/)?.[1] || '?';
      console.log('✅ ' + file + ' → ' + photoId);
    } else {
      skipped++;
    }
  }
  console.log('\n📸 Done! Updated: ' + updated + ', Skipped: ' + skipped);
}

main().catch(console.error);
