/**
 * This file is called when you want to scrape a site and build
 * the JS object that is used as the config during intake
 */

const Crawler = require("simplecrawler");
const fs = require('fs-extra');
const url = require('url');

// we only want to scrape html files so skipping typical resource types to speed things up
const resourceRegex = new RegExp('\.(pdf|jpe?g|png|css|js|woff2?|ttf|otf|svg)$', 'i');

module.exports = function(domain, ssl, saveTo){
  const myURL = url.parse(domain);
  console.log(myURL);
  let protocol = ssl ? 'https://' : 'http://';
  let target = protocol + myURL.href;

  var saveObj = {
    prefix : myURL.href,
    width: 1200,
    delay: 3000,
    username: false,
    password: false,
    script: false,
    outputPath: './output/',
    urls: []
  }

  var crawler = new Crawler(target);
  crawler.respectRobotsTxt=false;
  crawler.allowInitialDomainChange=true;
  crawler.stripQuerystring=true;
  crawler.parseHTMLComments=false;
  // crawler.ignoreInvalidSSL=true;

  crawler.on('crawlstart', ()=>console.log('beginning crawl of', target));

  var conditionID = crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback) {
    callback(null, !queueItem.path.match(resourceRegex));
  });

  crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    console.log(response.headers['content-type']);
    if (response.headers['content-type'].indexOf('text/html') >= 0) {
      console.log("%s (%d bytes)", queueItem.url, responseBuffer.length);
      
      let fileName = queueItem.url.replace(target+'/','').replace(/\//g,'-');
      saveObj.urls.push({ 
        filename: fileName === '' ? 'homepage' : fileName, 
        url: queueItem.url
      });
    }
  });

  /**************************************************
   * complete
   */

  const jsonSaveFile = './' + myURL.href.replace(/[\.\:]/g,'-').replace(/\//g,'') + '.json';
  
  console.log('jsonSaveFile:', jsonSaveFile);

  crawler.on('complete', function(){
    fs.writeJsonSync(saveTo || jsonSaveFile, saveObj, {
      spaces: 2
    })
  })

  /**************************************************
   * Error handling
   */

  crawler.on('fetch404', function(queueItem, responseObject){
    console.log("404 for %s", queueItem.url);
  })

  crawler.on('queueerror', function(err, URLData){
    console.log(err, URLData);
  })

  crawler.on('fetcherror', function(queueItem, responseObject){
    console.log("fetcherror for %s", queueItem.url);
  })

  crawler.start();
}