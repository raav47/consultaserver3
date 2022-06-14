const express = require('express');

const pagePromise = require('./initiPuppeter.js');
const consultaSaldoMovilnet = require('./consultaSaldoMovilnet.js');
//import {actualizarTasaDolarVenta,actualizarTasaDolarCompra} from './db/firebasePagoRapidoInit.js'

const app = express();
const PORT = process.env.PORT|| 9108;
//app.use(express.text());

app.use(express.json());

//Middleware para chequear req
app.use(async(req,res,next)=>{
    //const page = await _initPage(pagePromise)
    if (typeof req.body != 'object')return;

    const requestObject = req.body;

    if(
        !requestObject.hasOwnProperty('number')
        ||!requestObject.hasOwnProperty('signature')
      ) {console.log('devuelto ',requestObject);return res.status(200).end()};
   //   console.log('next');
      next()
});


app.post('/',async(req,res)=>{

    //MIDDLEWARE CHECKER, Y LUEGO:
    const requestObject = req.body;

    if (requestObject.signature == 'raav') { // continuamos
        try {

            const page = await _initPage(pagePromise);

            const objectSaldo = await consultaSaldoMovilnet.default(requestObject.number,page)
       
            console.log('SALDO DEL NUMERO '+requestObject.number+' = ',objectSaldo.saldo);
            //return res.status(200).end();
            return res.status(200).send(objectSaldo);
        
        } catch (error) {
            console.error('Error in Server ' ,error);
            console.log('requestObject = ',requestObject);
            return res.status(400).send({error:error.toString(),ok:false})
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
    const page = await pagePromise.default();
    try{  
      //console.log('page ', page)
      
      await page.goto('http://www.movilnet.com.ve/consultarabono/Balance', {//http://www.movilnet.com.ve/sitio/minisitios/consulta/
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      });
      return page;
    }catch(error){
        console.log('se debe intentar abrir de nuevo , error = ',error);
        page.close()
        return await _initPage(pagePromise) //forzamos hasta que abra
    }
};

/*async function* _pageGenerator() {
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
}*/