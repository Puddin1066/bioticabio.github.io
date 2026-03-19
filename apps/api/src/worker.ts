import { OpenTargetsProviderLive, MockOpenTargetsProvider } from '@biotica/opentargets';
import { runIntegratedPipeline } from './pipeline.js';
import { getNextQueuedRun, updateRun, getRun, getDataDir } from './store.js';
import { join } from 'path';

function processOne(): boolean {
  const reportId = getNextQueuedRun();
  if (!reportId) return false;

  const run = getRun(reportId);
  if (!run || run.status !== 'queued') return false;

  updateRun(reportId, { status: 'running' });

  const mode = run.request.context?.mode ?? 'live';
  const provider = mode === 'mocked' ? new MockOpenTargetsProvider() : new OpenTargetsProviderLive();

  if (run.reportType !== 'integrated-thesis') {
    updateRun(reportId, { status: 'failed', error: `Unsupported report type: ${run.reportType}` });
    return true;
  }

  const artifactDir = join(getDataDir(), reportId);

  runIntegratedPipeline(provider, run.request, artifactDir)
    .then((result) => {
      const markdownPath = join(artifactDir, 'report.md');
      updateRun(reportId, {
        status: 'completed',
        resolvedEntities: result.resolvedEntities,
        evidenceSnapshot: result.evidenceSnapshot as unknown as import('@biotica/core').EvidenceSnapshot,
        sections: result.sections,
        artifactMarkdownPath: markdownPath,
      });
    })
    .catch((err) => {
      updateRun(reportId, {
        status: 'failed',
        error: err instanceof Error ? err.message : String(err),
      });
    });

  return true;
}

export function runWorkerLoop(intervalMs = 2000): void {
  function tick() {
    processOne();
    setTimeout(tick, intervalMs);
  }
  tick();
}
