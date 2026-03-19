import type { Audience } from '@biotica/core';
type Disease = {
    knownDrugs?: {
        count?: number;
    };
    associatedTargets?: {
        count?: number;
        rows?: Array<{
            target?: {
                approvedSymbol?: string;
            };
            score?: number;
        }>;
    };
};
type IntegratedData = {
    drug?: {
        name?: string;
        indications?: {
            count?: number;
        };
    } | null;
    diseases?: Record<string, Disease>;
    targets?: Record<string, {
        approvedSymbol?: string;
        knownDrugs?: {
            count?: number;
        };
        associatedDiseases?: {
            count?: number;
        };
    }>;
    _meta?: {
        trigeminalGeneSymbols?: string[];
    };
};
/**
 * Build audience-aware executive summary (3–5 lines, deterministic).
 */
export declare function buildExecutiveSummarySection(data: IntegratedData, audience?: Audience): string;
export {};
//# sourceMappingURL=executiveSummary.d.ts.map