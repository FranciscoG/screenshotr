#!/usr/bin/env node
const path = require('path');
const intake = require('./lib/intake.js');
const scrape = require('./lib/scrape.js');
var argv = require('minimist')(process.argv.slice(2));

function displayHelp(){
  var helptext = `
  Screenshot automation tool
  Usage:
    ./screenshots.js --capture path/to/your/config-file.json
    
    crawl a site to build a base config file for you
    ./screenshots.js --scrape www.domain.com
  
  If no destination folder is set, a folder called "output" will be created in the current directory`;
  
  console.log(helptext);
}

/******************************************************************
 * Screenshotr
 * index.js
 * 
 * in this file we just process the config file and pass
 * it off to /lib/intake.js
 */

/**
 * Check if required command line arguments exist
 */
if ( !argv.capture && !argv.scrape ) {
  displayHelp();
  process.exit(1);
}

if (argv.capture) {
  let userConfig = require( path.join( __dirname, argv.capture ) );
  intake(userConfig);
}

if (argv.scrape) {
  scrape(argv.scrape, argv.ssl);
}
