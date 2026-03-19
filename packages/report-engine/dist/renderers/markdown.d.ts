import type { ReportSection } from '@biotica/core';
/**
 * Assemble report sections into a single Markdown string (no front matter).
 */
export declare function renderSections(sections: ReportSection[]): string;
/**
 * Wrap body with optional base URL for site links.
 */
export declare function withBaseUrl(body: string, baseUrl: string): string;
//# sourceMappingURL=markdown.d.ts.map