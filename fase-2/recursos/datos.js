/* Datos de ejemplo del prototipo de Deuda de cotizaciones.
   Los totales, las filas y los modales cuadran entre sí: no cambiarlos.
   Se carga antes que app.js y expone todo en window.DATOS. */
window.DATOS = (function(){
  "use strict";
  /* ── Formatos: miles con punto, UF con 3 decimales, $0 con 0,000 UF ─── */
  var UF = 38489;
  function miles(n){ return String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function pesos(n){ return (n < 0 ? "-$" : "$") + miles(n); }
  function uf(n){
    var v = (Math.abs(n) / UF).toFixed(3).split(".");
    return (n < 0 ? "-" : "") + miles(parseInt(v[0], 10)) + "," + v[1] + " UF";
  }
  function monto(n){ return [pesos(n), uf(n)]; }

  /* ── Periodos ────────────────────────────────────────────────────────── */
  /* La deuda es total a pagar menos total pagado; total pagadores es EEPC + NN. */
  function totales(total, pagado, afiliados, deudaEepc, eepc, nn){
    return {total:total, pagado:pagado, deuda:total - pagado, afiliados:afiliados, deudaEepc:deudaEepc, eepc:eepc, nn:nn, pagadores:eepc + nn};
  }
  var T_SEP = totales(842190400, 198430600, 9480, 690431300, 4728, 1182);
  var T_AGO = totales(842190400, 323740150, 7120, 559680750, 3504, 876);
  var T_JUL = totales(838940100, 347736400, 6985, 530303700, 3442, 860);
  var T_JUN = totales(831615300, 368744400, 6840, 499720900, 3372, 843);

  function avisoInconsistencias(n){
    return {tono:"revisar", accion:true, texto: n === 1
      ? "Deuda preliminar. Se encontró 1 registro con inconsistencias, selecciona ver detalle para conocerlo."
      : "Deuda preliminar. Se encontraron " + miles(n) + " registros con inconsistencias, selecciona ver detalle para conocerlos."};
  }
  function periodo(o){
    o.etiqueta = o.etiqueta || o.opcion;
    if (!o.aviso) o.aviso = o.caso === "curso"
      ? {tono:"curso", texto:"Deuda preliminar. El periodo de recaudación aún no cierra y los montos pueden cambiar."}
      : {tono:"cerrado", texto:"Deuda final. El periodo de recaudación cerró el " + o.cierre + " a las 11:24 hrs."};
    return o;
  }
  /* Septiembre tiene cuatro variantes para mostrar sus estados sin cambiar de
     mes: en curso y cerrado en el prototipo principal, y las dos de
     inconsistencias en el suyo. En la plataforma existe una a la vez. Las
     cuatro generan la deuda (loader); los meses ya consolidados solo se
     consultan (skeleton). El cierre no cambia los montos: es la misma
     generación con otro estado. */
  var PERIODOS = {
    "2026-09": periodo({opcion:"Septiembre 2026 (en curso)", etiqueta:"Septiembre 2026", caso:"curso", carga:"loader", datos:"sep", rem:"Agosto 2026", rec:"09/2026", tot:T_SEP}),
    "2026-09-cerrado": periodo({opcion:"Septiembre 2026 (cerrado)", etiqueta:"Septiembre 2026", caso:"cerrado", cierre:"05/10/2026", carga:"loader", datos:"sep", rem:"Agosto 2026", rec:"09/2026", tot:T_SEP}),
    "2026-09-inc": periodo({opcion:"Septiembre 2026 (varios tipos)", etiqueta:"Septiembre 2026", caso:"curso", carga:"loader", datos:"sep", rem:"Agosto 2026", rec:"09/2026", tot:T_SEP, inc:"cien"}),
    "2026-09-inc-uno": periodo({opcion:"Septiembre 2026 (un solo tipo)", etiqueta:"Septiembre 2026", caso:"curso", carga:"loader", datos:"sep", rem:"Agosto 2026", rec:"09/2026", tot:T_SEP, inc:"uno"}),
    "2026-08": periodo({opcion:"Agosto 2026", caso:"cerrado", cierre:"05/09/2026", carga:"skeleton", datos:"ago", rem:"Julio 2026", rec:"08/2026", tot:T_AGO}),
    "2026-07": periodo({opcion:"Julio 2026", caso:"cerrado", cierre:"05/08/2026", carga:"skeleton", datos:"ago", rem:"Junio 2026", rec:"07/2026", tot:T_JUL}),
    "2026-06": periodo({opcion:"Junio 2026", caso:"cerrado", cierre:"05/07/2026", carga:"skeleton", datos:"ago", rem:"Mayo 2026", rec:"06/2026", tot:T_JUN})
  };

  /* ── Muestra: afiliados y sus líneas de pago ─────────────────────────── */
  /* Total a pagar = pactado + compensación. Pagado = suma de las líneas,
     también las NN. Deuda = total a pagar − pagado. */
  var AFILIADOS = [
    {id:"a1", rut:"10322567-K", nombre:"Andrea González Soto", tipo:"D", pactado:100000, peso:.08},
    {id:"a2", rut:"11622567-8", nombre:"Marco Pizarro Lillo", tipo:"DP", pactado:60000, peso:.40},
    {id:"a3", rut:"17948884-2", nombre:"Javiera Núñez Bravo", tipo:"I", pactado:403373, peso:.20},
    {id:"a4", rut:"28831161-7", nombre:"Rodrigo Cáceres Mansilla", tipo:"D", pactado:50000, peso:.08, comp:{rut:"12345345-3", nombre:"Camila Rojas Vidal", monto:-10000}},
    {id:"a5", rut:"9455312-K", nombre:"Paulina Ortiz Valdés", tipo:"D", pactado:35000, peso:.0704},
    {id:"a6", rut:"21335447-6", nombre:"Sergio Bustamante Rojas", tipo:"V", pactado:25000, peso:.1696}
  ];
  /* Cada afiliado de la muestra representa una parte de los deudores (peso):
     así el filtro del Figma (Dependiente, deuda desde $20.000) da 2.184 registros. */
  /* Un par pagador × afiliado, con sus pagos. Si un pagador paga por dos
     canales, la fila dice «2 pagos» y Detalle de pago los separa.
     Cada pago guarda el día; mes y año salen del periodo de recaudación. */
  var LINEAS = [
    {id:"l1", a:"a1", pag:["45654323-1","Clínica Alemana de Santiago S.A."], tipo:"EEPC", nAfil:850, pactado:100000,
      pagos:{sep:[["10","SV",60000]], ago:[["10","SV",80000]]}},
    {id:"l2", a:"a2", pag:["56234544-0","Colegio Alemán de Santiago SpA"], tipo:"EEPC", nAfil:312, pactado:40000,
      pagos:{sep:[["10","SV",25000],["18","CAJA",5000]], ago:[["12","SV",25000],["20","CAJA",5000]]}},
    {id:"l3", a:"a2", pag:["76100200-K","AFP Modelo S.A."], tipo:"EEPC", nAfil:1204, pactado:20000,
      pagos:{sep:[["15","CAJA",20000]], ago:[["14","CAJA",20000]]}},
    {id:"l4", a:"a5", pag:["45654323-1","Clínica Alemana de Santiago S.A."], tipo:"EEPC", nAfil:850, pactado:35000, pagos:{sep:[], ago:[]}},
    {id:"l5", a:"a5", pag:["76123456-7","Inmobiliaria Los Andes SpA"], tipo:"NN", nAfil:1, pactado:null,
      pagos:{sep:[["08","PREVIRED",15000]], ago:[["07","PREVIRED",15000]]}},
    {id:"l6", a:"a4", pag:["78456765-2","Servicios Diagnósticos Clínica Alemana Limitada"], tipo:"EEPC", nAfil:97, pactado:40000, pagos:{sep:[], ago:[]}},
    {id:"l7", a:"a3", pag:["17948884-2","Javiera Núñez Bravo"], tipo:"EEPC", nAfil:1, pactado:403373, pagos:{sep:[], ago:[["11","SV",203373]]}},
    {id:"l8", a:"a6", pag:["21335447-6","Sergio Bustamante Rojas"], tipo:"EEPC", nAfil:1, pactado:25000, pagos:{sep:[], ago:[]}}
  ];
  /* Relleno de la muestra: 60 afiliados más, para que «Mostrar por página» con
     25 o 50 muestre filas distintas. Van después de los seis del diseño y no
     pesan en los conteos (peso 0), así los totales y los filtros siguen
     cuadrando con el diseño. */
  var BASE_A = AFILIADOS.length, BASE_L = LINEAS.length;
  (function(){
    var PILA = ["Alejandra","Benjamín","Catalina","Diego","Elena","Fernando","Gabriela","Héctor","Isidora","Joaquín","Karina","Lucas","Martina","Nicolás","Olivia","Pablo","Renata","Sebastián","Trinidad","Vicente","Antonia","Cristóbal","Florencia","Matías","Valentina","Tomás","Constanza","Felipe","Ignacia","Maximiliano"];
    var APELLIDOS = ["Muñoz","Soto","Reyes","Morales","Contreras","Rojas","Díaz","Vargas","Castro","Herrera","Espinoza","Navarro","Silva","Araya","Pérez","Gutiérrez","Flores","Torres","Campos","Ramírez","Fuentes","Tapia","Carrasco","Vera","Lagos","Pino","Olivares","Lobos","Paredes","Toro"];
    function rutDe(cuerpo){ return cuerpo + "-" + dv(cuerpo); }
    var EMPLEADORES = [
      [rutDe("96512340"), "Constructora Los Robles SpA", 145],
      [rutDe("77891230"), "Transportes Cordillera Ltda.", 88],
      [rutDe("76345120"), "Comercial Santa Elena S.A.", 203],
      [rutDe("65098760"), "Fundación Educacional Aurora", 61],
      [rutDe("78123450"), "Laboratorio Andino S.A.", 119]
    ];
    var AFP = ["76100200-K", "AFP Modelo S.A.", 1204], NN = [rutDe("76987650"), "Asesorías Pacífico SpA"];
    var TIPOS = ["D","D","I","D","P","D","V","DP","D","D"], MEDIOS = ["PREVIRED","SV","CAJA"];
    /* Parte pagada de cada línea: siempre menos que el pactado, así todos deben. */
    var PARTE = [0, .5, .8, 0, .6, .9, .3, 0, .75, .4];
    function dia(n){ return (n < 10 ? "0" : "") + n; }
    for (var i = 0; i < 60; i++) {
      var cuerpo = String(8000000 + (i * 263171 + 97) % 17000000);
      var tipo = TIPOS[i % 10], pactado = 32000 + ((i * 7331) % 2300) * 91;
      var ap1 = (i * 7 + 3) % 30, ap2 = (i * 11 + 13) % 30; if (ap2 === ap1) ap2 = (ap2 + 1) % 30;
      var a = {id:"x" + i, rut:rutDe(cuerpo), nombre:PILA[i % 30] + " " + APELLIDOS[ap1] + " " + APELLIDOS[ap2],
        tipo:tipo, pactado:pactado, peso:0, extra:true};
      AFILIADOS.push(a);
      var e = EMPLEADORES[i % 5], partes;
      if (tipo === "I" || tipo === "V") partes = [[[a.rut, a.nombre], 1, pactado]];
      else if (tipo === "P") partes = [[[AFP[0], AFP[1]], AFP[2], pactado]];
      else if (tipo === "DP") partes = [[[e[0], e[1]], e[2], Math.round(pactado * .65)], [[AFP[0], AFP[1]], AFP[2], pactado - Math.round(pactado * .65)]];
      else partes = [[[e[0], e[1]], e[2], pactado]];
      var resto = {sep:pactado, ago:pactado};
      partes.forEach(function(pt, j){
        var l = {id:"x" + i + "-" + j, a:a.id, pag:pt[0], tipo:"EEPC", nAfil:pt[1], pactado:pt[2], extra:true, pagos:{}};
        [["sep", PARTE[(i + j) % 10], 5 + i % 15], ["ago", PARTE[(i + j + 3) % 10], 6 + i % 14]].forEach(function(m){
          var n = Math.round(pt[2] * m[1]); resto[m[0]] -= n;
          l.pagos[m[0]] = n ? [[dia(m[2]), MEDIOS[(i + j) % MEDIOS.length], n]] : [];
        });
        LINEAS.push(l);
      });
      /* Algunos reciben además un pago NN, menor que lo que les falta. */
      if (i % 9 === 4) {
        var nn = {id:"x" + i + "-nn", a:a.id, pag:NN, tipo:"NN", nAfil:1, pactado:null, extra:true, pagos:{}};
        ["sep", "ago"].forEach(function(m){ var n = Math.floor(resto[m] * .4 / 1000) * 1000; nn.pagos[m] = n ? [["12", "CAJA", n]] : []; });
        LINEAS.push(nn);
      }
    }
  })();

  var DEUDORES = {
    "45654323-1":{total:120, lineas:["l1","l4"]},
    "56234544-0":{total:64, lineas:["l2"], extra:[["16325874-9","Daniela Rojas Pinto",0,52000],["15874236-5","Felipe Morales Soto",38000,12000],["17452369-K","Ignacio Vargas Muñoz",20000,25000],["19874563-4","Josefa Castro Díaz",0,40000]]},
    "76100200-K":{total:210, lineas:["l3"]},
    "78456765-2":{total:18, lineas:["l6"]},
    "17948884-2":{total:1, lineas:["l7"]},
    "21335447-6":{total:1, lineas:["l8"]},
    "76123456-7":{total:0, lineas:[]}
  };
  /* Pagadores del relleno: sus líneas de la muestra más otros deudores. */
  LINEAS.forEach(function(l){
    if (!l.extra || l.tipo !== "EEPC" || (DEUDORES[l.pag[0]] && !DEUDORES[l.pag[0]].auto)) return;
    var d = DEUDORES[l.pag[0]] || (DEUDORES[l.pag[0]] = {total:0, lineas:[], auto:true});
    d.lineas.push(l.id);
    d.total = l.nAfil === 1 ? 1 : Math.max(d.lineas.length, Math.round(l.nAfil * .3));
  });
  var NOMBRES = ["Alejandra Muñoz Tapia","Benjamín Soto Carrasco","Catalina Reyes Fuentes","Diego Morales Vera","Elena Contreras Lagos","Fernando Rojas Pino","Gabriela Díaz Sepúlveda","Héctor Vargas Olivares","Isidora Castro Lobos","Joaquín Herrera Paredes","Karina Espinoza Toro","Lucas Navarro Guzmán","Martina Silva Cáceres","Nicolás Araya Molina","Olivia Pérez Salinas","Pablo Gutiérrez Vidal","Renata Flores Bravo","Sebastián Torres Rivas","Trinidad Campos Núñez","Vicente Ramírez Ortiz"];
  function dv(cuerpo){ var s = 0, m = 2; for (var i = cuerpo.length - 1; i >= 0; i--) { s += +cuerpo[i] * m; m = m === 7 ? 2 : m + 1; } var r = 11 - (s % 11); return r === 11 ? "0" : r === 10 ? "K" : String(r); }
  function relleno(semilla, n){
    var out = [];
    for (var i = 0; i < n; i++) {
      var k = (semilla * 7 + i * 3) % NOMBRES.length, cuerpo = String(12000000 + ((semilla * 104729 + i * 7919) % 8000000));
      var deuda = 10000 + ((semilla + i) * 7331 % 60) * 1000, pagado = ((semilla + i) % 3 === 0) ? 0 : 5000 + ((semilla * 3 + i) % 20) * 1000;
      out.push([cuerpo + "-" + dv(cuerpo), NOMBRES[k], pagado, deuda]);
    }
    return out;
  }

  /* Registros con inconsistencias de muestra: las reglas son las de la
     validación; los valores son ejemplos. */
  function inc_dv(n){ var s = 0, m = 2; String(n).split("").reverse().forEach(function(d){ s += Number(d) * m; m = m === 7 ? 2 : m + 1; }); var r = 11 - (s % 11); return r === 11 ? "0" : r === 10 ? "K" : String(r); }
  function inc_rut(n){ return n + "-" + inc_dv(n); }
  var inc_semilla = 7;
  function inc_azar(){ inc_semilla = (inc_semilla * 9301 + 49297) % 233280; return inc_semilla / 233280; }
  function inc_rutAfil(){ return inc_rut(9000000 + Math.floor(inc_azar() * 17000000)); }
  function inc_rutPag(){ return inc_rut(76000000 + Math.floor(inc_azar() * 999999)); }
  var inc_MEDIOS = ["SV", "TGR", "CAJA", "PREVIRED", "Seguro de cesantía"];
  var inc_CALIDAD = [
    ["Fecha de pago", "31/02/2026", "Esa fecha no existe"],
    ["Pactado", "vacío", "El dato es obligatorio"],
    ["RUT pagador", "7648291-3", "El dígito verificador no corresponde al RUT"],
    ["Medio de pago", "TRANSFERENCIA ELECTRÓNICA INTERBANCARIA DIFERIDA", "El valor no está en la lista de medios de pago de la plataforma"],
    ["Monto pagado", "-$15.000", "El monto no puede ser negativo"]
  ];
  function inc_duplicados(pares){ var f = []; for (var i = 0; i < pares; i++) { var a = inc_rutAfil(), g = inc_rutPag(), m = inc_MEDIOS[i % inc_MEDIOS.length]; f.push([a, g, m], [a, g, m]); } return f; }
  function inc_fuera(n){ var meses = ["Julio 2026", "Junio 2026", "Mayo 2026"], f = []; for (var i = 0; i < n; i++) f.push([inc_rutAfil(), inc_rutPag(), meses[i % 3]]); return f; }
  function inc_calidad(n){ var f = []; for (var i = 0; i < n; i++) { var c = inc_CALIDAD[i % inc_CALIDAD.length]; f.push([inc_rutAfil(), c[0], c[1], c[2]]); } return f; }
  var inc_COLS = {
    dup: ["RUT afiliado", "RUT pagador", "Medio de pago"],
    fuera: ["RUT afiliado", "RUT pagador", "Periodo de remuneración"],
    cal: ["RUT afiliado", "Columna", "Valor", "Motivo"]
  };
  function inc_grupos(nDup, nFuera, nCal){
    var g = [];
    if (nDup) g.push({titulo:"Duplicidades", desc:"El mismo periodo de remuneración se repite para el mismo afiliado, pagador y medio de pago", cols:inc_COLS.dup, filas:inc_duplicados(nDup / 2)});
    if (nFuera) g.push({titulo:"Fuera de mes", desc:"El periodo de remuneración no corresponde al del mes en curso (Agosto 2026)", cols:inc_COLS.fuera, filas:inc_fuera(nFuera)});
    if (nCal) g.push({titulo:"Calidad del dato", desc:"Columnas con un valor que no se puede usar", cols:inc_COLS.cal, filas:inc_calidad(nCal)});
    return g;
  }
  /* Cada conjunto parte de la misma semilla: el de un solo tipo repite las
     duplicidades del otro, así el mismo caso se reconoce entre los dos. */
  function inc_datos(registros, nDup, nFuera, nCal){
    inc_semilla = 7;
    return {registros:registros, grupos:inc_grupos(nDup, nFuera, nCal)};
  }
  var INCONSISTENCIAS = {
    /* 24 + 18 + 70 = 112 inconsistencias en 100 registros: 12 registros tienen dos. */
    cien: inc_datos(100, 24, 18, 70),
    /* Un solo tipo: las 24 inconsistencias son los 24 registros. */
    uno:  inc_datos(24, 24, 0, 0)
  };
  Object.keys(PERIODOS).forEach(function(k){ var q = PERIODOS[k]; if (q.inc) q.aviso = avisoInconsistencias(INCONSISTENCIAS[q.inc].registros); });
  return {
    miles:miles, pesos:pesos, uf:uf, monto:monto,
    PERIODOS:PERIODOS, AFILIADOS:AFILIADOS, LINEAS:LINEAS, BASE_A:BASE_A, BASE_L:BASE_L,
    DEUDORES:DEUDORES, relleno:relleno, INCONSISTENCIAS:INCONSISTENCIAS
  };
})();
