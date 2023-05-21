"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initiPuppeter_js_1 = __importDefault(require("./initiPuppeter.js"));
let pageStrategyKeepOpenedDigitelPage = null;
async function consultarSaldoDigitel(numero) {
    const page = await getOpenedDigitelPage();
    const selectorNumberInput = "#numero";
    ///await page.waitForSelector(selectorNumberInput,{timeout: 120000});
    //   console.info('loaded');
    //await page.click('#tel')
    await page.type(selectorNumberInput, numero.toString(), { delay: 18 }); //250
    //  console.info('writted');
    const resChallengue = await _burlarCaptchaDigitel(page);
    console.info('resChallengue=', resChallengue);
    await page.type('#txtCode_consulta', resChallengue.toString(), { delay: 20 }); //340
    //  console.info('inputValidate');
    await page.click('#consulta_saldo_form > div:nth-child(6) > button', { delay: 30 }); //120
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
    /*instead close Sin await ya que como desactive el cache en initPuppeteer acabaria esperando que cargue la pagina innecesariamente
    
    o con await y con cache para que rfresce rapidamente, de momento probare esta a ver si no me aparecen captchas externos entonces vale la pena
    */
    await page.reload();
    if ( //Esto por el problema descrito en abrir multiples pestañas digitel abajo,
    dataObj.Linea != numero) {
        return {
            //ok:(dataObj.Success === true),//de forma que si es null sea false y no null
            saldo: " - ",
            operadora: "digitel",
            number: dataObj.Linea,
            fechaPago: " - ",
            datos: { message: "No se pudo completar tu consulta, por favor vuelve a intentarlo" },
            fechaOperacion: Date.now(),
        };
    }
    else {
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
async function getOpenedDigitelPage() {
    /*
    Con este sistema existe un bug, y es que si llegan dos a la vez o durante una consulta se realiza entonces se confunde puppeteer y acaba devolviendole a ambos el mismo saldo de la ultima peticion
    */
    if (!pageStrategyKeepOpenedDigitelPage) {
        const page = await (0, initiPuppeter_js_1.default)("https://www.digitel.com.ve/personas/consultar-saldo/");
        pageStrategyKeepOpenedDigitelPage = page;
    }
    return pageStrategyKeepOpenedDigitelPage;
}
exports.default = consultarSaldoDigitel;
