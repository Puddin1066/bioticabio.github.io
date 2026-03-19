import { GraphQLClient } from 'graphql-request';
import { createClient, request } from './client.js';
import type {
  IOpenTargetsProvider,
  DrugResponse,
  DiseaseResponse,
  TargetResponse,
  SearchResult,
  MapIdsResult,
} from './provider.js';

export interface OpenTargetsProviderLiveConfig {
  apiUrl?: string;
}

/**
 * Live Open Targets API provider. All data is from the real Platform; isMocked is false.
 */
export class OpenTargetsProviderLive implements IOpenTargetsProvider {
  readonly isMocked = false;
  private client: GraphQLClient;

  constructor(config: OpenTargetsProviderLiveConfig = {}) {
    this.client = createClient({ apiUrl: config.apiUrl });
  }

  async requestDrug(chemblId: string): Promise<DrugResponse> {
    const result = await request<DrugResponse>(this.client, 'drug-assessment', { chemblId });
    return result;
  }

  async requestDisease(
    efoId: string,
    queryVariant: 'disease-landscape' | 'disease-dry-eye' = 'disease-landscape'
  ): Promise<DiseaseResponse> {
    const name = queryVariant === 'disease-dry-eye' ? 'disease-dry-eye' : 'disease-landscape';
    const result = await request<DiseaseResponse>(this.client, name, { efoId });
    return result;
  }

  async requestTarget(
    ensemblId: string,
    queryVariant: 'oncology-target-assessment' | 'target-summary' = 'target-summary'
  ): Promise<TargetResponse> {
    const name =
      queryVariant === 'oncology-target-assessment' ? 'oncology-target-assessment' : 'target-summary';
    const result = await request<TargetResponse>(this.client, name, { ensemblId });
    return result;
  }

  async searchEntities(
    queryString: string,
    entityNames: string[],
    page: { index: number; size: number } = { index: 0, size: 10 }
  ): Promise<SearchResult> {
    const result = await request<SearchResult>(this.client, 'search-entities', {
      queryString,
      entityNames,
      page,
    });
    return result;
  }

  async mapIds(queryTerms: string[], entityNames?: string[]): Promise<MapIdsResult> {
    const result = await request<MapIdsResult>(this.client, 'map-ids', {
      queryTerms,
      entityNames: entityNames ?? ['disease', 'target', 'drug'],
    });
    return result;
  }
}
