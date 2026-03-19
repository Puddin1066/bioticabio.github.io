import type { Audience } from '@biotica/core';
type IntegratedData = {
    drug?: Record<string, unknown> | null;
    diseases?: Record<string, Record<string, unknown>>;
    targets?: Record<string, Record<string, unknown>>;
    _meta?: {
        trigeminalGeneSymbols?: string[];
    };
};
/**
 * Build audience-aware recommendation / next steps (2–4 bullets, deterministic).
 */
export declare function buildRecommendationSection(data: IntegratedData, audience?: Audience): string;
export {};
//# sourceMappingURL=recommendation.d.ts.map