type Meta = {
    dryEyeEfoIds?: string[];
    dryEyeProxyLabels?: string[];
    trigeminalGeneSymbols?: string[];
    trigeminalTargetIds?: string[];
    translationSource?: string;
    requestInput?: {
        drug?: string;
        diseases?: string[];
        targets?: string[];
        audience?: string;
        mode?: string;
    };
    queryOperations?: string[];
};
/**
 * Build data provenance section (input, query structure, resolution, re-run).
 */
export declare function buildProvenance(meta?: Meta | null): string;
export {};
//# sourceMappingURL=provenance.d.ts.map