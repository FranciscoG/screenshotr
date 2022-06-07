/**
 * This file is called when you want to scrape a site and build
 * the JS object that is used as the config during intake
 */
import fs from "fs";
import { URL } from "url";
import crawler from "./crawler/index.js";

export default async function scrape(domain, ssl, saveTo) {
  const myURL = new URL(domain);
  const protocol = ssl ? "https" : "http";
  const target = protocol + myURL.href.replace(/^https?/, "");

  const saveObj = {
    prefix: myURL.href,
    width: 1200,
    delay: 3000,
    username: false,
    password: false,
    script: false,
    outputPath: "./output/",
    urls: [],
  };

  const links = await crawler(domain);
  
  links.forEach((link) => {
    const fileName = link.replace(target + "/", "").replace(/\//g, "-");
    saveObj.urls.push({
      filename: fileName === "" ? "homepage" : fileName,
      url: link,
    });
  });

  const jsonSaveFile = "./" + myURL.href.replace(/[\.\:]/g, "-").replace(/\//g, "") + ".json";

  console.log("jsonSaveFile:", jsonSaveFile);

  fs.writeFileSync(saveTo || jsonSaveFile, JSON.stringify(saveObj, null, 2), {
    encoding: "utf-8",
  });
}
