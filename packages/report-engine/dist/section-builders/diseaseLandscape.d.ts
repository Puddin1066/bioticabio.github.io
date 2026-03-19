type Disease = {
    name?: string;
    therapeuticAreas?: Array<{
        name?: string;
    }>;
    knownDrugs?: {
        count?: number;
        rows?: Array<{
            drugId?: string;
            prefName?: string;
            phase?: string;
            target?: {
                approvedSymbol?: string;
                approvedName?: string;
            };
            targetId?: string;
        }>;
    };
    associatedTargets?: {
        count?: number;
        rows?: Array<{
            score?: number;
            target?: {
                approvedSymbol?: string;
                approvedName?: string;
            };
        }>;
    };
};
type Meta = {
    dryEyeEfoIds?: string[];
    dryEyeProxyLabels?: string[];
};
/**
 * Build dry eye / disease landscape section for integrated or disease-centric report.
 */
export declare function buildDryEyeSection(diseases: Record<string, Disease> | null | undefined, meta?: Meta | null): string;
export {};
//# sourceMappingURL=diseaseLandscape.d.ts.map