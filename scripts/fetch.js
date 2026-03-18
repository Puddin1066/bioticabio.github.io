/**
 * Fetches target and disease data from the Open Targets Platform GraphQL API
 * and writes combined JSON for report generation.
 * Usage: node fetch.js [ensemblId]
 * Default ensemblId: ENSG00000139618 (BRCA2)
 */

import { GraphQLClient } from 'graphql-request';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const API_URL = 'https://api.platform.opentargets.org/api/v4/graphql';

const INDICATION_EFO_IDS = [
  'EFO_0000305', // breast carcinoma
  'EFO_0000405', // ovarian carcinoma
  'EFO_0000615', // prostate cancer
  'EFO_0000616', // neoplasm
];

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadQuery(name) {
  const path = join(__dirname, 'queries', `${name}.graphql`);
  return readFileSync(path, 'utf8');
}

async function main() {
  const ensemblId = process.argv[2] || 'ENSG00000139618';
  const client = new GraphQLClient(API_URL);

  const targetQuery = loadQuery('oncology-target-assessment');
  const diseaseQuery = loadQuery('disease-landscape');

  const target = await client.request(targetQuery, { ensemblId });
  if (!target?.target) {
    throw new Error(`No target returned for ${ensemblId}`);
  }

  const diseases = {};
  for (const efoId of INDICATION_EFO_IDS) {
    const res = await client.request(diseaseQuery, { efoId });
    if (res?.disease) diseases[efoId] = res.disease;
  }

  const out = {
    _meta: { ensemblId, fetchedAt: new Date().toISOString() },
    target: target.target,
    diseases,
  };

  const dataDir = join(__dirname, '..', '_data');
  mkdirSync(dataDir, { recursive: true });
  const outPath = join(dataDir, 'oncology-result.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
