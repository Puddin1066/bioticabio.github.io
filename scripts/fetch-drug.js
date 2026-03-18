/**
 * Fetches drug data from the Open Targets Platform GraphQL API
 * and writes combined JSON for drug-centric report generation.
 * Usage: node fetch-drug.js [chemblId]
 * Default chemblId: CHEMBL103 (Progesterone)
 */

import { GraphQLClient } from 'graphql-request';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const API_URL = 'https://api.platform.opentargets.org/api/v4/graphql';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadQuery(name) {
  const path = join(__dirname, 'queries', `${name}.graphql`);
  return readFileSync(path, 'utf8');
}

async function main() {
  const chemblId = process.argv[2] || 'CHEMBL103';
  const client = new GraphQLClient(API_URL);

  const drugQuery = loadQuery('drug-assessment');

  const result = await client.request(drugQuery, { chemblId });
  if (!result?.drug) {
    throw new Error(`No drug returned for ${chemblId}`);
  }

  const out = {
    _meta: { chemblId, fetchedAt: new Date().toISOString() },
    drug: result.drug,
  };

  const dataDir = join(__dirname, '..', '_data');
  mkdirSync(dataDir, { recursive: true });
  const outPath = join(dataDir, 'drug-result.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
