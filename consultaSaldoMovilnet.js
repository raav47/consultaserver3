const pagePromise = require('./initiPuppeter.js');




(async()=>{ 
try {
  const page = await pagePromise.default();
  //console.log('page ', page)
  
  await page.goto('http://www.movilnet.com.ve/consultarabono/Balance', {//http://www.movilnet.com.ve/sitio/minisitios/consulta/
    waitUntil: 'domcontentloaded',
    timeout: 0,
  });
  await page.waitForSelector('#tel',{timeout: 120000});
  console.log('loaded');
  //await page.click('#tel')
  await page.type('#tel','04169791250',{delay:800})
  console.log('writted');

  const resChallengue = await _burlarCaptchaMovilnet(page);

  console.log('resChallengue');

  await page.type('#inputValidate',resChallengue.toString(),{delay:600});

  console.log('inputValidate');

  await page.click('#enviar',{delay:100});


  await page.waitForSelector('li.collection-header > h4');

  console.log('loaded2')

  const nmrValidado =  await page.$eval('li.collection-header > h4',((pDesafio)=>pDesafio.innerHTML));

  console.log(nmrValidado);

  console.log('enviado');
} catch (error) {
  console.log('se debe intentar abrir de nuevo , error = ',error);
}
})();

async function _initPage(page) {
  const textValidate =  await page.$eval('#textValidate',((pDesafio)=>pDesafio.innerHTML));//¿Cuánto es? 3 + 8
  console.log(textValidate);
  const challengue = textValidate.substring(11,textValidate.length);//3 + 8
  console.log(challengue) 
  const resChallengue = Number(challengue.split('+')[0]) +Number(challengue.split('+')[1]);  
  console.log(resChallengue) 

  return resChallengue;
}

async function _burlarCaptchaMovilnet(page) {
  const textValidate =  await page.$eval('#textValidate',((pDesafio)=>pDesafio.innerHTML));//¿Cuánto es? 3 + 8
  console.log(textValidate);
  const challengue = textValidate.substring(11,textValidate.length);//3 + 8
  console.log(challengue) 
  const resChallengue = Number(challengue.split('+')[0]) +Number(challengue.split('+')[1]);  
  console.log(resChallengue) 

  return resChallengue;
}