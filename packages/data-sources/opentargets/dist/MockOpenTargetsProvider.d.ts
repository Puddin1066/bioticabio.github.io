import type { IOpenTargetsProvider, DrugResponse, DiseaseResponse, TargetResponse, SearchResult, MapIdsResult } from './provider.js';
/**
 * Mock Open Targets provider. Returns minimal fixture data and isMocked is true.
 * Use for tests and when context.mode is 'mocked'; never present mock data as live evidence.
 */
export declare class MockOpenTargetsProvider implements IOpenTargetsProvider {
    readonly isMocked = true;
    requestDrug(_chemblId: string): Promise<DrugResponse>;
    requestDisease(_efoId: string): Promise<DiseaseResponse>;
    requestTarget(_ensemblId: string): Promise<TargetResponse>;
    searchEntities(_queryString: string, _entityNames: string[]): Promise<SearchResult>;
    mapIds(_queryTerms: string[], _entityNames?: string[]): Promise<MapIdsResult>;
}
//# sourceMappingURL=MockOpenTargetsProvider.d.ts.map