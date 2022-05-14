import puppeteer, { devices } from "puppeteer";
import fs from 'fs';
import path from 'path';

function makeFileName(pageIndex, prefix, filename, width) {
  var num = pageIndex + 1 + "";
  // left padding by a single 0 if need be
  if (num.length === 1) {
    num = "0" + num;
  }

  // file name should be as follows:
  // pageIndex + prefix + filename + width
  return `${num}-${prefix}-${filename.replace(" ", "-")}-${width}px.jpg`;
}

function noop() {}

export default function capture(config, onError = noop) {
  const {
    url,
    width,
    height,
    device,
    delay,
    prefix,
    filename,
    outputPath,
    username,
    password,
    pageIndex,
    quality,
    script,
    showConsole,
  } = config;

  try {
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  return async function run() {
    const browser = await puppeteer.launch();
    let page = await browser.newPage();

    /*********************************************************
     * Handle Events
     */

    if (showConsole) {
      page.on("console", (...args) => {
        for (let i = 0; i < args.length; ++i) {
          console.log(`${i}: ${args[i]}`);
        }
      });
    }

    page.on("error", (...args) => {
      for (let i = 0; i < args.length; ++i) {
        console.error(`${i}: ${args[i]}`);
        onError(`${i}: ${args[i]}`);
      }
    });

    /*********************************************************
     * device emulation
     * https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageemulateoptions
     */

    if (device && devices[device]) {
      await page.emulate(devices[device]);
    } else {
      await page.setViewport({
        width: width,
        height: 2000, // the 'fullPage' screenshot setting overrides it but any number is still needed here or it will fail
        deviceScaleFactor: 1,
        isMobile: false,
      });
    }

    /*********************************************************
     * HTTP Auth headers
     * https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagesetextrahttpheadersheaders
     */

    if (username && password) {
      let headers = new Map();
      let encodedCreds = Buffer.from(`${username}:${password}`).toString("base64");
      headers.set("Authorization", `Basic ${encodedCreds}`);
      await page.setExtraHTTPHeaders(headers).catch((err) => {
        console.log("setHeaders", err);
      });
    }

    /*********************************************************
     * load the actual page
     * https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegotourl-options
     */
    await page.goto(url);

    /*********************************************************
     * mouse move down (to trigger parallax and fade in animations)
     */

    if (script) {
      await page.injectFile(path.resolve(process.cwd(), script)).catch((err) => {
        console.log(err);
      });
    }

    /*********************************************************
     * add extra delay to allow for fade in effects, etc
     */

    if (delay) {
      await page.waitFor(delay);
    }

    /*********************************************************
      file name setup
    */
    const finalFileName = makeFileName(pageIndex, prefix, filename, width);

    /*********************************************************
      take screenshot
      https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions
    */
    await page
      .screenshot({
        path: outputPath + finalFileName,
        type: "jpeg",
        quality: quality || 80,
        fullPage: true,
      })
      .catch((err) => {
        console.log("screenshot", err);
      });

    browser.close();
    return outputPath + finalFileName;
  };
};
