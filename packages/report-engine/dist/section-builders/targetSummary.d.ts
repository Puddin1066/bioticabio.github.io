type Target = {
    id?: string;
    approvedSymbol?: string;
    approvedName?: string;
    pathways?: Array<{
        topLevelTerm?: string;
        pathway?: string;
    }>;
    knownDrugs?: {
        count?: number;
        rows?: Array<{
            prefName?: string;
            drugId?: string;
        }>;
    };
    associatedDiseases?: {
        count?: number;
        rows?: Array<{
            disease?: {
                name?: string;
            };
        }>;
    };
};
type Meta = {
    trigeminalGeneSymbols?: string[];
};
/**
 * Build trigeminal / target summary section for integrated report.
 */
export declare function buildTrigeminalSection(targets: Record<string, Target> | null | undefined, meta?: Meta | null): string;
export {};
//# sourceMappingURL=targetSummary.d.ts.map