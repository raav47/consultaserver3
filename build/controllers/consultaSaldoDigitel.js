"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initiPuppeter_js_1 = __importDefault(require("./initiPuppeter.js"));
async function consultarSaldoDigitel(numero) {
    const page = await (0, initiPuppeter_js_1.default)("https://www.digitel.com.ve/personas/consultar-saldo/");
    const selectorNumberInput = "#numero";
    await page.waitForSelector(selectorNumberInput, { timeout: 120000 });
    //   console.info('loaded');
    //await page.click('#tel')
    await page.type(selectorNumberInput, numero.toString(), { delay: 280 });
    //  console.info('writted');
    const resChallengue = await _burlarCaptchaDigitel(page);
    console.info('resChallengue=', resChallengue);
    await page.type('#txtCode_consulta', resChallengue.toString(), { delay: 380 });
    //  console.info('inputValidate');
    await page.click('#consulta_saldo_form > div:nth-child(6) > button', { delay: 120 });
    const response = await page.waitForResponse(response => response.url().includes('admin-ajax.php'), { timeout: 0 });
    //  linkHandlers[0].click()
    const dataObj = await response.json();
    console.log("dataObj", await dataObj);
    /*
    dataObj:{
   Success: true,
   Message: 'Data obtenida exitosamente',
   Linea: '04123547859',
   Datos: {
     TipoLinea: 'prepago',
     Numero: '04123547859',
     Captcha: '8dy68',
     Saldo: '4,87',
     Estatus: 'Activa (Llamadas Entrantes y Salientes)',
     FechaPago: '03-06-2023',
     Accion: 'Recargar',
     UrlAccion: '/personas/recargar-saldo'
   }
 }
    
    */
    await page.close();
    //Si el numero no existe digitel nos responde Sucess con null
    if (dataObj.Success === true) {
        return {
            //ok:(dataObj.Success === true),//de forma que si es null sea false y no null
            number: dataObj.Linea,
            operadora: "digitel",
            saldo: dataObj.Datos.Saldo,
            fechaPago: dataObj.Datos.FechaPago,
            fechaOperacion: Date.now(),
            datos: _removeToDatosElementsRepeatedDigitel(dataObj.Datos)
        };
    }
    else {
        return {
            //ok:(dataObj.Success === true),//de forma que si es null sea false y no null
            saldo: " - ",
            operadora: "digitel",
            number: dataObj.Linea,
            fechaPago: " - ",
            datos: { message: dataObj.Message },
            fechaOperacion: Date.now(),
        };
    }
}
;
async function _burlarCaptchaDigitel(page) {
    function __getCodeWithoutSpaces(code) {
        return code.split(' ').join('');
    }
    const codeString = await page.evaluate(() => document.getElementById("mainCaptcha_consulta").value); //ya que value es un elemento añadido por ellos mismos no lo reconoce
    //console.info("codeString",codeString);
    return __getCodeWithoutSpaces(codeString);
    ;
}
function _removeToDatosElementsRepeatedDigitel(datos) {
    /*datos any ya que no me permite hacer delete, a no ser que le coloque que las propiedades sean opcionales (?)
    
    
    datos:
    
    
    */
    if (datos != null) {
        delete datos.Saldo;
        delete datos.fechaPago;
        delete datos.Captcha;
        delete datos.UrlAccion; //Por esto podria saber si es pospago o prepago
        delete datos.Accion;
        delete datos.Numero;
        delete datos.FechaPago; //Ya la asigne al objeto principal!
    }
    return datos;
}
exports.default = consultarSaldoDigitel;
