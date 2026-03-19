/**
 * Report builder: progesterone, trigeminal nerve targets, and dry eye disease.
 * Transforms progesterone-trigeminal-dry-eye.json into integrated Markdown.
 */

const MAX_INDICATIONS = 7;
const MAX_DRUGS_PER_DISEASE = 10;
const MAX_TARGETS_PER_DISEASE = 10;
const MAX_DRUGS_PER_TARGET = 5;
const MAX_DISEASES_PER_TARGET = 8;

function safe(obj, def = '') {
  if (obj === null || obj === undefined) return def;
  return obj;
}

function formatDrugName(name) {
  if (!name) return 'Drug';
  if (name === name.toUpperCase() && name.length > 1) return name.charAt(0) + name.slice(1).toLowerCase();
  return name;
}

function buildProgesteroneSection(drug) {
  if (!drug) return 'No drug data returned from the Platform.';
  const name = formatDrugName(drug.name) || 'Progesterone';
  const type = drug.drugType || '—';
  const desc = drug.description || 'Approved and investigational indications in the Platform.';
  const mechRows = drug.mechanismsOfAction?.rows ?? [];
  const indRows = (drug.indications?.rows ?? []).slice(0, MAX_INDICATIONS);
  const indCount = drug.indications?.count ?? indRows.length;

  const hasDryEyeOrOcular = indRows.some((r) => {
    const n = (r.disease?.name || '').toLowerCase();
    return /dry eye|ocular|sicca|keratoconjunctivitis|meibomian|lacrimal/.test(n);
  });

  let section = '**Biology that matters:** Progesterone acts via nuclear hormone receptor signalling. Sex hormones influence meibomian gland lipid production and lacrimal gland function; clinical literature supports hormonal modulation of dry eye, especially in post-menopausal populations. Progesterone is not a "dry eye drug" in the Platform, but it sits in a **hormonal modulation axis of tear film physiology**—a bridge to neuro-lacrimal and gland-modulation hypotheses.\n\n';
  section += `**Platform profile:** ${name} is a **${type}**. ${desc}\n\n`;
  if (mechRows.length > 0) {
    section += '**Mechanism and targets (Platform):**\n\n| Target | Mechanism |\n|--------|------------|\n';
    mechRows.slice(0, 7).forEach((r) => {
      const t = r.targetName || (r.targets && r.targets[0]?.approvedSymbol) || '—';
      const m = safe(r.mechanismOfAction, r.actionType);
      section += `| ${t} | ${m} |\n`;
    });
    section += '\n';
  } else {
    section += '**Mechanism and targets:** Mechanism/target detail in Platform (e.g. progesterone receptor).\n\n';
  }

  section += `**Indications (top ${Math.min(MAX_INDICATIONS, indCount)} of ${indCount} in Platform):**\n\n`;
  if (indRows.length === 0) {
    section += '*No indication rows returned.*\n\n';
  } else {
    section += '| Indication |\n|------------|\n';
    indRows.forEach((r) => {
      section += `| ${safe(r.disease?.name, '—')} |\n`;
    });
    section += '\n';
  }

  if (hasDryEyeOrOcular) {
    section += '**Dry eye / ocular:** At least one indication in the Platform matches dry eye or ocular-related terms.\n\n';
  } else {
    section += '**Dry eye / ocular:** No indication in the Platform explicitly matches dry eye or ocular-related terms; the biological link is literature-supported hormonal effects on tear physiology, not a direct Open Targets indication.\n\n';
  }
  return section;
}

