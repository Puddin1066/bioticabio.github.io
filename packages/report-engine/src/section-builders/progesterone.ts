import { safe, formatDrugName, MAX_INDICATIONS } from '../utils.js';

type DrugRow = {
  targetName?: string;
  targets?: Array<{ approvedSymbol?: string; approvedName?: string }>;
  mechanismOfAction?: string;
  actionType?: string;
};
type IndicationRow = { disease?: { name?: string } };
type Drug = {
  name?: string;
  drugType?: string;
  description?: string;
  mechanismsOfAction?: { rows?: DrugRow[] };
  indications?: { count?: number; rows?: IndicationRow[] };
};

/**
 * Build Progesterone (drug) section body for integrated report.
 */
export function buildProgesteroneSection(drug: Drug | null | undefined): string {
  if (!drug) return 'No drug data returned from the Platform.';
  const name = formatDrugName(drug.name) || 'Progesterone';
  const type = (drug.drugType as string) || '—';
  const desc = (drug.description as string) || 'Approved and investigational indications in the Platform.';
  const mechRows = drug.mechanismsOfAction?.rows ?? [];
  const indRows = (drug.indications?.rows ?? []).slice(0, MAX_INDICATIONS);
  const indCount = drug.indications?.count ?? indRows.length;

  const hasDryEyeOrOcular = indRows.some((r) => {
    const n = (r.disease?.name || '').toLowerCase();
    return /dry eye|ocular|sicca|keratoconjunctivitis|meibomian|lacrimal/.test(n);
  });

  let section =
    '**Biology that matters:** Progesterone acts via nuclear hormone receptor signalling. Sex hormones influence meibomian gland lipid production and lacrimal gland function; clinical literature supports hormonal modulation of dry eye, especially in post-menopausal populations. Progesterone is not a "dry eye drug" in the Platform, but it sits in a **hormonal modulation axis of tear film physiology**—a bridge to neuro-lacrimal and gland-modulation hypotheses.\n\n';
  section += `**Platform profile:** ${name} is a **${type}**. ${desc}\n\n`;
  if (mechRows.length > 0) {
    section += '**Mechanism and targets (Platform):**\n\n| Target | Mechanism |\n|--------|------------|\n';
    mechRows.slice(0, 7).forEach((r) => {
      const t = r.targetName || (r.targets && r.targets[0]?.approvedSymbol) || '—';
      const m = safe(r.mechanismOfAction, r.actionType as string) as string;
      section += `| ${t} | ${m} |\n`;
    });
    section += '\n';
  } else {
    section += '**Mechanism and targets:** Mechanism/target detail in Platform (e.g. progesterone receptor).\n\n';
  }

  section += `**Indications (top ${Math.min(MAX_INDICATIONS, indCount)} of ${indCount} in Platform):**\n\n`;
  if (indRows.length === 0) {
    section += '*No indication rows returned.*\n\n';
  } else {
    section += '| Indication |\n|------------|\n';
    indRows.forEach((r) => {
      section += `| ${safe(r.disease?.name, '—')} |\n`;
    });
    section += '\n';
  }

  section += `**Data-backed benchmark:** ${indCount} indications in Platform (repurposing breadth); use to compare other drugs or re-runs.\n\n`;

  if (hasDryEyeOrOcular) {
    section += '**Dry eye / ocular:** At least one indication in the Platform matches dry eye or ocular-related terms.\n\n';
  } else {
    section +=
      '**Dry eye / ocular:** No indication in the Platform explicitly matches dry eye or ocular-related terms; the biological link is literature-supported hormonal effects on tear physiology, not a direct Open Targets indication.\n\n';
  }
  return section;
}
