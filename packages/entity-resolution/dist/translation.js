import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_TRANSLATION_PATH = join(__dirname, '..', '..', '..', 'scripts', 'config', 'ontology-translation.json');
/**
 * Load ontology translation from JSON. Uses default path to scripts/config/ontology-translation.json
 * if no path provided. Returns empty translation if file missing or invalid.
 */
export function loadTranslation(configPath = DEFAULT_TRANSLATION_PATH) {
    try {
        const raw = readFileSync(configPath, 'utf8');
        const data = JSON.parse(raw);
        const dry_eye = data.dry_eye;
        const trigeminal_pathway = data.trigeminal_pathway;
        return {
            dry_eye: dry_eye ?? { efo_proxies: [], search_terms_fallback: [] },
            trigeminal_pathway: trigeminal_pathway ?? { gene_symbols: ['TRPV1', 'TRPM8', 'SCN9A', 'CHRM3'] },
        };
    }
    catch {
        return {
            dry_eye: { efo_proxies: [], search_terms_fallback: ['dry eye disease', 'keratoconjunctivitis sicca'] },
            trigeminal_pathway: { gene_symbols: ['TRPV1', 'TRPM8', 'SCN9A', 'CHRM3'] },
        };
    }
}
//# sourceMappingURL=translation.js.map