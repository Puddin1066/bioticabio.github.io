import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { ReportRun, ReportRequest } from '@biotica/core';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DATA_DIR = process.env.DATA_DIR ?? join(__dirname, '..', '..', '..', 'reports', 'generated');
const DB_PATH = process.env.DB_PATH ?? join(DATA_DIR, 'runs.db');

let db: ReturnType<typeof Database> | null = null;

function getDb(): Database.Database {
  if (db) return db;
  mkdirSync(DATA_DIR, { recursive: true });
  db = new Database(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS report_runs (
      report_id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'queued',
      report_type TEXT NOT NULL,
      request_json TEXT NOT NULL,
      resolved_entities_json TEXT,
      evidence_snapshot_json TEXT,
      sections_json TEXT,
      artifact_markdown_path TEXT,
      error_text TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  return db;
}

function generateId(): string {
  return 'rpt_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
}

export function createRun(request: ReportRequest): ReportRun {
  const reportId = generateId();
  const now = new Date().toISOString();
  const db = getDb();
  db.prepare(
    `INSERT INTO report_runs (report_id, status, report_type, request_json, created_at, updated_at)
     VALUES (?, 'queued', ?, ?, ?, ?)`
  ).run(reportId, request.reportType, JSON.stringify(request), now, now);

  return {
    reportId,
    status: 'queued',
    reportType: request.reportType,
    request,
    createdAt: now,
    updatedAt: now,
  };
}

export function getRun(reportId: string): ReportRun | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM report_runs WHERE report_id = ?').get(reportId) as {
    report_id: string;
    status: string;
    report_type: string;
    request_json: string;
    resolved_entities_json: string | null;
    evidence_snapshot_json: string | null;
    sections_json: string | null;
    artifact_markdown_path: string | null;
    error_text: string | null;
    created_at: string;
    updated_at: string;
  } | undefined;
  if (!row) return null;

  const request = JSON.parse(row.request_json) as ReportRequest;
  const run: ReportRun = {
    reportId: row.report_id,
    status: row.status as ReportRun['status'],
    reportType: row.report_type as ReportRun['reportType'],
    request,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
  if (row.resolved_entities_json) run.resolvedEntities = JSON.parse(row.resolved_entities_json);
  if (row.evidence_snapshot_json) run.evidenceSnapshot = JSON.parse(row.evidence_snapshot_json) as ReportRun['evidenceSnapshot'];
  if (row.artifact_markdown_path) run.artifacts = { markdown: row.artifact_markdown_path };
  if (row.error_text) run.error = row.error_text;
  return run;
}

export function updateRun(
  reportId: string,
  updates: {
    status: ReportRun['status'];
    resolvedEntities?: ReportRun['resolvedEntities'];
    evidenceSnapshot?: ReportRun['evidenceSnapshot'];
    sections?: ReportRun['sections'];
    artifactMarkdownPath?: string;
    error?: string;
  }
): void {
  const now = new Date().toISOString();
  const db = getDb();
  const row = db.prepare('SELECT request_json FROM report_runs WHERE report_id = ?').get(reportId) as { request_json: string } | undefined;
  if (!row) return;

  db.prepare(
    `UPDATE report_runs SET
      status = ?, resolved_entities_json = ?, evidence_snapshot_json = ?, sections_json = ?,
      artifact_markdown_path = ?, error_text = ?, updated_at = ?
     WHERE report_id = ?`
  ).run(
    updates.status,
    updates.resolvedEntities ? JSON.stringify(updates.resolvedEntities) : null,
    updates.evidenceSnapshot ? JSON.stringify(updates.evidenceSnapshot) : null,
    updates.sections ? JSON.stringify(updates.sections) : null,
    updates.artifactMarkdownPath ?? null,
    updates.error ?? null,
    now,
    reportId
  );
}

export function getNextQueuedRun(): string | null {
  const db = getDb();
  const row = db.prepare("SELECT report_id FROM report_runs WHERE status = 'queued' ORDER BY created_at ASC LIMIT 1").get() as { report_id: string } | undefined;
  return row?.report_id ?? null;
}

export function getDataDir(): string {
  return DATA_DIR;
}
