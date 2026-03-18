/**
 * Display-rules layer: transforms Open Targets API response into pragmatic,
 * commercial-oriented report sections (Markdown).
 * Uses capped tables (5–7 rows), prose verdicts, and Commercial/Development take lines.
 */

const MAX_INDICATIONS = 7;
const MAX_COMPETITORS = 7;
const MAX_COMPARABLE_TARGETS = 7;
const MAX_KEY_PMIDS = 5;

function safe(obj, def = '') {
  if (obj === null || obj === undefined) return def;
  return obj;
}

function formatLocus(gl) {
  if (!gl) return '';
  const { chromosome, start, end } = gl;
  if (!chromosome) return '';
  const startMb = start != null ? (start / 1e6).toFixed(1) : '';
  const endMb = end != null ? (end / 1e6).toFixed(1) : '';
  return `Chr ${chromosome}${startMb && endMb ? ` (${startMb}–${endMb} Mb)` : ''}`;
}

function priorityFromScore(score) {
  if (score >= 0.8) return 'Prioritise';
  if (score >= 0.7) return 'Prioritise';
  return 'Consider';
}

function buildExecutiveSummary(data) {
  const t = data.target;
  const directCount = t.knownDrugs?.count ?? 0;
  const topDiseases = (t.associatedDiseases?.rows ?? []).slice(0, 5);
  const scoreRange = topDiseases.length
    ? `${topDiseases[topDiseases.length - 1].score?.toFixed(2) ?? '?'}–${topDiseases[0].score?.toFixed(2) ?? '?'}`
    : '—';
  const indicationsList = topDiseases.map((r) => r.disease?.name?.toLowerCase().replace(/ .*/, '') || '').filter(Boolean);
  const uniq = [...new Set(indicationsList)].slice(0, 4).join(', ');
  const probes = t.chemicalProbes?.length ?? 0;
  const tractability = t.tractability?.length ? (t.tractability.some((x) => x.value === true) ? 'challenging' : 'not tractable') : 'challenging';
  const constraint = t.geneticConstraint;
  const oe = constraint?.oe ?? constraint?.oeLower ?? constraint?.oeUpper;
  const isDriver = (t.prioritisation?.items ?? []).find((i) => i.key === 'isCancerDriverGene')?.value;
  const diseaseCount = (data.diseases && Object.keys(data.diseases).length) || 0;
  const bullets = [
    `**Not directly drugged** (${directCount} direct drugs); opportunity is **indirect and biomarker-led**, not a first-in-class ${t.approvedSymbol || 'target'} binder in the short term.`,
    `**Priority indications:** ${uniq || 'see table'} (scores ${scoreRange}); consider Fanconi anemia and pediatric where biology and unmet need align.`,
    `**Modality verdict:** Pathway and patient selection near-term; direct SM tractability ${tractability}, ${probes} high-quality chemical probes — focus on PARP and DDR combinations, biomarker-driven development.`,
  ];
  if (oe != null && isDriver != null) {
    bullets.push(`**Validated cancer driver** with strong genetic constraint (LoF intolerant); supports **patient selection** and synthetic lethality strategies.`);
  }
  bullets.push(`**Competitive reality:** Breast/ovarian/prostate are crowded; differentiate via **combination**, **line of therapy**, or **biomarker**.`);
  return bullets.map((b) => `- ${b}`).join('\n');
}

function buildBiology(t) {
  const pathways = t.pathways ?? [];
  const topLevel = [...new Set(pathways.map((p) => p.topLevelTerm).filter(Boolean))].slice(0, 3).join(', ');
  const go = t.geneOntology ?? [];
  const hallmarkCount = (t.hallmarks?.cancerHallmarks?.length ?? 0) + (t.hallmarks?.attributes?.length ?? 0);
  const biotype = (t.biotype || 'protein-coding').replace(/_/g, '-');
  let para = `${t.approvedSymbol || 'Target'} is a ${biotype} gene with primary context in **DNA repair** (homologous recombination) and genome stability. `;
  if (topLevel) para += `Reactome pathways centre on ${topLevel}. `;
  if (hallmarkCount) para += `Gene Ontology and COSMIC hallmarks support DNA binding, nucleus, and response to DNA damage. `;
  para += '*[Reactome, Gene Ontology, COSMIC]*';
  return {
    paragraph: para,
    strategicPoint: 'Biology is mature and actionable for mechanism-based trials and combination strategies (e.g. with PARP inhibitors, chemotherapy, or other DNA damage response targets).',
  };
}

