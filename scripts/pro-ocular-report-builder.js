/**
 * Pro-ocular evaluation report builder: transforms Open Targets disease-landscape
 * data (pro-ocular-result.json) into a single Markdown report with Jekyll front matter.
 * Handles missing diseases; caps tables (5–7 drugs, 10 targets per indication).
 */

const MAX_DRUGS_PER_INDICATION = 7;
const MAX_TARGETS_PER_INDICATION = 10;

function safe(obj, def = '') {
  if (obj === null || obj === undefined) return def;
  return obj;
}

function buildIndicationSpace(diseases) {
  const entries = Object.entries(diseases || {}).filter(([, d]) => d && d.name);
  if (entries.length === 0) return 'No indication data returned from the Platform for the configured EFO IDs.';
  const lines = entries.map(([efoId, d]) => {
    const areas = (d.therapeuticAreas || []).map((a) => a.name).join('; ') || '—';
    return `| ${safe(d.name)} | ${efoId} | ${areas} |`;
  });
  return [
    '| Indication | EFO ID | Therapeutic area(s) |',
    '|------------|--------|---------------------|',
    ...lines,
  ].join('\n');
}

function buildCompetitiveLandscape(diseases) {
  const entries = Object.entries(diseases || {}).filter(([, d]) => d && d.name);
  if (entries.length === 0) return 'No data.';
  const parts = [];
  for (const [efoId, d] of entries) {
    const knownDrugs = d.knownDrugs || {};
    const count = knownDrugs.count ?? 0;
    const rows = (knownDrugs.rows || []).slice(0, MAX_DRUGS_PER_INDICATION);
    parts.push(`**${safe(d.name)}** (${efoId}): ${count} known drug(s) in the Platform.`);
    if (rows.length === 0) {
      parts.push('*No drug rows returned.*\n');
      continue;
    }
    const table = [
      '| Drug | Phase | Mechanism | Target |',
      '|------|-------|------------|--------|',
      ...rows.map((r) => {
        const drug = safe(r.prefName, r.drugId || '—');
        const phase = safe(r.phase, '—');
        const mechanism = safe(r.mechanismOfAction, '—');
        const target = r.target ? (r.target.approvedSymbol || r.target.approvedName || r.targetId || '—') : (r.targetId || '—');
        return `| ${drug} | ${phase} | ${mechanism} | ${target} |`;
      }),
    ].join('\n');
    parts.push(table, '');
  }
  return parts.join('\n');
}

function buildTargetLandscape(diseases) {
  const entries = Object.entries(diseases || {}).filter(([, d]) => d && d.name);
  if (entries.length === 0) return 'No data.';
  const parts = [];
  for (const [efoId, d] of entries) {
    const assoc = d.associatedTargets || {};
    const count = assoc.count ?? 0;
    const rows = (assoc.rows || []).slice(0, MAX_TARGETS_PER_INDICATION);
    parts.push(`**${safe(d.name)}** (${efoId}): ${count} associated target(s).`);
    if (rows.length === 0) {
      parts.push('*No target rows returned.*\n');
      continue;
    }
    const table = [
      '| Target | Score |',
      '|--------|-------|',
      ...rows.map((r) => {
        const sym = r.target ? (r.target.approvedSymbol || r.target.approvedName || r.target.id || '—') : '—';
        const score = r.score != null ? r.score.toFixed(3) : '—';
        return `| ${sym} | ${score} |`;
      }),
    ].join('\n');
    parts.push(table, '');
  }
  return parts.join('\n');
}

function buildCommercialRelevance(diseases) {
  const entries = Object.entries(diseases || {}).filter(([, d]) => d && d.name);
  if (entries.length === 0) return 'No indication data available from the Platform.';
  const byIndication = entries.map(([efoId, d]) => {
    const rows = (d.knownDrugs || {}).rows || [];
    const approved = rows.filter((r) => (r.status || '').toLowerCase().includes('approved') || (r.phase || '').toLowerCase() === 'approved').length;
    const inDev = rows.length - approved;
    return { name: d.name, efoId, count: rows.length, approved, inDev };
  });
  const totalApproved = byIndication.reduce((s, x) => s + x.approved, 0);
  const totalInDev = byIndication.reduce((s, x) => s + x.inDev, 0);
  let para = `From the Platform: ${totalApproved} approved and ${totalInDev} in-development drug associations across the evaluated indications. `;
  para += 'Pro-ocular is Phase 3–ready for ocular GVHD and positioned in dry eye and Sjögren syndrome. ';
  const dryEyeCount = byIndication.find((x) => /dry|sicca|sialolithiasis/i.test(x.name))?.count ?? 0;
  const sjogrenCount = byIndication.find((x) => /sjogren/i.test(x.name))?.count ?? 0;
  if (dryEyeCount > 0 || sjogrenCount > 0) {
    para += `Platform lists ${dryEyeCount} drug(s) for dry-eye–related indication(s) and ${sjogrenCount} for Sjögren. `;
  }
  para += 'No drug in the Platform is specifically labelled for ocular GVHD in this dataset. ';
  para += '**Commercial take:** Pro-ocular addresses an unmet niche (especially oGVHD) while overlapping with dry eye and Sjögren competitive space; differentiation is mechanism (neuro/lacrimal) and formulation.';
  return para;
}

