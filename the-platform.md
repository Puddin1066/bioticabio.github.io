---
title: The platform
nav_order: 8
description: Open Targets Platform — the evidence base behind Biotica Bio assessments
---

# The platform

Biotica Bio assessments are powered by the **Open Targets Platform**: a public, evidence-based resource that integrates targets, diseases, drugs, and associations from many curated and experimental sources.

## What the Platform provides

The [Open Targets Platform](https://www.opentargets.org/) exposes a **GraphQL API** that delivers:

- **Targets** — Gene identity, pathways (e.g. Reactome), Gene Ontology, cancer hallmarks (COSMIC), tractability, target class, chemical probes, known drugs.
- **Diseases** — Ontologies (EFO, MONDO), therapeutic areas.
- **Target–disease associations** — Scored associations with evidence from genetics, literature, pathways, and other datasources (EVA, Europe PMC, Genomics England, IMPC, Cancer Gene Census, Reactome, and more).
- **Prioritisation** — Composite scores (genetic constraint, cancer driver status, DepMap essentiality, mouse phenotypes, tissue specificity).
- **Safety** — Target-level safety/liability data where available.
- **Expression** — Tissue and biosample expression (e.g. Expression Atlas, Human Protein Atlas).
- **Literature** — Publication counts and metadata (e.g. Europe PMC).

That evidence is the same data that industry and academia use for target validation and drug discovery. We don’t own or host it—we **query it, interpret it, and turn it into strategy and due-diligence narratives** for startups and investors.

## Why it matters for you

- **Credibility** — Every claim in a Biotica Bio report can be traced back to the Platform and its upstream sources.
- **Reproducibility** — Same query, same API; you can re-run or audit as data updates.
- **Speed** — One structured query replaces ad hoc literature and database diving for a first-pass assessment.

{: .note }
**Powered by Open Targets. Interpretation and strategy by Biotica Bio.**

Biotica Bio is not affiliated with Open Targets. We use the Platform as our primary evidence source; upstream data is maintained and documented by the [Open Targets project](https://www.opentargets.org/) and the respective databases.

## Links

- [Open Targets](https://www.opentargets.org/)
- [Open Targets Platform GraphQL API](https://api.platform.opentargets.org/api/v4/graphql) (browser Playground and schema)
