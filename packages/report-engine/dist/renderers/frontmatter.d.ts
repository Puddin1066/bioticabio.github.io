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
export declare function renderFrontmatter(fields: FrontmatterFields): string;
//# sourceMappingURL=frontmatter.d.ts.map