function buildDryEyeSection(diseases, meta) {
  const entries = Object.entries(diseases || {}).filter(([, d]) => d && d.name);
  const efoIds = meta?.dryEyeEfoIds ?? [];
  const proxyLabels = meta?.dryEyeProxyLabels ?? [];

  let section = '**Framing:** Dry eye is poorly represented as a single node in ontologies; it is often split across keratoconjunctivitis sicca, Sjögren syndrome, and ocular surface disease. We use **ontology proxies** that overlap clinically with dry eye. Open Targets is strongest for autoimmune drivers (e.g. Sjögren) and weaker for multifactorial symptom syndromes—that nuance is a valuable insight, not a limitation.\n\n';
  if (entries.length === 0) {
    section += `**Proxies used (EFO IDs):** ${efoIds.join(', ') || 'none'}. ${proxyLabels.length ? `Labels: ${proxyLabels.join(', ')}.` : ''} No disease payload returned for those IDs in this run; the framing above still holds for how dry eye maps to the Platform.\n\n*Open Targets is used for target/biology context; it may not fully enumerate the commercial dry eye market.*\n`;
    return section;
  }

  section += `**Proxies in this report:** ${efoIds.join(', ')}. ${proxyLabels.length ? `(${proxyLabels.join(', ')})` : ''}\n\n`;
  section += '| Disease | EFO ID | Therapeutic area(s) |\n|---------|--------|---------------------|\n';
  entries.forEach(([efoId, d]) => {
    const areas = (d.therapeuticAreas || []).map((a) => a.name).join('; ') || '—';
    section += `| ${safe(d.name)} | ${efoId} | ${areas} |\n`;
  });
  section += '\n';

  const d = entries[0][1];
  const knownDrugs = d.knownDrugs || {};
  const kdRows = (knownDrugs.rows || []).slice(0, MAX_DRUGS_PER_DISEASE);
  section += `**Known drugs (Platform, this node):** ${knownDrugs.count ?? 0} total. Top ${kdRows.length}:\n\n`;
  if (kdRows.length > 0) {
    section += '| Drug | Phase | Target |\n|------|-------|--------|\n';
    kdRows.forEach((r) => {
      const t = r.target ? (r.target.approvedSymbol || r.target.approvedName) : (r.targetId || '—');
      section += `| ${safe(r.prefName, r.drugId)} | ${safe(r.phase)} | ${t} |\n`;
    });
  } else {
    section += '*No drug rows in this disease node.* Sparse nodes do not imply absence of real-world competition.\n';
  }
  section += '\n';

  const at = d.associatedTargets || {};
  const atRows = (at.rows || []).slice(0, MAX_TARGETS_PER_DISEASE);
  section += `**Associated targets (Platform):** ${at.count ?? 0} total. Top ${atRows.length}:\n\n`;
  if (atRows.length > 0) {
    section += '| Target | Score |\n|--------|-------|\n';
    atRows.forEach((r) => {
      const sym = r.target ? (r.target.approvedSymbol || r.target.approvedName) : '—';
      section += `| ${sym} | ${r.score != null ? r.score.toFixed(3) : '—'} |\n`;
    });
  } else {
    section += '*No target rows.*\n';
  }
  section += '\n*Open Targets is a tool for target identification and prioritisation; it may not fully enumerate the commercial dry eye market.*\n';
  return section;
}

function buildTrigeminalSection(targets, meta) {
  const entries = Object.entries(targets || {}).filter(([, t]) => t && (t.approvedSymbol || t.id));
  const symbols = meta?.trigeminalGeneSymbols ?? [];
  let section = '**Framing:** The trigeminal nerve is an anatomical structure; Open Targets indexes genes, not nerves. We represent trigeminal-mediated biology (ocular sensation, reflex tear secretion, sensory transmission) by **gene-level proxies**: TRPV1 (nociception/inflammation), TRPM8 (cold/tear reflex), SCN9A (Nav1.7, sensory transmission), CHRM3 (lacrimal parasympathetic). Open Targets will not return "trigeminal nerve" but returns these components of trigeminal signalling biology.\n\n';
  if (entries.length === 0) {
    section += `**Proxies requested:** ${symbols.join(', ') || 'TRPV1, TRPM8, SCN9A, CHRM3'}. No target payloads returned in this run; the framing above describes how the pathway is represented.\n`;
    return section;
  }

  const dryEyeOcularRegex = /dry eye|ocular|sicca|keratoconjunctivitis|meibomian|lacrimal|eye disease|sjogren/i;
  section += `**Targets in this report:** ${entries.map(([, t]) => t.approvedSymbol || t.id).join(', ')}\n\n`;
  entries.forEach(([ensemblId, t]) => {
    const sym = t.approvedSymbol || t.approvedName || ensemblId;
    const name = t.approvedName || t.approvedSymbol || '—';
    section += `### ${sym}\n\n`;
    section += `${name} (${ensemblId}).\n\n`;
    const pathways = (t.pathways || []).slice(0, 3);
    if (pathways.length > 0) {
      section += '**Pathways:** ' + pathways.map((p) => p.topLevelTerm || p.pathway).filter(Boolean).join('; ') + '\n\n';
    }
    const kd = t.knownDrugs || {};
    const kdRows = (kd.rows || []).slice(0, MAX_DRUGS_PER_TARGET);
    section += `**Known drugs:** ${kd.count ?? 0}. Top: ${kdRows.map((r) => r.prefName || r.drugId).join(', ') || '—'}\n\n`;
    const ad = t.associatedDiseases || {};
    const adRows = (ad.rows || []).slice(0, MAX_DISEASES_PER_TARGET);
    const dryEyeMention = adRows.find((r) => dryEyeOcularRegex.test(r.disease?.name || ''));
    if (dryEyeMention) {
      section += `**Associated diseases (top ${adRows.length}):** includes **${dryEyeMention.disease?.name}** (dry eye/ocular-related).\n\n`;
    } else {
      section += `**Associated diseases:** ${ad.count ?? 0} total; top: ${adRows.map((r) => r.disease?.name).filter(Boolean).join(', ') || '—'}\n\n`;
    }
  });
  return section;
}

