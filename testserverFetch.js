const axios = require('axios');
 
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
};

// console.log(urlApiBinance);
// console.log(binanceReqParams);
// console.log(axiosConfig);



////https://arcane-chamber-98016.herokuapp.com/

//192.168.1.109:9108

/*
const numbers = ['04161050843','04163607743','04165244948','04161767018'];

numbers.forEach(async(numero)=>{//MULTI REQ
    console.log('salió ',numero);
    const result = await axios.post('http://192.168.1.109:9108/',JSON.stringify({
        number:numero,
        signature:'raav',
    }),axiosConfig);

    console.log(result.data);
})
*/

(async()=>{//UN SOLO REQ
    const result = await axios.post('https://arcane-chamber-98016.herokuapp.com/',JSON.stringify({
        number:'04165244948',
        signature:'raav',
    }),axiosConfig);
    console.log(result.data.data);
})();