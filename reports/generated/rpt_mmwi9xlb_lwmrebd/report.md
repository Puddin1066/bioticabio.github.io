---
title: Progesterone, trigeminal targets & dry eye
layout: default
parent: Example
nav_order: 4
description: Open Targets–backed evaluation of progesterone, trigeminal nerve targets, and dry eye disease — Biotica Bio example report
---
# Progesterone, trigeminal nerve targets, and dry eye disease

This report evaluates **progesterone** (drug), **trigeminal pathway gene proxies** (TRPV1, TRPM8, SCN9A, CHRM3), and **dry eye disease** (indication) using the Open Targets Platform. Dry eye is represented by ontology proxies (e.g. Sjögren syndrome); trigeminal-mediated biology by gene-level proxies. All data are query-backed; framing is designed for strategic and R&D interpretation.
{: .lead }

{: .warning }
This report is for strategic and due-diligence use only; it does not constitute regulatory, medical, or investment advice.

*Data: Open Targets Platform. Interpretation: Biotica Bio.*

---

## Executive summary

**Prepared for:** Investor diligence.

This report covers **Progesterone** (drug), **trigeminal pathway gene proxies** (TRPV1, TRPM8, SCN9A, CHRM3), and **dry eye disease** (indication) using the Open Targets Platform, with dry eye represented by ontology proxies (e.g. Sjögren syndrome).

**Main insight:** At least one trigeminal proxy (CHRM3) appears in the dry eye–associated target set; the Platform nonetheless emphasises immune/inflammatory biology (e.g. IRF5, STAT4), while the progesterone/trigeminal thesis emphasises neuro-reflex and hormonal modulation—**orthogonal mechanistic spaces**, which is the strategic signal.

**Caveat:** Progesterone is not a direct dry eye indication in the Platform; the link is literature-supported hormonal effects on tear physiology. Competitive drug counts in some disease nodes may be sparse; re-run after Platform updates if the competitive landscape is critical.

**Use:** For diligence and risk assessment: evidence base, mechanistic differentiation, and key gaps to validate before commitment.

---

## Progesterone in the Platform

**Biology that matters:** Progesterone acts via nuclear hormone receptor signalling. Sex hormones influence meibomian gland lipid production and lacrimal gland function; clinical literature supports hormonal modulation of dry eye, especially in post-menopausal populations. Progesterone is not a "dry eye drug" in the Platform, but it sits in a **hormonal modulation axis of tear film physiology**—a bridge to neuro-lacrimal and gland-modulation hypotheses.

**Platform profile:** Progesterone is a **Small molecule**. Small molecule drug with a maximum clinical trial phase of IV (across all indications) that was first approved in 1976 and has 3 approved and 44 investigational indications. This drug has a black box warning from the FDA.

**Mechanism and targets (Platform):**

| Target | Mechanism |
|--------|------------|
| Progesterone receptor | Progesterone receptor agonist |

**Indications (top 7 of 47 in Platform):**

| Indication |
|------------|
| anorexia nervosa |
| Osteopenia |
| cervical intraepithelial neoplasia |
| breast carcinoma |
| hemorrhage |
| Vulvar Lichen Sclerosus |
| bulimia nervosa |

**Dry eye / ocular:** No indication in the Platform explicitly matches dry eye or ocular-related terms; the biological link is literature-supported hormonal effects on tear physiology, not a direct Open Targets indication.



---

## Dry eye disease (Open Targets)

**Framing:** Dry eye is poorly represented as a single node in ontologies; it is often split across keratoconjunctivitis sicca, Sjögren syndrome, and ocular surface disease. We use **ontology proxies** that overlap clinically with dry eye. Open Targets is strongest for autoimmune drivers (e.g. Sjögren) and weaker for multifactorial symptom syndromes—that nuance is a valuable insight, not a limitation.

**Proxies in this report:** EFO_0000699. (Sjogren syndrome)

| Disease | EFO ID | Therapeutic area(s) |
|---------|--------|---------------------|
| Sjogren syndrome | EFO_0000699 | immune system disease; gastrointestinal disease; disorder of visual system |

**Known drugs (Platform, this node):** 85 total. Top 10:

| Drug | Phase | Target |
|------|-------|--------|
| PILOCARPINE | 4 | CHRM1 |
| PILOCARPINE | 4 | CHRM3 |
| ABATACEPT | 3 | CD80 |
| HYDROXYCHLOROQUINE | 3 | TLR7 |
| HYDROXYCHLOROQUINE | 3 | TLR9 |
| DEUCRAVACITINIB | 3 | TYK2 |
| DAZODALIBEP | 3 | CD40LG |
| IANALUMAB | 3 | TNFRSF13C |
| IANALUMAB | 3 | TNFRSF13C |
| ABATACEPT | 3 | CD86 |

**Associated targets (Platform):** 2748 total. Top 10:

| Target | Score |
|--------|-------|
| IRF5 | 0.490 |
| STAT4 | 0.424 |
| GTF2I | 0.387 |
| CHRM3 | 0.374 |
| ATG2B | 0.372 |
| CHRM1 | 0.370 |
| TNFRSF13C | 0.367 |
| TRMU | 0.362 |
| COX7B2 | 0.358 |
| RBFOX1 | 0.355 |

*Open Targets is a tool for target identification and prioritisation; it may not fully enumerate the commercial dry eye market.*


---

## Trigeminal nerve–related targets

