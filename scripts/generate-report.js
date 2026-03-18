/**
 * Generates a pragmatic, commercial-oriented oncology target report in Markdown
 * from Open Targets API data. Reads _data/oncology-result.json (run fetch.js first)
 * and writes example/<symbol>-report.md or a path specified by --out.
 *
 * Usage:
 *   node generate-report.js [ensemblId]
 *   node generate-report.js --from-json _data/oncology-result.json [--out example/brca2-report.md]
 *
 * Default: reads _data/oncology-result.json, writes example/brca2-report.md
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { buildMarkdown } from './report-builder.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const defaultDataPath = join(rootDir, '_data', 'oncology-result.json');
const defaultOutPath = join(rootDir, 'example', 'brca2-report.md');

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
    console.error('Run: node fetch.js [ensemblId]  (e.g. ENSG00000139618 for BRCA2)');
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

  if (!data.target) {
    console.error('JSON must contain .target (run fetch.js to populate _data/oncology-result.json)');
    process.exit(1);
  }

  const baseUrl = '{{ site.baseurl }}';
  const markdown = buildMarkdown(data, baseUrl);

  writeFileSync(outPath, markdown, 'utf8');
  console.log(`Wrote ${outPath}`);
}

main();