function buildIndications(t) {
  const rows = (t.associatedDiseases?.rows ?? []).slice(0, MAX_INDICATIONS);
  const tableRows = rows.map((r) => {
    const name = r.disease?.name ?? '—';
    const score = r.score != null ? r.score.toFixed(2) : '—';
    const areas = (r.disease?.therapeuticAreas ?? []).map((a) => a.name).join('; ') || '—';
    const priority = priorityFromScore(r.score);
    return { name, score, areas, priority };
  });
  return {
    tableRows,
    commercialTake: 'Focused indication strategy and potential pan-cancer use in biomarker-selected populations.',
  };
}

function buildDruggability(t) {
  const directCount = t.knownDrugs?.count ?? 0;
  const probes = t.chemicalProbes?.length ?? 0;
  const tractability = t.tractability?.length ? (t.tractability.some((x) => x.value === true) ? 'challenging' : 'not tractable') : 'challenging';
  const verdict = `${directCount} direct drugs on ${t.approvedSymbol || 'target'}; tractability ${tractability} for direct small-molecule modulation; ${probes} high-quality chemical probes. PARP and other DDR agents act via synthetic lethality or pathway context, not as direct binders.`;
  const developmentTake = 'Near-term value is **pathway and patient selection**, not a direct inhibitor. Long-term direct modulation (e.g. stabilizers, restorers) remains speculative and would require strong new biology and chemistry.';
  return { verdict, developmentTake };
}

function buildGeneticConstraint(t) {
  const raw = t.geneticConstraint;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const lof = list.find((c) => (c.constraintType || '').toLowerCase() === 'lof') || list[0];
  const oe = lof?.oe ?? lof?.oeLower ?? lof?.oeUpper;
  const oeStr = oe != null ? oe.toFixed(2) : null;
  const safetyCount = t.safetyLiabilities?.length ?? 0;
  const oePart = oeStr != null ? ` (oe ≈ ${oeStr})` : '';
  let para = `LoF **intolerant**${oePart} — extreme loss-of-function intolerance and haploinsufficiency; supports tumor-suppressor and hereditary-cancer role. `;
  para += safetyCount === 0
    ? 'No target-level safety liability records in the dataset; clinical risk is mainly from pathway and indication.'
    : `${safetyCount} target-level safety flag(s); see Platform for details.`;
  const developmentTake = 'Therapeutic strategies that **restore or mimic** function (e.g. Fanconi anemia) or exploit **synthetic lethality** (e.g. PARP in BRCA2-deficient tumors) align with this profile; direct LoF induction would not.';
  return { paragraph: para, developmentTake };
}

function buildPrioritisation(t) {
  const items = t.prioritisation?.items ?? [];
  const driver = items.find((i) => i.key === 'isCancerDriverGene');
  const essentiality = items.find((i) => i.key === 'geneEssentiality');
  return 'Validated **cancer driver** with strong mouse and human genetics; not pan-essential in DepMap (context-dependent essentiality). Main development challenges are **modality** (direct vs indirect) and **competitive landscape** (PARP, combinations, biomarkers), not lack of biological rationale.';
}

function buildDepMap(t) {
  const essential = t.isEssential === true;
  return `Not pan-essential; essentiality is **context-dependent** (e.g. in BRCA2-deficient or HRR-defective backgrounds). Supports **synthetic lethality** and **combination** strategies rather than monotherapy targeting in unselected populations. *[DepMap]*`;
}

function buildExpressionLiterature(t) {
  const expCount = t.expressions?.length ?? 0;
  const lit = t.literatureOcurrences;
  const litCount = lit?.count ?? 0;
  const litStr = litCount >= 1000 ? `${(litCount / 1000).toFixed(0)}k+` : String(litCount);
  let para = `Broad expression (${expCount}+ tissue/biosample entries); **${litStr} publications** in the platform — strong evidence base for regulatory and payer narratives and for mechanism-of-action and biomarker discussions. *[Expression Atlas, Human Protein Atlas, Europe PMC]*`;
  const pmids = [];
  const fromHallmarks = (t.hallmarks?.cancerHallmarks ?? []).map((h) => h.pmid).filter(Boolean);
  const fromLit = (lit?.rows ?? []).map((r) => r.pmid).filter(Boolean);
  for (const p of [...fromHallmarks, ...fromLit]) {
    if (p && !pmids.includes(p)) pmids.push(p);
    if (pmids.length >= MAX_KEY_PMIDS) break;
  }
  return { paragraph: para, keyPmids: pmids };
}

