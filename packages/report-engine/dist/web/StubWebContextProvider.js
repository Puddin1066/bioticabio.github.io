/**
 * Stub implementation: returns empty or mocked snippets.
 * Replace with real retrieval (e.g. search API, news API) when web enrichment is enabled.
 */
export class StubWebContextProvider {
    async fetchContext(_query, _options) {
        return {
            snippets: [],
            isMocked: true,
        };
    }
}
//# sourceMappingURL=StubWebContextProvider.js.map