import { MAX_DRUGS_PER_TARGET, MAX_DISEASES_PER_TARGET } from '../utils.js';

type Target = {
  id?: string;
  approvedSymbol?: string;
  approvedName?: string;
  pathways?: Array<{ topLevelTerm?: string; pathway?: string }>;
  knownDrugs?: { count?: number; rows?: Array<{ prefName?: string; drugId?: string }> };
  associatedDiseases?: { count?: number; rows?: Array<{ disease?: { name?: string } }> };
};
type Meta = { trigeminalGeneSymbols?: string[] };

const DRY_EYE_OCULAR_REGEX = /dry eye|ocular|sicca|keratoconjunctivitis|meibomian|lacrimal|eye disease|sjogren/i;

/**
 * Build trigeminal / target summary section for integrated report.
 */
export function buildTrigeminalSection(
  targets: Record<string, Target> | null | undefined,
  meta?: Meta | null
): string {
  const entries = Object.entries(targets || {}).filter(([, t]) => t && (t.approvedSymbol || t.id));
  const symbols = meta?.trigeminalGeneSymbols ?? [];
  let section =
    '**Framing:** The trigeminal nerve is an anatomical structure; Open Targets indexes genes, not nerves. We represent trigeminal-mediated biology (ocular sensation, reflex tear secretion, sensory transmission) by **gene-level proxies**: TRPV1 (nociception/inflammation), TRPM8 (cold/tear reflex), SCN9A (Nav1.7, sensory transmission), CHRM3 (lacrimal parasympathetic). Open Targets will not return "trigeminal nerve" but returns these components of trigeminal signalling biology.\n\n';
  if (entries.length === 0) {
    section += `**Proxies requested:** ${symbols.join(', ') || 'TRPV1, TRPM8, SCN9A, CHRM3'}. No target payloads returned in this run; the framing above describes how the pathway is represented.\n`;
    return section;
  }

  section += `**Targets in this report:** ${entries.map(([, t]) => t.approvedSymbol || t.id).join(', ')}\n\n`;
  entries.forEach(([ensemblId, t]) => {
    const sym = t.approvedSymbol || t.approvedName || ensemblId;
    const name = t.approvedName || t.approvedSymbol || '—';
    section += `### ${sym}\n\n`;
    section += `${name} (${ensemblId}).\n\n`;
    const pathways = (t.pathways || []).slice(0, 3);
    if (pathways.length > 0) {
      section += '**Pathways:** ' + pathways.map((p) => p.topLevelTerm || p.pathway).filter(Boolean).join('; ') + '\n\n';
    }
    const kd = t.knownDrugs || {};
    const kdRows = (kd.rows || []).slice(0, MAX_DRUGS_PER_TARGET);
    section += `**Known drugs:** ${kd.count ?? 0}. Top: ${(kdRows.map((r) => r.prefName || r.drugId).join(', ') as string) || '—'}\n\n`;
    const ad = t.associatedDiseases || {};
    const adRows = (ad.rows || []).slice(0, MAX_DISEASES_PER_TARGET);
    const dryEyeMention = adRows.find((r) => DRY_EYE_OCULAR_REGEX.test(r.disease?.name || ''));
    if (dryEyeMention) {
      section += `**Associated diseases (top ${adRows.length}):** includes **${dryEyeMention.disease?.name}** (dry eye/ocular-related).\n\n`;
    } else {
      section += `**Associated diseases:** ${ad.count ?? 0} total; top: ${adRows.map((r) => r.disease?.name).filter(Boolean).join(', ') || '—'}\n\n`;
    }
  });
  const totalKnownDrugs = entries.reduce((sum, [, t]) => sum + (t.knownDrugs?.count ?? 0), 0);
  const totalDiseases = entries.reduce((sum, [, t]) => sum + (t.associatedDiseases?.count ?? 0), 0);
  section += `**Data-backed benchmark:** Trigeminal proxies in this run: **${entries.length}** targets, **${totalKnownDrugs}** total known drugs, **${totalDiseases}** total associated diseases (Platform counts for comparison).\n\n`;
  return section;
}
