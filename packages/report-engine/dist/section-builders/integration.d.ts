type Drug = {
    id?: string;
    indications?: {
        count?: number;
    };
    mechanismsOfAction?: {
        rows?: Array<{
            targets?: Array<{
                id?: string;
            }>;
        }>;
    };
};
type Disease = {
    name?: string;
    knownDrugs?: {
        count?: number;
        rows?: Array<{
            drugId?: string;
            prefName?: string;
        }>;
    };
    associatedTargets?: {
        count?: number;
        rows?: Array<{
            target?: {
                id?: string;
                approvedSymbol?: string;
            };
        }>;
    };
};
type Target = {
    approvedSymbol?: string;
    knownDrugs?: {
        count?: number;
    };
    associatedDiseases?: {
        count?: number;
    };
};
type IntegratedData = {
    drug?: Drug | null;
    diseases?: Record<string, Disease>;
    targets?: Record<string, Target>;
    _meta?: {
        trigeminalGeneSymbols?: string[];
    };
};
/**
 * Build integration/synthesis section for progesterone + trigeminal + dry eye report.
 */
export declare function buildIntegrationSection(data: IntegratedData): string;
export {};
//# sourceMappingURL=integration.d.ts.map