/**
 * Assemble report sections into a single Markdown string (no front matter).
 */
export function renderSections(sections) {
    return sections.map((s) => `## ${s.title}\n\n${s.body}`).join('\n\n---\n\n');
}
/**
 * Wrap body with optional base URL for site links.
 */
export function withBaseUrl(body, baseUrl) {
    if (!baseUrl)
        return body;
    return body.replace(/\{\%\s*link\s+([^\s%]+)\s*\%\}/g, (_, path) => `${baseUrl}/${path}`);
}
//# sourceMappingURL=markdown.js.map