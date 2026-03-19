import type { GeneratedSection } from '@biotica/core';
import type { EvidenceSnapshot } from '@biotica/core';
/**
 * Contract for LLM-backed synthesis. Callers must pass normalized evidence only;
 * output must separate evidence_points, inferences, and recommendations with citations.
 */
export interface ILLMSynthesizer {
    /**
     * Generate executive summary section from evidence snapshot.
     * Returns structured fields so evidence vs inference is explicit.
     */
    generateExecutiveSummary(evidence: EvidenceSnapshot): Promise<GeneratedSection>;
    /**
     * Generate risk and recommendation section from evidence snapshot.
     */
    generateRisksAndRecommendations(evidence: EvidenceSnapshot): Promise<GeneratedSection>;
}
//# sourceMappingURL=ILLMSynthesizer.d.ts.map