# Report reflection criteria (objective model)

Used over 5 cycles to refine the progesterone / trigeminal / dry eye report and data pipeline.

## Data and resolution

- **No pipeline-failure tone:** Report must never say "could not be resolved" or "try re-running when the API is available" as the main message. Use ontology proxies and framing so the narrative is robust to API gaps.
- **Dry eye:** Represented by EFO proxies (e.g. Sjögren syndrome); state that dry eye is poorly represented as a single node and that Open Targets is stronger for autoimmune drivers, weaker for multifactorial symptom syndromes.
- **Trigeminal:** Represented by gene-level proxies (TRPV1, TRPM8, SCN9A, CHRM3), not by searching for "trigeminal nerve." Explain that Open Targets indexes genes, not anatomy.

## Commercial and R&D framing

- **Progesterone:** Include biology that matters (nuclear hormone receptor, meibomian/lacrimal, hormonal modulation of dry eye). Position as hormonal modulation axis of tear film physiology and bridge to neuro-lacrimal hypotheses.
- **Integration:** State orthogonal paradigms—Open Targets emphasises immune/inflammatory targets; the drug thesis emphasises neuro-reflex/hormonal modulation. That contrast is the signal.
- **Commercial take:** Dry eye market = crowded (anti-inflammatory, tear stabilisation); emerging niche = neurostimulation (e.g. Tyrvaya); progesterone = biological plausibility layer; positioning = neuro-lacrimal activation, distinct from immune/lubrication.
- **R&D take:** Open Targets is useful for showing what the mechanism is *not* (dominant landscape = immune; proposed = neural reflex). That contrast is the insight.

## Data-backed

- Use an ontology translation table (dry eye EFO proxies, trigeminal gene symbols) so the fetch is reproducible and does not depend only on mapIds/search.
- Report must show real Platform data (tables, counts) where available; narrative interprets the data rather than replacing it.
