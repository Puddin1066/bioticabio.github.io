---
title: How it's built
layout: default
nav_order: 7
description: One query to evidence to narrative — Biotica Bio method
---

# How it's built

Biotica Bio assessments are **reproducible by design**: one GraphQL query against the Open Targets Platform returns structured evidence (target, pathways, disease associations, druggability, safety, DepMap, literature, and more). We turn that data into a narrative report—so you get both the evidence and the interpretation.
{: .lead }

## Flow

1. **One query** — We run a comprehensive oncology target assessment query (or a variant for your use case) against the [Open Targets Platform GraphQL API](https://api.platform.opentargets.org/api/v4/graphql).
2. **Structured data** — The API returns JSON: genes, pathways, associations, known drugs, tractability, prioritisation scores, safety, expression, genetic constraint, literature counts, and more.
3. **Narrative report** — We interpret that data and write the executive summary, strategic points, and recommendations you see in reports like the [BRCA2 example]({% link example/brca2-report.md %}).

Same query, same data—you can **re-run as evidence updates** or have your own team audit the inputs. For the BRCA2 example, the response was generated from `oncology-result.json`; the narrative was added for executive use.

## The query

The BRCA2 report used the following GraphQL query (target ID `ENSG00000139618`). You can run it in the [Open Targets GraphQL Playground](https://api.platform.opentargets.org/api/v4/graphql) or in your own environment. For the Platform's entities and how they are queried (target, disease, drug, variant, study), see [The platform → Entities and query space]({% link the-platform.md %}#entities-and-query-space).

```graphql
# Comprehensive oncology target assessment
# Replace ensemblId for a different target (e.g. BRCA1, EGFR, TP53)
query OncologyTargetAssessment {
  target(ensemblId: "ENSG00000139618") {
    id
    approvedSymbol
    approvedName
    biotype
    genomicLocation { chromosome start end strand }
    pathways { pathwayId pathway topLevelTerm }
    geneOntology { term { id name } aspect evidence geneProduct source }
    functionDescriptions
    hallmarks {
      cancerHallmarks { label description impact pmid }
      attributes { name description pmid }
    }
    tractability { label modality value }
    targetClass { id label level }
    chemicalProbes { id isHighQuality mechanismOfAction probeMinerScore urls { niceName url } }
    tep { name uri therapeuticArea description }
    knownDrugs(size: 20) {
      count uniqueDrugs uniqueDiseases
      rows { drugId prefName drugType diseaseId label phase status mechanismOfAction targetClass }
    }
    associatedDiseases(page: { index: 0, size: 25 }, orderByScore: "score desc") {
      count
      rows { score datatypeScores { id score } datasourceScores { id score } disease { id name therapeuticAreas { id name } } }
    }
    evidences(efoIds: ["EFO_0000616"], size: 10) { count rows { id score datasourceId datatypeId disease { id } target { id } } }
    isEssential
    depMapEssentiality { tissueId tissueName screens { cellLineName diseaseFromSource geneEffect expression } }
    prioritisation { items { key value } }
    safetyLiabilities { event eventId datasource effects { direction dosing } literature url biosamples { tissueLabel cellLabel } }
    expressions { tissue { id label anatomicalSystems organs } rna { level zscore value unit } protein { level reliability } }
    geneticConstraint { constraintType score oe oeLower oeUpper }
    literatureOcurrences(startYear: 2015) { count rows { pmid publicationDate pmcid } }
  }
}
```

Example target IDs: BRCA1 `ENSG00000012048`, EGFR `ENSG00000146648`, KRAS `ENSG00000133703`, TP53 `ENSG00000141510`, PIK3CA `ENSG00000121879`.

For the full query file (with comments), see `docs/oncology-target-assessment.graphql` in the project repository (the same repo that contains this docs site).

## Reproducibility

- **Same query, same API** — Anyone with access to the Open Targets Platform can re-run this query and get the same evidence base.
- **Updates** — When Open Targets or upstream sources release new data, re-running the query and regenerating the report keeps the assessment current.
- **Audit** — The methodology is transparent: data from the Platform; interpretation and narrative by Biotica Bio.

For more on the Platform itself, see [The platform]({% link the-platform.md %}).
