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
/**
 * Load ontology translation from JSON. Uses default path to scripts/config/ontology-translation.json
 * if no path provided. Returns empty translation if file missing or invalid.
 */
export declare function loadTranslation(configPath?: string): OntologyTranslation;
//# sourceMappingURL=translation.d.ts.map