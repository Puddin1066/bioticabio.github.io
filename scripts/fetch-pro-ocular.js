/**
 * Fetches Open Targets disease data for Pro-ocular (Signal12) indication evaluation:
 * dry eye, Sjögren syndrome, graft-versus-host disease.
 * Writes _data/pro-ocular-result.json for the Pro-ocular report generator.
 * Usage: node fetch-pro-ocular.js
 */

import { GraphQLClient } from 'graphql-request';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const API_URL = 'https://api.platform.opentargets.org/api/v4/graphql';

// Pro-ocular indication EFO IDs (validate in Platform if missing: https://platform.opentargets.org)
const PRO_OCULAR_INDICATION_EFO_IDS = [
  { efoId: 'EFO_1001180', label: 'dry eye / keratoconjunctivitis sicca' },
  { efoId: 'EFO_0000699', label: 'Sjögren syndrome' },
  { efoId: 'EFO_0002363', label: 'graft-versus-host disease' },
];

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadQuery(name) {
  const path = join(__dirname, 'queries', `${name}.graphql`);
  return readFileSync(path, 'utf8');
}

async function main() {
  const client = new GraphQLClient(API_URL);
  const diseaseQuery = loadQuery('disease-landscape');

  const diseases = {};
  const indicationEfoIds = [];

  for (const { efoId, label } of PRO_OCULAR_INDICATION_EFO_IDS) {
    try {
      const result = await client.request(diseaseQuery, { efoId });
      if (result?.disease) {
        diseases[efoId] = result.disease;
        indicationEfoIds.push(efoId);
      } else {
        console.warn(`No disease returned for ${efoId} (${label}); skipping.`);
      }
    } catch (err) {
      console.warn(`Failed to fetch ${efoId} (${label}):`, err.message);
    }
  }

  const out = {
    _meta: {
      fetchedAt: new Date().toISOString(),
      indicationEfoIds,
      source: 'Open Targets Platform disease(efoId) for Pro-ocular indication evaluation',
    },
    diseases,
  };

  const dataDir = join(__dirname, '..', '_data');
  mkdirSync(dataDir, { recursive: true });
  const outPath = join(dataDir, 'pro-ocular-result.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
