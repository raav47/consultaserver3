type Operadoras = "movilnet"|"digitel";

interface datosLineaDigitel {
   /* TipoLinea: 'prepago',
    Numero: '04123547859',
    Captcha: '8dy68',
    Saldo: '4,87',
    Estatus: 'Activa (Llamadas Entrantes y Salientes)',
    FechaPago: '03-06-2023',
    Accion: 'Recargar',
    UrlAccion: '/personas/recargar-saldo'*/

    TipoLinea: string,
    //Numero: string,
   
 
    Estatus: string,


    //Pasaron a ser parte de ResConsultaSaldo
   //Saldo: string,
  // FechaPago: string,

    //No son necesarias devolver ya que se imprimirían
    // Captcha: string,
    //Accion: string,
    //UrlAccion: string
}
interface datosLineaMovilnet {
 
     status: string,
    // fecha_exp: string, paso a ser de ResCOnsultaSaldo como tal
 }

 interface failureDatosLinea{
   message:string,
 }

export interface ConsultaSaldoInfo {
   // ok:boolean,
    number:string,
    operadora:Operadoras|string,///Solo para poder saber a que operadora fue la recarga en el historial!!!
    saldo:string, //puede ser number o - si linea no existe
    fechaPago:string|boolean,//Digitel fecha dd/mm/yyy o boolean, Movilnet string 14 de cada mes
    fechaOperacion:number,
    datos: (datosLineaDigitel)|datosLineaMovilnet|failureDatosLinea,

}

