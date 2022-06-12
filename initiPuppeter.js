const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

async function initPuppeter() {
    puppeteer.use(StealthPlugin())
    const browser = await puppeteer.launch({
      args: [
        '--incognito',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
        headless:false,
    }); //{headless:false}


    const context = await browser.createIncognitoBrowserContext();



    const page = await context.newPage();
    //await page.waitForNavigation({timeout:0})

  await page.setDefaultNavigationTimeout(120000);

  return page;
}
 
exports.default = initPuppeter;

