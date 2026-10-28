import * as cheerio from "cheerio";

export function parsePage(html, sourceUrl) {
  const $ = cheerio.load(html);
  const title = $("article h1").first().text().trim();
  const published = $("article time").first().attr("datetime") || "";
  const summary = $("article p.summary").first().text().trim();
  if (!title || !published || !summary) {
    throw new Error(`Record is missing a field: ${sourceUrl}`);
  }
  const id = new URL(sourceUrl).pathname.split("/").pop().replace(/\.html$/, "");
  return { id, title, published, summary, source_url: sourceUrl };
}
