# Biotica Bio site (Just the Docs)

Marketing and documentation site for [Biotica Bio](https://bioticabio.com): evidence-led target assessment for startups and investors. Built with the [Just the Docs](https://just-the-docs.github.io/just-the-docs/) Jekyll theme.

## Using this site

### Option A: Standalone repo (recommended)

1. On GitHub, click **Use this template** on [just-the-docs/just-the-docs-template](https://github.com/just-the-docs/just-the-docs-template) to create a new repo (e.g. `bioticabio-site` or `bioticabio.github.io`).
2. Replace the template’s content with the contents of this `bioticabio-docs` folder (all files and folders, including `.github/workflows/pages.yml`).
3. In the new repo: **Settings → Pages → Build and deployment → Source** → **GitHub Actions**.
4. Push to `main`; the site will build and deploy. Set **Settings → Pages → Custom domain** to `bioticabio.com` when ready and point DNS there.

### Option B: Docs inside an existing repo

To host this site from a `docs` (or `bioticabio-docs`) directory in an existing repo, see [Hosting your docs from an existing project repo](https://github.com/just-the-docs/just-the-docs-template#hosting-your-docs-from-an-existing-project-repo) in the Just the Docs template README. Copy this folder into `docs`, add a workflow that sets `working-directory: docs` and uploads `docs/_site/`, and trigger on changes under `docs/**`.

## Local setup and preview

1. **Install dependencies** (requires Ruby ≥ 2.7; Jekyll 4.x needs it):

   ```bash
   bundle install
   ```

   If your system Ruby is older (e.g. macOS `/usr/bin/ruby` 2.6), use Homebrew’s Ruby:

   ```bash
   /opt/homebrew/opt/ruby/bin/bundle install
   ```

2. **Run the site locally:**

   ```bash
   bundle exec jekyll serve
   ```

   With Homebrew Ruby:

   ```bash
   /opt/homebrew/opt/ruby/bin/bundle exec jekyll serve
   ```

   If port 4000 is in use, pick another port:

   ```bash
   bundle exec jekyll serve --port 4002
   ```

3. Open [http://localhost:4000](http://localhost:4000) (or the port you chose).

## Contents

- **Home** — Value proposition, audience (startups / investors), CTA to example.
- **What we do** — Services and disclaimer.
- **For startups** / **For investors** — Use cases.
- **Example → BRCA2 report** — Full oncology target assessment (from Open Targets Platform).
- **How it’s built** — Method, query, reproducibility.
- **The platform** — Open Targets and attribution.
- **About** / **Contact** — Brand and contact.

Add `favicon.ico` and optional `logo.png` under `assets/images/` and reference them in `_config.yml` when you have them.
