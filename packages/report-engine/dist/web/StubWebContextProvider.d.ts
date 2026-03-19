import type { IWebContextProvider, WebContextResult } from './IWebContextProvider.js';
/**
 * Stub implementation: returns empty or mocked snippets.
 * Replace with real retrieval (e.g. search API, news API) when web enrichment is enabled.
 */
export declare class StubWebContextProvider implements IWebContextProvider {
    fetchContext(_query: string, _options?: {
        maxResults?: number;
    }): Promise<WebContextResult>;
}
//# sourceMappingURL=StubWebContextProvider.d.ts.map