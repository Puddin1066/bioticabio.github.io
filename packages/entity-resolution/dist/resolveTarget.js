const ENSEMBL_PREFIX = 'ENSG';
/**
 * Resolve target input to a canonical Ensembl ID and label.
 * - If input looks like ENSG*, use as ID and fetch name from provider (optional validation).
 * - Otherwise search by symbol and take first target hit.
 * Returns null if resolution fails or validation rejects (e.g. wrong type).
 */
export async function resolveTarget(provider, input) {
    const trimmed = input.trim();
    if (!trimmed)
        return null;
    if (trimmed.startsWith(ENSEMBL_PREFIX)) {
        const targetResponse = await provider.requestTarget(trimmed, 'target-summary');
        const target = targetResponse.target;
        if (!target)
            return null;
        const id = target.id ?? trimmed;
        const label = target.approvedSymbol ?? target.approvedName ?? id;
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
    const targetHit = hits.find((h) => h.entity === 'target' && (h.object?.approvedSymbol || h.id?.startsWith(ENSEMBL_PREFIX)));
    if (!targetHit?.id)
        return null;
    const resolvedId = targetHit.id;
    const label = targetHit.object?.approvedSymbol ??
        targetHit.object?.approvedName ??
        targetHit.name ??
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
export async function resolveTargets(provider, inputs) {
    const results = [];
    const seen = new Set();
    for (const input of inputs) {
        const resolved = await resolveTarget(provider, input);
        if (resolved && !seen.has(resolved.resolvedId)) {
            seen.add(resolved.resolvedId);
            results.push(resolved);
        }
    }
    return results;
}
//# sourceMappingURL=resolveTarget.js.map