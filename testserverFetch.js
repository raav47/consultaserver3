const axios = require('axios');
 
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
};

// console.log(urlApiBinance);
// console.log(binanceReqParams);
// console.log(axiosConfig);



const url = 'https://arcane-chamber-98016.herokuapp.com/';
//const url = 'http://192.168.1.109:9108/';

/*
const numbers = ['04161847313','04163607743','04163147782','04165244948','04169709278'];

numbers.forEach(async(numero)=>{//MULTI REQ
    console.log('salió ',numero);
    const result = await axios.post(url,JSON.stringify({
        number:numero,
        signature:'raav',
    }),axiosConfig);

    console.log(result.data);
})
*/

///*
(async()=>{//UN SOLO REQ
    const result = await axios.post(url,JSON.stringify({
        number:'04165244948',
        signature:'raav',
    }),axiosConfig);
    console.log(result.data);
})();
//*/