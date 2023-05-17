//import puppeteer,{BrowserContext, Page } from 'puppeteer';
//import puppeteer from 'puppeteer-extra';
//import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import chrome from 'chrome-aws-lambda';
import puppeteer,{BrowserContext,Page} from 'puppeteer-core';

let contextGlobal:BrowserContext;//convertir a clase

//convertir a clase
async function _initBrowser() {
  /**  puppeteer.use(StealthPlugin())
   const browser = await puppeteer.launch({
     args: [
       '--incognito',
       '--no-sandbox',
       '--disable-setuid-sandbox',
       //'--single-process',
      // '--no-zygote'
     ],
      headless:true,
   }); //{headless:false}*/

   console.info("chrome.executablePath,",await chrome.executablePath)
   const browser = await puppeteer.launch({
     args: [
      ...chrome.args,
       '--incognito',
       '--no-sandbox',
       '--hide-scrollbars',
       '--disable-setuid-sandbox',
       //'--single-process',
      // '--no-zygote'
     ],
      headless:true,
      executablePath: await (chrome.executablePath),
      ignoreHTTPSErrors:true,
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
 
async function _initPuppeter() {
  //puppeteer.launch
  //browser.createIncognitoBrowserContext();
  
      const context = await _initContext();
  
      const page = await context.newPage();
  
  
  
     page.setDefaultNavigationTimeout(120000);
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

  
async function initPage(url:string):Promise<Page> { 
  const page = await _initPuppeter();
  try{  
    //console.log('page ', page)
    
    await page.goto(url, { //http://www.movilnet.com.ve/sitio/minisitios/consulta/
      waitUntil: 'domcontentloaded',
      timeout: 120000,
    });
    return page;
  }catch(error){
      console.log('se debe intentar abrir de nuevo , error = ',error);
      page.close()
      return await initPage(url) //forzamos hasta que abra
  }
};
export default initPage;

