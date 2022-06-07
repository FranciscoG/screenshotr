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

    if (lastHTMLSize !== 0 && currentHTMLSize === lastHTMLSize) {
      countStableSizeIterations++;
    } else {
      countStableSizeIterations = 0; //reset the counter
    }

    if (countStableSizeIterations >= minStableSizeIterations) {
      console.log("Page rendered fully..");
      break;
    }

    lastHTMLSize = currentHTMLSize;
    await page.waitForTimeout(checkDurationMsecs);
  }
};

/**
 * Removes any link that is fails the regex test
 * @param {RegExp} hostRe a regex to test if host are the same
 * @param {string[]} urls array of full urls
 * @param {string[]} visited array of urls already scraped
 * @returns {string[]} an array of urls with external urls removed and search queries and hash stripped
 */
export const filterLinks = (hostRe, urls, visited) => {
  return urls
    .filter((href) => {
      const u = new URL(href);
      return hostRe.test(u.host) && !visited.includes(toBase(u));
    })
    .map(baseUrl);
};

/**
 * Takes a url string and strips out search queries and hash
 * @param {string} full a complete URI with hashes and search parameters
 * @returns {string} just the protocol + host + pathname
 */
export const baseUrl = (full) => {
  const u = new URL(full);
  return toBase(u);
};

/**
 * Takes an instance of URL and returns the url without any search queries or hash
 * @param {URL} url instance of URL
 * @returns {string} just the protocol + host + pathname
 */
export const toBase = (u) => {
  return `${u.protocol}//${u.host}${u.pathname}`;
};

/**
 * Dedupe an array
 * @param {any[]} arr
 * @returns {any[]}
 */
export const deDupe = (arr = []) => {
  return [...new Set(arr)];
};
