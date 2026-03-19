import { computeBenchmarkSummary } from '../benchmarks.js';

type Drug = {
  id?: string;
  indications?: { count?: number };
  mechanismsOfAction?: { rows?: Array<{ targets?: Array<{ id?: string }> }> };
};
type Disease = {
  name?: string;
  knownDrugs?: { count?: number; rows?: Array<{ drugId?: string; prefName?: string }> };
  associatedTargets?: { count?: number; rows?: Array<{ target?: { id?: string; approvedSymbol?: string } }> };
};
type Target = {
  approvedSymbol?: string;
  knownDrugs?: { count?: number };
  associatedDiseases?: { count?: number };
};
type IntegratedData = {
  drug?: Drug | null;
  diseases?: Record<string, Disease>;
  targets?: Record<string, Target>;
  _meta?: { trigeminalGeneSymbols?: string[] };
};

/**
 * Build integration/synthesis section for progesterone + trigeminal + dry eye report.
 */
export function buildIntegrationSection(data: IntegratedData): string {
  const drug = data.drug;
  const diseases = data.diseases || {};
  const targets = data.targets || {};
  const diseaseEntries = Object.entries(diseases).filter(([, d]) => d && d.name);
  const dryEyeTargetSymbols = new Set<string>();
  diseaseEntries.forEach(([, d]) => {
    (d.associatedTargets?.rows || []).forEach((r) => {
      if (r.target?.approvedSymbol) dryEyeTargetSymbols.add(r.target.approvedSymbol);
    });
  });
  const trigeminalSymbols = new Set(Object.values(targets).map((t) => t.approvedSymbol).filter(Boolean) as string[]);
  const proxySymbols = data._meta?.trigeminalGeneSymbols ?? [...trigeminalSymbols];
  const overlapSymbols = proxySymbols.filter((s) => dryEyeTargetSymbols.has(s));

  let section = '';
  section +=
    '**Progesterone ↔ dry eye:** No direct Open Targets linkage in this dataset; literature-supported hormonal effects on tear physiology suggest indirect relevance (hormonal modulation axis).\n\n';
  section += '**Trigeminal pathway ↔ dry eye:** Component targets (e.g. TRPV1, TRPM8, CHRM3) connect sensory signalling to tear production. ';
  if (overlapSymbols.length > 0) {
    section += `**${overlapSymbols.join(', ')}** ${overlapSymbols.length === 1 ? 'appears' : 'appear'} in the dry eye–associated target set (concrete link between neuro/lacrimal signalling and this indication). `;
  }
  section +=
    overlapSymbols.length > 0
      ? 'Overlap with dry eye–associated targets: yes.'
      : 'Overlap in this dataset: limited; immune targets (e.g. IRF5, STAT4) dominate the dry eye node—orthogonal to neuro-reflex proxies.';
  section += '\n\n';
  section +=
    '**Synthesis:** Open Targets emphasises immune/inflammatory biology (e.g. Sjögren targets such as IRF5, STAT4). The progesterone/trigeminal hypothesis emphasises neuro-reflex and hormonal modulation of lacrimal/meibomian function. **These are orthogonal mechanistic spaces, not overlapping ones**—that contrast is the signal.\n\n';
  section +=
    '**Commercial take:** The dry eye market is crowded (anti-inflammatory, tear stabilisation). The emerging niche is neurostimulation / endogenous tear activation (e.g. Tyrvaya). Progesterone is not a direct competitor but supports a biological plausibility layer (gland modulation). Pro-ocular-style positioning is not "another dry eye drug" but a neuro-lacrimal activation strategy, adjacent to but distinct from immune modulation and lubrication.\n\n';
  section +=
    '**R&D take:** Open Targets is useful here not for confirming the mechanism, but for showing what it is not: the dominant target landscape in the Platform is immune signalling; the proposed mechanism is neural reflex activation. That contrast is the insight.\n\n';
  const b = computeBenchmarkSummary(data);
  section +=
    `**Benchmarks (this report):** Drug ${b.drug.indicationCount} indications; dry eye proxies ${b.indication.knownDrugsTotal} known drugs, ${b.indication.associatedTargetsTotal} associated targets; trigeminal proxies ${b.targets.totalKnownDrugs} known drugs, ${b.targets.totalAssociatedDiseases} associated diseases. Use these to compare other theses or re-runs.`;
  return section;
}
