---
title: Pro-ocular (Signal12) evaluation
layout: default
parent: Example
nav_order: 3
description: Open Targets–based evaluation of Pro-ocular indication and competitive space — Biotica Bio example report
image: /assets/images/og-default.png
keywords:
  - dry eye competitive landscape
  - ocular gvhd diligence
  - open targets indication assessment
datePublished: 2026-03-01
dateModified: 2026-03-20
author_name: John Round
author_title: Biotech Strategist
author_linkedin: https://www.linkedin.com/in/john-round-475b764/
about:
  - Pro-ocular
  - Sjogren syndrome
  - EFO_0000699
---

# Pro-ocular (Signal12) evaluation

This report evaluates **Pro-ocular** (Signal12's [Pro-ocular™](https://signal12inc.com/pro-ocular/)) using the Open Targets Platform for the **indication and competitive landscape** of its target diseases. Pro-ocular is not in the Platform; the following data are drugs and targets the Platform associates with each indication.
{: .lead }

{: .warning }
This report is for strategic and due-diligence use only; it does not constitute regulatory, medical, or investment advice.

For methodology, see [How it's built]({{ site.baseurl }}{% link how-its-built.md %}).

*Data: Open Targets Platform. Pro-ocular context: Signal12. Interpretation: Biotica Bio.*

---

## Executive memo snapshot

- **Decision focus:** Evaluate whether Pro-ocular sits in an investable unmet-need niche versus crowded categories.
- **Upside:** Mechanism positioning is differentiated from dominant immune-modulation narratives.
- **Primary risk:** Limited direct platform representation for product-specific positioning.
- **Near-term action:** Anchor thesis on mechanism differentiation and indication-specific commercial wedge.

## Operator capabilities demonstrated

- Integrates external product context with platform evidence without overclaiming.
- Handles sparse/indirect evidence conditions with explicit caveats.
- Translates complex indication landscape into commercialization implications.

*Perspective: John Round, Biotica Bio.*

---

## Pro-ocular context (curated)

**Pro-ocular™** (Signal12) targets the ophthalmic branch of the trigeminal nerve and supports lacrimal and meibomian function to promote endogenous tear production. Indications include ocular graft-versus-host disease (oGVHD), Sjögren syndrome, and dry eye. Phase 3–ready (oGVHD). Source: [Signal12 — Pro-ocular](https://signal12inc.com/pro-ocular/).

---

## Indication space

| Indication | EFO ID | Therapeutic area(s) |
|------------|--------|---------------------|
| sialolithiasis | EFO_1001180 | gastrointestinal disease |
| Sjogren syndrome | EFO_0000699 | immune system disease; gastrointestinal disease; disorder of visual system |

---

## Competitive landscape (from Open Targets)

Pro-ocular is not in the Platform; the following are drugs the Platform associates with each indication.

**sialolithiasis** (EFO_1001180): 0 known drug(s) in the Platform.
*No drug rows returned.*

**Sjogren syndrome** (EFO_0000699): 0 known drug(s) in the Platform.
*No drug rows returned.*


---

## Target / mechanism landscape (from Open Targets)

For each indication, the main Platform-associated targets are listed below. Pro-ocular's mechanism (neuro/trigeminal, lacrimal) is different from these target-associated mechanisms.

**sialolithiasis** (EFO_1001180): 443 associated target(s).
| Target | Score |
|--------|-------|
| CTXN3 | 0.353 |
| COL27A1 | 0.349 |
| SH3BP4 | 0.332 |
| TBX3 | 0.331 |
| SVIL | 0.331 |
| RASGEF1B | 0.329 |
| THSD7A | 0.328 |
| CDH20 | 0.328 |
| DNAH9 | 0.328 |
| KANK1 | 0.324 |

**Sjogren syndrome** (EFO_0000699): 2748 associated target(s).
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


---

## Commercial relevance

From the Platform: 0 approved and 0 in-development drug associations across the evaluated indications. Pro-ocular is Phase 3–ready for ocular GVHD and positioned in dry eye and Sjögren syndrome. No drug in the Platform is specifically labelled for ocular GVHD in this dataset. **Commercial take:** Pro-ocular addresses an unmet niche (especially oGVHD) while overlapping with dry eye and Sjögren competitive space; differentiation is mechanism (neuro/lacrimal) and formulation.

---

## R&D relevance

The Platform highlights targets such as CTXN3, COL27A1, SH3BP4, IRF5, STAT4, GTF2I for these diseases. Pro-ocular's mechanism (ophthalmic branch of trigeminal nerve, lacrimal/meibomian, endogenous tears) is distinct from these target-associated mechanisms. **R&D take:** Open Targets supports evaluation of the indication space; Pro-ocular occupies a different mechanism niche (neuro/lacrimal) and is complementary to target-centric R&D.

---

## Data provenance

Report generated from the **Open Targets Platform GraphQL API** (disease(efoId)). Indications queried: EFO_1001180, EFO_0000699. Data: knownDrugs and associatedTargets per disease. Pro-ocular context from [Signal12/Pro-ocular](https://signal12inc.com/pro-ocular/). To re-run: `node fetch-pro-ocular.js` then `node generate-pro-ocular-report.js` (optional `--from-json` and `--out`).

---

*Data: Open Targets Platform. Pro-ocular context: Signal12. Interpretation: Biotica Bio.*
