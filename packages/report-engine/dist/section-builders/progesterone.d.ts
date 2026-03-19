type DrugRow = {
    targetName?: string;
    targets?: Array<{
        approvedSymbol?: string;
        approvedName?: string;
    }>;
    mechanismOfAction?: string;
    actionType?: string;
};
type IndicationRow = {
    disease?: {
        name?: string;
    };
};
type Drug = {
    name?: string;
    drugType?: string;
    description?: string;
    mechanismsOfAction?: {
        rows?: DrugRow[];
    };
    indications?: {
        count?: number;
        rows?: IndicationRow[];
    };
};
/**
 * Build Progesterone (drug) section body for integrated report.
 */
export declare function buildProgesteroneSection(drug: Drug | null | undefined): string;
export {};
//# sourceMappingURL=progesterone.d.ts.map