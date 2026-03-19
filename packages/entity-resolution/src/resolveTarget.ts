import type { ResolvedEntity } from '@biotica/core';
import type { IOpenTargetsProvider } from '@biotica/opentargets';

const ENSEMBL_PREFIX = 'ENSG';

/**
 * Resolve target input to a canonical Ensembl ID and label.
 * - If input looks like ENSG*, use as ID and fetch name from provider (optional validation).
 * - Otherwise search by symbol and take first target hit.
 * Returns null if resolution fails or validation rejects (e.g. wrong type).
 */
export async function resolveTarget(
  provider: IOpenTargetsProvider,
  input: string
): Promise<ResolvedEntity | null> {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith(ENSEMBL_PREFIX)) {
    const targetResponse = await provider.requestTarget(trimmed, 'target-summary');
    const target = targetResponse.target;
    if (!target) return null;
    const id = (target.id as string) ?? trimmed;
    const label =
      (target.approvedSymbol as string) ?? (target.approvedName as string) ?? id;
    return {
      input: trimmed,
      resolvedId: id,
      label: String(label),
      entityType: 'target',
      resolutionType: 'canonical',
    };
  }

  const searchResult = await provider.searchEntities(trimmed, ['target'], { index: 0, size: 5 });
  const hits = searchResult.search?.hits ?? [];
  const targetHit = hits.find(
    (h) => h.entity === 'target' && (h.object?.approvedSymbol || h.id?.startsWith(ENSEMBL_PREFIX))
  );
  if (!targetHit?.id) return null;

  const resolvedId = targetHit.id;
  const label =
    (targetHit.object?.approvedSymbol as string) ??
    (targetHit.object?.approvedName as string) ??
    (targetHit.name as string) ??
    resolvedId;

  return {
    input: trimmed,
    resolvedId,
    label: String(label),
    entityType: 'target',
    resolutionType: 'search',
  };
}

/**
 * Resolve multiple target inputs (e.g. gene symbols) to Ensembl IDs via search.
 * Used for integrated reports (e.g. trigeminal pathway proxies).
 */
export async function resolveTargets(
  provider: IOpenTargetsProvider,
  inputs: string[]
): Promise<ResolvedEntity[]> {
  const results: ResolvedEntity[] = [];
  const seen = new Set<string>();

  for (const input of inputs) {
    const resolved = await resolveTarget(provider, input);
    if (resolved && !seen.has(resolved.resolvedId)) {
      seen.add(resolved.resolvedId);
      results.push(resolved);
    }
  }
  return results;
}
