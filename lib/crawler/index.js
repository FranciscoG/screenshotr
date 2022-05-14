import { URL } from "url";
import { startBrowser } from "./browser.js";
import { pageScraper } from "./pageScraper.js";
import { filterLinks, toBase } from "./utils.js";

async function crawl(startingUrl) {
  const original = new URL(startingUrl);

  // visited links
  let visited = new Set([toBase(startingUrl)]);

  // links to vist
  let links = new Set([startingUrl]);

  // get new browser instance
  let browserInstance = await startBrowser();

  async function gotoUrl(nextUrl) {
    // start scraping
    const linksOnPage = await pageScraper(browserInstance, nextUrl);
    const filtered = filterLinks(original, linksOnPage, visited);

    // save only urls from the exact same domain
    links = links.concat(filtered);
  }

  while (links.length > 0) {
    const nexturl = links.shift();
    if (nexturl) {
      await gotoUrl(nexturl);
    }
  }

  // done, close browser instance
  await browserInstance.close();
  console.log([...visited]);
}

export default crawl;
