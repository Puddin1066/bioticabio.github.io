import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface EfoProxy {
  efoId: string;
  label: string;
}

export interface DryEyeTranslation {
  description?: string;
  efo_proxies: EfoProxy[];
  search_terms_fallback?: string[];
}

export interface TrigeminalPathwayTranslation {
  description?: string;
  gene_symbols: string[];
  rationale?: string;
}

export interface OntologyTranslation {
  dry_eye?: DryEyeTranslation;
  trigeminal_pathway?: TrigeminalPathwayTranslation;
}

const DEFAULT_TRANSLATION_PATH = join(__dirname, '..', '..', '..', 'scripts', 'config', 'ontology-translation.json');

/**
 * Load ontology translation from JSON. Uses default path to scripts/config/ontology-translation.json
 * if no path provided. Returns empty translation if file missing or invalid.
 */
export function loadTranslation(configPath: string = DEFAULT_TRANSLATION_PATH): OntologyTranslation {
  try {
    const raw = readFileSync(configPath, 'utf8');
    const data = JSON.parse(raw) as Record<string, unknown>;
    const dry_eye = data.dry_eye as DryEyeTranslation | undefined;
    const trigeminal_pathway = data.trigeminal_pathway as TrigeminalPathwayTranslation | undefined;
    return {
      dry_eye: dry_eye ?? { efo_proxies: [], search_terms_fallback: [] },
      trigeminal_pathway:
        trigeminal_pathway ?? { gene_symbols: ['TRPV1', 'TRPM8', 'SCN9A', 'CHRM3'] },
    };
  } catch {
    return {
      dry_eye: { efo_proxies: [], search_terms_fallback: ['dry eye disease', 'keratoconjunctivitis sicca'] },
      trigeminal_pathway: { gene_symbols: ['TRPV1', 'TRPM8', 'SCN9A', 'CHRM3'] },
    };
  }
}
