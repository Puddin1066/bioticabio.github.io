export function renderFrontmatter(fields) {
    const lines = ['---'];
    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined && value !== null) {
            const v = typeof value === 'string' ? (value.includes(':') || value.includes('\n') ? `"${value.replace(/"/g, '\\"')}"` : value) : value;
            lines.push(`${key}: ${v}`);
        }
    }
    lines.push('---');
    return lines.join('\n');
}
//# sourceMappingURL=frontmatter.js.map