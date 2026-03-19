import type { ResolvedEntity } from '@biotica/core';
import type { IOpenTargetsProvider } from '@biotica/opentargets';
/**
 * Resolve drug input to ChEMBL ID and label.
 * - If input looks like CHEMBL*, use as ID and fetch name from provider.
 * - Otherwise we do not resolve by name (Open Targets drug search not in scope); return null.
 */
export declare function resolveDrug(provider: IOpenTargetsProvider, input: string): Promise<ResolvedEntity | null>;
//# sourceMappingURL=resolveDrug.d.ts.map