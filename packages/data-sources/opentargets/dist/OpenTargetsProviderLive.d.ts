import type { IOpenTargetsProvider, DrugResponse, DiseaseResponse, TargetResponse, SearchResult, MapIdsResult } from './provider.js';
export interface OpenTargetsProviderLiveConfig {
    apiUrl?: string;
}
/**
 * Live Open Targets API provider. All data is from the real Platform; isMocked is false.
 */
export declare class OpenTargetsProviderLive implements IOpenTargetsProvider {
    readonly isMocked = false;
    private client;
    constructor(config?: OpenTargetsProviderLiveConfig);
    requestDrug(chemblId: string): Promise<DrugResponse>;
    requestDisease(efoId: string, queryVariant?: 'disease-landscape' | 'disease-dry-eye'): Promise<DiseaseResponse>;
    requestTarget(ensemblId: string, queryVariant?: 'oncology-target-assessment' | 'target-summary'): Promise<TargetResponse>;
    searchEntities(queryString: string, entityNames: string[], page?: {
        index: number;
        size: number;
    }): Promise<SearchResult>;
    mapIds(queryTerms: string[], entityNames?: string[]): Promise<MapIdsResult>;
}
//# sourceMappingURL=OpenTargetsProviderLive.d.ts.map