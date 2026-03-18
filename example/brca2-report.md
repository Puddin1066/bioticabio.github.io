---
title: BRCA2 executive report
layout: default
parent: Example
nav_order: 1
description: Full BRCA2 oncology target assessment — Biotica Bio example deliverable
---

# BRCA2: Executive Oncology Target Assessment

This is an example Biotica Bio deliverable: a comprehensive oncology target assessment for **BRCA2**, generated from the Open Targets Platform API and interpreted for strategy and due diligence. The data below is derived from the Platform's aggregated sources; the narrative and strategic synthesis are by Biotica Bio.
{: .lead }

{: .warning }
This assessment is for strategic and due-diligence use only; it does not constitute regulatory, medical, or investment advice.

For how this report was produced (one GraphQL query → data → narrative), see [How it's built]({{ site.baseurl }}{% link how-its-built.md %}).

*Data: Open Targets Platform. Interpretation and narrative: Biotica Bio.*

---

**Target:** BRCA2 (*BRCA2 DNA repair associated*)  
**Gene ID:** ENSG00000139618  
**Locus:** Chr 13 (32.3–32.4 Mb)  
**Report source:** Open Targets Platform API.  
**Audience:** Pharma / biotech strategy and R&D leadership
{: .report-meta }

---

## 1. Executive summary

- **Not directly drugged** (0 direct drugs); opportunity is **indirect and biomarker-led**, not a first-in-class BRCA2 binder in the short term.
- **Priority indications:** breast, fanconi, breast-ovarian (scores 0.80–0.84); consider Fanconi anemia and pediatric where biology and unmet need align.
- **Modality verdict:** Pathway and patient selection near-term; direct SM tractability challenging, 0 high-quality chemical probes — focus on PARP and DDR combinations, biomarker-driven development.
- **Competitive reality:** Breast/ovarian/prostate are crowded; differentiate via **combination**, **line of therapy**, or **biomarker**.

---

## 2. Target and biology

BRCA2 is a protein-coding gene with primary context in **DNA repair** (homologous recombination) and genome stability. Reactome pathways centre on DNA Repair, Disease, Reproduction. Gene Ontology and COSMIC hallmarks support DNA binding, nucleus, and response to DNA damage. *[Reactome, Gene Ontology, COSMIC]*

**Strategic point:** Biology is mature and actionable for mechanism-based trials and combination strategies (e.g. with PARP inhibitors, chemotherapy, or other DNA damage response targets).

---

## 3. Where to play (indications)

| Disease | Score (0–1) | Therapeutic area | Priority |
|---------|-------------|------------------|----------|
| breast cancer | 0.84 | cancer or benign tumor; reproductive system or breast disease; integumentary system disease | Prioritise |
| breast neoplasm | 0.84 | integumentary system disease; cancer or benign tumor; reproductive system or breast disease | Prioritise |
| Fanconi anemia complementation group D1 | 0.84 | nutritional or metabolic disease; musculoskeletal or connective tissue disease; genetic, familial or congenital disease; hematologic disease; immune system disease | Prioritise |
| breast carcinoma | 0.83 | cancer or benign tumor; integumentary system disease; reproductive system or breast disease | Prioritise |
| breast-ovarian cancer, familial, susceptibility to, 2 | 0.80 | cancer or benign tumor; genetic, familial or congenital disease | Prioritise |
| ovarian neoplasm | 0.79 | cancer or benign tumor; reproductive system or breast disease; endocrine system disease | Prioritise |
| Hereditary breast and ovarian cancer syndrome | 0.79 | cancer or benign tumor; endocrine system disease; reproductive system or breast disease; integumentary system disease; genetic, familial or congenital disease | Prioritise |

Prioritise **hereditary and sporadic breast, ovarian, and prostate cancer**; consider Fanconi anemia and pediatric indications where biology and unmet need align. Evidence is **genetics- and pathway-led** (EVA, Genomics England, Reactome, Europe PMC, and others).

**Commercial take:** Focused indication strategy and potential pan-cancer use in biomarker-selected populations.

---

## 4. Druggability and modality

**Verdict:** 0 direct drugs on BRCA2; tractability challenging for direct small-molecule modulation; 0 high-quality chemical probes. PARP and other DDR agents act via synthetic lethality or pathway context, not as direct binders.

**Development take:** Near-term value is **pathway and patient selection**, not a direct inhibitor. Long-term direct modulation (e.g. stabilizers, restorers) remains speculative and would require strong new biology and chemistry.

---

## 5. Genetic constraint and safety

LoF **intolerant** (oe ≈ 0.71) — extreme loss-of-function intolerance and haploinsufficiency; supports tumor-suppressor and hereditary-cancer role. No target-level safety liability records in the dataset; clinical risk is mainly from pathway and indication.

**Development take:** Therapeutic strategies that **restore or mimic** function (e.g. Fanconi anemia) or exploit **synthetic lethality** (e.g. PARP in BRCA2-deficient tumors) align with this profile; direct LoF induction would not.

---

## 6. Prioritisation and feasibility

Validated **cancer driver** with strong mouse and human genetics; not pan-essential in DepMap (context-dependent essentiality). Main development challenges are **modality** (direct vs indirect) and **competitive landscape** (PARP, combinations, biomarkers), not lack of biological rationale.

---

## 7. DepMap and cellular dependency

Not pan-essential; essentiality is **context-dependent** (e.g. in BRCA2-deficient or HRR-defective backgrounds). Supports **synthetic lethality** and **combination** strategies rather than monotherapy targeting in unselected populations. *[DepMap]*

---

## 8. Expression and literature

Broad expression (110+ tissue/biosample entries); **34k+ publications** in the platform — strong evidence base for regulatory and payer narratives and for mechanism-of-action and biomarker discussions. *[Expression Atlas, Human Protein Atlas, Europe PMC]*

**Key papers (evidence-backed and hallmark):** [14681210](https://pubmed.ncbi.nlm.nih.gov/14681210/), [25833843](https://pubmed.ncbi.nlm.nih.gov/25833843/), [24902638](https://pubmed.ncbi.nlm.nih.gov/24902638/), [32005245](https://pubmed.ncbi.nlm.nih.gov/32005245/), [40724944](https://pubmed.ncbi.nlm.nih.gov/40724944/).

---

## 9. Strategic synthesis and recommendations

1. **Indication focus** — Prioritise hereditary and sporadic breast, ovarian, and prostate cancer; consider Fanconi anemia and pediatric (e.g. medulloblastoma) where biology and unmet need align.
2. **Modality** — Short-to-mid term: maximise **indirect** approaches (PARP and beyond, DDR combinations) and **biomarker-driven** development (germline/somatic BRCA2, HRR signatures). Longer term: pursue direct BRCA2 modulation only if strong new biology and chemistry emerge.
3. **Competitive and development risk** — Differentiation via combination, line of therapy, biomarker, or formulation is critical; genetic constraint and driver status support **patient selection** to maximise benefit and support labelling.
4. **Evidence use** — Use the large evidence base for target validation narratives, regulatory packages, and payer/HTA discussions; keep updates aligned with Open Targets and other public evidence.

---

## 10. Data provenance and methodology

Report generated from the **Open Targets Platform GraphQL API** (`https://api.platform.opentargets.org/api/v4/graphql`). Query: comprehensive oncology target assessment (target, pathways, GO, hallmarks, tractability, known drugs, associated diseases, evidence, DepMap, prioritisation, safety, expression, genetic constraint, literature, interactions; plus disease-level data for competitors/comparables). Target: BRCA2 (ENSG00000139618). Re-run the oncology query for this ID (or other targets) to refresh the underlying data; interpretation and strategic narrative are by Biotica Bio.

---

## 11. Competitive reality

*Source: Open Targets Platform `disease(efoId).knownDrugs`, `disease(efoId).associatedTargets`, and `target.interactions`. Indication set: breast carcinoma, ovarian carcinoma, prostate cancer, neoplasm.*

Breast carcinoma and related indications have many approved drugs and phase II+ candidates; ovarian and prostate are similarly active. BRCA2 is not directly targeted — the competitive set is indication-space and pathway-adjacent.

### Key competitors

| Drug | Target | Phase | Mechanism | Indication |
|------|--------|------|------------|------------|
| EXEMESTANE | cytochrome P450 family 19 subfamily A member 1 | 4 | Cytochrome P450 19A1 inhibitor | breast carcinoma |
| GOSERELIN ACETATE | gonadotropin releasing hormone receptor | 4 | Gonadotropin-releasing hormone receptor agonist | breast carcinoma |
| TOREMIFENE CITRATE | estrogen receptor 1 | 4 | Estrogen receptor modulator | breast carcinoma |
| BEVACIZUMAB | vascular endothelial growth factor A | 4 | Vascular endothelial growth factor A inhibitor | breast carcinoma |
| TRASTUZUMAB | erb-b2 receptor tyrosine kinase 2 | 4 | Receptor protein-tyrosine kinase erbB-2 inhibitor | breast carcinoma |
| IXABEPILONE | tubulin beta 1 class VI | 4 | Tubulin inhibitor | breast carcinoma |
| IXABEPILONE | tubulin beta 2A class IIa | 4 | Tubulin inhibitor | breast carcinoma |

### Key comparable targets

| Target | Role |
|--------|------|
| BRCA1, BRCA1 DNA repair associated | — |
| PALB2, partner and localizer of BRCA2 | — |
| TP53, tumor protein p53 | — |
| PIK3CA, phosphatidylinositol-4,5-bisphosphate 3-kinase catalytic subunit alpha | — |
| CHEK2, checkpoint kinase 2 | — |
| ATM, ATM serine/threonine kinase | — |
| RAD51C, RAD51 paralog C | — |

Pathway neighbours available in Platform (target.interactions).

**Commercial take:** Crowded landscape; differentiate via **combination**, **line of therapy**, **biomarker**, or **formulation**.

---

## 12. Commercial opportunity map

*Feasibility and competition context informed by Open Targets (disease.knownDrugs, associatedTargets).*

### Revenue-generating strategies (ranked)

| Strategy | Feasibility | Revenue potential | Reality check |
|----------|-------------|-------------------|---------------|
| Biomarker-driven trial enrichment | High | High | Already standard; still expandable |
| PARP + novel combo (ATR, POLθ) | High | Very high | Competitive but still open |
| Resistance reversal therapies | Medium | Very high | Underserved, high-value niche |
| Fanconi anemia gene restoration | Medium | Medium | Orphan economics |
| Direct BRCA2 modulation | Low | Unknown | Long-term science project |

### Alpha insight

The opportunity is not BRCA2 per se but **the dynamic loss and restoration of BRCA2 function over time**. That unlocks resistance tracking, adaptive therapy, and sequencing strategies—and justifies investment in biomarkers and combinations that address reversion and HR restoration, not only front-line synthetic lethality.

### Near-term wedge

The most valuable near-term wedge is **BRCA2 + longitudinal biomarker platform**: detecting reversion mutations, HR restoration, and therapy escape. That supports diagnostics, trial enablement, and pharma partnerships without requiring a direct BRCA2 drug.

---

*Data: Open Targets Platform. Interpretation and narrative: Biotica Bio. For methodology, see [How it's built]({{ site.baseurl }}{% link how-its-built.md %}).*