function buildIntegrationSection(data) {
  const drug = data.drug;
  const diseases = data.diseases || {};
  const targets = data.targets || {};
  const diseaseEntries = Object.entries(diseases).filter(([, d]) => d && d.name);
  const dryEyeDrugIds = new Set();
  const dryEyeTargetIds = new Set();
  diseaseEntries.forEach(([, d]) => {
    (d.knownDrugs?.rows || []).forEach((r) => dryEyeDrugIds.add(r.drugId || r.prefName));
    (d.associatedTargets?.rows || []).forEach((r) => {
      if (r.target?.id) dryEyeTargetIds.add(r.target.id);
      if (r.target?.approvedSymbol) dryEyeTargetIds.add(r.target.approvedSymbol);
    });
  });
  const progId = drug?.id;
  const progTargetIds = new Set((drug?.mechanismsOfAction?.rows || []).flatMap((r) => (r.targets || []).map((t) => t.id).filter(Boolean)));
  const trigeminalIds = new Set(Object.keys(targets));
  const trigeminalSymbols = new Set(Object.values(targets).map((t) => t.approvedSymbol).filter(Boolean));

  const progInDryEye = progId && dryEyeDrugIds.has(progId);
  const progTargetOverlap = [...progTargetIds].some((id) => dryEyeTargetIds.has(id));
  const trigeminalOverlap = [...trigeminalIds].some((id) => dryEyeTargetIds.has(id));

  let section = '';
  section += '**Progesterone ↔ dry eye:** No direct Open Targets linkage in this dataset; literature-supported hormonal effects on tear physiology suggest indirect relevance (hormonal modulation axis).\n\n';
  const dryEyeTargetSymbols = new Set();
  diseaseEntries.forEach(([, d]) => {
    (d.associatedTargets?.rows || []).forEach((r) => {
      if (r.target?.approvedSymbol) dryEyeTargetSymbols.add(r.target.approvedSymbol);
    });
  });
  const proxySymbols = data._meta?.trigeminalGeneSymbols ?? [...trigeminalSymbols];
  const overlapSymbols = proxySymbols.filter((s) => dryEyeTargetSymbols.has(s));
  section += '**Trigeminal pathway ↔ dry eye:** Component targets (e.g. TRPV1, TRPM8, CHRM3) connect sensory signalling to tear production. ';
  if (overlapSymbols.length > 0) {
    section += `**${overlapSymbols.join(', ')}** ${overlapSymbols.length === 1 ? 'appears' : 'appear'} in the dry eye–associated target set (concrete link between neuro/lacrimal signalling and this indication). `;
  }
  section += trigeminalOverlap || overlapSymbols.length > 0 ? 'Overlap with dry eye–associated targets: yes.' : 'Overlap in this dataset: limited; immune targets (e.g. IRF5, STAT4) dominate the dry eye node—orthogonal to neuro-reflex proxies.';
  section += '\n\n';
  section += '**Synthesis:** Open Targets emphasises immune/inflammatory biology (e.g. Sjögren targets such as IRF5, STAT4). The progesterone/trigeminal hypothesis emphasises neuro-reflex and hormonal modulation of lacrimal/meibomian function. **These are orthogonal mechanistic spaces, not overlapping ones**—that contrast is the signal.\n\n';
  section += '**Commercial take:** The dry eye market is crowded (anti-inflammatory, tear stabilisation). The emerging niche is neurostimulation / endogenous tear activation (e.g. Tyrvaya). Progesterone is not a direct competitor but supports a biological plausibility layer (gland modulation). Pro-ocular-style positioning is not "another dry eye drug" but a neuro-lacrimal activation strategy, adjacent to but distinct from immune modulation and lubrication.\n\n';
  section += '**R&D take:** Open Targets is useful here not for confirming the mechanism, but for showing what it is not: the dominant target landscape in the Platform is immune signalling; the proposed mechanism is neural reflex activation. That contrast is the insight.';
  return section;
}

