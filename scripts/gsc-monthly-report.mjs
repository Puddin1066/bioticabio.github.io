import path from "node:path";
import { spawnSync } from "node:child_process";

function monthStamp(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

/** Default matches URL-prefix property in Search Console (not the same as sc-domain:). */
const DEFAULT_GSC_SITE = "https://bioticabio.com/";

function main() {
  const stamp = monthStamp();
  const root = process.cwd();
  const outDir = path.join(root, "docs", "seo", "metrics");
  /** e.g. `-gemflush` so a second property in the same month does not overwrite Biotica files */
  const suffix = process.env.GSC_METRICS_SUFFIX || "";
  const jsonPath = path.join(outDir, `gsc${suffix}-${stamp}.json`);
  const mdPath = path.join(outDir, `gsc${suffix}-${stamp}.md`);
  const site = process.env.GSC_SITE || DEFAULT_GSC_SITE;

  const args = [
    "scripts/gsc-top-queries.mjs",
    "--site",
    site,
    "--days",
    "28",
    "--rows",
    "100",
    "--out-json",
    jsonPath,
    "--out-md",
    mdPath
  ];

  const run = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (run.status !== 0) {
    process.exit(run.status ?? 1);
  }

  console.log(`\nMonthly SEO metrics written to:\n- ${jsonPath}\n- ${mdPath}`);
}

main();
