/**
 * Data-backed benchmarks derived from Open Targets evidence.
 * Used across report sections so evaluations are comparable and re-runs can be measured against the same metrics.
 */

type Drug = {
  indications?: { count?: number };
};

/** Minimal shape for benchmark computation; accepts evidence from pipeline (rows may have score and/or target). */
type DiseaseLike = {
  knownDrugs?: { count?: number };
  associatedTargets?: { count?: number; rows?: Array<Record<string, unknown>> };
};

type TargetLike = {
  knownDrugs?: { count?: number };
  associatedDiseases?: { count?: number };
};

export type BenchmarkSummary = {
  drug: { indicationCount: number };
  indication: { knownDrugsTotal: number; associatedTargetsTotal: number; topScore: number | null };
  targets: { totalKnownDrugs: number; totalAssociatedDiseases: number; targetCount: number };
};

/**
 * Compute benchmark totals from integrated report evidence (counts and scores).
 * All values are from the current evidence snapshot; no external reference data.
 */
export function computeBenchmarkSummary(data: {
  drug?: Drug | null;
  diseases?: Record<string, DiseaseLike>;
  targets?: Record<string, TargetLike>;
}): BenchmarkSummary {
  const drug = data.drug;
  const diseases = data.diseases ?? {};
  const targets = data.targets ?? {};

  let knownDrugsTotal = 0;
  let associatedTargetsTotal = 0;
  let topScore: number | null = null;
  for (const d of Object.values(diseases)) {
    knownDrugsTotal += d.knownDrugs?.count ?? 0;
    associatedTargetsTotal += d.associatedTargets?.count ?? 0;
    const rows = d.associatedTargets?.rows ?? [];
    for (const r of rows) {
      const s = (r as { score?: number }).score;
      if (s != null && (topScore == null || s > topScore)) topScore = s;
    }
  }

  let totalKnownDrugs = 0;
  let totalAssociatedDiseases = 0;
  for (const t of Object.values(targets)) {
    totalKnownDrugs += t.knownDrugs?.count ?? 0;
    totalAssociatedDiseases += t.associatedDiseases?.count ?? 0;
  }

  return {
    drug: { indicationCount: drug?.indications?.count ?? 0 },
    indication: {
      knownDrugsTotal,
      associatedTargetsTotal,
      topScore,
    },
    targets: {
      totalKnownDrugs,
      totalAssociatedDiseases,
      targetCount: Object.keys(targets).length,
    },
  };
}

/**
 * Format a short "Data-backed benchmarks" paragraph for use in executive summary or provenance.
 */
export function formatBenchmarkSummary(summary: BenchmarkSummary): string {
  const parts: string[] = [];
  parts.push(`Drug: **${summary.drug.indicationCount}** indications in Platform`);
  parts.push(
    `Indication (dry eye proxies): **${summary.indication.knownDrugsTotal}** known drugs, **${summary.indication.associatedTargetsTotal}** associated targets` +
      (summary.indication.topScore != null ? ` (top association score ${summary.indication.topScore.toFixed(3)})` : '')
  );
  parts.push(
    `Targets (trigeminal proxies): **${summary.targets.targetCount}** targets, **${summary.targets.totalKnownDrugs}** total known drugs, **${summary.targets.totalAssociatedDiseases}** total associated diseases`
  );
  return '**Data-backed benchmarks (this run):** ' + parts.join('; ') + '. Use these metrics to compare other candidates or re-runs.';
}
