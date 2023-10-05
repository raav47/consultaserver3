"use strict";
//import puppeteer,{BrowserContext, Page } from 'puppeteer';
//import puppeteer from 'puppeteer-extra';
//import StealthPlugin from 'puppeteer-extra-plugin-stealth';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import chrome from 'chrome-aws-lambda';
const puppeteer_core_1 = __importDefault(require("puppeteer-core")); ///SOLO PROD
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
// Optional: If you'd like to use the legacy headless mode. "new" is the default.
//chromium.setHeadlessMode = true;
// Optional: If you'd like to disable webgl, true is the default.
chromium_1.default.setGraphicsMode = false;
/// SOLO PRUEBA import puppeteer,{BrowserContext,Page} from 'puppeteer';/// SOLO PRUEBA 
let contextGlobal; //convertir a clase
//let prueba = true;
//sudo apt-get install ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils
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
    // console.info("chrome.executablePath,",await chrome.executablePath)
    //chromium.
    const browser = await puppeteer_core_1.default.launch({
        args: [
            ...chromium_1.default.args,
            '--incognito',
            /*'--no-sandbox',
            '--hide-scrollbars',*/
            '--disable-setuid-sandbox',
            ///'--single-process',
            /// '--no-zygote'
        ],
        headless: chromium_1.default.headless,
        executablePath: await (chromium_1.default.executablePath()),
        ignoreHTTPSErrors: true,
    }); //{headless:false}
    return browser;
}
async function _initContext() {
    // console.log(contextGlobal);
    if (contextGlobal != undefined)
        return contextGlobal;
    ///
    const browser = await _initBrowser();
    console.info("broser iniciado");
    const context = await browser.createIncognitoBrowserContext();
    contextGlobal = context; //convertir a clase para evitar variables globales y recordar mas seguro estado
    // console.info("returnado context")
    return context;
}
async function _initPuppeter() {
    //puppeteer.launch
    //browser.createIncognitoBrowserContext();
    const context = await _initContext();
    //  console.info("contexto iniciado")
    // console.info("pages = ",await context.pages())
    //context.
    const page = await context.newPage();
    console.info("page iniciado");
    page.setDefaultNavigationTimeout(120000);
    //await page.setCacheEnabled(false);//En teoria para que pueda undir f5 en la de digitel sin que me salga el captcha luego de un tiempo
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() === 'stylesheet'
            || req.resourceType() === 'font'
            || req.resourceType() === 'media'
            || req.resourceType() === "image"
            || req.resourceType() === "manifest"
            || req.resourceType() === "fetch") {
            req.abort();
        }
        else {
            req.continue();
        }
    });
    return page;
}
async function initPage(url) {
    const page = await _initPuppeter();
    try {
        console.log('page _initPuppeter ', page);
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 120000,
        });
        return page;
    }
    catch (error) {
        console.log('se debe intentar abrir de nuevo , error = ', error);
        page.close();
        return await initPage(url); //forzamos hasta que abra
    }
}
;
exports.default = initPage;
