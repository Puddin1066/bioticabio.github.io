---
title: The platform
layout: default
nav_order: 8
description: Open Targets Platform — the evidence base behind Biotica Bio assessments
---

# The platform

Biotica Bio assessments are powered by the **Open Targets Platform**: a public, evidence-based resource that integrates targets, diseases, drugs, and associations from many curated and experimental sources.
{: .lead }

## Why Open Targets matters

The Open Targets Platform is the same evidence base that **industry and academia** use for target validation and drug discovery. Its value comes from:

- **Public and trusted** — Non-proprietary; targets, diseases, drugs, variants, and studies are annotated and linked from curated and experimental sources (genetics, literature, pathways, tractability, safety).
- **Integrated model** — One framework connects [targets](https://platform-docs.opentargets.org/target), [diseases and phenotypes](https://platform-docs.opentargets.org/disease-or-phenotype), [evidence](https://platform-docs.opentargets.org/evidence), and [scored target–disease associations](https://platform-docs.opentargets.org/associations), so you get a consistent picture instead of scattered databases.
- **Evidence in one place** — Associations are generated and scored from many datasources; the Platform aggregates and weights this so you can interrogate it interactively or via API.
- **Single API, reproducible** — One GraphQL API delivers the full evidence picture. Same query, same result; you can re-run or audit as data updates.

We build on this so every Biotica Bio narrative is **traceable, updatable, and aligned with the same standard the rest of the field uses**.

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

## Benchmarking drug, target, and indication potential

A valuable way to use the Platform is to **benchmark** drug, gene (target), or indication **potential and evaluations** on the same evidence base. Because the API delivers consistent entities (targets, diseases, drugs), scored associations, prioritisation metrics, tractability, and known drugs per indication, you can:

- **Compare targets** — Same query shape for any gene; prioritisation scores, association scores, and tractability let you rank or compare targets within a therapeutic area or pipeline.
- **Compare indications** — Disease-level data (associated targets, known drugs, therapeutic area) supports comparing indications for a given drug or target, or benchmarking one indication against the landscape.
- **Compare drugs** — Drug-centric queries (mechanisms, indications, targets) give a consistent basis to evaluate repurposing potential or positioning across a shortlist.

We use this in practice as **pipeline prioritisation** and **competitive context**: compare targets and indications on the same evidence base, see how a thesis sits relative to the Platform landscape, and re-run as data updates so benchmarks stay current. Reports don't yet expose a single "benchmark score" widget—they interpret the same underlying scores and landscape data so you can focus on the best opportunities and differentiation.

## Entities and query space

The Platform's [data model](https://platform-docs.opentargets.org/getting-started) is built around **five main entities**. The GraphQL API lets you query by entity and then traverse to related data—so you can start from a target, a disease, or a drug and get the full linked picture.

| Entity | What it is | Query entry (example) | What you can ask for from it |
|--------|------------|------------------------|------------------------------|
| **Target** | Candidate drug-binding molecule (e.g. gene/product) | `target(ensemblId: "ENSG00000139618")` | Pathways, GO, hallmarks, tractability, **associatedDiseases**, **knownDrugs**, evidence, prioritisation, safety, expression, interactions |
| **Disease / Phenotype** | Disease indication, phenotype, or trait (EFO/MONDO) | `disease(efoId: "EFO_0000616")` | Name, ontology; **associatedTargets**, **knownDrugs**; therapeutic area |
| **Drug** | Molecule as medicinal product (ChEMBL) | `drug(chemblId: "CHEMBL192")` | Indications, mechanisms, targets, phases, drug type |
| **Variant** | DNA variant associated with disease or trait | *via API* | Links to studies, traits, and targets; population frequencies, variant effect, transcript consequences |
| **Study** | Source of evidence (e.g. GWAS, molQTL) linking variants to traits | *via API* | Links to variants, traits, molecular phenotypes; GWAS/molQTL credible sets |

### Which entities the pipeline uses today

The **report pipeline and Open Targets provider** currently use **three** of the five entities:

- **Target** — `requestTarget` (target-summary, oncology-target-assessment).
- **Disease / Phenotype** — `requestDisease` (disease-landscape, disease-dry-eye).
- **Drug** — `requestDrug` (drug-assessment).

**Variant** and **Study** are first-class in the Platform (variant pages, GWAS/molQTL studies, credible sets, Locus-to-Gene) but are **not yet** exposed in our provider or report pipeline—no GraphQL query loaders or `requestVariant` / `requestStudy` methods. Adding them would mean new queries and section builders (e.g. genetics evidence or study-backed associations) for reports that need variant- or study-centric views.

In practice, Biotica Bio assessments today **start from a target**, **disease**, or **drug**: one query then pulls associations, known drugs, evidence, and—when we need landscape context—related diseases and their associated targets and drugs. The same API supports target-centric, disease-centric, or drug-centric views so the query space matches how you think about the biology or the deal.

## Why it matters for you

- **Credibility** — Every claim in a Biotica Bio report can be traced back to the Platform and its upstream sources.
- **Reproducibility** — Same query, same API; you can re-run or audit as data updates.
- **Speed** — One structured query replaces ad hoc literature and database diving for a first-pass assessment.

To see how this evidence is translated into decisions, explore [example deliverables]({% link example.md %}) and then [contact us for scoped support]({% link contact.md %}).

{: .note }
**Powered by Open Targets. Interpretation and strategy by Biotica Bio.**

Biotica Bio is not affiliated with Open Targets. We use the Platform as our primary evidence source; upstream data is maintained and documented by the [Open Targets project](https://www.opentargets.org/) and the respective databases.

## Links

- [Open Targets](https://www.opentargets.org/)
- [Open Targets — Getting started](https://platform-docs.opentargets.org/getting-started) (data model, evidence, associations)
- [Open Targets Platform GraphQL API](https://api.platform.opentargets.org/api/v4/graphql) (browser Playground and schema)
