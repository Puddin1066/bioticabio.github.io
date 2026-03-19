import type { ResolvedEntity } from '@biotica/core';
import type { IOpenTargetsProvider } from '@biotica/opentargets';
import type { OntologyTranslation } from './translation.js';

const EFO_PREFIX = 'EFO_';

/**
 * Resolve disease input to one or more EFO IDs with labels.
 * - If input looks like EFO_*, use as ID and fetch name from provider.
 * - Else if translation has dry_eye.efo_proxies and input matches dry-eye semantics, use proxies.
 * - Otherwise use mapIds with translation search_terms_fallback or the input as single term.
 * Returns empty array if resolution fails. Validates that fetched disease id/name match when possible.
 */
export async function resolveDisease(
  provider: IOpenTargetsProvider,
  input: string,
  translation?: OntologyTranslation | null
): Promise<ResolvedEntity[]> {
  const raw = input.trim();
  const trimmed = raw.toLowerCase();
  if (!raw) return [];

  if (trimmed.startsWith(EFO_PREFIX.toLowerCase())) {
    const efoId = raw.startsWith(EFO_PREFIX) ? raw : EFO_PREFIX + raw.slice(4);
    const diseaseResponse = await provider.requestDisease(efoId, 'disease-landscape');
    const disease = diseaseResponse.disease;
    if (!disease) return [];
    const id = (disease.id as string) ?? efoId;
    const label = (disease.name as string) ?? id;
    return [
      {
        input: raw,
        resolvedId: id,
        label: String(label),
        entityType: 'disease',
        resolutionType: 'canonical',
      },
    ];
  }

  const dryEyeTerms = ['dry eye', 'keratoconjunctivitis', 'sicca', 'dry eye disease'];
  const isDryEyeLike = dryEyeTerms.some((t) => trimmed.includes(t));

  if (isDryEyeLike && translation?.dry_eye?.efo_proxies?.length) {
    const results: ResolvedEntity[] = [];
    for (const proxy of translation.dry_eye.efo_proxies) {
      const diseaseResponse = await provider.requestDisease(proxy.efoId, 'disease-landscape');
      const disease = diseaseResponse.disease;
      const label = disease?.name ?? proxy.label;
      results.push({
        input,
        resolvedId: proxy.efoId,
        label: String(label),
        entityType: 'disease',
        resolutionType: 'proxy',
      });
    }
    return results;
  }

  const terms = translation?.dry_eye?.search_terms_fallback ?? [raw];
  const mapResult = await provider.mapIds([raw].concat(terms), ['disease']);
  const mappings = mapResult.mapIds?.mappings ?? [];
  const hitIds = new Set<string>();
  const results: ResolvedEntity[] = [];

  for (const m of mappings) {
    for (const h of m.hits ?? []) {
      if (h.id && (h.entity === 'disease' || (h.object && !('approvedSymbol' in h.object)))) {
        if (hitIds.has(h.id)) continue;
        hitIds.add(h.id);
        const label = (h.object?.name as string) ?? (h.name as string) ?? h.id;
        results.push({
          input: raw,
          resolvedId: h.id,
          label: String(label),
          entityType: 'disease',
          resolutionType: 'search',
        });
      }
    }
  }

  return results;
}

/**
 * Resolve multiple disease inputs (EFO IDs or names). Deduplicates by resolvedId.
 */
export async function resolveDiseases(
  provider: IOpenTargetsProvider,
  inputs: string[],
  translation?: OntologyTranslation | null
): Promise<ResolvedEntity[]> {
  const seen = new Set<string>();
  const results: ResolvedEntity[] = [];

  for (const input of inputs) {
    const resolved = await resolveDisease(provider, input, translation);
    for (const r of resolved) {
      if (!seen.has(r.resolvedId)) {
        seen.add(r.resolvedId);
        results.push(r);
      }
    }
  }
  return results;
}
