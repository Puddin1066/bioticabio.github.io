/**
 * Fetches Open Targets data for integrated report: progesterone, trigeminal pathway targets, dry eye.
 * Uses ontology translation table (dry eye EFO proxies, trigeminal gene symbols) first; optional mapIds/search to extend.
 * Writes _data/progesterone-trigeminal-dry-eye.json.
 * Usage: node fetch-progesterone-trigeminal-dry-eye.js
 */

import { GraphQLClient } from 'graphql-request';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const API_URL = 'https://api.platform.opentargets.org/api/v4/graphql';
const PROG_CHEMBL_ID = 'CHEMBL103';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, 'config', 'ontology-translation.json');

function loadQuery(name) {
  const path = join(__dirname, 'queries', `${name}.graphql`);
  return readFileSync(path, 'utf8');
}

function loadTranslation() {
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  } catch (e) {
    return { dry_eye: { efo_proxies: [] }, trigeminal_pathway: { gene_symbols: [] } };
  }
}

function extractDiseaseIdsFromMapIds(result) {
  const ids = new Set();
  const mappings = result?.mapIds?.mappings ?? [];
  for (const m of mappings) {
    for (const h of m.hits ?? []) {
      if (h.id && (h.entity === 'disease' || (h.object && h.object.id))) ids.add(h.id);
    }
  }
  return [...ids];
}

function extractDiseaseIdsFromSearch(result) {
  const ids = [];
  for (const h of result?.search?.hits ?? []) {
    if (h.id && (h.entity === 'disease' || (h.object && h.object.id && !h.object.approvedSymbol))) ids.push(h.id);
  }
  return ids;
}

function extractTargetIdsFromSearch(result) {
  const ids = [];
  for (const h of result?.search?.hits ?? []) {
    if (h.id && (h.entity === 'target' || (h.object && (h.object.approvedSymbol || h.object.id)))) ids.push(h.id);
  }
  return ids;
}

async function main() {
  const translation = loadTranslation();
  const dryEyeProxies = translation.dry_eye?.efo_proxies ?? [];
  const trigeminalSymbols = translation.trigeminal_pathway?.gene_symbols ?? ['TRPV1', 'TRPM8', 'SCN9A', 'CHRM3'];

  const client = new GraphQLClient(API_URL);
  const searchQuery = loadQuery('search-entities');
  const mapIdsQuery = loadQuery('map-ids');
  const targetSummaryQuery = loadQuery('target-summary');
  const diseaseDryEyeQuery = loadQuery('disease-dry-eye');
  const drugQuery = loadQuery('drug-assessment');

  // Dry eye: use EFO proxies from translation first; optionally extend via mapIds
  let dryEyeEfoIds = dryEyeProxies.map((p) => p.efoId).filter(Boolean);
  try {
    const mapResult = await client.request(mapIdsQuery, {
      queryTerms: translation.dry_eye?.search_terms_fallback ?? ['dry eye disease', 'keratoconjunctivitis sicca'],
      entityNames: ['disease'],
    });
    const fromMap = extractDiseaseIdsFromMapIds(mapResult);
    fromMap.forEach((id) => { if (!dryEyeEfoIds.includes(id)) dryEyeEfoIds.push(id); });
  } catch (_) {}
  if (dryEyeEfoIds.length === 0 && dryEyeProxies.length > 0) {
    dryEyeEfoIds = dryEyeProxies.map((p) => p.efoId);
  }

  // Trigeminal: resolve gene symbols to Ensembl IDs via search, then fetch targets
  const trigeminalTargetIds = [];
  for (const symbol of trigeminalSymbols) {
    try {
      const searchResult = await client.request(searchQuery, {
        queryString: symbol,
        entityNames: ['target'],
        page: { index: 0, size: 3 },
      });
      const ids = extractTargetIdsFromSearch(searchResult);
      const first = ids.find((id) => id.startsWith('ENSG'));
      if (first && !trigeminalTargetIds.includes(first)) trigeminalTargetIds.push(first);
    } catch (_) {}
  }

  // Drug
  let drug = null;
  try {
    const drugResult = await client.request(drugQuery, { chemblId: PROG_CHEMBL_ID });
    drug = drugResult?.drug ?? null;
  } catch (err) {
    console.warn('drug fetch failed:', err.message);
  }

  // Diseases for dry eye EFO IDs
  const diseases = {};
  for (const efoId of dryEyeEfoIds) {
    try {
      const result = await client.request(diseaseDryEyeQuery, { efoId });
      if (result?.disease) diseases[efoId] = result.disease;
    } catch (err) {
      console.warn(`disease ${efoId} fetch failed:`, err.message);
    }
  }

  // Target summaries for trigeminal proxy genes
  const targets = {};
  for (const ensemblId of trigeminalTargetIds) {
    try {
      const result = await client.request(targetSummaryQuery, { ensemblId });
      if (result?.target) targets[ensemblId] = result.target;
    } catch (err) {
      console.warn(`target ${ensemblId} fetch failed:`, err.message);
    }
  }

  const out = {
    _meta: {
      fetchedAt: new Date().toISOString(),
      translationSource: 'config/ontology-translation.json',
      dryEyeEfoIds,
      dryEyeProxyLabels: dryEyeProxies.map((p) => p.label).filter(Boolean),
      trigeminalGeneSymbols: trigeminalSymbols,
      trigeminalTargetIds,
      source: 'Open Targets Platform: ontology translation + drug, disease, target-summary',
    },
    drug,
    diseases,
    targets,
  };

  const dataDir = join(__dirname, '..', '_data');
  mkdirSync(dataDir, { recursive: true });
  const outPath = join(dataDir, 'progesterone-trigeminal-dry-eye.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
