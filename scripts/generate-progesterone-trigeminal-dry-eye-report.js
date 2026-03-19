/**
 * Generates the progesterone / trigeminal / dry eye report from Open Targets data.
 * Reads _data/progesterone-trigeminal-dry-eye.json (run fetch-progesterone-trigeminal-dry-eye.js first).
 * Writes example/progesterone-trigeminal-dry-eye-report.md (or --out).
 *
 * Usage:
 *   node generate-progesterone-trigeminal-dry-eye-report.js
 *   node generate-progesterone-trigeminal-dry-eye-report.js --from-json _data/progesterone-trigeminal-dry-eye.json [--out example/progesterone-trigeminal-dry-eye-report.md]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { buildMarkdown } from './progesterone-trigeminal-dry-eye-report-builder.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const defaultDataPath = join(rootDir, '_data', 'progesterone-trigeminal-dry-eye.json');
const defaultOutPath = join(rootDir, 'example', 'progesterone-trigeminal-dry-eye-report.md');

function parseArgs() {
  const args = process.argv.slice(2);
  let dataPath = defaultDataPath;
  let outPath = defaultOutPath;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--from-json' && args[i + 1]) {
      dataPath = args[++i];
    } else if (args[i] === '--out' && args[i + 1]) {
      outPath = args[++i];
    }
  }
  return { dataPath, outPath };
}

function main() {
  const { dataPath, outPath } = parseArgs();

  if (!existsSync(dataPath)) {
    console.error(`Data file not found: ${dataPath}`);
    console.error('Run: node fetch-progesterone-trigeminal-dry-eye.js');
    process.exit(1);
  }

  const raw = readFileSync(dataPath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('Invalid JSON in', dataPath, e.message);
    process.exit(1);
  }

  const baseUrl = '{{ site.baseurl }}';
  const markdown = buildMarkdown(data, baseUrl);

  writeFileSync(outPath, markdown, 'utf8');
  console.log(`Wrote ${outPath}`);
}

main();
