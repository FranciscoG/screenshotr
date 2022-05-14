import { waitTillHTMLRendered } from "./utils.js";

export async function pageScraper(browser, url) {
  let page = await browser.newPage();
  console.log(`Navigating to ${url}...`);

  try {
    // Navigate to the selected page and wait for it to stop loading
    await page.goto(url, {
      timeout: 10000,
      waitUntil: "load",
    });
    // wait for any JS to stop manipulating the DOM
    await waitTillHTMLRendered(page);
  } catch (e) {
    console.error(`Error navigating to ${url}:`, e.message);
    return [];
  }

  // Get all links with hrefs and return them
  return await page.$$eval("a[href]", (links) => links.map((link) => link.href));
}

