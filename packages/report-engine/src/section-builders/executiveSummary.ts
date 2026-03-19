import type { Audience } from '@biotica/core';
import { computeBenchmarkSummary, formatBenchmarkSummary } from '../benchmarks.js';

type Disease = {
  knownDrugs?: { count?: number };
  associatedTargets?: { count?: number; rows?: Array<{ target?: { approvedSymbol?: string }; score?: number }> };
};
type IntegratedData = {
  drug?: { name?: string; indications?: { count?: number } } | null;
  diseases?: Record<string, Disease>;
  targets?: Record<string, { approvedSymbol?: string; knownDrugs?: { count?: number }; associatedDiseases?: { count?: number } }>;
  _meta?: { trigeminalGeneSymbols?: string[] };
};

function getOverlapSymbols(data: IntegratedData): string[] {
  const diseases = data.diseases || {};
  const targets = data.targets || {};
  const dryEyeSymbols = new Set<string>();
  Object.values(diseases).forEach((d) => {
    (d.associatedTargets?.rows || []).forEach((r) => {
      if (r.target?.approvedSymbol) dryEyeSymbols.add(r.target.approvedSymbol);
    });
  });
  const proxySymbols = data._meta?.trigeminalGeneSymbols ?? Object.values(targets).map((t) => t.approvedSymbol).filter(Boolean) as string[];
  return proxySymbols.filter((s) => dryEyeSymbols.has(s));
}

const AUDIENCE_LABELS: Record<Audience, string> = {
  investor: 'Investor diligence',
  executive: 'Executive strategy',
  bd: 'BD / partnering',
  scientific: 'R&D / evidence review',
};

/**
 * Build audience-aware executive summary (3–5 lines, deterministic).
 */
export function buildExecutiveSummarySection(data: IntegratedData, audience?: Audience): string {
  const overlap = getOverlapSymbols(data);
  const hasOverlap = overlap.length > 0;
  const drugName = data.drug?.name ? String(data.drug.name).replace(/^PROGESTERONE$/i, 'Progesterone') : 'Progesterone';
  const aud = audience ?? 'executive';
  const audienceLabel = AUDIENCE_LABELS[aud];

  const lines: string[] = [];

  lines.push(`This report covers **${drugName}** (drug), **trigeminal pathway gene proxies** (TRPV1, TRPM8, SCN9A, CHRM3), and **dry eye disease** (indication) using the Open Targets Platform, with dry eye represented by ontology proxies (e.g. Sjögren syndrome).`);

  if (hasOverlap) {
    lines.push(`**Main insight:** At least one trigeminal proxy (${overlap.join(', ')}) appears in the dry eye–associated target set; the Platform nonetheless emphasises immune/inflammatory biology (e.g. IRF5, STAT4), while the progesterone/trigeminal thesis emphasises neuro-reflex and hormonal modulation—**orthogonal mechanistic spaces**, which is the strategic signal.`);
  } else {
    lines.push(`**Main insight:** The Platform emphasises immune/inflammatory biology for dry eye (e.g. Sjögren targets); the progesterone/trigeminal thesis emphasises neuro-reflex and hormonal modulation of lacrimal/meibomian function. **These are orthogonal mechanistic spaces**—that contrast is the signal.`);
  }

  lines.push(`**Caveat:** ${drugName} is not a direct dry eye indication in the Platform; the link is literature-supported hormonal effects on tear physiology. Competitive drug counts in some disease nodes may be sparse; re-run after Platform updates if the competitive landscape is critical.`);

  if (aud === 'investor') {
    lines.push(`**Use:** For diligence and risk assessment: evidence base, mechanistic differentiation, and key gaps to validate before commitment.`);
  } else if (aud === 'executive') {
    lines.push(`**Use:** For strategic fit and positioning: how this thesis sits relative to the Platform landscape and where to emphasise differentiation.`);
  } else if (aud === 'bd') {
    lines.push(`**Use:** For differentiation and partner narrative: orthogonal mechanism and neuro-lacrimal positioning distinct from immune/lubrication.`);
  } else {
    lines.push(`**Use:** For evidence review: mechanism, proxy choices, and Platform limits (dry eye as multifactorial syndrome vs autoimmune drivers).`);
  }

  const summary = computeBenchmarkSummary(data);
  lines.push(formatBenchmarkSummary(summary));

  const intro = audienceLabel ? `**Prepared for:** ${audienceLabel}.\n\n` : '';
  return intro + lines.map((l) => l).join('\n\n');
}
