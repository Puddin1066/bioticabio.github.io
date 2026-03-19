/**
 * Quality gates: snapshot-style checks, provenance, and mocked-data labeling.
 * Run with: npx tsx src/__tests__/report.integrated.test.ts (or node after build)
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { buildIntegratedReportMarkdown, buildIntegratedReportSections } from '../buildIntegratedReport.js';
import type { IntegratedReportData } from '../buildIntegratedReport.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadFixture(name: string): IntegratedReportData {
  const fromDist = join(__dirname, '..', '..', 'src', '__tests__', 'fixtures', name);
  const fromSrc = join(__dirname, 'fixtures', name);
  const path = __dirname.includes('dist') ? fromDist : fromSrc;
  return JSON.parse(readFileSync(path, 'utf8')) as IntegratedReportData;
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

// --- Required sections (from report-reflection-criteria and plan) ---
const REQUIRED_SECTION_IDS = ['executive-summary', 'progesterone', 'dry-eye', 'trigeminal', 'integration', 'recommendation', 'provenance'];

// --- Provenance must contain these (no pipeline-failure tone) ---
const PROVENANCE_MUST_CONTAIN = ['Open Targets', 'ontology translation', 'Entity resolution'];

// --- Mocked data must be explicitly labeled ---
const MOCK_LABEL = '[MOCK]';

export function runQualityGates(): void {
  const minimal = loadFixture('integrated-minimal.json');
  const mocked = loadFixture('mocked-integrated.json');

  // 1. Structured sections present
  const sections = buildIntegratedReportSections(minimal);
  for (const id of REQUIRED_SECTION_IDS) {
    assert(sections.some((s) => s.id === id), `Missing required section: ${id}`);
  }

  // 2. Full Markdown contains required headings
  const markdown = buildIntegratedReportMarkdown(minimal, '', 'executive');
  assert(markdown.includes('## Data provenance'), 'Markdown must include "## Data provenance"');
  assert(markdown.includes('## Integration'), 'Markdown must include "## Integration"');

  // 3. Provenance block contains required phrasing (no "could not be resolved" tone)
  const provenanceSection = sections.find((s) => s.id === 'provenance');
  assert(!!provenanceSection, 'Provenance section must exist');
  for (const phrase of PROVENANCE_MUST_CONTAIN) {
    assert(
      provenanceSection!.body.includes(phrase),
      `Provenance must contain "${phrase}"`
    );
  }
  assert(
    !provenanceSection!.body.toLowerCase().includes('could not be resolved'),
    'Provenance must not contain pipeline-failure tone'
  );

  // 4. Mocked fixture produces output that labels mock data
  const mockedMarkdown = buildIntegratedReportMarkdown(mocked, '', 'executive');
  assert(
    mockedMarkdown.includes(MOCK_LABEL),
    'Output built from mocked fixture must contain "[MOCK]" label'
  );

  console.log('Quality gates passed.');
}

runQualityGates();
