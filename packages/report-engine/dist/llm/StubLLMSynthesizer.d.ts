import type { ILLMSynthesizer } from './ILLMSynthesizer.js';
import type { GeneratedSection } from '@biotica/core';
import type { EvidenceSnapshot } from '@biotica/core';
/**
 * Stub implementation: returns deterministic placeholder text.
 * Replace with a real LLM client (e.g. OpenAI, Anthropic) that accepts
   * normalized evidence JSON and returns GeneratedSection with citations.
 */
export declare class StubLLMSynthesizer implements ILLMSynthesizer {
    generateExecutiveSummary(_evidence: EvidenceSnapshot): Promise<GeneratedSection>;
    generateRisksAndRecommendations(_evidence: EvidenceSnapshot): Promise<GeneratedSection>;
}
//# sourceMappingURL=StubLLMSynthesizer.d.ts.map