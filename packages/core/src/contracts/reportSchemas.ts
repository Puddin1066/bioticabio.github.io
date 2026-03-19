/**
 * Normalized contracts for report requests, resolved entities, evidence snapshots,
 * sections, and report runs. Used across data sources, report engine, and API.
 */

export type ReportType =
  | 'target-assessment'
  | 'drug-assessment'
  | 'disease-landscape'
  | 'integrated-thesis';

export type Audience = 'investor' | 'executive' | 'bd' | 'scientific';

export type DataMode = 'live' | 'mocked';

export type ReportDepth = 'brief' | 'standard' | 'deep';

/** Subject entities: canonical IDs or natural-language inputs. */
export interface ReportSubject {
  target?: string;
  targets?: string[];
  drug?: string;
  drugs?: string[];
  disease?: string;
  diseases?: string[];
}

/** Request to generate a report. */
export interface ReportRequest {
  reportType: ReportType;
  subject: ReportSubject;
  audience?: Audience;
  depth?: ReportDepth;
  questions?: string[];
  context?: {
    clientName?: string;
    objective?: string;
    mode: DataMode;
  };
  options?: {
    webEnrichment?: boolean;
    llmSynthesis?: boolean;
  };
}

/** Single resolved entity with provenance. */
export interface ResolvedEntity {
  input: string;
  resolvedId: string;
  label: string;
  entityType: 'target' | 'disease' | 'drug';
  resolutionType?: 'canonical' | 'proxy' | 'search';
}

/** Resolved entities keyed by role (e.g. drug, diseases, targets). */
export interface ResolvedEntities {
  drug?: ResolvedEntity;
  diseases?: ResolvedEntity[];
  targets?: ResolvedEntity[];
  target?: ResolvedEntity;
}

/** Provenance for a report run. */
export interface Provenance {
  mode: DataMode;
  sources: string[];
  fetchedAt: string;
  translationSource?: string;
  querySet?: string[];
}

/** Normalized evidence snapshot (API-agnostic shape for builders). */
export interface EvidenceSnapshot {
  _meta: {
    fetchedAt: string;
    reportType: ReportType;
    provenance: Provenance;
    [key: string]: unknown;
  };
  target?: Record<string, unknown>;
  targets?: Record<string, Record<string, unknown>>;
  disease?: Record<string, unknown>;
  diseases?: Record<string, Record<string, unknown>>;
  drug?: Record<string, unknown>;
  [key: string]: unknown;
}

/** Single report section before rendering. */
export interface ReportSection {
  id: string;
  title: string;
  body: string;
  citations?: string[];
}

/** Structured output from LLM synthesis (evidence vs inference vs recommendation). */
export interface GeneratedSection {
  title: string;
  summary: string;
  evidence_points: string[];
  inferences: string[];
  risks: string[];
  recommendations?: string[];
  citations: string[];
}

/** Rendered artifact paths. */
export interface ReportArtifacts {
  markdown?: string;
  html?: string;
  pdf?: string;
}

/** Full report run output. */
export interface ReportRun {
  reportId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  reportType: ReportType;
  request: ReportRequest;
  resolvedEntities?: ResolvedEntities;
  evidenceSnapshot?: EvidenceSnapshot;
  sections?: ReportSection[];
  provenance?: Provenance;
  artifacts?: ReportArtifacts;
  error?: string;
  createdAt: string;
  updatedAt: string;
}
