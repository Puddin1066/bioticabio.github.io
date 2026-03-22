# Weekly SEO operations playbook

Use this loop weekly to convert Search Console data into measurable growth.

## 1) Pull baseline data

From repository root:

```bash
npm run gsc:top-queries -- --site "https://bioticabio.com/" --days 28 --rows 50
```

If your property is **domain** (not URL-prefix), use:

```bash
npm run gsc:top-queries -- --site "sc-domain:bioticabio.com" --days 28 --rows 50
```

Run `npm run gsc:list-sites` to see exact `siteUrl` values for your OAuth user.

Track:

- top queries
- top pages
- clicks, impressions, CTR, average position

For monthly persistence (recommended):

```bash
npm run seo:monthly
```

This writes a dated snapshot to `docs/seo/metrics/` for trend tracking and review.

## 2) Prioritize fixes

- **High impressions + low CTR:** rewrite title/description for stronger intent match.
- **Position 8-20:** strengthen on-page clarity and internal links.
- **Position 1-5 + low CTR:** test tighter value proposition and proof language.

## 3) Weekly page optimization list

Review these first:

- `/`
- `/what-we-do.html`
- `/for-startups.html`
- `/for-investors.html`
- `/example.html`

## 4) Internal linking checks

Ensure these paths remain intact:

- `/` -> persona pages -> `/example.html` -> `/contact.html`
- `/how-its-built.html` and `/the-platform.html` -> `/example.html` + `/contact.html`

## 5) Monthly hygiene

- Confirm `sitemap.xml` still includes only strategic pages.
- Confirm `reports/generated/**` remains `noindex,follow`.
- Review duplicate or near-duplicate pages for consolidation opportunities.