function buildRndRelevance(diseases) {
  const entries = Object.entries(diseases || {}).filter(([, d]) => d && d.name);
  if (entries.length === 0) return 'No indication data available.';
  const topTargets = [];
  for (const [, d] of entries) {
    const rows = (d.associatedTargets || {}).rows || [];
    topTargets.push(...rows.slice(0, 3).map((r) => r.target?.approvedSymbol || r.target?.approvedName).filter(Boolean));
  }
  const uniq = [...new Set(topTargets)].slice(0, 8).join(', ');
  let para = `The Platform highlights targets such as ${uniq || '—'} for these diseases. `;
  para += "Pro-ocular's mechanism (ophthalmic branch of trigeminal nerve, lacrimal/meibomian, endogenous tears) is distinct from these target-associated mechanisms. ";
  para += '**R&D take:** Open Targets supports evaluation of the indication space; Pro-ocular occupies a different mechanism niche (neuro/lacrimal) and is complementary to target-centric R&D.';
  return para;
}

function buildProvenance(meta) {
  const efoIds = (meta?.indicationEfoIds || []).join(', ') || '—';
  return `Report generated from the **Open Targets Platform GraphQL API** (disease(efoId)). Indications queried: ${efoIds}. Data: knownDrugs and associatedTargets per disease. Pro-ocular context from [Signal12/Pro-ocular](https://signal12inc.com/pro-ocular/). To re-run: \`node fetch-pro-ocular.js\` then \`node generate-pro-ocular-report.js\` (optional \`--from-json\` and \`--out\`).`;
}

/**
 * Build full Markdown for the Pro-ocular evaluation report.
 * @param {Object} data - Parsed pro-ocular-result.json: { _meta, diseases }
 * @param {string} [baseUrl] - Optional Jekyll baseurl (e.g. '{{ site.baseurl }}')
 * @returns {string} Markdown with Jekyll front matter
 */
function buildMarkdown(data, baseUrl = '') {
  const diseases = data.diseases || {};
  const meta = data._meta || {};

  const indicationSpace = buildIndicationSpace(diseases);
  const competitiveLandscape = buildCompetitiveLandscape(diseases);
  const targetLandscape = buildTargetLandscape(diseases);
  const commercialRelevance = buildCommercialRelevance(diseases);
  const rndRelevance = buildRndRelevance(diseases);
  const provenance = buildProvenance(meta);

  const proOcularContext = `**Pro-ocular™** (Signal12) targets the ophthalmic branch of the trigeminal nerve and supports lacrimal and meibomian function to promote endogenous tear production. Indications include ocular graft-versus-host disease (oGVHD), Sjögren syndrome, and dry eye. Phase 3–ready (oGVHD). Source: [Signal12 — Pro-ocular](https://signal12inc.com/pro-ocular/).`;

  const leadDisclaimer = `This report evaluates **Pro-ocular** (Signal12's [Pro-ocular™](https://signal12inc.com/pro-ocular/)) using the Open Targets Platform for the **indication and competitive landscape** of its target diseases. Pro-ocular is not in the Platform; the following data are drugs and targets the Platform associates with each indication.`;

  return `---
title: Pro-ocular (Signal12) evaluation
layout: default
parent: Example
nav_order: 3
description: Open Targets–based evaluation of Pro-ocular indication and competitive space — Biotica Bio example report
---

# Pro-ocular (Signal12) evaluation

${leadDisclaimer}
{: .lead }

{: .warning }
This report is for strategic and due-diligence use only; it does not constitute regulatory, medical, or investment advice.

${baseUrl ? `For methodology, see [How it's built](${baseUrl}{% link how-its-built.md %}).\n\n` : ''}*Data: Open Targets Platform. Pro-ocular context: Signal12. Interpretation: Biotica Bio.*

---

## Pro-ocular context (curated)

${proOcularContext}

---

## Indication space

${indicationSpace}

---

## Competitive landscape (from Open Targets)

Pro-ocular is not in the Platform; the following are drugs the Platform associates with each indication.

${competitiveLandscape}

---

## Target / mechanism landscape (from Open Targets)

For each indication, the main Platform-associated targets are listed below. Pro-ocular's mechanism (neuro/trigeminal, lacrimal) is different from these target-associated mechanisms.

${targetLandscape}

---

## Commercial relevance

${commercialRelevance}

---

## R&D relevance

${rndRelevance}

---

## Data provenance

${provenance}

---

*Data: Open Targets Platform. Pro-ocular context: Signal12. Interpretation: Biotica Bio.*
`;
}

export {
  buildMarkdown,
  buildIndicationSpace,
  buildCompetitiveLandscape,
  buildTargetLandscape,
  buildCommercialRelevance,
  buildRndRelevance,
  buildProvenance,
};
