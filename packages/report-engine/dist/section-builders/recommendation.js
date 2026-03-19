/**
 * Build audience-aware recommendation / next steps (2–4 bullets, deterministic).
 */
export function buildRecommendationSection(data, audience) {
    const aud = audience ?? 'executive';
    const bullets = [];
    if (aud === 'investor') {
        bullets.push('Validate neuro-reflex and hormonal positioning with key opinion leaders or clinical advisors.');
        bullets.push('Confirm competitive landscape for dry eye (Platform may undercount in some nodes); re-run report after Platform updates if drug lists are material to the thesis.');
        bullets.push('Use this report\'s data-backed benchmarks (indication count, known drugs, association scores) when evaluating or comparing other candidates.');
        bullets.push('Use the orthogonal-mechanism framing (immune vs neuro-reflex) to articulate diligence risk: evidence supports differentiation, but direct dry eye indication is not in the Platform.');
    }
    else if (aud === 'executive') {
        bullets.push('Use the orthogonal-mechanism narrative (immune vs neuro-reflex) for strategic messaging and board-level positioning.');
        bullets.push('Prioritise neuro-lacrimal and gland-modulation angles; avoid positioning as "another dry eye drug" in crowded anti-inflammatory/lubrication space.');
        bullets.push('Leverage data-backed benchmarks (indication count, known drugs, target–disease scores) in this report when comparing pipeline or portfolio options.');
        bullets.push('Re-run the report when Open Targets data refreshes to keep competitive and target landscape current.');
    }
    else if (aud === 'bd') {
        bullets.push('Use Platform competitive set and associated targets for partner-facing slides; emphasise differentiation (neurostimulation / endogenous tear activation niche vs immune/lubrication).');
        bullets.push('Use this report\'s data-backed benchmarks (indication count, known drugs, target counts) to compare assets in partner or pipeline discussions.');
        bullets.push('Highlight CHRM3 and other trigeminal proxies in the dry eye–associated set as a concrete link for partner discussions.');
        bullets.push('Frame Pro-ocular-style positioning as adjacent to but distinct from immune modulation and lubrication.');
    }
    else {
        bullets.push('Use the ontology proxy rationale (dry eye → Sjögren; trigeminal → gene proxies) when citing evidence; note Platform strengths (autoimmune) vs limits (multifactorial syndromes).');
        bullets.push('Use this report\'s data-backed benchmarks (counts, scores) to compare other drug/target/indication evaluations on the same evidence base.');
        bullets.push('Re-run after Platform updates to refresh target and disease associations.');
    }
    return bullets.map((b) => `- ${b}`).join('\n');
}
//# sourceMappingURL=recommendation.js.map