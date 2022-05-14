Work in progress

__Prerequisites:__

Node.js - http://nodejs.org/  get LTS version

run `npm install` when you first download this to install local dependencies

__________________

### How to use

From the command line:

```
$ ./screenshots.js path/to/site.js
```

__________________

### How to setup your site.js  

**note:** Your js file can be called whatever you desire, 'site.js' is just an example filename

Here's how to setup your the javascript file that screenshot.js processes. Let's start with your global settings. Here are all the global options available:

```javascript
module.exports = {
  outputPath: "", 
  filename_prefix: "", 
  width: ##,
  height: ##, 
  splitPages: true,
  zoom: ##,
  loadTime: ##,
  urls: [], // this will hold the array of objects for the individual pages
  cookies: {}
};
```

Explanation of each global setting    

**outputPath:** @type {string}    
default: "./output/"    
Path to where you want the screenshots to be saved


**filename:** @type {string}    
Global filename prefix.


**width:** @type {number}    
globally set the width of browser window when capturing


**height:** @type {number}    
globally set the clip height for all pages. In order for this to work you need to at least ClipX in the URL object


**splitPages:** @type {bool}    
whether to split screenshots into chunks.


**zoom:** @type {number}    
globally set the page zoom amount. ex. 1.5 would give you a 150% zoom level


**loadTime:** @type {numbner}    
Default: 5000    
Globally set the amount of time, in milliseconds, that you will allow PhantomJS to load a URL before rendering.


**urls:** @type {array}    
An arry of url objects.  See [URLS](#urls) section for more details.


**cookies:** @type {object}    
cookie object. See [Cookies](#cookies) section below for more details


**loadTime:** @type {Number}    
Default: 5000    
set the page load timeout globally. How much time to wait for page load before PhantomJS takes a screenshot.  In milliseconds.


__________________

### URLS

**`urls : []`** is an array URL objects that are setup like this:


```javascript
{
  url: "",
  filename: "",
  cookie: "",
  width: ##,
  height: ##,
  clipX: ##,
  clipY: ##,
  zoom: ##,
  username: "",
  password: "",
  noScrollbar: true,
  loadTime: ##,
  subfolder: ""
}
```

**url:**  @type {String}    
**required**    
the url to be screenshot.  This is the only required property


**filename:** @type {String}    
Additional string to be appended to the global filename


**cookie:** @type {String}    
Indicates which array of cookies from your cookie object to use. See [Cookies](#cookies) below for more details


**width:** @type {Number}    
Override the global width just for the current url


**height:** @type {Number}    
Override the global height just for the current url


**clipX:** @type {Number}    
Set the starting X coordinate for your clip region.  Clipping will only work when both a width and height are set.


**clipY:** @type {Number}    
Set the starting Y coordinate for your clip region.  Clipping will only work when both a width and height are set.


**zoom:** @type {Number}    
Apply a zoom to the current page only.  Overrides the global zoom property if set.


**username:** @type {String}    
**password:** @type {String}    
Simple HTTP Auth credentials.

**noScrollbar:** @type {Bool}    
Default: false    
Sets overflow hidden to all elements on the page with `!important`.  Useful if you want to simulate a mobile screenshot


**loadTime:** @type {Number}     
Override the global loadTime setting for a specific url


**subfolder:** @type {String}    
this will append to global path.  It will insert a "/" before and after.  (ex.  'mysub' will be appended as '/mysub/')

