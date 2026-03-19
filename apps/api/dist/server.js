import express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createRun, getRun, updateRun, getDataDir } from './store.js';
import { runWorkerLoop } from './worker.js';
const app = express();
app.use(express.json());
const PORT = Number(process.env.PORT) || 3000;
/** POST /reports — create a report request and enqueue. */
app.post('/reports', (req, res) => {
    try {
        const body = req.body;
        const reportType = body.reportType ?? 'integrated-thesis';
        const subject = body.subject ?? { drug: 'CHEMBL103', diseases: ['dry eye disease'], targets: ['TRPV1', 'TRPM8', 'SCN9A', 'CHRM3'] };
        const request = {
            reportType,
            subject,
            audience: body.audience ?? 'executive',
            context: { mode: body.context?.mode ?? 'live' },
        };
        const run = createRun(request);
        res.status(202).json({
            reportId: run.reportId,
            status: run.status,
            reportType: run.reportType,
            createdAt: run.createdAt,
        });
    }
    catch (e) {
        res.status(400).json({ error: e instanceof Error ? e.message : 'Bad request' });
    }
});
/** GET /reports/:id — get run status and metadata. */
app.get('/reports/:id', (req, res) => {
    const run = getRun(req.params.id);
    if (!run) {
        res.status(404).json({ error: 'Report not found' });
        return;
    }
    res.json(run);
});
/** POST /reports/:id/refresh — re-run report (same request). */
app.post('/reports/:id/refresh', (req, res) => {
    const run = getRun(req.params.id);
    if (!run) {
        res.status(404).json({ error: 'Report not found' });
        return;
    }
    updateRun(run.reportId, { status: 'queued' });
    res.status(202).json({ reportId: run.reportId, status: 'queued' });
});
/** GET /reports/:id/artifact — get report markdown (or 404). */
app.get('/reports/:id/artifact', (req, res) => {
    const run = getRun(req.params.id);
    if (!run) {
        res.status(404).json({ error: 'Report not found' });
        return;
    }
    const path = run.artifacts?.markdown;
    if (!path) {
        res.status(404).json({ error: 'Artifact not ready or missing' });
        return;
    }
    try {
        const content = readFileSync(path, 'utf8');
        res.type('text/markdown').send(content);
    }
    catch {
        res.status(404).json({ error: 'Artifact file not found' });
    }
});
/** GET /reports/:id/evidence — get fetched data (evidence snapshot) as JSON (or 404). */
app.get('/reports/:id/evidence', (req, res) => {
    const run = getRun(req.params.id);
    if (!run) {
        res.status(404).json({ error: 'Report not found' });
        return;
    }
    const path = join(getDataDir(), req.params.id, 'evidence.json');
    try {
        const content = readFileSync(path, 'utf8');
        res.type('application/json').send(content);
    }
    catch {
        res.status(404).json({ error: 'Evidence not ready or missing' });
    }
});
app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
    runWorkerLoop(2000);
});
