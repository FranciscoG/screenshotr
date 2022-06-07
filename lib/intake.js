import eachLimit from "./utils/eachLimit.js";
import capturePage from "./capture.js";
import { startBrowser } from "./browser.js";

const defaults = {
  outputPath: "./output/",
  prefix: "",
};

export default async function intake(config) {
  const { urls, ...remainingConfig } = config;
  const globals = { ...defaults, ...remainingConfig };

  /********************************************************************
   * adding a page index number to each url
   */
  for (let i = 0; i < urls.length; i++) {
    let current = urls[i];
    // the local URL properties should overide the global
    urls[i] = { ...globals, ...current };
    urls[i].pageIndex = i;
  }

  const browserInstance = await startBrowser();

  async function doOnEach(url) {
    try {
      const runCapture = capturePage(url);
      const filename = await runCapture(browserInstance);
      console.log("finished capturing:", filename);
    } catch (e) {
      console.error(`error capturing ${url}: ${e.message}`);
    }
  }

  function doOnFinish(error) {
    if (error) {
      console.log("each-async done/error: " + error);
    } else {
      console.log("All urls have been processed successfully");
    }
  }

  await eachLimit(urls, 5, doOnEach, doOnFinish);
}
