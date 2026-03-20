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

  if (!fs.existsSync(credentialsPath)) {
    throw new Error(`Credentials file not found: ${credentialsPath}`);
  }

  const auth = await getAuthedClient(credentialsPath, tokenPath);
  const searchconsole = google.searchconsole({ version: "v1", auth });

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

  console.log("Top queries:");
  for (const row of queryResp.data.rows || []) {
    const key = row.keys?.[0] || "(unknown)";
    console.log(
      `- ${key} | clicks=${row.clicks ?? 0}, impressions=${row.impressions ?? 0}, ctr=${(
        (row.ctr ?? 0) * 100
      ).toFixed(2)}%, position=${(row.position ?? 0).toFixed(2)}`
    );
  }

  console.log("\nTop pages:");
  for (const row of pageResp.data.rows || []) {
    const key = row.keys?.[0] || "(unknown)";
    console.log(
      `- ${key} | clicks=${row.clicks ?? 0}, impressions=${row.impressions ?? 0}, ctr=${(
        (row.ctr ?? 0) * 100
      ).toFixed(2)}%, position=${(row.position ?? 0).toFixed(2)}`
    );
  }
}

main().catch((err) => {
  console.error("\nFailed to fetch Search Console data.");
  console.error(err.message);
  process.exit(1);
});
