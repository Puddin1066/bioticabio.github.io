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
