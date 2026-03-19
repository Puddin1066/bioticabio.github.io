import type { ResolvedEntity } from '@biotica/core';
import type { IOpenTargetsProvider } from '@biotica/opentargets';
import type { OntologyTranslation } from './translation.js';
/**
 * Resolve disease input to one or more EFO IDs with labels.
 * - If input looks like EFO_*, use as ID and fetch name from provider.
 * - Else if translation has dry_eye.efo_proxies and input matches dry-eye semantics, use proxies.
 * - Otherwise use mapIds with translation search_terms_fallback or the input as single term.
 * Returns empty array if resolution fails. Validates that fetched disease id/name match when possible.
 */
export declare function resolveDisease(provider: IOpenTargetsProvider, input: string, translation?: OntologyTranslation | null): Promise<ResolvedEntity[]>;
/**
 * Resolve multiple disease inputs (EFO IDs or names). Deduplicates by resolvedId.
 */
export declare function resolveDiseases(provider: IOpenTargetsProvider, inputs: string[], translation?: OntologyTranslation | null): Promise<ResolvedEntity[]>;
//# sourceMappingURL=resolveDisease.d.ts.map