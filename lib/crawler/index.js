import { URL } from "url";
import { startBrowser } from "../browser.js";
import { pageScraper } from "./pageScraper.js";
import { filterLinks, toBase } from "./utils.js";

async function crawl(startingUrl) {
  const originalUrl = new URL(startingUrl);
  const hostRe = new RegExp(`^(www\.)?${originalUrl.host.replace(/^www\./, "")}$`);

  // get new browser instance
  const browserInstance = await startBrowser();

  // visited links
  const visited = [];

  // links to crawl
  const links = new Set([startingUrl]);

  async function gotoUrl(nextUrl) {
    // start scraping
    const linksOnPage = await pageScraper(browserInstance, nextUrl);
    // process returned links
    const filtered = filterLinks(hostRe, linksOnPage, visited);
    // save only urls from the exact same domain
    filtered.forEach(links.add, links);
  }

  const LinksIter = links.values();

  while (links.size > 0) {
    const nexturl = LinksIter.next().value;
    await gotoUrl(nexturl);
    links.delete(nexturl);
    visited.push(nexturl);
  }

  // done, close browser instance
  await browserInstance.close();
  return visited;
}

export default crawl;
