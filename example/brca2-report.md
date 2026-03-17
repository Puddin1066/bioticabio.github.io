---
title: BRCA2 executive report
parent: Example
nav_order: 1
description: Full BRCA2 oncology target assessment — Biotica Bio example deliverable
---

# BRCA2: Executive Oncology Target Assessment

This is an example Biotica Bio deliverable: a comprehensive oncology target assessment for **BRCA2**, generated from the Open Targets Platform API and interpreted for strategy and due diligence. The data below is derived from the Platform’s aggregated sources; the narrative and strategic synthesis are by Biotica Bio.

{: .warning }
This assessment is for strategic and due-diligence use only; it does not constitute regulatory, medical, or investment advice.

For how this report was produced (one GraphQL query → data → narrative), see [How it's built]({{ site.baseurl }}{% link how-its-built.md %}).

*Data: Open Targets Platform. Interpretation and narrative: Biotica Bio.*

---

**Target:** BRCA2 (*BRCA2 DNA repair associated*)  
**Gene ID:** ENSG00000139618  
**Locus:** Chr 13 (32.3–32.4 Mb)  
**Report source:** Open Targets Platform API (oncology comprehensive query). All data in this report is derived from the Platform’s aggregated sources; see §10 and inline citations.  
**Audience:** Pharma / biotech strategy and R&D leadership

---

## 1. Executive summary

*Synthesis drawn from all cited data sources below (Ensembl, Reactome, GO, COSMIC, association/evidence pipeline, ChEMBL, gnomAD, DepMap, Expression Atlas, Europe PMC, and Open Targets prioritisation).*

BRCA2 is a **high‑confidence, biology‑rich oncology target** with a very strong genetic and mechanistic link to breast, ovarian, prostate, and other cancers, and to Fanconi anemia. The evidence base is large (thousands of associations and evidence items) and the target is **not currently drugged directly** (no approved small‑molecule or biologic targeting BRCA2 itself), creating both opportunity and development risk. **Strategic takeaway:** the main opportunity is **indirect modulation** (e.g. synthetic lethality with PARP, or DNA repair pathway context) and **patient selection / stratification** in existing and new therapies, rather than a first‑in‑class direct BRCA2 binder in the short term.

---

## 2. Target and biology

*Data sources: Ensembl (gene identity, locus, biotype); Reactome (pathways); Gene Ontology (GO annotations); COSMIC (cancer hallmarks).*

| Attribute | Summary |
|-----------|--------|
| **Gene** | BRCA2 (protein coding) *[Ensembl]* |
| **Primary function** | DNA repair (homologous recombination), genome stability *[Gene Ontology, Reactome]* |
| **Pathway context** | 14 Reactome pathways; dominant themes: **DNA Repair**, **Disease** (e.g. defective HRR), **Reproduction** (meiotic recombination) *[Reactome]* |
| **Gene Ontology** | 138 annotations (molecular function, biological process, localization); strong support for DNA binding, nucleus, response to DNA damage / ionizing radiation *[Gene Ontology]* |
| **Cancer hallmarks** | 3 COSMIC cancer hallmarks annotated — supports established role in malignancy *[COSMIC]* |

**Strategic point:** Biology is mature and actionable for mechanism‑based trials and combination strategies (e.g. with PARP inhibitors, chemotherapy, or other DNA damage response targets).

---

## 3. Disease association landscape

*Data sources: Open Targets association pipeline (on-the-fly scoring). Evidence and scores aggregate: EVA, Europe PMC, Genomics England, gene_burden, UniProt (variants/literature), GWAS credible sets, IMPC, Cancer Gene Census, Reactome, Gene2Phenotype, Orphanet, ClinGen, IntOGen, Expression Atlas, and others. Disease ontology: EFO, MONDO.*

- **Total associations:** 1,065 target–disease associations (ranked by score).  
- **Evidence count:** 3,014 evidence items (genetic, somatic, literature, pathways).

**Top associated diseases (by association score):**

| Disease | Score (0–1) | Therapeutic area |
|---------|------------|------------------|
| Breast cancer | 0.84 | Cancer; reproductive system |
| Breast neoplasm | 0.84 | Cancer; integumentary system |
| Fanconi anemia complementation group D1 | 0.84 | Metabolic; genetic/congenital; hematologic |
| Breast carcinoma | 0.83 | Cancer |
| Familial breast‑ovarian cancer susceptibility 2 | 0.80 | Cancer; genetic |
| Ovarian neoplasm | 0.79 | Cancer; reproductive |
| Hereditary breast and ovarian cancer syndrome | 0.79 | Cancer; genetic; reproductive |
| Cancer (broad) | 0.78 | Cancer |
| Ovarian cancer | 0.78 | Cancer; reproductive |
| Hereditary breast cancer | 0.76 | Cancer; genetic |
| Medulloblastoma | 0.74 | Cancer; nervous system |
| Prostate cancer | 0.74 | Cancer; reproductive |

**Evidence mix:** Strong contributions from **genetic association** (germline and somatic) *[EVA, Genomics England, gene_burden, UniProt variants]*, **genetic literature** *[ClinVar/EVA, Genomics England, Gene2Phenotype, Orphanet]*, **literature** *[Europe PMC]*, and **pathway** *[Reactome]*. Somatic *[EVA somatic, Cancer Gene Census, IntOGen]* and **GWAS credible sets** also contribute.

**Strategic point:** Indications are concentrated in **hereditary and sporadic breast/ovarian and prostate cancer**, with clear relevance to **Fanconi anemia** and **pediatric** (medulloblastoma). This supports a focused indication strategy and potential pan‑cancer use in biomarker‑selected populations.

---

## 4. Druggability and modality

*Data sources: ChEMBL (known drugs, target class, tractability inputs); chemical probe databases (e.g. ProbeMiner) via Platform; Open Targets prioritisation layer (pocket/ligand/binder flags).*

| Dimension | Assessment |
|-----------|------------|
| **Known drugs (direct)** | **0** drugs/clinical candidates with a **direct** mechanism on BRCA2 in the dataset *[ChEMBL / known_drugs]*. PARP inhibitors and other DDR agents act upstream/downstream or via synthetic lethality, not as BRCA2 binders. |
| **Tractability** | **Small molecule (SM):** one bucket tractable (e.g. one category True), others False — overall **challenging but not ruled out** for direct modulation *[Platform tractability]*. |
| **Target class** | No ChEMBL target class returned (often the case for non‑classical druggable proteins) *[ChEMBL]*. |
| **Chemical probes** | 0 high‑quality chemical probes listed — **tool compound gap** for direct BRCA2 pharmacology *[chemical probe curation / ProbeMiner]*. |
| **Prioritisation (platform)** | No small‑molecule binder, no pocket/ligand flags; **genetic constraint** and **cancer driver** flags present (see below) *[Open Targets prioritisation]*. |

**Strategic point:** Near‑term value is in **pathway and patient selection**, not in a direct BRCA2 inhibitor. Long‑term, stabilizers/restorers or allosteric modulators remain speculative and would require strong biology and new chemistry.

---

## 5. Genetic constraint and safety

*Data sources: gnomAD (genetic constraint metrics); target safety/liability data as ingested by the Platform (e.g. clinical/preclinical safety sources).*

- **Genetic constraint (gnomAD):** *[gnomAD]*  
  - **LoF (loss‑of‑function):** score ≈ 6.6×10⁻⁴⁴, oe ≈ 0.71 → **extreme LoF intolerance** (haploinsufficiency; LoF variants under strong purifying selection).  
  - **Missense / synonymous:** oe near 0.92–0.96 → relatively tolerant to missense/synonymous variation in the general population.  

- **Safety liabilities:** **0** target safety liability records in the dataset *[Platform target safety layer]* (no direct target‑based safety flags; clinical risk is mainly from pathway/indication, not from this target’s safety layer).

**Strategic point:** Genetic data support **high biological impact of LoF** (tumor suppressor, hereditary cancer). Therapeutic strategies that **restore or mimic** function (e.g. in Fanconi anemia) or exploit **synthetic lethality** (e.g. PARP in BRCA2‑deficient tumors) align with this profile; direct LoF induction would not.

---

## 6. Prioritisation and feasibility (platform scores)

*Data sources: Open Targets prioritisation (composite of genetic constraint, cancer driver status, DepMap essentiality, IMPC mouse phenotypes, tissue specificity, and other feasibility/druggability inputs).*

Platform prioritisation (values roughly in [−1, 1]; 0 = neutral):

| Factor | Value | Implication |
|--------|--------|-------------|
| **isCancerDriverGene** | −1 | Treated as a known cancer driver in the model *[e.g. Cancer Gene Census / IntOGen]* (negative score can reflect high competition or deprioritisation in a “novelty” sense). |
| **geneEssentiality** | 0 | Not classified as a pan‑essential gene in DepMap *[DepMap]* (consistent with context‑dependent essentiality in BRCA2‑deficient settings). |
| **mouseKOScore** | ≈ −0.95 | Strong phenotype in mouse KO *[IMPC]* — supports biological importance and relevance of animal models. |
| **geneticConstraint** | ≈ −0.28 | Slightly negative in the aggregate score *[gnomAD]*; aligns with LoF intolerance. |
| **tissueSpecificity / tissueDistribution** | 0.5 | Moderate breadth *[expression data]* — relevant across tissues, not hyper‑restricted. |

**Strategic point:** BRCA2 is a **validated cancer driver** with strong mouse and human genetics. The main development challenges are **modality** (direct vs indirect) and **competitive landscape** (PARP, combinations, biomarkers), not lack of biological rationale.

---

## 7. DepMap and cellular dependency

*Data source: DepMap (Cancer Dependency Map — Broad Institute).*

- **Is essential (binary):** **False** (not a pan‑essential gene across cell lines) *[DepMap]*.  
- **DepMap essentiality:** 29 tissue/anatomical contexts with data (e.g. liver, fibroblast, uterus, kidney, eye) *[DepMap]*.  

**Strategic point:** Essentiality is **context‑dependent** (e.g. in BRCA2‑deficient or HRR‑defective backgrounds). This supports **synthetic lethality** and **combination** strategies rather than monotherapy targeting of BRCA2 in unselected populations.

---

## 8. Expression and literature

*Data sources: Expression Atlas, Human Protein Atlas (expression); Europe PMC / PubMed (literature counts and metadata).*

- **Expression:** 110 tissue/biosample entries (RNA/protein) — broad expression with potential for **tissue‑specific** or **context‑dependent** strategies *[Expression Atlas, Human Protein Atlas]*.  
- **Literature:** **34,120** publications in the platform *[Europe PMC]* — one of the most heavily cited targets in the dataset.

**Strategic point:** Rich literature supports **regulatory and payer narratives** and de‑risks **mechanism‑of‑action** and **biomarker** discussions.

---

## 9. Strategic synthesis and recommendations

*Recommendations are informed by the full evidence set and sources cited in §§2–8.*

1. **Indication focus**  
   Prioritise **hereditary and sporadic breast, ovarian, and prostate cancer**, and consider **Fanconi anemia** and **pediatric** (e.g. medulloblastoma) where biology and unmet need align.

2. **Modality**  
   - **Short‑to‑mid term:** Maximise **indirect** approaches (PARP and beyond, DDR combinations, chemotherapy/radiation combinations) and **biomarker‑driven** development (germline/somatic BRCA2, HRR signatures).  
   - **Longer term:** Only pursue **direct** BRCA2 modulation (e.g. stabilizers, restorers) if strong new biology and chemistry emerge; current tractability and probe data do not support this as a near‑term priority.

3. **Competitive and development risk**  
   - **Competition:** PARP inhibitors and HRR/DDR pipeline are crowded; differentiation via **combination**, **line of therapy**, **biomarker**, or **formulation** is critical.  
   - **Development risk:** Genetic constraint and driver status support **patient selection** (e.g. BRCA2‑mutant, HRD‑high) to maximise benefit and support labelling.

4. **Data and evidence**  
   Use the **large evidence base** (associations, evidence items, pathways, literature) for **target validation narratives**, **regulatory packages**, and **payer/HTA** discussions; keep updates aligned with Open Targets and other public evidence.

---

## 10. Data provenance and methodology

- **API source:** Open Targets Platform GraphQL API (`https://api.platform.opentargets.org/api/v4/graphql`).  
- **Query:** Comprehensive oncology target assessment (target, pathways, GO, hallmarks, tractability, known drugs, associated diseases, evidence, DepMap, prioritisation, safety, expression, genetic constraint, literature).  
- **Target:** BRCA2 (ENSG00000139618).  
- **Report generated:** From `oncology-result.json`; interpretation and strategic narrative added for executive use.

### Data sources by section

| Section | Primary data sources |
|--------|----------------------|
| §2 Target and biology | Ensembl (gene, locus, biotype); Reactome (pathways); Gene Ontology (GO); COSMIC (cancer hallmarks) |
| §3 Disease associations | Open Targets association pipeline: EVA, Europe PMC, Genomics England, gene_burden, UniProt, GWAS credible sets, IMPC, Cancer Gene Census, Reactome, Gene2Phenotype, Orphanet, ClinGen, IntOGen, Expression Atlas; EFO/MONDO (disease ontology) |
| §4 Druggability | ChEMBL (known drugs, target class); Platform tractability; chemical probe curation (e.g. ProbeMiner); Open Targets prioritisation |
| §5 Genetic constraint & safety | gnomAD (constraint); Platform target safety layer |
| §6 Prioritisation | Open Targets prioritisation (DepMap, gnomAD, Cancer Gene Census, IMPC, expression, tissue data) |
| §7 Cellular dependency | DepMap (Cancer Dependency Map) |
| §8 Expression & literature | Expression Atlas, Human Protein Atlas; Europe PMC |

All data is accessed via the Open Targets Platform; upstream sources are maintained and documented by the Open Targets project and respective databases.

For reproducibility or updates, re-run the oncology query for `ENSG00000139618` (or other targets) and regenerate this report from the new JSON.

---

*Data: Open Targets Platform. Interpretation and narrative: Biotica Bio. For methodology, see [How it's built]({{ site.baseurl }}{% link how-its-built.md %}).*
