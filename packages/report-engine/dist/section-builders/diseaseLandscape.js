import { safe, MAX_DRUGS_PER_DISEASE, MAX_TARGETS_PER_DISEASE } from '../utils.js';
/**
 * Build dry eye / disease landscape section for integrated or disease-centric report.
 */
export function buildDryEyeSection(diseases, meta) {
    const entries = Object.entries(diseases || {}).filter(([, d]) => d && d.name);
    const efoIds = meta?.dryEyeEfoIds ?? [];
    const proxyLabels = meta?.dryEyeProxyLabels ?? [];
    let section = '**Framing:** Dry eye is poorly represented as a single node in ontologies; it is often split across keratoconjunctivitis sicca, Sjögren syndrome, and ocular surface disease. We use **ontology proxies** that overlap clinically with dry eye. Open Targets is strongest for autoimmune drivers (e.g. Sjögren) and weaker for multifactorial symptom syndromes—that nuance is a valuable insight, not a limitation.\n\n';
    if (entries.length === 0) {
        section += `**Proxies used (EFO IDs):** ${efoIds.join(', ') || 'none'}. ${proxyLabels.length ? `Labels: ${proxyLabels.join(', ')}.` : ''} No disease payload returned for those IDs in this run; the framing above still holds for how dry eye maps to the Platform.\n\n*Open Targets is used for target/biology context; it may not fully enumerate the commercial dry eye market.*\n`;
        return section;
    }
    section += `**Proxies in this report:** ${efoIds.join(', ')}. ${proxyLabels.length ? `(${proxyLabels.join(', ')})` : ''}\n\n`;
    section += '| Disease | EFO ID | Therapeutic area(s) |\n|---------|--------|---------------------|\n';
    entries.forEach(([efoId, d]) => {
        const areas = (d.therapeuticAreas || []).map((a) => a.name).join('; ') || '—';
        section += `| ${safe(d.name)} | ${efoId} | ${areas} |\n`;
    });
    section += '\n';
    const d = entries[0][1];
    const knownDrugs = d.knownDrugs || {};
    const kdRows = (knownDrugs.rows || []).slice(0, MAX_DRUGS_PER_DISEASE);
    section += `**Known drugs (Platform, this node):** ${knownDrugs.count ?? 0} total. Top ${kdRows.length}:\n\n`;
    if (kdRows.length > 0) {
        section += '| Drug | Phase | Target |\n|------|-------|--------|\n';
        kdRows.forEach((r) => {
            const t = r.target ? (r.target.approvedSymbol || r.target.approvedName) : (r.targetId || '—');
            section += `| ${safe(r.prefName, r.drugId)} | ${safe(r.phase)} | ${t} |\n`;
        });
    }
    else {
        section += '*No drug rows in this disease node.* Sparse nodes do not imply absence of real-world competition. Re-run the report after a Platform update if you need the latest competitive drug list for this indication.\n';
    }
    section += '\n';
    const at = d.associatedTargets || {};
    const atRows = (at.rows || []).slice(0, MAX_TARGETS_PER_DISEASE);
    section += `**Associated targets (Platform):** ${at.count ?? 0} total. Top ${atRows.length}:\n\n`;
    if (atRows.length > 0) {
        section += '| Target | Score |\n|--------|-------|\n';
        atRows.forEach((r) => {
            const sym = r.target ? (r.target.approvedSymbol || r.target.approvedName) : '—';
            section += `| ${sym} | ${r.score != null ? r.score.toFixed(3) : '—'} |\n`;
        });
    }
    else {
        section += '*No target rows.*\n';
    }
    const knownDrugsCount = knownDrugs.count ?? 0;
    const associatedTargetsCount = at.count ?? 0;
    section += `\n**Data-backed benchmark:** This run: **${knownDrugsCount}** known drugs, **${associatedTargetsCount}** associated targets for the dry eye proxy node(s). Use these counts to benchmark other indications or re-runs.\n\n`;
    section += '*Open Targets is a tool for target identification and prioritisation; it may not fully enumerate the commercial dry eye market.*\n';
    return section;
}
//# sourceMappingURL=diseaseLandscape.js.map