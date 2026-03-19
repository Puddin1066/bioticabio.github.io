import type { ResolvedEntity } from '@biotica/core';
import type { IOpenTargetsProvider } from '@biotica/opentargets';

const CHEMBL_PREFIX = 'CHEMBL';

/**
 * Resolve drug input to ChEMBL ID and label.
 * - If input looks like CHEMBL*, use as ID and fetch name from provider.
 * - Otherwise we do not resolve by name (Open Targets drug search not in scope); return null.
 */
export async function resolveDrug(
  provider: IOpenTargetsProvider,
  input: string
): Promise<ResolvedEntity | null> {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith(CHEMBL_PREFIX)) {
    const drugResponse = await provider.requestDrug(trimmed);
    const drug = drugResponse.drug;
    if (!drug) return null;
    const id = (drug.id as string) ?? trimmed;
    const label = (drug.name as string) ?? id;
    return {
      input: trimmed,
      resolvedId: id,
      label: String(label),
      entityType: 'drug',
      resolutionType: 'canonical',
    };
  }

  return null;
}
