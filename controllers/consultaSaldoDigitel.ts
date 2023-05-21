import initPage from './initiPuppeter.js';

import { Page } from 'puppeteer-core';//Solo para tipar /// SOLO PROD
//import { Page } from 'puppeteer';//Solo para tipar /// SOLO PRUEBA 

let pageStrategyKeepOpenedDigitelPage: Page | null = null;


async function consultarSaldoDigitel(numero:number) {

    const page = await getOpenedDigitelPage();
  

    const selectorNumberInput = "#numero";
    ///await page.waitForSelector(selectorNumberInput,{timeout: 120000});
 //   console.info('loaded');
    //await page.click('#tel')
    await page.type(selectorNumberInput,numero.toString(),{delay:18})//250
  //  console.info('writted');

    const resChallengue = await _burlarCaptchaDigitel(page);

    console.info('resChallengue=',resChallengue);

    await page.type('#txtCode_consulta',resChallengue.toString(),{delay:20});//340

  //  console.info('inputValidate');

    await page.click('#consulta_saldo_form > div:nth-child(6) > button',{delay:30});//120

    
    const response = await  page.waitForResponse(response => response.url().includes('admin-ajax.php'),{timeout:0});
      //  linkHandlers[0].click()
    
    const dataObj = await response.json();
    //console.log("dataObj",await dataObj)
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

    if( //Esto por el problema descrito en abrir multiples pestañas digitel abajo,
       dataObj.Linea != numero){
      return {
        //ok:(dataObj.Success === true),//de forma que si es null sea false y no null
        saldo:" - ",//null
        operadora:"digitel",
        number:dataObj.Linea,
        fechaPago:" - ",//null
        datos:{message:"No se pudo completar tu consulta, por favor vuelve a intentarlo"},//dataObj.Datos is null
        fechaOperacion:Date.now(),
        }
    }else{
       //Si el numero no existe digitel nos responde Sucess con null
      if(dataObj.Success === true ){
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
    }

   


};

async function _burlarCaptchaDigitel(page: Page) {
      function __getCodeWithoutSpaces(code:string) {
        return code.split(' ').join('');
    }	

    const codeString = await page.evaluate(() => (document.getElementById("mainCaptcha_consulta") as any).value) //ya que value es un elemento añadido por ellos mismos no lo reconoce
    //console.info("codeString",codeString);
    
return __getCodeWithoutSpaces(codeString);;
}

function _removeToDatosElementsRepeatedDigitel(datos:{ 
  TipoLinea:string,
  Numero: string,
  Captcha: string,
  Saldo: string,
  Estatus:string,
  FechaPago: string,
  Accion: string,
  UrlAccion:string}) :{TipoLinea:string,Estatus:string}{
  /*datos any ya que no me permite hacer delete, a no ser que le coloque que las propiedades sean opcionales (?)
  
  
  datos:
  
  
  */ 
  if(datos != null){
    delete (datos as any).Saldo;
    delete (datos as any).fechaPago;
    delete (datos as any).Captcha;
    delete (datos as any).UrlAccion;//Por esto podria saber si es pospago o prepago
    delete (datos as any).Accion;
    delete (datos as any).Numero;
    delete (datos as any).FechaPago;//Ya la asigne al objeto principal!
  
  }

  return datos;
  

}

async function getOpenedDigitelPage () {
  /*
  Con este sistema existe un bug, y es que si llegan dos a la vez o durante una consulta se realiza entonces se confunde puppeteer y acaba devolviendole a ambos el mismo saldo de la ultima peticion
  */
  if(!pageStrategyKeepOpenedDigitelPage){
    const page = await initPage("https://www.digitel.com.ve/personas/consultar-saldo/");
    pageStrategyKeepOpenedDigitelPage = page;
  }

  return pageStrategyKeepOpenedDigitelPage;

  
}

export default consultarSaldoDigitel;