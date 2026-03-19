import type { ReportSection, Audience } from '@biotica/core';
import { buildProgesteroneSection } from './section-builders/progesterone.js';
import { buildDryEyeSection } from './section-builders/diseaseLandscape.js';
import { buildTrigeminalSection } from './section-builders/targetSummary.js';
import { buildIntegrationSection } from './section-builders/integration.js';
import { buildProvenance } from './section-builders/provenance.js';
import { buildExecutiveSummarySection } from './section-builders/executiveSummary.js';
import { buildRecommendationSection } from './section-builders/recommendation.js';
import { renderFrontmatter } from './renderers/frontmatter.js';

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
export function buildIntegratedReportMarkdown(
  data: IntegratedReportData,
  baseUrl = '',
  audience?: Audience
): string {
  const meta = data._meta ?? {};
  const drug = data.drug as IntegratedReportData['drug'];
  const diseases = data.diseases as IntegratedReportData['diseases'];
  const targets = data.targets as IntegratedReportData['targets'];
  const aud = audience ?? 'executive';

  const executiveSummaryBody = buildExecutiveSummarySection(data, aud);
  const progesteroneBody = buildProgesteroneSection(drug ?? undefined);
  const dryEyeBody = buildDryEyeSection(diseases ?? undefined, meta);
  const trigeminalBody = buildTrigeminalSection(targets ?? undefined, meta);
  const integrationBody = buildIntegrationSection(data);
  const recommendationBody = buildRecommendationSection(data, aud);
  const provenanceBody = buildProvenance(meta);

  const methodologyLink = baseUrl ? `For methodology, see [How it's built](${baseUrl}{% link how-its-built.md %}).\n\n` : '';

  const body = `
# Progesterone, trigeminal nerve targets, and dry eye disease

This report evaluates **progesterone** (drug), **trigeminal pathway gene proxies** (TRPV1, TRPM8, SCN9A, CHRM3), and **dry eye disease** (indication) using the Open Targets Platform. Dry eye is represented by ontology proxies (e.g. Sjögren syndrome); trigeminal-mediated biology by gene-level proxies. All data are query-backed; framing is designed for strategic and R&D interpretation.
{: .lead }

{: .warning }
This report is for strategic and due-diligence use only; it does not constitute regulatory, medical, or investment advice.

${methodologyLink}*Data: Open Targets Platform. Interpretation: Biotica Bio.*

---

## Executive summary

${executiveSummaryBody}

---

## Progesterone in the Platform

${progesteroneBody}

---

## Dry eye disease (Open Targets)

${dryEyeBody}

---

## Trigeminal nerve–related targets

${trigeminalBody}

---

## Integration

${integrationBody}

---

## Recommendation and next steps

${recommendationBody}

---

## Data provenance

${provenanceBody}

---

*Data: Open Targets Platform. Interpretation: Biotica Bio.*
`;

  const frontmatter = renderFrontmatter({
    title: 'Progesterone, trigeminal targets & dry eye',
    layout: 'default',
    parent: 'Example',
    nav_order: 4,
    description: "Open Targets–backed evaluation of progesterone, trigeminal nerve targets, and dry eye disease — Biotica Bio example report",
  });

  return frontmatter + '\n' + body.trim();
}

/**
 * Build integrated report as structured sections (for API/validation).
 */
export function buildIntegratedReportSections(data: IntegratedReportData, audience?: Audience): ReportSection[] {
  const meta = data._meta ?? {};
  const drug = data.drug as IntegratedReportData['drug'];
  const diseases = data.diseases as IntegratedReportData['diseases'];
  const targets = data.targets as IntegratedReportData['targets'];
  const aud = audience ?? 'executive';

  return [
    { id: 'executive-summary', title: 'Executive summary', body: buildExecutiveSummarySection(data, aud) },
    { id: 'progesterone', title: 'Progesterone in the Platform', body: buildProgesteroneSection(drug ?? undefined) },
    { id: 'dry-eye', title: 'Dry eye disease (Open Targets)', body: buildDryEyeSection(diseases ?? undefined, meta) },
    { id: 'trigeminal', title: 'Trigeminal nerve–related targets', body: buildTrigeminalSection(targets ?? undefined, meta) },
    { id: 'integration', title: 'Integration', body: buildIntegrationSection(data) },
    { id: 'recommendation', title: 'Recommendation and next steps', body: buildRecommendationSection(data, aud) },
    { id: 'provenance', title: 'Data provenance', body: buildProvenance(meta) },
  ];
}