**Framing:** The trigeminal nerve is an anatomical structure; Open Targets indexes genes, not nerves. We represent trigeminal-mediated biology (ocular sensation, reflex tear secretion, sensory transmission) by **gene-level proxies**: TRPV1 (nociception/inflammation), TRPM8 (cold/tear reflex), SCN9A (Nav1.7, sensory transmission), CHRM3 (lacrimal parasympathetic). Open Targets will not return "trigeminal nerve" but returns these components of trigeminal signalling biology.

**Targets in this report:** TRPV1, TRPM8, SCN9A, CHRM3

### TRPV1

transient receptor potential cation channel subfamily V member 1 (ENSG00000196689).

**Pathways:** Transport of small molecules

**Known drugs:** 343. Top: CAPSAICIN, ACETAMINOPHEN, ACETAMINOPHEN, ACETAMINOPHEN, CAPSAICIN

**Associated diseases:** 853 total; top: migraine disorder, Pain, Headache, Fever, common cold, Back pain, pharyngitis, arthritis

### TRPM8

transient receptor potential cation channel subfamily M member 8 (ENSG00000144481).

**Pathways:** Transport of small molecules

**Known drugs:** 46. Top: MENTHOL, MENTHOL, MENTHOL, MENTHOL, MENTHOL

**Associated diseases:** 308 total; top: Pain, Cough, Back pain, arthritis, pharyngitis, common cold, sprain, Pruritus

### SCN9A

sodium voltage-gated channel alpha subunit 9 (ENSG00000169432).

**Pathways:** Sensory Perception; Muscle contraction; Developmental Biology

**Known drugs:** 988. Top: DRONEDARONE HYDROCHLORIDE, PROPAFENONE HYDROCHLORIDE, ZONISAMIDE, ZONISAMIDE, PRIMIDONE

**Associated diseases:** 541 total; top: primary erythermalgia, paroxysmal extreme pain disorder, channelopathy-associated congenital insensitivity to pain, autosomal recessive, hereditary sensory and autonomic neuropathy type 2, epilepsy, Channelopathy-associated congenital insensitivity to pain, Seizure, hereditary sensory and autonomic neuropathy

### CHRM3

cholinergic receptor muscarinic 3 (ENSG00000133019).

**Pathways:** Signal Transduction; Signal Transduction; Metabolism

**Known drugs:** 519. Top: GLYCOPYRRONIUM BROMIDE, GLYCOPYRRONIUM BROMIDE, IPRATROPIUM BROMIDE, TIOTROPIUM BROMIDE, TIOTROPIUM BROMIDE

**Associated diseases:** 401 total; top: prune belly syndrome, chronic obstructive pulmonary disease, gastrointestinal disease, Hyperhidrosis, overactive bladder, asthma, Urinary incontinence, urgency urinary incontinence



---

## Integration

**Progesterone ↔ dry eye:** No direct Open Targets linkage in this dataset; literature-supported hormonal effects on tear physiology suggest indirect relevance (hormonal modulation axis).

**Trigeminal pathway ↔ dry eye:** Component targets (e.g. TRPV1, TRPM8, CHRM3) connect sensory signalling to tear production. **CHRM3** appears in the dry eye–associated target set (concrete link between neuro/lacrimal signalling and this indication). Overlap with dry eye–associated targets: yes.

**Synthesis:** Open Targets emphasises immune/inflammatory biology (e.g. Sjögren targets such as IRF5, STAT4). The progesterone/trigeminal hypothesis emphasises neuro-reflex and hormonal modulation of lacrimal/meibomian function. **These are orthogonal mechanistic spaces, not overlapping ones**—that contrast is the signal.

**Commercial take:** The dry eye market is crowded (anti-inflammatory, tear stabilisation). The emerging niche is neurostimulation / endogenous tear activation (e.g. Tyrvaya). Progesterone is not a direct competitor but supports a biological plausibility layer (gland modulation). Pro-ocular-style positioning is not "another dry eye drug" but a neuro-lacrimal activation strategy, adjacent to but distinct from immune modulation and lubrication.

**R&D take:** Open Targets is useful here not for confirming the mechanism, but for showing what it is not: the dominant target landscape in the Platform is immune signalling; the proposed mechanism is neural reflex activation. That contrast is the insight.

---

## Recommendation and next steps

- Validate neuro-reflex and hormonal positioning with key opinion leaders or clinical advisors.
- Confirm competitive landscape for dry eye (Platform may undercount in some nodes); re-run report after Platform updates if drug lists are material to the thesis.
- Use the orthogonal-mechanism framing (immune vs neuro-reflex) to articulate diligence risk: evidence supports differentiation, but direct dry eye indication is not in the Platform.

---

## Data provenance

Report generated from the **Open Targets Platform GraphQL API**. Entity resolution uses an **ontology translation table** (config/ontology-translation.json): dry eye → EFO proxies (EFO_0000699; Sjogren syndrome), trigeminal pathway → gene proxies (TRPV1, TRPM8, SCN9A, CHRM3). Queries: drug (CHEMBL103), disease (dry eye EFO IDs), target-summary (Ensembl IDs: ENSG00000196689, ENSG00000144481, ENSG00000169432, ENSG00000133019). Re-run: `node fetch-progesterone-trigeminal-dry-eye.js` then `node generate-progesterone-trigeminal-dry-eye-report.js` (optional `--from-json` and `--out`).

---

*Data: Open Targets Platform. Interpretation: Biotica Bio.*