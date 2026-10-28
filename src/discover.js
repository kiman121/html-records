import * as cheerio from "cheerio";

export function discoverLinks(html, pageUrl) {
  const $ = cheerio.load(html);
  const links = [];
  $("a.record").each((_, element) => {
    const href = $(element).attr("href");
    if (!href) return;
    links.push(new URL(href, pageUrl).href);
  });
  return links;
}
