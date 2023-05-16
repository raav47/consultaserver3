"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const consultaSaldoMovilnet_js_1 = __importDefault(require("./controllers/consultaSaldoMovilnet.js"));
const consultaSaldoDigitel_js_1 = __importDefault(require("./controllers/consultaSaldoDigitel.js"));
const consultaSaldoCantv_js_1 = __importDefault(require("./controllers/consultaSaldoCantv.js"));
//import {actualizarTasaDolarVenta,actualizarTasaDolarCompra} from './db/firebasePagoRapidoInit.js'
const app = (0, express_1.default)();
const PORT = process.env.PORT || 9108;
//app.use(express.text());
app.use(express_1.default.json());
//Middleware para chequear req
app.use((req, res, next) => {
    //const page = await _initPage(pagePromise)
    if (typeof req.body != 'object')
        return;
    const requestObject = req.body;
    if (!requestObject.hasOwnProperty('number')
        || !requestObject.hasOwnProperty('signature')
        || !requestObject.hasOwnProperty('version')) {
        console.log('devuelto ', requestObject);
        return res.status(200).end();
    }
    ;
    if (!(requestObject.signature === 'raav') || !(requestObject.version === "1.0")) {
        console.log('devuelto signature invalid o version', requestObject.signature + " ", requestObject.version);
        return res.status(400).end();
    }
    //   console.log('next');
    next();
});
app.post('/movilnet', async (req, res) => {
    //MIDDLEWARE CHECKER, Y LUEGO:
    const requestObject = req.body;
    console.info("iniciando consulta movilnet,", requestObject);
    try {
        const objectSaldo = await (0, consultaSaldoMovilnet_js_1.default)(requestObject.number);
        console.log('SALDO DEL NUMERO ' + requestObject.number + ' = ', objectSaldo.saldo);
        //return res.status(200).end();
        return res.status(200).send(objectSaldo);
    }
    catch (error) {
        console.error('Error in movilnet ', error);
        console.log('requestObject = ', requestObject);
        return res.status(444).send({ error: error.toString(), ok: false });
    }
});
app.post("/digitel", async (req, res) => {
    //MIDDLEWARE CHECKER, Y LUEGO:
    const requestObject = req.body;
    console.info("iniciando consulta digitel,", requestObject);
    try {
        if (requestObject.signature == 'raav') { // continuamos
            const objectSaldo = await (0, consultaSaldoDigitel_js_1.default)(req.body.number);
            console.log('SALDO DEL NUMERO ' + requestObject.number + ' = ', objectSaldo.saldo);
            //return res.status(200).end();
            return res.status(200).send(objectSaldo);
        }
    }
    catch (error) {
        console.error('Error in digitel ', error);
        console.log('requestObject = ', requestObject);
        return res.status(444).send({ error: error.toString() });
    }
});
app.post("/cantv", async (req, res) => {
    //MIDDLEWARE CHECKER, Y LUEGO:
    const requestObject = req.body;
    console.info("iniciando consulta cantv,", requestObject);
    try {
        if (requestObject.signature == 'raav') { // continuamos
            const objectSaldo = await (0, consultaSaldoCantv_js_1.default)(req.body.number);
            console.log('SALDO DEL NUMERO ' + requestObject.number + ' = ', objectSaldo.saldo);
            //return res.status(200).end();
            return res.status(200).send(objectSaldo);
        }
    }
    catch (error) {
        console.error('Error in cantv ', error);
        console.log('requestObject = ', requestObject);
        return res.status(444).send({ error: error.toString() });
    }
});
app.listen(PORT, () => console.log('ConsultaSaldo listo en el port: ' + PORT));
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
