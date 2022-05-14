import eachLimit from './utils/eachLimit.js';
import capturePage from './capture.js'

const defaults = {
  outputPath: './output/',
  prefix : ''
}

module.exports = async function(config) {
  let {urls} = config;
  delete config.urls;
  let globals = Object.assign({}, defaults, config);

  /********************************************************************
   * adding a page index number to each url
   */
  for (let i=0; i < urls.length; i++) {
    let current = urls[i];
    // the local URL properties should overide the global
    urls[i] = Object.assign({}, globals, current);
    urls[i].pageIndex = i;
  }

  async function doOnEach(url) {
    try {
      const runCapture = capturePage(url);
      const filename = await runCapture();
      console.log('finished capturing:', filename);
    } catch (e) {
      console.error(`error capturing ${url}: ${e.message}`);
    }
  }

  function doOnFinish(error){
    if (error) {
      console.log("each-async done/error: " + error);
    } else {
      console.log('All urls have been processed successfully');
    }
  }

  await eachLimit(urls, 5, doOnEach, doOnFinish);
}
