import assert from "node:assert/strict";
import test from "node:test";
import { discoverLinks } from "../src/discover.js";
import { parsePage } from "../src/parse.js";
import { collect } from "../src/run.js";

const listingUrl = new URL("../fixtures/listing.html", import.meta.url).href;

test("discoverLinks keeps record links and drops the rest", () => {
  const html = `
    <a class="record" href="records/alpha.html">Alpha</a>
    <a href="about.html">About</a>
  `;
  const links = discoverLinks(html, listingUrl);
  assert.equal(links.length, 1);
  assert.match(links[0], /records\/alpha\.html$/);
});

test("parsePage reads the title, date, and summary", () => {
  const html = `
    <article>
      <h1>Alpha notice</h1>
      <time datetime="2026-10-01">1 Oct 2026</time>
      <p class="summary">Library reading room closes early on Friday.</p>
    </article>
  `;
  const record = parsePage(html, new URL("../fixtures/records/alpha.html", import.meta.url).href);
  assert.equal(record.id, "alpha");
  assert.equal(record.published, "2026-10-01");
  assert.match(record.summary, /reading room/);
});

test("collect walks the fixture listing into two records", async () => {
  const records = await collect(listingUrl);
  assert.deepEqual(
    records.map((record) => record.id),
    ["alpha", "beta"]
  );
  assert.equal(records[0].title, "Alpha notice");
  assert.equal(records[1].published, "2026-10-15");
});
