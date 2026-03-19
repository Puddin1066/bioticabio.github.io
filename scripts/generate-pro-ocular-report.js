/**
 * Generates the Pro-ocular evaluation report in Markdown from Open Targets disease data.
 * Reads _data/pro-ocular-result.json (run fetch-pro-ocular.js first) and writes
 * example/pro-ocular-evaluation-report.md (or --out path).
 *
 * Usage:
 *   node generate-pro-ocular-report.js
 *   node generate-pro-ocular-report.js --from-json _data/pro-ocular-result.json [--out example/pro-ocular-evaluation-report.md]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { buildMarkdown } from './pro-ocular-report-builder.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const defaultDataPath = join(rootDir, '_data', 'pro-ocular-result.json');
const defaultOutPath = join(rootDir, 'example', 'pro-ocular-evaluation-report.md');

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
    console.error('Run: node fetch-pro-ocular.js');
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

  if (!data.diseases && !data._meta) {
    console.error('JSON must contain .diseases and/or ._meta (run fetch-pro-ocular.js to populate _data/pro-ocular-result.json)');
    process.exit(1);
  }

  const baseUrl = '{{ site.baseurl }}';
  const markdown = buildMarkdown(data, baseUrl);

  writeFileSync(outPath, markdown, 'utf8');
  console.log(`Wrote ${outPath}`);
}

main();
