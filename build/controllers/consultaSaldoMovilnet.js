"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initiPuppeter_js_1 = __importDefault(require("./initiPuppeter.js"));
async function consultarSaldoMovilnet(numero) {
    const page = await (0, initiPuppeter_js_1.default)("http://www.movilnet.com.ve/consultarabono/Balance");
    await page.waitForSelector('#tel', { timeout: 120000 });
    //   console.info('loaded');
    //await page.click('#tel')
    await page.type('#tel', numero.toString(), { delay: 250 });
    //  console.info('writted');
    const resChallengue = await _burlarCaptchaMovilnet(page);
    // console.info('resChallengue');
    await page.type('#inputValidate', resChallengue.toString(), { delay: 350 });
    //  console.info('inputValidate');
    await page.click('#enviar', { delay: 100 });
    await page.waitForSelector('li.collection-header > h4');
    //   console.info('loaded2')
    //innerText.split('mobile_friendly')[1]
    const nmrValidado = await page.$eval('li.collection-header', ((pDesafio) => pDesafio.textContent.split('mobile_friendly')[1])); //.split('mobile_friendly')[1] esto porque aqui agarramos es mobile_friendly\n04167985241//esto por si aca
    // console.info(nmrValidado);
    // return await page.click('body > div.row > div > a',{delay:100});// undir el la flechita de retroceder
    const parentNode = await page.$$eval('li.collection-item', rows => { return rows.map(anchor => anchor.textContent); }); //.slice(0, 10)
    //console.info("parentNode,",parentNode)
    const objectResolve = {
        number: nmrValidado,
        operadora: "movilnet",
        saldo: parentNode[0],
        fechaPago: parentNode[2],
        fechaOperacion: Date.now(),
        //son como tal los datos que me da
        datos: { status: parentNode[1], }
    };
    page.close();
    /*Pequeño error que sucedió una vez de que parentNode fue length 0, por si acaso comprobamos para no enviar obj vacío*/
    if (parentNode.length <= 0) {
        console.error("parentNode.length <= 0 !!, numero:", nmrValidado);
        return {
            number: nmrValidado,
            operadora: "movilnet",
            saldo: ' - ',
            fechaPago: ' - ',
            fechaOperacion: Date.now(),
            //son como tal los datos que me da
            datos: { message: 'Error, intenta de nuevo más tarde' }
        };
    }
    else {
        return objectResolve;
    }
    // console.info('enviado');
    // console.info(objectResolve);//collection-item
}
;
async function _burlarCaptchaMovilnet(page) {
    const textValidate = await page.$eval('#textValidate', ((pDesafio) => pDesafio.innerHTML)); //¿Cuánto es? 3 + 8
    // console.info(textValidate);
    const challengue = textValidate.substring(11, textValidate.length); //3 + 8
    // console.info(challengue) 
    const resChallengue = Number(challengue.split('+')[0]) + Number(challengue.split('+')[1]);
    //console.info(resChallengue) 
    return resChallengue;
}
exports.default = consultarSaldoMovilnet;
