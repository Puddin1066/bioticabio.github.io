/**
 * Jekyll-style YAML front matter for report Markdown.
 */
export interface FrontmatterFields {
  title: string;
  layout?: string;
  parent?: string;
  nav_order?: number;
  description?: string;
}

export function renderFrontmatter(fields: FrontmatterFields): string {
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
