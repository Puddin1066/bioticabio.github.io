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
        therapeuticAreas?: Array<{
            name?: string;
        }>;
    };
};
type Drug = {
    id?: string;
    name?: string;
    drugType?: string;
    description?: string;
    tradeNames?: string[];
    mechanismsOfAction?: {
        rows?: DrugRow[];
    };
    indications?: {
        count?: number;
        rows?: IndicationRow[];
    };
    drugWarnings?: Array<{
        warningType?: string;
        description?: string;
    }>;
};
export declare function buildExecutiveSummary(drug: Drug): string;
export declare function buildDrugProfile(drug: Drug): string;
export declare function buildDrugTargetsSection(drug: Drug): {
    paragraph: string;
    tableRows: Array<{
        targetName: string;
        mechanism: string;
    }>;
};
export declare function buildIndicationsRows(drug: Drug): Array<{
    name: string;
    areas: string;
}>;
export declare function buildRepurposingAngle(drug: Drug): string;
export {};
//# sourceMappingURL=drug.d.ts.map