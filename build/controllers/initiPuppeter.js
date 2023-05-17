"use strict";
//import puppeteer,{BrowserContext, Page } from 'puppeteer';
//import puppeteer from 'puppeteer-extra';
//import StealthPlugin from 'puppeteer-extra-plugin-stealth';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chrome_aws_lambda_1 = __importDefault(require("chrome-aws-lambda"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
let contextGlobal; //convertir a clase
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
    console.info("chrome.executablePath,", await chrome_aws_lambda_1.default.executablePath);
    const browser = await puppeteer_core_1.default.launch({
        args: [
            ...chrome_aws_lambda_1.default.args,
            '--incognito',
            '--no-sandbox',
            '--hide-scrollbars',
            '--disable-setuid-sandbox',
            //'--single-process',
            // '--no-zygote'
        ],
        headless: true,
        executablePath: await (chrome_aws_lambda_1.default.executablePath),
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
        if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font') {
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
        //console.log('page ', page)
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
