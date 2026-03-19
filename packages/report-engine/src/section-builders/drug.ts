import { formatDrugName, MAX_INDICATIONS, MAX_TARGETS } from '../utils.js';

type DrugRow = {
  targetName?: string;
  targets?: Array<{ approvedSymbol?: string; approvedName?: string }>;
  mechanismOfAction?: string;
  actionType?: string;
};
type IndicationRow = { disease?: { name?: string; therapeuticAreas?: Array<{ name?: string }> } };
type Drug = {
  id?: string;
  name?: string;
  drugType?: string;
  description?: string;
  tradeNames?: string[];
  mechanismsOfAction?: { rows?: DrugRow[] };
  indications?: { count?: number; rows?: IndicationRow[] };
  drugWarnings?: Array<{ warningType?: string; description?: string }>;
};

export function buildExecutiveSummary(drug: Drug): string {
  const name = formatDrugName(drug.name) || 'Drug';
  const type = (drug.drugType as string) || '—';
  const indCount = drug.indications?.count ?? 0;
  const mechRows = drug.mechanismsOfAction?.rows ?? [];
  const targetCount = mechRows.length;
  const bullets = [
    `**${name}** is a **${type}** with ${indCount} indication(s) in the Platform; description notes approved and investigational use.`,
    `**Current indications:** See table below (top ${Math.min(MAX_INDICATIONS, indCount)} of ${indCount}); spans reproductive, metabolic, neurological, and other therapeutic areas.`,
    `**Mechanism and targets:** ${targetCount > 0 ? `${targetCount} target(s) with mechanism data (e.g. ${mechRows[0]?.mechanismOfAction || mechRows[0]?.targetName || 'see table'}).` : 'Mechanism/target detail in Platform; steroid hormone (e.g. progesterone receptor).'}`,
    `**Repurposing angle:** Long off-patent; broad indication set supports repurposing and combination narratives (e.g. neuroprotection, TBI, cancer contexts).`,
    `**Commercial take:** Differentiate via formulation, indication expansion, or biomarker-led development; competitive landscape varies by indication.`,
  ];
  return bullets.map((b) => `- ${b}`).join('\n');
}

export function buildDrugProfile(drug: Drug): string {
  const name = formatDrugName(drug.name) || '—';
  const type = (drug.drugType as string) || '—';
  const desc = (drug.description as string) || '';
  const trades = (drug.tradeNames ?? []).slice(0, 5);
  const tradeStr = trades.length ? trades.join(', ') + (drug.tradeNames && drug.tradeNames.length > 5 ? ' (and others)' : '') : '—';
  return `**${name}** is a **${type}**. ${desc || 'Approved and investigational indications in the Platform.'} Trade names: ${tradeStr}.`;
}

export function buildDrugTargetsSection(drug: Drug): { paragraph: string; tableRows: Array<{ targetName: string; mechanism: string }> } {
  const rows = (drug.mechanismsOfAction?.rows ?? []).slice(0, MAX_TARGETS);
  if (rows.length === 0) {
    return {
      paragraph: 'Target and mechanism detail can be explored in the Open Targets Platform (e.g. progesterone receptor for steroid hormones).',
      tableRows: [],
    };
  }
  const tableRows = rows.map((r) => {
    const targetName = (r.targetName || (r.targets && r.targets[0]?.approvedName) || r.targets?.[0]?.approvedSymbol || '—') as string;
    const mechanism = (r.mechanismOfAction || r.actionType || '—') as string;
    return { targetName, mechanism };
  });
  return { paragraph: `${rows.length} target(s) with mechanism data.`, tableRows };
}

export function buildIndicationsRows(drug: Drug): Array<{ name: string; areas: string }> {
  const rows = (drug.indications?.rows ?? []).slice(0, MAX_INDICATIONS);
  return rows.map((r) => {
    const name = (r.disease?.name ?? '—') as string;
    const areas = (r.disease?.therapeuticAreas ?? []).map((a) => a.name).join('; ') || '—';
    return { name, areas };
  });
}

export function buildRepurposingAngle(drug: Drug): string {
  const indCount = drug.indications?.count ?? 0;
  const name = formatDrugName(drug.name) || 'this drug';
  return `With **${indCount}** indications in the Platform (approved and investigational), **${name}** has broad repurposing potential. Prioritise indications where evidence and unmet need align (e.g. neuroprotection, traumatic brain injury, or specific cancer contexts); use Platform disease and target data to assess competition per indication.`;
}
