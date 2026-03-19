/**
 * Open Targets data provider interface. Implementations must label data as live or mocked
 * so report outputs never mistake mocked API data for live evidence.
 */
export interface MapIdsHit {
    id: string;
    name?: string;
    entity?: string;
    score?: number;
    object?: {
        id: string;
        name?: string;
        approvedSymbol?: string;
        approvedName?: string;
    };
}
export interface MapIdsResult {
    mapIds?: {
        total?: number;
        mappings?: Array<{
            term?: string;
            hits?: MapIdsHit[];
        }>;
    };
}
export interface SearchHit {
    id: string;
    name?: string;
    entity?: string;
    category?: string;
    score?: number;
    object?: {
        id: string;
        name?: string;
        approvedSymbol?: string;
        approvedName?: string;
    };
}
export interface SearchResult {
    search?: {
        total?: number;
        hits?: SearchHit[];
    };
}
/** Raw API response shapes (minimal for provider interface). */
export interface DrugResponse {
    drug?: Record<string, unknown> | null;
}
export interface DiseaseResponse {
    disease?: Record<string, unknown> | null;
}
export interface TargetResponse {
    target?: Record<string, unknown> | null;
}
export interface OpenTargetsProviderConfig {
    /** If true, all responses must be explicitly marked as mocked. */
    mocked?: boolean;
}
/**
 * Provider for Open Targets data. Implementations: live (real API) or mock (fixtures).
 * Callers must check provenance so mocked data is never presented as live.
 */
export interface IOpenTargetsProvider {
    readonly isMocked: boolean;
    requestDrug(chemblId: string): Promise<DrugResponse>;
    requestDisease(efoId: string, queryVariant?: 'disease-landscape' | 'disease-dry-eye'): Promise<DiseaseResponse>;
    requestTarget(ensemblId: string, queryVariant?: 'oncology-target-assessment' | 'target-summary'): Promise<TargetResponse>;
    searchEntities(queryString: string, entityNames: string[], page?: {
        index: number;
        size: number;
    }): Promise<SearchResult>;
    mapIds(queryTerms: string[], entityNames?: string[]): Promise<MapIdsResult>;
}
//# sourceMappingURL=provider.d.ts.map