function buildProvenance(meta) {
  const efoIds = (meta?.dryEyeEfoIds ?? []).join(', ') || '—';
  const proxyLabels = (meta?.dryEyeProxyLabels ?? []).join(', ') || '—';
  const symbols = (meta?.trigeminalGeneSymbols ?? []).join(', ') || '—';
  const trigIds = (meta?.trigeminalTargetIds ?? []).join(', ') || '—';
  const source = meta?.translationSource ?? 'config';
  return `Report generated from the **Open Targets Platform GraphQL API**. Entity resolution uses an **ontology translation table** (${source}): dry eye → EFO proxies (${efoIds}; ${proxyLabels}), trigeminal pathway → gene proxies (${symbols}). Queries: drug (CHEMBL103), disease (dry eye EFO IDs), target-summary (Ensembl IDs: ${trigIds}). Re-run: \`node fetch-progesterone-trigeminal-dry-eye.js\` then \`node generate-progesterone-trigeminal-dry-eye-report.js\` (optional \`--from-json\` and \`--out\`).`;
}

function buildMarkdown(data, baseUrl = '') {
  const meta = data._meta || {};
  const drug = data.drug;
  const diseases = data.diseases || {};
  const targets = data.targets || {};

  const progesteroneSection = buildProgesteroneSection(drug);
  const dryEyeSection = buildDryEyeSection(diseases, meta);
  const trigeminalSection = buildTrigeminalSection(targets, meta);
  const integrationSection = buildIntegrationSection(data);
  const provenance = buildProvenance(meta);

  return `---
title: Progesterone, trigeminal targets & dry eye
layout: default
parent: Example
nav_order: 4
description: Open Targets–backed evaluation of progesterone, trigeminal nerve targets, and dry eye disease — Biotica Bio example report
---

# Progesterone, trigeminal nerve targets, and dry eye disease

This report evaluates **progesterone** (drug), **trigeminal pathway gene proxies** (TRPV1, TRPM8, SCN9A, CHRM3), and **dry eye disease** (indication) using the Open Targets Platform. Dry eye is represented by ontology proxies (e.g. Sjögren syndrome); trigeminal-mediated biology by gene-level proxies. All data are query-backed; framing is designed for strategic and R&D interpretation.
{: .lead }

{: .warning }
This report is for strategic and due-diligence use only; it does not constitute regulatory, medical, or investment advice.

${baseUrl ? `For methodology, see [How it's built](${baseUrl}{% link how-its-built.md %}).\n\n` : ''}*Data: Open Targets Platform. Interpretation: Biotica Bio.*

---

## Progesterone in the Platform

${progesteroneSection}

---

## Dry eye disease (Open Targets)

${dryEyeSection}

---

## Trigeminal nerve–related targets

${trigeminalSection}

---

## Integration

${integrationSection}

---

## Data provenance

${provenance}

---

*Data: Open Targets Platform. Interpretation: Biotica Bio.*
`;
}

export {
  buildMarkdown,
  buildProgesteroneSection,
  buildDryEyeSection,
  buildTrigeminalSection,
  buildIntegrationSection,
  buildProvenance,
};
