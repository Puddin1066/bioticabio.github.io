/**
 * Data-backed benchmarks derived from Open Targets evidence.
 * Used across report sections so evaluations are comparable and re-runs can be measured against the same metrics.
 */
type Drug = {
    indications?: {
        count?: number;
    };
};
/** Minimal shape for benchmark computation; accepts evidence from pipeline (rows may have score and/or target). */
type DiseaseLike = {
    knownDrugs?: {
        count?: number;
    };
    associatedTargets?: {
        count?: number;
        rows?: Array<Record<string, unknown>>;
    };
};
type TargetLike = {
    knownDrugs?: {
        count?: number;
    };
    associatedDiseases?: {
        count?: number;
    };
};
export type BenchmarkSummary = {
    drug: {
        indicationCount: number;
    };
    indication: {
        knownDrugsTotal: number;
        associatedTargetsTotal: number;
        topScore: number | null;
    };
    targets: {
        totalKnownDrugs: number;
        totalAssociatedDiseases: number;
        targetCount: number;
    };
};
/**
 * Compute benchmark totals from integrated report evidence (counts and scores).
 * All values are from the current evidence snapshot; no external reference data.
 */
export declare function computeBenchmarkSummary(data: {
    drug?: Drug | null;
    diseases?: Record<string, DiseaseLike>;
    targets?: Record<string, TargetLike>;
}): BenchmarkSummary;
/**
 * Format a short "Data-backed benchmarks" paragraph for use in executive summary or provenance.
 */
export declare function formatBenchmarkSummary(summary: BenchmarkSummary): string;
export {};
//# sourceMappingURL=benchmarks.d.ts.map