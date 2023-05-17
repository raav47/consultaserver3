"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initiPuppeter_js_1 = __importDefault(require("./initiPuppeter.js"));
//import { Page } from 'puppeteer';//Solo para tipar
/*
async function consultarSaldoCantv(numero:number) {

    const page = await initPage("https://cati.cantv.com.ve/chat_cantv_java/consulta_saldo.jsp");

    const codigoArea = numero.toString().slice(1, 4);//de 0276334... agarramos 276
    const telefonoSinArea = numero.toString().slice(4, numero.toString().length);//de 0276334... agarramos 276


    const codigoAreaInput = "#consulta_codigo_area";
    await page.waitForSelector(codigoAreaInput,{timeout: 120000});

    await page.type(codigoArea,codigoArea,{delay:280})

    const telefonoInput = "#consulta_numero_telefonico";

    await page.type(telefonoInput,telefonoSinArea,{delay:280})
    


    const resChallengue = await _burlarCaptchaCantv(page);

    console.info('resChallengue=',resChallengue);

    await page.type('#captcha',resChallengue.toString(),{delay:380});

  //  console.info('inputValidate');

    await page.click('#consulta-saldo_telefonia_validar > div > div.col-12.text-center.caja_botones.m-3.p-3 > button',{delay:120});

    
    const response = await  page.waitForResponse(response => response.url().includes('admin-ajax.php'),{timeout:0});
      //  linkHandlers[0].click()
    
    const dataObj = await response.json();
    console.log("dataObj",await dataObj)


    await page.close();

    //Si el numero no existe digitel nos responde Sucess con null
    if(dataObj.Success === true){
      return {
      //ok:(dataObj.Success === true),//de forma que si es null sea false y no null
      number:dataObj.Linea,
      operadora:"digitel",
      saldo:dataObj.Datos.Saldo,

      fechaPago:dataObj.Datos.FechaPago,
      fechaOperacion:Date.now(),
      datos:_removeToDatosElementsRepeatedDigitel(dataObj.Datos)
      

      }
    }else{
      return {
        //ok:(dataObj.Success === true),//de forma que si es null sea false y no null
        saldo:" - ",//null
        operadora:"digitel",
        number:dataObj.Linea,
        fechaPago:" - ",//null
        datos:{message:dataObj.Message as string},//dataObj.Datos is null
        fechaOperacion:Date.now(),
        }
    }


};

async function _burlarCaptchaCantv(page:Page) {
    const textValidate =  await page.$eval('#resultado',((pDesafio)=>pDesafio.innerHTML));//¿Cuánto es? 3 + 8
  
  
    const resChallengue = Number(textValidate.split('+')[0]) +Number(textValidate.split('+')[1]);
    //console.info(resChallengue)
  
    return resChallengue;
  }
*/
async function consultarSaldoCantv(numero) {
    const codigoArea = numero.toString().slice(1, 4); //de 0276334... agarramos 276
    const telefonoSinArea = numero.toString().slice(4, numero.toString().length); //de 0276334... agarramos 276
    //console.info("codigoArea",codigoArea);
    // console.info("telefonoSinArea,",telefonoSinArea);
    const urlApi = `https://cati.cantv.com.ve/chat_cantv_java/Servlet_Consulta_Saldo?consulta_codigo_area=${codigoArea}&consulta_numero_telefonico=${telefonoSinArea}`;
    const page = await (0, initiPuppeter_js_1.default)(urlApi);
    // await page.waitForNavigation();
    //const data = await page.evaluate(() => document.evaluate("/html/body/text()", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
    const dataString = await page.evaluate(() => document.body.innerText);
    const dataObj = JSON.parse(dataString)[0];
    // console.info(dataObj);
    /*{
        codigoArea: '276',
        telefono: '3555358',
        fechaUltimaFacturacion: '20230425',
        saldoActual: '-1,24',
        saldoVencido: '-1.24',
        fechaVencimiento: '20230430',
        fechaCorte: '20230515',
        montoultipag: '0,62',
        error: ''
      } */
    // console.info(data.);
    //const response = await  page.waitForResponse(response => response.url().includes('https://cati.cantv.com.ve/chat_cantv_java/Servlet_Consulta_Sald'),{timeout:0});
    //console.info("response",response)
    // const headers= {
    //   "Accept":` text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`,
    //     "Accept-Encoding":` gzip, deflate, br`,
    //     "Accept-Language":` es-ES,es;q=0.9`,
    //     "Cache-Control":` max-age=0`,
    //     "Connection":` keep-alive`,
    //     "Host":` cati.cantv.com.ve`,
    //     "Sec-Fetch-Dest":` document`,
    //     "Sec-Fetch-Mode":` navigate`,
    //     "Sec-Fetch-Site":` none`,
    //     "Sec-Fetch-User":` ?1`,
    //     "Upgrade-Insecure-Requests":` 1`,
    //     "User-Agent":` Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36`,
    //     "sec-ch-ua":` "Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"`,
    //     "sec-ch-ua-mobile":` ?0`,
    //     "sec-ch-ua-platform":` "Windows";`
    //  }
    //  const info = await axios.get(urlApi);
    page.close();
    if (dataObj) {
        return {
            number: numero,
            operadora: "cantv",
            saldo: dataObj.saldoActual,
            fechaPago: dataObj.fechaVencimiento,
            fechaOperacion: Date.now(),
            datos: _removeToDatosElementsRepeatedCANTV(dataObj)
        };
    }
    else {
        return {
            number: numero,
            operadora: "cantv",
            saldo: " - ",
            fechaPago: " - ",
            fechaOperacion: Date.now(),
            datos: { Message: "Número de servicio no encontrado" }
        };
    }
}
function _removeToDatosElementsRepeatedCANTV(datos) {
    /*datos any ya que no me permite hacer delete, a no ser que le coloque que las propiedades sean opcionales (?)
    
    
    datos:
    
    
    */
    if (datos != null) {
        delete datos.saldoActual;
        delete datos.fechaVencimiento;
        delete datos.telefono;
        if (datos.error.toString().length === 0) {
            delete datos.error;
        }
    }
    return datos;
}
exports.default = consultarSaldoCantv;
