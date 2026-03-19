import type { ResolvedEntity } from '@biotica/core';
import type { IOpenTargetsProvider } from '@biotica/opentargets';
/**
 * Resolve target input to a canonical Ensembl ID and label.
 * - If input looks like ENSG*, use as ID and fetch name from provider (optional validation).
 * - Otherwise search by symbol and take first target hit.
 * Returns null if resolution fails or validation rejects (e.g. wrong type).
 */
export declare function resolveTarget(provider: IOpenTargetsProvider, input: string): Promise<ResolvedEntity | null>;
/**
 * Resolve multiple target inputs (e.g. gene symbols) to Ensembl IDs via search.
 * Used for integrated reports (e.g. trigeminal pathway proxies).
 */
export declare function resolveTargets(provider: IOpenTargetsProvider, inputs: string[]): Promise<ResolvedEntity[]>;
//# sourceMappingURL=resolveTarget.d.ts.map