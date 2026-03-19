import { createClient, request } from './client.js';
/**
 * Live Open Targets API provider. All data is from the real Platform; isMocked is false.
 */
export class OpenTargetsProviderLive {
    isMocked = false;
    client;
    constructor(config = {}) {
        this.client = createClient({ apiUrl: config.apiUrl });
    }
    async requestDrug(chemblId) {
        const result = await request(this.client, 'drug-assessment', { chemblId });
        return result;
    }
    async requestDisease(efoId, queryVariant = 'disease-landscape') {
        const name = queryVariant === 'disease-dry-eye' ? 'disease-dry-eye' : 'disease-landscape';
        const result = await request(this.client, name, { efoId });
        return result;
    }
    async requestTarget(ensemblId, queryVariant = 'target-summary') {
        const name = queryVariant === 'oncology-target-assessment' ? 'oncology-target-assessment' : 'target-summary';
        const result = await request(this.client, name, { ensemblId });
        return result;
    }
    async searchEntities(queryString, entityNames, page = { index: 0, size: 10 }) {
        const result = await request(this.client, 'search-entities', {
            queryString,
            entityNames,
            page,
        });
        return result;
    }
    async mapIds(queryTerms, entityNames) {
        const result = await request(this.client, 'map-ids', {
            queryTerms,
            entityNames: entityNames ?? ['disease', 'target', 'drug'],
        });
        return result;
    }
}
//# sourceMappingURL=OpenTargetsProviderLive.js.map