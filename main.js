class ComisionAfp {
    constructor(nombreAfp, comFlujo, comSaldo,primaSeguros,aporteObligarotio,remMaxAsegurable) {
        this.nombreAfp = nombreAfp;
        this.comFlujo = comFlujo;
        this.comSaldo = comSaldo;
        this.primaSeguros = primaSeguros;
        this.aporteObligarotio = aporteObligarotio;
        this.remMaxAsegurable = remMaxAsegurable;
       //content
    };
};

const comisionesAFPs = [];

/**
 * 
 * @param {*} url Es la url que debemos ingresar para obtener la página ej: "http://xxx.com/resultados"
 * @returns retorna un documento html COMPLETO parseado con formato html (no como texto).
 */
async function scrapDataFromHTML(url){
    try{
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc;
    }
    catch(error){
        console.error('Error al obtener la página:', error)
        throw error; // Propaga el error para manejarlo externamente si es necesario
    };
}

/**
 * 
 * @param {*} cadenaConEspacio La cadena original.
 * @returns una cadena sin espacion a los lados y dentro de la cadena.
 */
function eliminaEspacios(cadenaConEspacio){
    //const cadenaSinEspacio = cadenaConEspacio.replace(/\s/g, '').replace(',', '.');
    const cadenaSinEspacio = cadenaConEspacio.replace(/[\s%]/g, '').replace(',', '.');
    return cadenaSinEspacio;
}

/**
 * 
 * @param {*} url La url a la que se le va a hacer SCRAPING.
 */
async function leerPaginaHtml(url) {
  const docHtml = await scrapDataFromHTML(url);
  const filas = docHtml.querySelectorAll('.JER_filaContenido');
  if (filas.length > 0) {
    filas.forEach(fila => {
      comisionesAFPs.push(new ComisionAfp(
        eliminaEspacios(fila.childNodes[1].textContent.trim()), 
        parseFloat(eliminaEspacios(fila.childNodes[3].textContent.trim())), 
        parseFloat(eliminaEspacios(fila.childNodes[5].textContent.trim())),
        parseFloat(eliminaEspacios(fila.childNodes[7].textContent.trim())),
        parseFloat(eliminaEspacios(fila.childNodes[9].textContent.trim())),
        parseFloat(eliminaEspacios(fila.childNodes[11].textContent.trim()))))
    });
    console.log(comisionesAFPs);
  } else {
    console.error('No se encontraron filas de contenido en la página.');
  }
}

const CORS_BRIDGE = 'https://cors-anywhere.herokuapp.com/';
const URL_SCRAP = 'https://www.sbs.gob.pe/app/spp/empleadores/comisiones_spp/Paginas/comision_prima.aspx';

leerPaginaHtml(CORS_BRIDGE + URL_SCRAP);