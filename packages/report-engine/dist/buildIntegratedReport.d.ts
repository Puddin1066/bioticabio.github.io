import type { ReportSection, Audience } from '@biotica/core';
export type RequestInputMeta = {
    drug?: string;
    diseases?: string[];
    targets?: string[];
    audience?: string;
    mode?: string;
};
export type IntegratedReportData = {
    _meta?: {
        fetchedAt?: string;
        dryEyeEfoIds?: string[];
        dryEyeProxyLabels?: string[];
        trigeminalGeneSymbols?: string[];
        trigeminalTargetIds?: string[];
        translationSource?: string;
        source?: string;
        requestInput?: RequestInputMeta;
        queryOperations?: string[];
    };
    drug?: Record<string, unknown> | null;
    diseases?: Record<string, Record<string, unknown>>;
    targets?: Record<string, Record<string, unknown>>;
};
/**
 * Build full integrated report (progesterone + trigeminal + dry eye) as Markdown with front matter.
 */
export declare function buildIntegratedReportMarkdown(data: IntegratedReportData, baseUrl?: string, audience?: Audience): string;
/**
 * Build integrated report as structured sections (for API/validation).
 */
export declare function buildIntegratedReportSections(data: IntegratedReportData, audience?: Audience): ReportSection[];
//# sourceMappingURL=buildIntegratedReport.d.ts.map