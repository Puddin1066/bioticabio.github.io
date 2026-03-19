/**
 * Optional web context for reports: recent trials, competitor updates,
 * regulatory events, conference abstracts. Kept separate from Open Targets evidence.
 */
export interface WebContextSnippet {
  title: string;
  snippet: string;
  url?: string;
  date?: string;
  source?: string;
}

export interface WebContextResult {
  snippets: WebContextSnippet[];
  /** When true, data was mocked or unavailable. */
  isMocked?: boolean;
}

/**
 * Provider for live or mocked web context. Report pipeline may call this
 * when options.webEnrichment is true.
 */
export interface IWebContextProvider {
  /**
   * Fetch recent context for a given topic (e.g. "dry eye drug approval", "TRPV1 clinical trial").
   */
  fetchContext(query: string, options?: { maxResults?: number }): Promise<WebContextResult>;
}