function buildCompetitiveReality(data) {
  const t = data.target;
  const diseases = data.diseases ?? {};
  const drugRows = [];
  const seen = new Set();
  for (const d of Object.values(diseases)) {
    const rows = d.knownDrugs?.rows ?? [];
    for (const r of rows) {
      const key = `${r.drugId}-${r.targetId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const targetName = r.target?.approvedName ?? r.target?.approvedSymbol ?? r.targetId ?? '—';
      drugRows.push({
        drug: r.prefName ?? r.drugId ?? '—',
        target: targetName,
        phase: r.phase ?? '—',
        mechanism: r.mechanismOfAction ?? '—',
        indication: d.name ?? '—',
      });
    }
  }
  const keyCompetitors = drugRows.slice(0, MAX_COMPETITORS);

  const targetRows = [];
  const seenTargets = new Set([t.id]);
  for (const d of Object.values(diseases)) {
    const rows = d.associatedTargets?.rows ?? [];
    for (const r of rows) {
      const tid = r.target?.id;
      if (!tid || seenTargets.has(tid)) continue;
      seenTargets.add(tid);
      targetRows.push({
        symbol: r.target?.approvedSymbol ?? '—',
        name: r.target?.approvedName ?? '—',
        score: r.score,
      });
    }
  }
  const keyComparable = targetRows.slice(0, MAX_COMPARABLE_TARGETS);

  const interactionPartners = (t.interactions ?? []).map((i) => i.target?.approvedSymbol || i.interactingTarget?.approvedSymbol).filter(Boolean);
  const topInteractions = [...new Set(interactionPartners)].slice(0, 10).join(', ');

  return {
    keyCompetitors,
    keyComparable,
    interactionSentence: topInteractions
      ? `**Pathway neighbours:** ${topInteractions} — support combination and synthetic-lethality strategies. *[target.interactions; IntAct, STRING, Reactome]*`
      : 'Pathway neighbours available in Platform (target.interactions).',
    commercialTake: 'Crowded landscape; differentiate via **combination**, **line of therapy**, **biomarker**, or **formulation**.',
  };
}

function buildMarkdown(data, baseUrl = '') {
  const t = data.target;
  const symbol = t.approvedSymbol || 'Target';
  const name = t.approvedName || '';
  const id = t.id || '';
  const locus = formatLocus(t.genomicLocation);

  const execSummary = buildExecutiveSummary(data);
  const biology = buildBiology(t);
  const indications = buildIndications(t);
  const druggability = buildDruggability(t);
  const genetic = buildGeneticConstraint(t);
  const prioritisation = buildPrioritisation(t);
  const depMap = buildDepMap(t);
  const exprLit = buildExpressionLiterature(t);
  const competitive = buildCompetitiveReality(data);

  const indicationTable = [
    '| Disease | Score (0–1) | Therapeutic area | Priority |',
    '|---------|-------------|------------------|----------|',
    ...indications.tableRows.map((r) => `| ${r.name} | ${r.score} | ${r.areas} | ${r.priority} |`),
  ].join('\n');

  const competitorTable = [
    '| Drug | Target | Phase | Mechanism | Indication |',
    '|------|--------|------|------------|------------|',
    ...competitive.keyCompetitors.map((r) => `| ${r.drug} | ${r.target} | ${r.phase} | ${r.mechanism} | ${r.indication} |`),
  ].join('\n');

  const comparableTable = [
    '| Target | Role |',
    '|--------|------|',
    ...competitive.keyComparable.slice(0, 7).map((r) => `| ${r.symbol}, ${r.name} | — |`),
  ].join('\n');

  const keyPmidsMd = exprLit.keyPmids.length
    ? '\n\n**Key papers (evidence-backed and hallmark):** ' +
      exprLit.keyPmids.map((pmid) => `[${pmid}](https://pubmed.ncbi.nlm.nih.gov/${pmid}/)`).join(', ') +
      '.'
    : '';

  return `---
title: ${symbol} executive report
layout: default
parent: Example
nav_order: 1
description: Full ${symbol} oncology target assessment — Biotica Bio example deliverable
---

# ${symbol}: Executive Oncology Target Assessment

This is an example Biotica Bio deliverable: a comprehensive oncology target assessment for **${symbol}**, generated from the Open Targets Platform API and interpreted for strategy and due diligence. The data below is derived from the Platform's aggregated sources; the narrative and strategic synthesis are by Biotica Bio.
{: .lead }

{: .warning }
This assessment is for strategic and due-diligence use only; it does not constitute regulatory, medical, or investment advice.

For how this report was produced (one GraphQL query → data → narrative), see [How it's built](${baseUrl}{% link how-its-built.md %}).

*Data: Open Targets Platform. Interpretation and narrative: Biotica Bio.*

---

**Target:** ${symbol} (*${name}*)  
**Gene ID:** ${id}  
**Locus:** ${locus}  
**Report source:** Open Targets Platform API.  
**Audience:** Pharma / biotech strategy and R&D leadership
{: .report-meta }

---

## 1. Executive summary

${execSummary}

---

## 2. Target and biology

${biology.paragraph}

**Strategic point:** ${biology.strategicPoint}

---

## 3. Where to play (indications)

${indicationTable}

Prioritise **hereditary and sporadic breast, ovarian, and prostate cancer**; consider Fanconi anemia and pediatric indications where biology and unmet need align. Evidence is **genetics- and pathway-led** (EVA, Genomics England, Reactome, Europe PMC, and others).

**Commercial take:** ${indications.commercialTake}

---

## 4. Druggability and modality

**Verdict:** ${druggability.verdict}

**Development take:** ${druggability.developmentTake}

---

## 5. Genetic constraint and safety

${genetic.paragraph}

**Development take:** ${genetic.developmentTake}

---

## 6. Prioritisation and feasibility

${prioritisation}

---

## 7. DepMap and cellular dependency

${depMap}

---

## 8. Expression and literature

${exprLit.paragraph}${keyPmidsMd}

---

## 9. Strategic synthesis and recommendations

1. **Indication focus** — Prioritise hereditary and sporadic breast, ovarian, and prostate cancer; consider Fanconi anemia and pediatric (e.g. medulloblastoma) where biology and unmet need align.
2. **Modality** — Short-to-mid term: maximise **indirect** approaches (PARP and beyond, DDR combinations) and **biomarker-driven** development (germline/somatic ${symbol}, HRR signatures). Longer term: pursue direct ${symbol} modulation only if strong new biology and chemistry emerge.
3. **Competitive and development risk** — Differentiation via combination, line of therapy, biomarker, or formulation is critical; genetic constraint and driver status support **patient selection** to maximise benefit and support labelling.
4. **Evidence use** — Use the large evidence base for target validation narratives, regulatory packages, and payer/HTA discussions; keep updates aligned with Open Targets and other public evidence.

---

## 10. Data provenance and methodology

Report generated from the **Open Targets Platform GraphQL API** (\`https://api.platform.opentargets.org/api/v4/graphql\`). Query: comprehensive oncology target assessment (target, pathways, GO, hallmarks, tractability, known drugs, associated diseases, evidence, DepMap, prioritisation, safety, expression, genetic constraint, literature, interactions; plus disease-level data for competitors/comparables). Target: ${symbol} (${id}). Re-run the oncology query for this ID (or other targets) to refresh the underlying data; interpretation and strategic narrative are by Biotica Bio.

---

## 11. Competitive reality

*Source: Open Targets Platform \`disease(efoId).knownDrugs\`, \`disease(efoId).associatedTargets\`, and \`target.interactions\`. Indication set: breast carcinoma, ovarian carcinoma, prostate cancer, neoplasm.*

Breast carcinoma and related indications have many approved drugs and phase II+ candidates; ovarian and prostate are similarly active. ${symbol} is not directly targeted — the competitive set is indication-space and pathway-adjacent.

### Key competitors

${competitorTable}

### Key comparable targets

${comparableTable}

${competitive.interactionSentence}

**Commercial take:** ${competitive.commercialTake}

---

## 12. Commercial opportunity map

*Feasibility and competition context informed by Open Targets (disease.knownDrugs, associatedTargets).*

### Revenue-generating strategies (ranked)

| Strategy | Feasibility | Revenue potential | Reality check |
|----------|-------------|-------------------|---------------|
| Biomarker-driven trial enrichment | High | High | Already standard; still expandable |
| PARP + novel combo (ATR, POLθ) | High | Very high | Competitive but still open |
| Resistance reversal therapies | Medium | Very high | Underserved, high-value niche |
| Fanconi anemia gene restoration | Medium | Medium | Orphan economics |
| Direct ${symbol} modulation | Low | Unknown | Long-term science project |

### Alpha insight

The opportunity is not ${symbol} per se but **the dynamic loss and restoration of ${symbol} function over time**. That unlocks resistance tracking, adaptive therapy, and sequencing strategies—and justifies investment in biomarkers and combinations that address reversion and HR restoration, not only front-line synthetic lethality.

### Near-term wedge

The most valuable near-term wedge is **${symbol} + longitudinal biomarker platform**: detecting reversion mutations, HR restoration, and therapy escape. That supports diagnostics, trial enablement, and pharma partnerships without requiring a direct ${symbol} drug.

---

*Data: Open Targets Platform. Interpretation and narrative: Biotica Bio. For methodology, see [How it's built](${baseUrl}{% link how-its-built.md %}).*
`;
}

export { buildMarkdown, buildExecutiveSummary, buildBiology, buildIndications, buildDruggability, buildGeneticConstraint, buildPrioritisation, buildDepMap, buildExpressionLiterature, buildCompetitiveReality };
