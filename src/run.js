import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { discoverLinks } from "./discover.js";
import { fetchPage } from "./fetch.js";
import { parsePage } from "./parse.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function readPage(pageUrl) {
  if (pageUrl.startsWith("file:")) {
    return readFile(new URL(pageUrl), "utf8");
  }
  return fetchPage(pageUrl);
}

export async function collect(listingUrl) {
  const listingHtml = await readPage(listingUrl);
  const links = discoverLinks(listingHtml, listingUrl);
  const records = [];
  for (const link of links) {
    const html = await readPage(link);
    records.push(parsePage(html, link));
  }
  records.sort((a, b) => a.id.localeCompare(b.id));
  return records;
}

export async function writeRecords(records, outputPath) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(records, null, 2)}\n`);
}

function listingUrlFromArgs(argv) {
  const flag = argv.indexOf("--url");
  if (flag !== -1 && argv[flag + 1]) {
    return argv[flag + 1];
  }
  return new URL("../fixtures/listing.html", import.meta.url).href;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const listingUrl = listingUrlFromArgs(process.argv);
  const outputPath = path.join(root, "output", "records.json");
  const records = await collect(listingUrl);
  await writeRecords(records, outputPath);
  console.log(`Wrote ${records.length} records to ${outputPath}`);
}
