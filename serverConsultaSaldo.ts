import express from 'express';


import consultaSaldoMovilnet from './controllers/consultaSaldoMovilnet.js';
import consultaSaldoDigitel from './controllers/consultaSaldoDigitel.js';
import { ConsultaSaldoInfo } from './models/resConsultaSaldo.js';
import consultarSaldoCantv from './controllers/consultaSaldoCantv.js';
//import {actualizarTasaDolarVenta,actualizarTasaDolarCompra} from './db/firebasePagoRapidoInit.js'

const app = express();
const PORT = process.env.PORT|| 9108;
//app.use(express.text());

app.use(express.json());

//Middleware para chequear req
app.use((req,res,next)=>{
    //const page = await _initPage(pagePromise)
    if (typeof req.body != 'object')return;

    const requestObject = req.body;

    if(
        !requestObject.hasOwnProperty('number')
        ||!requestObject.hasOwnProperty('signature')
        ||!requestObject.hasOwnProperty('version')
      ) {
        console.log('devuelto ',requestObject);
        return res.status(200).end()
    };
    if(!(requestObject.signature === 'raav') ||!(requestObject.version === "1.0") ){
        console.log('devuelto signature invalid o version',requestObject.signature + " ",requestObject.version);
        return res.status(400).end()
    }
    
    
   //   console.log('next');
    next()
});


app.post('/movilnet',async(req,res)=>{

    //MIDDLEWARE CHECKER, Y LUEGO:
    const requestObject = req.body;
    console.info("iniciando consulta movilnet,",requestObject)
        try {
      
            const objectSaldo:ConsultaSaldoInfo = await consultaSaldoMovilnet(requestObject.number)
       
            console.log('SALDO DEL NUMERO '+requestObject.number+' = ',objectSaldo.saldo);
            //return res.status(200).end();
            return res.status(200).send(objectSaldo);
        
        } catch (error:any) {
            console.error('Error in movilnet ' ,error);
            console.log('requestObject = ',requestObject);
            return res.status(444).send({error:error.toString(),ok:false})
        }
   
   
});

app.post("/digitel",async (req,res) => {
   //MIDDLEWARE CHECKER, Y LUEGO:
   const requestObject = req.body;
   console.info("iniciando consulta digitel,",requestObject)
    try {
        if (requestObject.signature == 'raav') { // continuamos


            const objectSaldo:ConsultaSaldoInfo = await consultaSaldoDigitel(req.body.number)

            console.log('SALDO DEL NUMERO '+requestObject.number+' = ',objectSaldo.saldo);
            //return res.status(200).end();
            return res.status(200).send(objectSaldo);
        }

    } catch (error:any) {
        console.error('Error in digitel ' ,error);
        console.log('requestObject = ',requestObject);
        return res.status(444).send({error:error.toString()})
    }
    

})

app.post("/cantv",async (req,res) => {
    //MIDDLEWARE CHECKER, Y LUEGO:
    const requestObject = req.body;
    console.info("iniciando consulta cantv,",requestObject)
     try {
         if (requestObject.signature == 'raav') { // continuamos
 
 
             const objectSaldo:any = await consultarSaldoCantv(req.body.number)
 
             console.log('SALDO DEL NUMERO '+requestObject.number+' = ',objectSaldo.saldo);
             //return res.status(200).end();
             return res.status(200).send(objectSaldo);
         }
 
     } catch (error:any) {
         console.error('Error in cantv ' ,error);
         console.log('requestObject = ',requestObject);
         return res.status(444).send({error:error.toString()})
     }
     
 
 })


app.listen(PORT,()=>
    console.log('ConsultaSaldo listo en el port: ' + PORT)
);



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