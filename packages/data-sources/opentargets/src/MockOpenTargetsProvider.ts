import type {
  IOpenTargetsProvider,
  DrugResponse,
  DiseaseResponse,
  TargetResponse,
  SearchResult,
  MapIdsResult,
} from './provider.js';

/**
 * Mock Open Targets provider. Returns minimal fixture data and isMocked is true.
 * Use for tests and when context.mode is 'mocked'; never present mock data as live evidence.
 */
export class MockOpenTargetsProvider implements IOpenTargetsProvider {
  readonly isMocked = true;

  async requestDrug(_chemblId: string): Promise<DrugResponse> {
    return {
      drug: {
        id: 'CHEMBL103',
        name: 'Progesterone',
        description: '[MOCK] Drug data from MockOpenTargetsProvider.',
        drugType: 'small molecule',
        mechanismsOfAction: { rows: [] },
        indications: { count: 0, rows: [] },
      },
    };
  }

  async requestDisease(_efoId: string): Promise<DiseaseResponse> {
    return {
      disease: {
        id: 'EFO_0000699',
        name: '[MOCK] Sjögren syndrome (mock)',
        therapeuticAreas: [],
        knownDrugs: { count: 0, rows: [] },
        associatedTargets: { count: 0, rows: [] },
      },
    };
  }

  async requestTarget(_ensemblId: string): Promise<TargetResponse> {
    return {
      target: {
        id: _ensemblId,
        approvedSymbol: 'TRPV1',
        approvedName: '[MOCK] Target data from MockOpenTargetsProvider.',
        pathways: [],
        knownDrugs: { count: 0, rows: [] },
        associatedDiseases: { count: 0, rows: [] },
      },
    };
  }

  async searchEntities(_queryString: string, _entityNames: string[]): Promise<SearchResult> {
    return { search: { total: 0, hits: [] } };
  }

  async mapIds(_queryTerms: string[], _entityNames?: string[]): Promise<MapIdsResult> {
    return { mapIds: { total: 0, mappings: [] } };
  }
}
