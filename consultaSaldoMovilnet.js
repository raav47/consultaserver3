async function consultarSaldoMovilnet(numero,page) {
  try {

    await page.waitForSelector('#tel',{timeout: 120000});
 //   console.info('loaded');
    //await page.click('#tel')
    await page.type('#tel',numero.toString(),{delay:350})
  //  console.info('writted');

    const resChallengue = await _burlarCaptchaMovilnet(page);

   // console.info('resChallengue');

    await page.type('#inputValidate',resChallengue.toString(),{delay:350});

  //  console.info('inputValidate');

    await page.click('#enviar',{delay:100});


    await page.waitForSelector('li.collection-header > h4',{delay:12000});

 //   console.info('loaded2')

    const nmrValidado =  await page.$eval('li.collection-header',((pDesafio)=>pDesafio.innerText.split('mobile_friendly')[1]));//.split('mobile_friendly')[1] esto porque aqui agarramos es mobile_friendly\n04167985241//esto por si aca

   // console.info(nmrValidado);



   // return await page.click('body > div.row > div > a',{delay:100});// undir el la flechita de retroceder

   const parentNode = await page.$$eval('li.collection-item', rows => { return rows.map(anchor => anchor.innerText)});//.slice(0, 10)

   const objectResolve = {
    number:nmrValidado,
    saldo:parentNode[0],
    status:parentNode[1],
    fecha_exp:parentNode[2],
    ok:true
   }

  // console.info('enviado');
  // console.info(objectResolve);//collection-item

   page.close();

   return objectResolve;
  } catch (error) {
    console.info('error consultado saldo OJO = ',error);
    return {ok:false,msj:error.toString()}
  }
};

async function _burlarCaptchaMovilnet(page) {
  const textValidate =  await page.$eval('#textValidate',((pDesafio)=>pDesafio.innerHTML));//¿Cuánto es? 3 + 8
  console.info(textValidate);
  const challengue = textValidate.substring(11,textValidate.length);//3 + 8
  console.info(challengue) 
  const resChallengue = Number(challengue.split('+')[0]) +Number(challengue.split('+')[1]);  
  console.info(resChallengue) 

  return resChallengue;
}

exports.default = consultarSaldoMovilnet;