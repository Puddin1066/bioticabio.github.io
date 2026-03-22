# Report generator

Generates pragmatic, commercial-oriented oncology target reports from the [Open Targets Platform](https://api.platform.opentargets.org/api/v4/graphql) GraphQL API. The same display rules (capped tables, prose verdicts, Commercial/Development take lines) are applied so reports stay consistent and refreshable.

## Prerequisites

- Node.js 18+ (for native `fetch` and ES modules)
- `npm install` in this directory

## Usage

### 1. Fetch data from the API

```bash
cd scripts
npm install
node fetch.js [ensemblId]
```

- **Default `ensemblId`:** `ENSG00000139618` (BRCA2)
- Writes `_data/oncology-result.json` (target + disease landscape for breast, ovarian, prostate, neoplasm)

Example for another target:

```bash
node fetch.js ENSG00000012048
```

### 2. Generate the report

```bash
node generate-report.js
```

- Reads `_data/oncology-result.json`
- Applies display rules (see plan: Phase 1 structure, capped tables, verdicts, Commercial take)
- Writes `example/brca2-report.md` (Jekyll-ready Markdown with front matter)

Options:

```bash
node generate-report.js --from-json _data/oncology-result.json --out example/brca2-report.md
```

### One-shot (fetch then generate)

```bash
node fetch.js ENSG00000139618 && node generate-report.js
```

## Files

| File | Purpose |
|------|--------|
| `queries/oncology-target-assessment.graphql` | Target-centric query (pathways, GO, hallmarks, tractability, known drugs, associated diseases, evidence, DepMap, prioritisation, safety, expression, genetic constraint, literature) |
| `queries/disease-landscape.graphql` | Disease-level query for key indications (knownDrugs, associatedTargets) |
| `fetch.js` | Calls the API with both queries; writes combined JSON to `_data/oncology-result.json` |
| `report-builder.js` | Display-rules layer: transforms API JSON into report sections (exec summary, indications, druggability, competitive reality, etc.) and full Markdown |
| `generate-report.js` | Reads JSON, runs report builder, writes Markdown to `example/brca2-report.md` (or `--out`) |

## Data flow

1. **Fetch:** `fetch.js` → Open Targets API (target + 4 disease EFO IDs) → `_data/oncology-result.json`
2. **Build:** `generate-report.js` → read JSON → `report-builder.js` (display rules) → Markdown string
3. **Output:** Write to `example/brca2-report.md`; Jekyll builds it as part of the site.

## Regenerating after API updates

Re-run fetch then generate so the example report reflects the latest Platform data:

```bash
node fetch.js ENSG00000139618 && node generate-report.js
```

Then commit the updated `example/brca2-report.md` if desired.

---

## Drug-centric report

A **drug-centric** report uses the Open Targets **drug** entity (ChEMBL ID) as the primary subject: indications, targets, mechanism, and repurposing context. Default example: **Progesterone** (CHEMBL103).

### Fetch drug data

```bash
node fetch-drug.js [chemblId]
```

- **Default `chemblId`:** `CHEMBL103` (Progesterone)
- Writes `_data/drug-result.json`

### Generate drug report

```bash
node generate-drug-report.js
```

- Reads `_data/drug-result.json`
- Writes `example/progesterone-report.md` (or `--out` path)

Options:

```bash
node generate-drug-report.js --from-json _data/drug-result.json --out example/progesterone-report.md
```

### One-shot (drug)

```bash
node fetch-drug.js CHEMBL103 && node generate-drug-report.js
```

### Drug pipeline files

| File | Purpose |
|------|--------|
| `queries/drug-assessment.graphql` | Drug query by chemblId (identity, mechanismsOfAction, indications, drugWarnings) |
| `fetch-drug.js` | Calls the API; writes `_data/drug-result.json` |
| `drug-report-builder.js` | Display-rules layer for drug reports (exec summary, profile, indications, targets, repurposing) |
| `generate-drug-report.js` | Reads JSON, runs drug report builder, writes `example/progesterone-report.md` (or `--out`) |

---

## Pro-ocular evaluation report

A **Pro-ocular (Signal12) evaluation** report uses the Open Targets **disease** entity for the indications Pro-ocular targets: dry eye, Sjögren syndrome, and graft-versus-host disease. It summarizes indication space, competitive landscape (knownDrugs), target/mechanism landscape (associatedTargets), and commercial/R&D relevance. Pro-ocular is not in the Platform; the report evaluates the indication and competitive space from the API and adds curated Pro-ocular context.

### Fetch Pro-ocular indication data

```bash
node fetch-pro-ocular.js
```

- Uses three fixed indication EFO IDs (dry eye, Sjögren, GVHD); reuses `queries/disease-landscape.graphql`
- Writes `_data/pro-ocular-result.json`

### Generate Pro-ocular report

```bash
node generate-pro-ocular-report.js
```

- Reads `_data/pro-ocular-result.json`
- Writes `example/pro-ocular-evaluation-report.md` (or `--out` path)

Options:

```bash
node generate-pro-ocular-report.js --from-json _data/pro-ocular-result.json --out example/pro-ocular-evaluation-report.md
```

### One-shot (Pro-ocular)

```bash
node fetch-pro-ocular.js && node generate-pro-ocular-report.js
```

### Pro-ocular pipeline files

| File | Purpose |
|------|--------|
| `queries/disease-landscape.graphql` | Disease query by efoId (knownDrugs, associatedTargets); reused for Pro-ocular |
| `fetch-pro-ocular.js` | Calls the API for each of three indication EFO IDs; writes `_data/pro-ocular-result.json` |
| `pro-ocular-report-builder.js` | Builds Pro-ocular evaluation Markdown (indication space, competitive/target landscape, commercial/R&D, provenance) |
| `generate-pro-ocular-report.js` | Reads JSON, runs report builder, writes `example/pro-ocular-evaluation-report.md` (or `--out`) |

---

## Progesterone, trigeminal targets & dry eye report

An **integrated** report that evaluates **progesterone** (drug), **trigeminal nerve–related targets** (genes), and **dry eye disease** (indication) using the Open Targets Platform. It uses **search** and **mapIds** to resolve dry eye EFO IDs and trigeminal target Ensembl IDs, then fetches drug (CHEMBL103), disease(s), and target summaries.

**API pipeline:** The same report is generated by the Report API (`POST /reports`, report type `integrated-thesis`) using `@biotica/report-engine`. The API pipeline includes **data-backed benchmarks** in every applicable section (drug indication count; indication known drugs and associated targets; target known drugs and diseases) so reports can be compared across runs or candidates. The script below is a standalone builder; for benchmark-rich output use the API.

### Fetch data

```bash
node fetch-progesterone-trigeminal-dry-eye.js
```

- Resolves dry eye via `mapIds` (terms: dry eye disease, keratoconjunctivitis sicca, dry eye); falls back to `search` if needed
- Resolves trigeminal targets via `search` (query: "trigeminal"), then fetches target summaries
- Fetches progesterone (drug) and dry eye disease(efoId) for resolved EFO IDs
- Writes `_data/progesterone-trigeminal-dry-eye.json`

### Generate report

```bash
node generate-progesterone-trigeminal-dry-eye-report.js
```

- Reads `_data/progesterone-trigeminal-dry-eye.json`
- Writes `example/progesterone-trigeminal-dry-eye-report.md` (or `--out` path)

Options:

```bash
node generate-progesterone-trigeminal-dry-eye-report.js --from-json _data/progesterone-trigeminal-dry-eye.json --out example/progesterone-trigeminal-dry-eye-report.md
```

### One-shot

```bash
node fetch-progesterone-trigeminal-dry-eye.js && node generate-progesterone-trigeminal-dry-eye-report.js
```

### Pipeline files

| File | Purpose |
|------|--------|
| `queries/search-entities.graphql` | Full-text search for entity resolution |
| `queries/map-ids.graphql` | Map free-text terms to canonical IDs |
| `queries/target-summary.graphql` | Lightweight target (pathways, knownDrugs, associatedDiseases) |
| `queries/disease-dry-eye.graphql` | Disease with description, parents, larger knownDrugs/associatedTargets |
| `queries/drug-assessment.graphql` | Drug by chemblId (reused) |
| `fetch-progesterone-trigeminal-dry-eye.js` | mapIds/search then drug + disease(s) + target(s); writes JSON |
| `progesterone-trigeminal-dry-eye-report-builder.js` | Builds integrated Markdown (progesterone, dry eye, trigeminal, integration, provenance) |
| `generate-progesterone-trigeminal-dry-eye-report.js` | Reads JSON, runs builder, writes report |

---

## Search Console SEO checks

From repository root, run the Search Console helper to pull top queries and top pages:

```bash
npm run gsc:top-queries -- --site "https://bioticabio.com/" --days 28 --rows 50
```

For URL-prefix properties:

```bash
npm run gsc:top-queries -- --site "https://bioticabio.com/" --days 28 --rows 50
```

Use this output in the weekly loop documented in `docs/seo-ops-playbook.md`.

### List properties your OAuth user can access

If you see `User does not have sufficient permission for site '…'`, your `--site` string must match a property **and** your Google account must be a Search Console user on that property.

```bash
npm run gsc:list-sites
```

Copy a listed `siteUrl` exactly (including `sc-domain:` vs `https://` and any trailing slash) into `--site`.

### Persist monthly metrics and summary

Generate a monthly artifact pair (JSON + Markdown) under `docs/seo/metrics/`:

```bash
npm run seo:monthly
```

Default site is `https://bioticabio.com/` (URL-prefix property). Override:

```bash
GSC_SITE="sc-domain:bioticabio.com" npm run seo:monthly
```

This creates:

- `docs/seo/metrics/gsc-YYYY-MM.json`
- `docs/seo/metrics/gsc-YYYY-MM.md`

The Markdown report includes:

- top consulting-intent queries
- top person/entity queries (John Round variants)
- low-CTR optimization candidates
- top pages by impressions
