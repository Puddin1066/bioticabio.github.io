/**
 * Display-rules layer for drug-centric reports: transforms Open Targets drug API
 * response into pragmatic, commercial-oriented Markdown (capped tables, Commercial take).
 */

const MAX_INDICATIONS = 7;
const MAX_TARGETS = 7;

function formatDrugName(name) {
  if (!name) return 'Drug';
  if (name === name.toUpperCase() && name.length > 1) return name.charAt(0) + name.slice(1).toLowerCase();
  return name;
}

function buildExecutiveSummary(drug) {
  const name = formatDrugName(drug.name) || 'Drug';
  const type = drug.drugType || '—';
  const desc = drug.description || '';
  const indCount = drug.indications?.count ?? 0;
  const mechRows = drug.mechanismsOfAction?.rows ?? [];
  const targetCount = mechRows.length;
  const bullets = [
    `**${name}** is a **${type}** with ${indCount} indication(s) in the Platform; description notes approved and investigational use.`,
    `**Current indications:** See table below (top ${Math.min(MAX_INDICATIONS, indCount)} of ${indCount}); spans reproductive, metabolic, neurological, and other therapeutic areas.`,
    `**Mechanism and targets:** ${targetCount > 0 ? `${targetCount} target(s) with mechanism data (e.g. ${mechRows[0]?.mechanismOfAction || mechRows[0]?.targetName || 'see table'}).` : 'Mechanism/target detail in Platform; steroid hormone (e.g. progesterone receptor).'}`,
    `**Repurposing angle:** Long off-patent; broad indication set supports repurposing and combination narratives (e.g. neuroprotection, TBI, cancer contexts).`,
    `**Commercial take:** Differentiate via formulation, indication expansion, or biomarker-led development; competitive landscape varies by indication.`,
  ];
  return bullets.map((b) => `- ${b}`).join('\n');
}

function buildDrugProfile(drug) {
  const name = formatDrugName(drug.name) || '—';
  const type = drug.drugType || '—';
  const desc = drug.description || '';
  const trades = (drug.tradeNames ?? []).slice(0, 5);
  const tradeStr = trades.length ? trades.join(', ') + (drug.tradeNames?.length > 5 ? ' (and others)' : '') : '—';
  let para = `**${name}** is a **${type}**. ${desc || 'Approved and investigational indications in the Platform.'} Trade names: ${tradeStr}.`;
  return para;
}

function buildTargets(drug) {
  const rows = (drug.mechanismsOfAction?.rows ?? []).slice(0, MAX_TARGETS);
  if (rows.length === 0) {
    return { paragraph: 'Target and mechanism detail can be explored in the Open Targets Platform (e.g. progesterone receptor for steroid hormones).', tableRows: [] };
  }
  const tableRows = rows.map((r) => {
    const targetName = r.targetName || (r.targets && r.targets[0]?.approvedName) || r.targets?.[0]?.approvedSymbol || '—';
    const mechanism = r.mechanismOfAction || r.actionType || '—';
    return { targetName, mechanism };
  });
  return {
    paragraph: `${rows.length} target(s) with mechanism data.`,
    tableRows,
  };
}

function buildIndications(drug) {
  const rows = (drug.indications?.rows ?? []).slice(0, MAX_INDICATIONS);
  return rows.map((r) => {
    const name = r.disease?.name ?? '—';
    const areas = (r.disease?.therapeuticAreas ?? []).map((a) => a.name).join('; ') || '—';
    return { name, areas };
  });
}


function buildRepurposingAngle(drug) {
  const indCount = drug.indications?.count ?? 0;
  const name = formatDrugName(drug.name) || 'this drug';
  return `With **${indCount}** indications in the Platform (approved and investigational), **${name}** has broad repurposing potential. Prioritise indications where evidence and unmet need align (e.g. neuroprotection, traumatic brain injury, or specific cancer contexts); use Platform disease and target data to assess competition per indication.`;
}

function buildMarkdown(data, baseUrl = '') {
  const drug = data.drug;
  const name = formatDrugName(drug.name) || 'Drug';
  const id = drug.id || '';

  const execSummary = buildExecutiveSummary(drug);
  const drugProfile = buildDrugProfile(drug);
  const targets = buildTargets(drug);
  const indicationRows = buildIndications(drug);
  const repurposing = buildRepurposingAngle(drug);

  const indicationTable = [
    '| Indication | Therapeutic area |',
    '|------------|------------------|',
    ...indicationRows.map((r) => `| ${r.name} | ${r.areas} |`),
  ].join('\n');

  const targetsSection =
    targets.tableRows.length > 0
      ? [
          '| Target | Mechanism |',
          '|--------|-----------|',
          ...targets.tableRows.map((r) => `| ${r.targetName} | ${r.mechanism} |`),
        ].join('\n')
      : targets.paragraph;

  const warnings = drug.drugWarnings ?? [];
  const warningNote =
    warnings.length > 0
      ? ` **Drug warnings:** ${warnings.map((w) => w.warningType || w.description).filter(Boolean).join('; ')} (see Platform for details).`
      : '';

  return `---
title: ${name} executive drug report
layout: default
parent: Example
nav_order: 2
description: Drug-centric assessment for ${name} — Biotica Bio example deliverable
---

# ${name}: Drug-Centric Assessment

This is an example Biotica Bio deliverable: a **drug-centric** assessment for **${name}**, generated from the Open Targets Platform API and interpreted for repurposing and commercial context. The data below is derived from the Platform's aggregated sources; the narrative and strategic synthesis are by Biotica Bio.
{: .lead }

{: .warning }
This assessment is for strategic and due-diligence use only; it does not constitute regulatory, medical, or investment advice.

For methodology, see [How it's built](${baseUrl}{% link how-its-built.md %}).

*Data: Open Targets Platform. Interpretation and narrative: Biotica Bio.*

---

**Drug:** ${name}  
**ChEMBL ID:** ${id}  
**Report source:** Open Targets Platform API (drug entity).  
**Audience:** Pharma / biotech strategy and R&D leadership
{: .report-meta }

---

## 1. Executive summary

${execSummary}

---

## 2. Drug profile

${drugProfile}${warningNote}

---

## 3. Where the drug is used (indications)

${indicationTable}

**Commercial take:** Focused indication strategy and repurposing potential; use Platform disease-level data to assess competition per indication.

---

## 4. Targets and mechanism

${targetsSection}

---

## 5. Repurposing and commercial angle

${repurposing}

**Commercial take:** Prioritise indications with strong evidence and manageable competition; leverage off-patent status for formulation and lifecycle strategies.

---

## 6. Data provenance and methodology

Report generated from the **Open Targets Platform GraphQL API** (\`https://api.platform.opentargets.org/api/v4/graphql\`). Query: drug-centric assessment (drug by chemblId: identity, mechanismsOfAction, indications, drugWarnings). Drug: ${name} (${id}). Re-run \`fetch-drug.js\` and \`generate-drug-report.js\` for this ChEMBL ID (or another) to refresh the report; interpretation and strategic narrative are by Biotica Bio.

---

*Data: Open Targets Platform. Interpretation and narrative: Biotica Bio. For methodology, see [How it's built](${baseUrl}{% link how-its-built.md %}).*
`;
}

export { buildMarkdown, buildExecutiveSummary, buildDrugProfile, buildTargets, buildIndications, buildRepurposingAngle };
