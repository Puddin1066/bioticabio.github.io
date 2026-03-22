import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"];

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i += 1) {
    const key = args[i];
    const val = args[i + 1];
    if (key.startsWith("--")) out[key.slice(2)] = val;
  }
  return out;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function formatPct(value) {
  return `${((value ?? 0) * 100).toFixed(2)}%`;
}

function formatPos(value) {
  return (value ?? 0).toFixed(2);
}

function toMetricRow(row) {
  return {
    key: row.keys?.[0] || "(unknown)",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0
  };
}

function byImpressionsDesc(a, b) {
  return (b.impressions ?? 0) - (a.impressions ?? 0);
}

function byCtrAsc(a, b) {
  return (a.ctr ?? 0) - (b.ctr ?? 0);
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function classifyQueryIntent(query) {
  const q = (query || "").toLowerCase();
  const personTerms = ["john round", "bioticabio john", "johnround"];
  const consultingTerms = [
    "consulting",
    "consultant",
    "due diligence",
    "target validation",
    "biotech strategy",
    "portfolio",
    "open targets"
  ];

  if (personTerms.some((term) => q.includes(term))) return "person-entity";
  if (consultingTerms.some((term) => q.includes(term))) return "consulting-intent";
  return "other";
}

function selectTopByIntent(rows, intent) {
  return rows
    .filter((row) => classifyQueryIntent(row.key) === intent)
    .sort(byImpressionsDesc)
    .slice(0, 5);
}

function selectLowCtrOpportunities(rows) {
  return rows
    .filter((row) => (row.impressions ?? 0) >= 100)
    .filter((row) => (row.ctr ?? 0) <= 0.03)
    .sort(byCtrAsc)
    .slice(0, 5);
}

function writeJsonOutput(filePath, payload) {
  ensureDirForFile(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function writeMarkdownOutput(filePath, payload) {
  const { siteUrl, startDate, endDate, queries, pages, generatedAt } = payload;
  const consultingTop = selectTopByIntent(queries, "consulting-intent");
  const personTop = selectTopByIntent(queries, "person-entity");
  const lowCtr = selectLowCtrOpportunities(queries);
  const topPages = [...pages].sort(byImpressionsDesc).slice(0, 10);

  const md = [
    "# GSC Monthly Snapshot",
    "",
    `- Generated: ${generatedAt}`,
    `- Site: \`${siteUrl}\``,
    `- Range: ${startDate} -> ${endDate}`,
    "",
    "## Top consulting-intent queries",
    "",
    ...(consultingTop.length
      ? consultingTop.map(
          (row) =>
            `- ${row.key} | impressions=${row.impressions}, clicks=${row.clicks}, ctr=${formatPct(
              row.ctr
            )}, position=${formatPos(row.position)}`
        )
      : ["- None detected in current range."]),
    "",
    "## Top person/entity queries",
    "",
    ...(personTop.length
      ? personTop.map(
          (row) =>
            `- ${row.key} | impressions=${row.impressions}, clicks=${row.clicks}, ctr=${formatPct(
              row.ctr
            )}, position=${formatPos(row.position)}`
        )
      : ["- None detected in current range."]),
    "",
    "## Low-CTR optimization candidates",
    "",
    ...(lowCtr.length
      ? lowCtr.map(
          (row) =>
            `- ${row.key} | impressions=${row.impressions}, clicks=${row.clicks}, ctr=${formatPct(
              row.ctr
            )}, position=${formatPos(row.position)}`
        )
      : ["- No low-CTR candidates met threshold (>=100 impressions)."]),
    "",
    "## Top pages",
    "",
    ...topPages.map(
      (row) =>
        `- ${row.key} | impressions=${row.impressions}, clicks=${row.clicks}, ctr=${formatPct(
          row.ctr
        )}, position=${formatPos(row.position)}`
    ),
    ""
  ].join("\n");

  ensureDirForFile(filePath);
  fs.writeFileSync(filePath, md);
}

async function askCode(url) {
  console.log("\nAuthorize this app by visiting this URL:\n");
  console.log(url);
  console.log("");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const code = await new Promise((resolve) => {
    rl.question("Paste authorization code here: ", (answer) => resolve(answer.trim()));
  });
  rl.close();
  return code;
}

async function getAuthedClient(credentialsPath, tokenPath) {
  const credentials = readJson(credentialsPath);
  const installed = credentials.installed ?? credentials.web;
  if (!installed) {
    throw new Error("Credentials JSON must include an 'installed' or 'web' object.");
  }

  const oauth2Client = new google.auth.OAuth2(
    installed.client_id,
    installed.client_secret,
    (installed.redirect_uris && installed.redirect_uris[0]) || "http://localhost"
  );

  if (fs.existsSync(tokenPath)) {
    oauth2Client.setCredentials(readJson(tokenPath));
    return oauth2Client;
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  const code = await askCode(authUrl);
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  fs.mkdirSync(path.dirname(tokenPath), { recursive: true });
  fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
  console.log(`Saved token to ${tokenPath}`);
  return oauth2Client;
}

async function main() {
  const args = parseArgs();
  const siteUrl = args.site || "sc-domain:bioticabio.com";
  const credentialsPath = args.credentials || path.resolve(".secrets/credentials.json");
  const tokenPath = args.token || path.resolve(".secrets/gsc-token.json");
  const days = Number(args.days || 28);
  const rowLimit = Number(args.rows || 20);
  const outJson = args["out-json"] ? path.resolve(args["out-json"]) : null;
  const outMd = args["out-md"] ? path.resolve(args["out-md"]) : null;

  if (!fs.existsSync(credentialsPath)) {
    throw new Error(`Credentials file not found: ${credentialsPath}`);
  }

  const auth = await getAuthedClient(credentialsPath, tokenPath);
  const searchconsole = google.searchconsole({ version: "v1", auth });

  if (process.argv.includes("--list-sites")) {
    const listResp = await searchconsole.sites.list({});
    const entries = listResp.data.siteEntry || [];
    if (entries.length === 0) {
      console.log(
        "\nNo Search Console properties for this Google account.\n\n" +
          "Fix: In Search Console (as a property owner), open Settings → Users and permissions " +
          "and add the same email you used for OAuth with Full or Owner access. " +
          "Or delete .secrets/gsc-token.json and re-run OAuth while signed in as the property owner.\n"
      );
    } else {
      console.log("\nProperties this OAuth user can access — use an exact value with --site:\n");
      for (const e of entries) {
        console.log(`- ${e.siteUrl} (${e.permissionLevel ?? "unknown"})`);
      }
      console.log("");
    }
    process.exit(0);
  }

  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  const startDate = start.toISOString().slice(0, 10);
  const endDate = end.toISOString().slice(0, 10);

  const queryResp = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit
    }
  });

  const pageResp = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["page"],
      rowLimit
    }
  });

  console.log(`\nSearch Console report for ${siteUrl}`);
  console.log(`Date range: ${startDate} -> ${endDate}\n`);

  const queryRows = (queryResp.data.rows || []).map(toMetricRow);
  const pageRows = (pageResp.data.rows || []).map(toMetricRow);

  console.log("Top queries:");
  for (const row of queryRows) {
    console.log(
      `- ${row.key} | clicks=${row.clicks}, impressions=${row.impressions}, ctr=${formatPct(
        row.ctr
      )}, position=${formatPos(row.position)}`
    );
  }

  console.log("\nTop pages:");
  for (const row of pageRows) {
    console.log(
      `- ${row.key} | clicks=${row.clicks}, impressions=${row.impressions}, ctr=${formatPct(
        row.ctr
      )}, position=${formatPos(row.position)}`
    );
  }

  const outputPayload = {
    generatedAt: new Date().toISOString(),
    siteUrl,
    startDate,
    endDate,
    days,
    rowLimit,
    queries: queryRows,
    pages: pageRows
  };

  if (outJson) {
    writeJsonOutput(outJson, outputPayload);
    console.log(`\nWrote JSON output to ${outJson}`);
  }
  if (outMd) {
    writeMarkdownOutput(outMd, outputPayload);
    console.log(`Wrote Markdown summary to ${outMd}`);
  }
}

main().catch((err) => {
  console.error("\nFailed to fetch Search Console data.");
  console.error(err.message);
  process.exit(1);
});
