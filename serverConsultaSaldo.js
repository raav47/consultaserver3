const express = require('express');

const pagePromise = require('./initiPuppeter.js');
const consultaSaldoMovilnet = require('./consultaSaldoMovilnet.js');
//import {actualizarTasaDolarVenta,actualizarTasaDolarCompra} from './db/firebasePagoRapidoInit.js'





const app = express();
const PORT = process.env.PORT|| 9108;
//app.use(express.text());

app.use(express.json());

let _pageGeneratorManage;

app.use(async(req,res,next)=>{
    //const page = await _initPage(pagePromise)
    const page = await _pageGenerator.next(); //_pageGenerator(pagePromise);
    console.log(page)
});

pagePromise.default().then(async(petro)=>{
    await petro.goto('http://www.movilnet.com.ve/consultarabono/Balance', {//http://www.movilnet.com.ve/sitio/minisitios/consulta/
        waitUntil: 'domcontentloaded',
        timeout: 180000,
    });
    await consultaSaldoMovilnet.default('04167985241',petro)

})


app.post('/',async(req,res)=>{
    //console.log('req.body = ',req.body);//express hace que llegue directamente como object

    if (typeof req.body != 'object')return;
 

    const requestObject = req.body;

    //console.log('response_order_data = ',response_order_data);
    if(
        !requestObject.hasOwnProperty('fiat')
        ||!requestObject.hasOwnProperty('crypto')
        ||!requestObject.hasOwnProperty('type')
        ||!requestObject.hasOwnProperty('TOKEN')
        //||!requestObject.hasOwnProperty('bank')
        ||!requestObject.hasOwnProperty('signature')
      ) {console.log('devuelto ',requestObject);return res.status(200).end()};

    if (requestObject.signature == 'raav') { // continuamos
        try {

            const medianPrices = await binanceKnowMedianPrice.binanceKnowMedianPrice(requestObject.fiat,requestObject.type,requestObject.crypto,requestObject.bank!=undefined?[requestObject.bank]:[]);

            console.info('medianPricesSucess fiat and type : ',requestObject.fiat + ' ' + requestObject.type);

            //return res.status(200).end();
            return res.status(200).send(medianPrices)
        
        } catch (error) {
            console.error('Error in medianPrice ' +error);
            console.log('requestObject = ',requestObject);
            return res.status(400).send({error:error.toString()})
        }
    }else{
        //si esta aqui es porque no fue sucess
            return res.status(400).end() //.send('signature no valid');
    };
   
});

app.listen(PORT,()=>{
    console.log('ConsultaSaldo listo en el port: ' + PORT);
});

async function _initPage(pagePromise) { 
    try{  
      const page = await pagePromise.default();
      //console.log('page ', page)
      
      await page.goto('http://www.movilnet.com.ve/consultarabono/Balance', {//http://www.movilnet.com.ve/sitio/minisitios/consulta/
        waitUntil: 'domcontentloaded',
        timeout: 180000,
      });
      return page;
    }catch{
        console.log('se debe intentar abrir de nuevo , error = ',error);
        return await _initPage(pagePromise) //forzamos hasta que abra
    }
}

async function* _pageGenerator() {
    //let page = await pagePromise.default();
   
        const page = await pagePromise.default();
        //console.log('page ', page)
        
        await page.goto('http://www.movilnet.com.ve/consultarabono/Balance', {//http://www.movilnet.com.ve/sitio/minisitios/consulta/
          waitUntil: 'domcontentloaded',
          timeout: 180000,
        });
    while (true) {
      yield* page;
    }
}