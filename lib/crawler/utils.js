import { URL } from "url";

// src: https://stackoverflow.com/a/61304202
export const waitTillHTMLRendered = async (page, timeout = 30000) => {
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;

  while (checkCounts++ <= maxChecks) {
    let html = await page.content();
    let currentHTMLSize = html.length;

    // let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

    // console.log(
    //   "last: ",
    //   lastHTMLSize,
    //   " <> curr: ",
    //   currentHTMLSize,
    //   " body html size: ",
    //   bodyHTMLSize
    // );

    if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) countStableSizeIterations++;
    else countStableSizeIterations = 0; //reset the counter

    if (countStableSizeIterations >= minStableSizeIterations) {
      console.log("Page rendered fully..");
      break;
    }

    lastHTMLSize = currentHTMLSize;
    await page.waitForTimeout(checkDurationMsecs);
  }
};

/**
 * @param {URL} original instance of URL constructed with original full url
 * @param {string[]} urls array of full urls
 * @param {Set<string>} visited Set of visited urls
 */
export const filterLinks = (original, urls, visited) => {
  return urls
    .filter((href) => {
      const u = new URL(href);
      const base = toBase(u);
      if (u.host === original.host) {
        visited.add(base);
        return true;
      }
      return false;
    })
    .map(baseUrl);
};

/**
 *
 * @param {string} full a complete URI with hashes and search parameters
 * @returns {string} just the protocol + host + pathname
 */
export const baseUrl = (full) => {
  const u = new URL(full);
  return toBase(u);
};

/**
 *
 * @param {URL} url instance of URL
 * @returns {string} just the protocol + host + pathname
 */
export const toBase = (u) => {
  return `${u.protocol}//${u.host}${u.pathname}`;
};
