"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
let contextGlobal; //convertir a clase
//convertir a clase
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
async function _initBrowser() {
    puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
    const browser = await puppeteer_extra_1.default.launch({
        args: [
            '--incognito',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            //'--single-process',
            // '--no-zygote'
        ],
        headless: true,
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
