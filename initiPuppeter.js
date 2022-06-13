const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');


let contextGlobal;//convertir a clase

//convertir a clase
async function initPuppeter() {
//puppeteer.launch
//browser.createIncognitoBrowserContext();

    const context = await _initContext();

    const page = await context.newPage();


  await page.setDefaultNavigationTimeout(120000);
  await page.setRequestInterception(true);
  page.on('request', (req) => {
  if(req.resourceType() === 'stylesheet' || req.resourceType() === 'font'){
  req.abort();
  }
  else {
  req.continue();
  }}
  );

  return page;
}
async function _initBrowser() {
  puppeteer.use(StealthPlugin())
  const browser = await puppeteer.launch({
    args: [
      '--incognito',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--single-process',
      '--no-zygote'
    ],
     // headless:false,
  }); //{headless:false}
return browser;
}
async function _initContext() { //esto seria un getter

 // console.log(contextGlobal);

  if(contextGlobal != undefined) return contextGlobal;
  ///
  const browser = await _initBrowser();

  const context = await browser.createIncognitoBrowserContext();

  contextGlobal = context; //convertir a clase para evitar variables globales y recordar mas seguro estado

  return context;
  
}
 
exports.default = initPuppeter;

