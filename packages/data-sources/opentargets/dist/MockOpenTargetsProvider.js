/**
 * Mock Open Targets provider. Returns minimal fixture data and isMocked is true.
 * Use for tests and when context.mode is 'mocked'; never present mock data as live evidence.
 */
export class MockOpenTargetsProvider {
    isMocked = true;
    async requestDrug(_chemblId) {
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
    async requestDisease(_efoId) {
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
    async requestTarget(_ensemblId) {
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
    async searchEntities(_queryString, _entityNames) {
        return { search: { total: 0, hits: [] } };
    }
    async mapIds(_queryTerms, _entityNames) {
        return { mapIds: { total: 0, mappings: [] } };
    }
}
//# sourceMappingURL=MockOpenTargetsProvider.js.map