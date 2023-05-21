const axios = require('axios');
 
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
};

// console.log(urlApiBinance);
// console.log(binanceReqParams);
// console.log(axiosConfig);



//const url = 'https://server-chi-jade.vercel.app/';//https://arcane-chamber-98016.herokuapp.com/
const url = 'http://192.168.0.118:9108/';

/*
const numbers = ['04161847313','04163607743','04163147782','04165244948','04169709278'];

numbers.forEach(async(numero)=>{//MULTI REQ
    console.log('salió ',numero);
    const result = await axios.post(url,JSON.stringify({
        number:numero,
        signature:'raav',
        version:"1.0",
    }),axiosConfig);

    console.log(result.data);
})
*/

///*
(async()=>{//UN SOLO REQ
    //const numero = "04265753903";
    const numero = "04123127158"
    /*const numero = 
    "04123547859" prepago
    "04123127158" pospago
    "04125753903" prepago
    "04125294948" inactivo

    movilnet 
    "04265753903"  inactivo

    "04166436727" pospago
    
    cantv

    02763505358 no existe

    */
    console.info("url "+url)
    console.info("iniciado consulta saldo del número "+numero)
    await consultaSaldoDigitel(numero);
})();

async function consultaSaldoMovilnet(numero) {
    const result = await axios.post(url+"movilnet",JSON.stringify({
        number:numero,
        signature:'raav',
        version:"1.0",
    }),axiosConfig);
    console.log(result.data);
    return result;
}

async function consultaSaldoDigitel(numero) {
    const result = await axios.post(url+"digitel",JSON.stringify({
        number:numero,
        signature:'raav',
        version:"1.0",
    }),axiosConfig);
    console.log(result.data);
    return result;
}

async function consultaSaldoCantv(numero) {
    const result = await axios.post(url+"cantv",JSON.stringify({
        number:numero,
        signature:'raav',
        version:"1.0",
    }),axiosConfig);
    console.log(result.data);
    return result;
}
//*/