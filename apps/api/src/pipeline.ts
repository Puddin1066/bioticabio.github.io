import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { IOpenTargetsProvider } from '@biotica/opentargets';
import type { ReportRequest, ResolvedEntities } from '@biotica/core';
import { loadTranslation, resolveDrug, resolveDisease, resolveTargets } from '@biotica/entity-resolution';
import { buildIntegratedReportMarkdown, buildIntegratedReportSections } from '@biotica/report-engine';
import type { IntegratedReportData } from '@biotica/report-engine';

export interface PipelineResult {
  markdown: string;
  sections: Array<{ id: string; title: string; body: string }>;
  resolvedEntities: ResolvedEntities;
  evidenceSnapshot: IntegratedReportData;
}

/**
 * Run integrated-thesis pipeline: resolve entities, fetch from provider, build report.
 */
export async function runIntegratedPipeline(
  provider: IOpenTargetsProvider,
  request: ReportRequest,
  artifactDir: string
): Promise<PipelineResult> {
  const translation = loadTranslation();
  const subject = request.subject;
  const mode = request.context?.mode ?? 'live';

  const drugInput = subject.drug ?? 'CHEMBL103';
  const diseaseInputs = subject.diseases ?? ['dry eye disease'];
  const targetInputs = subject.targets ?? ['TRPV1', 'TRPM8', 'SCN9A', 'CHRM3'];

  const drugResolved = await resolveDrug(provider, drugInput);
  const diseasesResolved = diseaseInputs.length
    ? await resolveDisease(provider, diseaseInputs[0], translation)
    : [];
  const targetsResolved = await resolveTargets(provider, targetInputs);

  const resolvedEntities: ResolvedEntities = {};
  if (drugResolved) resolvedEntities.drug = drugResolved;
  if (diseasesResolved.length) resolvedEntities.diseases = diseasesResolved;
  if (targetsResolved.length) resolvedEntities.targets = targetsResolved;

  const dryEyeEfoIds = diseasesResolved.map((r) => r.resolvedId);
  const trigeminalTargetIds = targetsResolved.map((r) => r.resolvedId);
  const trigeminalGeneSymbols = targetInputs;

  const drug = drugResolved ? await provider.requestDrug(drugResolved.resolvedId) : null;
  const diseases: Record<string, Record<string, unknown>> = {};
  for (const d of diseasesResolved) {
    const res = await provider.requestDisease(d.resolvedId, 'disease-dry-eye');
    if (res.disease) diseases[d.resolvedId] = res.disease as Record<string, unknown>;
  }
  const targets: Record<string, Record<string, unknown>> = {};
  for (const t of targetsResolved) {
    const res = await provider.requestTarget(t.resolvedId, 'target-summary');
    if (res.target) targets[t.resolvedId] = res.target as Record<string, unknown>;
  }

  const audience = request.audience ?? 'executive';
  const evidenceSnapshot: IntegratedReportData = {
    _meta: {
      fetchedAt: new Date().toISOString(),
      translationSource: 'config/ontology-translation.json',
      dryEyeEfoIds,
      dryEyeProxyLabels: diseasesResolved.map((r) => r.label),
      trigeminalGeneSymbols,
      trigeminalTargetIds,
      source: provider.isMocked ? '[MOCK] Open Targets data' : 'Open Targets Platform',
      requestInput: {
        drug: drugInput,
        diseases: diseaseInputs,
        targets: targetInputs,
        audience,
        mode,
      },
      queryOperations: ['drug summary (ChEMBL ID)', 'disease-dry-eye (EFO IDs)', 'target-summary (Ensembl IDs)'],
    },
    drug: drug?.drug as Record<string, unknown> ?? null,
    diseases,
    targets,
  };

  const markdown = buildIntegratedReportMarkdown(evidenceSnapshot, '', audience);
  const sections = buildIntegratedReportSections(evidenceSnapshot, audience);

  mkdirSync(artifactDir, { recursive: true });
  const markdownPath = join(artifactDir, 'report.md');
  writeFileSync(markdownPath, markdown, 'utf8');
  const evidencePath = join(artifactDir, 'evidence.json');
  writeFileSync(evidencePath, JSON.stringify(evidenceSnapshot, null, 2), 'utf8');

  return {
    markdown,
    sections: sections.map((s) => ({ id: s.id, title: s.title, body: s.body })),
    resolvedEntities,
    evidenceSnapshot,
  };
}
