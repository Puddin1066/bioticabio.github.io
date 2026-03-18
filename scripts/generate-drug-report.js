/**
 * Generates a drug-centric report in Markdown from Open Targets drug API data.
 * Reads _data/drug-result.json (run fetch-drug.js first) and writes
 * example/progesterone-report.md (or --out path).
 *
 * Usage:
 *   node generate-drug-report.js
 *   node generate-drug-report.js --from-json _data/drug-result.json [--out example/progesterone-report.md]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { buildMarkdown } from './drug-report-builder.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const defaultDataPath = join(rootDir, '_data', 'drug-result.json');
const defaultOutPath = join(rootDir, 'example', 'progesterone-report.md');

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
    console.error('Run: node fetch-drug.js [chemblId]  (e.g. CHEMBL103 for Progesterone)');
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

  if (!data.drug) {
    console.error('JSON must contain .drug (run fetch-drug.js to populate _data/drug-result.json)');
    process.exit(1);
  }

  const baseUrl = '{{ site.baseurl }}';
  const markdown = buildMarkdown(data, baseUrl);

  writeFileSync(outPath, markdown, 'utf8');
  console.log(`Wrote ${outPath}`);
}

main();
