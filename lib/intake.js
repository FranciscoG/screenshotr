const eachLimit = require('async/eachLimit');
const capturePage = require('./capture.js');

// var myPath = require('./pathStuff.js');
// myPath.openTransferpath();

const defaults = {
  outputPath: './output/',
  prefix : ''
}

module.exports = function(config) {
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

  function doOnEach(url, next) {
    let capUrl = capturePage(url);
    capUrl().then((filename)=>{
      console.log('finished capturing:', filename);
      next();
    });
  }

  function doOnFinish(error){
    if (error) {
      console.log("each-async done/error: " + error);
    } else {
      console.log('All urls have been processed successfully');
    }
  }

  eachLimit(urls, 5, doOnEach, doOnFinish);
}
