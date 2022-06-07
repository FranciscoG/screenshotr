#!/usr/bin/env node
import path from 'path'
import { program } from 'commander';

import intake from './lib/intake';
import scrape from './lib/crawler/index.js';

program
  .option("-c, --capture <string>", "begin screenshoting")
  .option("-s, --scrape <string>", "scrape url and build config file for capturing");

program.parse(process.argv);
const options = program.opts();

/**
 * Check if required command line arguments exist
 */
if (!options.capture && !options.scrape) {
  program.help();
}

if (options.capture) {
  let userConfig = require(path.join(__dirname, options.capture));
  intake(userConfig);
}

if (options.scrape) {
  scrape(options.scrape);
}
