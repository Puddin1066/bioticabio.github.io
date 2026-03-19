import type { IWebContextProvider, WebContextResult } from './IWebContextProvider.js';

/**
 * Stub implementation: returns empty or mocked snippets.
 * Replace with real retrieval (e.g. search API, news API) when web enrichment is enabled.
 */
export class StubWebContextProvider implements IWebContextProvider {
  async fetchContext(_query: string, _options?: { maxResults?: number }): Promise<WebContextResult> {
    return {
      snippets: [],
      isMocked: true,
    };
  }
}
