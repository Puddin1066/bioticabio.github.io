# Next steps to get bioticabio.com live

Follow these in order. Steps 1–4 are one-time setup; step 5 is optional (custom domain).

---

## 1. Create the site repo on GitHub

- Go to [just-the-docs/just-the-docs-template](https://github.com/just-the-docs/just-the-docs-template).
- Click **Use this template** → **Create a new repository**.
- Name it (e.g. `bioticabio-site` or `bioticabio.github.io` if you want `https://yourusername.github.io/bioticabio.github.io`).
- Create the repo (public is fine).

---

## 2. Replace the template content with Biotica Bio content

- Clone the new repo you just created.
- Delete everything in that repo **except** the `.git` folder (or delete all files and copy in the contents of `bioticabio-docs`).
- Copy **all** files and folders from this `bioticabio-docs` folder into the new repo root, including:
  - `.github/workflows/pages.yml`
  - `_config.yml`, `Gemfile`, `index.md`, all `.md` pages, `example/`, `assets/`, etc.
- Commit and push to `main`.

---

## 3. Enable GitHub Pages from Actions

- In the new repo: **Settings** → **Pages**.
- Under **Build and deployment**, **Source**: choose **GitHub Actions** (not “Deploy from a branch”).
- Save. The first push to `main` will trigger the workflow; wait for the **Deploy Jekyll site to Pages** run to finish (Actions tab).

---

## 4. Open the live site

- After a successful deploy, the site is at:
  - `https://<your-username>.github.io/<repo-name>/`  
  - or `https://<your-username>.github.io/` if the repo is named `<your-username>.github.io`.
- Click through: Home → What we do → For startups → For investors → Example (BRCA2) → How it’s built → The platform → About → Contact. Test search.

---

## 5. (Optional) Use bioticabio.com as the custom domain

- In the repo: **Settings** → **Pages** → **Custom domain**: enter `bioticabio.com`, then **Save**.
- At your DNS provider, add:
  - **CNAME** record: `bioticabio.com` → `<your-username>.github.io`  
  - or the **A** records GitHub shows for Pages.
- Back in **Settings** → **Pages**, enable **Enforce HTTPS** once DNS has propagated.
- In `_config.yml`, set `url: "https://bioticabio.com"` and push.

---

## Local preview (optional)

Local build needs **Ruby 2.7 or newer** (e.g. Ruby 3.3). If your system Ruby is older, use [rbenv](https://github.com/rbenv/rbenv), [rvm](https://rvm.io/), or rely on GitHub Actions to build.

```bash
cd bioticabio-docs
bundle install
bundle exec jekyll serve
```

Then open [http://localhost:4000](http://localhost:4000).

---

## After launch

- Add `favicon.ico` (and optional logo) under `assets/images/` and uncomment the `favicon_ico` / `logo` lines in `_config.yml`.
- Add or update a **Privacy** line (e.g. in footer or Contact) if you collect contact data.
