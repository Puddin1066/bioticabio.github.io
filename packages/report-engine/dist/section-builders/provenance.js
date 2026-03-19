/**
 * Build data provenance section (input, query structure, resolution, re-run).
 */
export function buildProvenance(meta) {
    const efoIds = (meta?.dryEyeEfoIds ?? []).join(', ') || '—';
    const proxyLabels = (meta?.dryEyeProxyLabels ?? []).join(', ') || '—';
    const symbols = (meta?.trigeminalGeneSymbols ?? []).join(', ') || '—';
    const trigIds = (meta?.trigeminalTargetIds ?? []).join(', ') || '—';
    const source = meta?.translationSource ?? 'config';
    const parts = [];
    if (meta?.requestInput) {
        const r = meta.requestInput;
        const drug = r.drug ?? '—';
        const diseases = (r.diseases ?? []).length ? (r.diseases ?? []).join(', ') : '—';
        const targets = (r.targets ?? []).length ? (r.targets ?? []).join(', ') : '—';
        const audience = r.audience ?? '—';
        const mode = r.mode ?? '—';
        parts.push('**Report parameters (input):** drug: ' + drug + '; diseases: ' + diseases + '; targets: ' + targets + '; audience: ' + audience + '; data mode: ' + mode + '.');
    }
    if (meta?.queryOperations?.length) {
        parts.push('**Query structure:** Open Targets GraphQL operations used: ' + meta.queryOperations.join(', ') + '.');
    }
    parts.push('Report generated from the **Open Targets Platform GraphQL API**. Entity resolution uses an **ontology translation table** (' +
        source +
        '): dry eye → EFO proxies (' +
        efoIds +
        '; ' +
        proxyLabels +
        '), trigeminal pathway → gene proxies (' +
        symbols +
        '). Resolved IDs used in queries: drug (ChEMBL), disease (EFO: ' +
        efoIds +
        '), targets (Ensembl: ' +
        trigIds +
        ').');
    parts.push('**Re-run:** Submit the same parameters via the Report API (`POST /reports`).');
    return parts.join('\n\n');
}
//# sourceMappingURL=provenance.js.map