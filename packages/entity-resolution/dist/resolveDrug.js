const CHEMBL_PREFIX = 'CHEMBL';
/**
 * Resolve drug input to ChEMBL ID and label.
 * - If input looks like CHEMBL*, use as ID and fetch name from provider.
 * - Otherwise we do not resolve by name (Open Targets drug search not in scope); return null.
 */
export async function resolveDrug(provider, input) {
    const trimmed = input.trim();
    if (!trimmed)
        return null;
    if (trimmed.startsWith(CHEMBL_PREFIX)) {
        const drugResponse = await provider.requestDrug(trimmed);
        const drug = drugResponse.drug;
        if (!drug)
            return null;
        const id = drug.id ?? trimmed;
        const label = drug.name ?? id;
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
//# sourceMappingURL=resolveDrug.js.map