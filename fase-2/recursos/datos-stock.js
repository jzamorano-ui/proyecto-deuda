/* Datos de ejemplo de la deuda histórica (stock).
   Los totales, las filas y los modales cuadran entre sí: no cambiarlos.
   Expone todo en window.STOCK_DATOS. */
window.STOCK_DATOS = (function(){
  "use strict";
  /* Mismos formatos que datos.js. */
  var UF = 38489;
  function miles(n){ return String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function pesos(n){ return (n < 0 ? "-$" : "$") + miles(n); }
  function uf(n){ var v = (Math.abs(n) / UF).toFixed(3).split("."); return (n < 0 ? "-" : "") + miles(parseInt(v[0], 10)) + "," + v[1] + " UF"; }
  function monto(n){ return [pesos(n), uf(n)]; }

  function dv(c){
    var s = 0, m = 2;
    for (var i = c.length - 1; i >= 0; i--) { s += parseInt(c[i], 10) * m; m = m === 7 ? 2 : m + 1; }
    var r = 11 - s % 11; return r === 11 ? "0" : r === 10 ? "K" : String(r);
  }
  function rut(c){ return c + "-" + dv(c); }

  var USUARIO = "Carlos Inostroza Martínez";
  var MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  /* «Marzo 2026» → número para ordenar meses. */
  function orden(mes){ var m = mes.split(" "); return parseInt(m[1], 10) * 12 + MESES.indexOf(m[0]); }
  function mes(n){ return MESES[n % 12] + " " + Math.floor(n / 12); }

  /* Periodos de recaudación. La carga solo se habilita en el periodo en curso. */
  var PERIODOS = {
    oct:{etiqueta:"Octubre 2026", opcion:"Octubre 2026", enCurso:true},
    sep:{etiqueta:"Septiembre 2026", opcion:"Septiembre 2026"},
    ago:{etiqueta:"Agosto 2026", opcion:"Agosto 2026"}
  };
  /* Corte (Raúl, 21-10): en el periodo de recaudación X, el flujo es la
     remuneración X − 1 y el stock va de mayo 2022 a X − 2. Octubre llega
     hasta agosto 2026. */
  var DESDE = "Mayo 2022";
  function corte(k){ return {desde:DESDE, hasta:mes(orden(PERIODOS[k].etiqueta) - 2)}; }
  /* Todos los meses del corte, del más nuevo al más antiguo. */
  function mesesCorte(k){
    var c = corte(k), out = [];
    for (var n = orden(c.hasta); n >= orden(c.desde); n--) out.push(mes(n));
    return out;
  }

  /* Personas de stock (las de datos-fase-2) y pagadores. */
  var P = {
    marco:{rut:"11622567-8", nombre:"Marco Pizarro Lillo", tipo:"DP"},
    rodrigo:{rut:"28831161-7", nombre:"Rodrigo Cáceres Mansilla", tipo:"D"},
    paulina:{rut:"9455312-K", nombre:"Paulina Ortiz Valdés", tipo:"D"},
    valentina:{rut:rut("16234890"), nombre:"Valentina Soto Riquelme", tipo:"I"},
    hector:{rut:rut("8745231"), nombre:"Héctor Fuentes Carrasco", tipo:"D"}
  };
  var PAG = {
    clinica:["45654323-1", "Clínica Alemana de Santiago S.A."],
    colegio:["56234544-0", "Colegio Alemán de Santiago SpA"],
    afp:["76100200-K", "AFP Modelo S.A."],
    inmobiliaria:["76123456-7", "Inmobiliaria Los Andes SpA"],
    servicios:["78456765-2", "Servicios Diagnósticos Clínica Alemana Limitada"]
  };
  /* «propio»: la persona independiente paga su propia cotización. En el
     relleno de la tabla (abajo), el pagador viene como [RUT, nombre]. */
  function pagador(l){
    if (l.pag === "propio") { var x = persona(l.p); return [x.rut, x.nombre]; }
    return Array.isArray(l.pag) ? l.pag : PAG[l.pag];
  }

  /* Totales de cada carga. Septiembre y agosto son el STOCK de datos-fase-2;
     octubre sigue la misma tendencia. */
  var TOTALES = {
    oct:{registros:42627, afiliados:7641, total:1331884500, pagado:231290400, deuda:1100594100, deudaEepc:1108893718, eepc:4012, nn:1004},
    sep:{registros:41264, afiliados:7380, total:1284512300, pagado:214906150, deuda:1069606150, deudaEepc:1077606137, eepc:3930, nn:982},
    ago:{registros:39870, afiliados:7105, total:1236904700, pagado:198338250, deuda:1038566450, deudaEepc:1046286795, eepc:3842, nn:959}
  };
  /* Cargas ya hechas, de la más nueva a la más antigua. Cada una se hizo en su
     periodo, cuando estaba en curso: la hora es la de datos-fase-2 y el día,
     uno del mismo mes. Octubre parte sin carga: la fecha la pone el prototipo
     al cargar. */
  var CARGAS = {
    sep:[{fecha:"09/09/2026", hora:"10:24", archivo:"deuda-stock-septiembre-2026.xlsx", registros:41264, por:USUARIO}],
    ago:[{fecha:"10/08/2026", hora:"09:52", archivo:"deuda-stock-agosto-2026.xlsx", registros:39870, por:USUARIO}]
  };
  /* Caso con-carga: octubre parte con esta carga, hecha en el mismo periodo.
     Los registros son los de la carga de octubre. La huella es la de
     archivos-de-prueba/deuda-stock-octubre-2026.xlsx: volver a cargarlo avisa
     que ya fue cargado. */
  var CARGA_OCT = {fecha:"19/10/2026", hora:"10:24", archivo:"deuda-stock-octubre-2026.xlsx", registros:42627, por:USUARIO, huella:"fa33b2a2"};

  /* Afiliados: una fila por persona y periodo adeudado (STOCK_FILAS). Cada
     carga va de mayo 2022 a X − 2 (corte): octubre hasta agosto 2026,
     septiembre hasta julio 2026 y agosto hasta junio 2026. En octubre entra
     agosto 2026, con lo que dejó el flujo de septiembre (FLUJO_FILAS), y
     Cobranza cobró parte de lo de Marco (marzo) y Valentina (mayo 2025). */
  var FILAS = {
    oct:[
      {p:"paulina", adeudado:"Agosto 2026", total:35000, pagado:15000, deuda:20000, nEepc:1},
      {p:"paulina", adeudado:"Julio 2026", total:35000, pagado:25000, deuda:10000, nEepc:1},
      {p:"paulina", adeudado:"Junio 2026", total:35000, pagado:15000, deuda:20000, nEepc:1},
      {p:"marco", adeudado:"Agosto 2026", total:60000, pagado:50000, deuda:10000, nEepc:2},
      {p:"marco", adeudado:"Julio 2026", total:60000, pagado:50000, deuda:10000, nEepc:2},
      {p:"marco", adeudado:"Marzo 2026", total:60000, pagado:40000, deuda:20000, nEepc:2},
      {p:"rodrigo", adeudado:"Agosto 2026", total:40000, pagado:0, deuda:40000, nEepc:1},
      {p:"rodrigo", adeudado:"Enero 2026", total:50000, pagado:0, deuda:50000, nEepc:1},
      {p:"valentina", adeudado:"Mayo 2025", total:48500, pagado:20000, deuda:28500, nEepc:1},
      {p:"valentina", adeudado:"Noviembre 2022", total:45000, pagado:0, deuda:45000, nEepc:1},
      {p:"hector", adeudado:"Diciembre 2024", total:72000, pagado:12000, deuda:60000, nEepc:1},
      {p:"hector", adeudado:"Mayo 2022", total:64000, pagado:0, deuda:64000, nEepc:1}
    ],
    sep:[
      {p:"paulina", adeudado:"Julio 2026", total:35000, pagado:25000, deuda:10000, nEepc:1},
      {p:"paulina", adeudado:"Junio 2026", total:35000, pagado:15000, deuda:20000, nEepc:1},
      {p:"marco", adeudado:"Julio 2026", total:60000, pagado:50000, deuda:10000, nEepc:2},
      {p:"marco", adeudado:"Marzo 2026", total:60000, pagado:0, deuda:60000, nEepc:2},
      {p:"rodrigo", adeudado:"Enero 2026", total:50000, pagado:0, deuda:50000, nEepc:1},
      {p:"valentina", adeudado:"Mayo 2025", total:48500, pagado:0, deuda:48500, nEepc:1},
      {p:"valentina", adeudado:"Noviembre 2022", total:45000, pagado:0, deuda:45000, nEepc:1},
      {p:"hector", adeudado:"Diciembre 2024", total:72000, pagado:12000, deuda:60000, nEepc:1},
      {p:"hector", adeudado:"Mayo 2022", total:64000, pagado:0, deuda:64000, nEepc:1}
    ],
    ago:[
      {p:"paulina", adeudado:"Junio 2026", total:35000, pagado:0, deuda:35000, nEepc:1},
      {p:"marco", adeudado:"Marzo 2026", total:60000, pagado:0, deuda:60000, nEepc:2},
      {p:"rodrigo", adeudado:"Enero 2026", total:50000, pagado:0, deuda:50000, nEepc:1},
      {p:"valentina", adeudado:"Mayo 2025", total:48500, pagado:0, deuda:48500, nEepc:1},
      {p:"valentina", adeudado:"Noviembre 2022", total:45000, pagado:0, deuda:45000, nEepc:1},
      {p:"hector", adeudado:"Diciembre 2024", total:72000, pagado:0, deuda:72000, nEepc:1},
      {p:"hector", adeudado:"Mayo 2022", total:64000, pagado:0, deuda:64000, nEepc:1}
    ]
  };
  /* Pagadores: una fila por pagador, persona y periodo adeudado. En cada fila
     de Afiliados, el pactado EEPC suma el total a pagar, lo pagado (NN incluido)
     suma lo pagado y las líneas EEPC son el N° de EEPC. La NN no tiene pactado
     ni deuda, como en la fase 1. Julio de Marco y Paulina son las líneas l2 a
     l5 de la fase 1. */
  var PAGADORES = {
    oct:[
      {pag:"clinica", p:"paulina", adeudado:"Agosto 2026", pactado:35000, pagado:0, deuda:35000, tipoPag:"EEPC"},
      {pag:"inmobiliaria", p:"paulina", adeudado:"Agosto 2026", pactado:null, pagado:15000, deuda:null, tipoPag:"NN"},
      {pag:"clinica", p:"paulina", adeudado:"Julio 2026", pactado:35000, pagado:10000, deuda:25000, tipoPag:"EEPC"},
      {pag:"inmobiliaria", p:"paulina", adeudado:"Julio 2026", pactado:null, pagado:15000, deuda:null, tipoPag:"NN"},
      {pag:"clinica", p:"paulina", adeudado:"Junio 2026", pactado:35000, pagado:0, deuda:35000, tipoPag:"EEPC"},
      {pag:"inmobiliaria", p:"paulina", adeudado:"Junio 2026", pactado:null, pagado:15000, deuda:null, tipoPag:"NN"},
      {pag:"colegio", p:"marco", adeudado:"Agosto 2026", pactado:40000, pagado:30000, deuda:10000, tipoPag:"EEPC"},
      {pag:"afp", p:"marco", adeudado:"Agosto 2026", pactado:20000, pagado:20000, deuda:0, tipoPag:"EEPC"},
      {pag:"colegio", p:"marco", adeudado:"Julio 2026", pactado:40000, pagado:30000, deuda:10000, tipoPag:"EEPC"},
      {pag:"afp", p:"marco", adeudado:"Julio 2026", pactado:20000, pagado:20000, deuda:0, tipoPag:"EEPC"},
      {pag:"colegio", p:"marco", adeudado:"Marzo 2026", pactado:40000, pagado:40000, deuda:0, tipoPag:"EEPC"},
      {pag:"afp", p:"marco", adeudado:"Marzo 2026", pactado:20000, pagado:0, deuda:20000, tipoPag:"EEPC"},
      {pag:"servicios", p:"rodrigo", adeudado:"Agosto 2026", pactado:40000, pagado:0, deuda:40000, tipoPag:"EEPC"},
      {pag:"servicios", p:"rodrigo", adeudado:"Enero 2026", pactado:50000, pagado:0, deuda:50000, tipoPag:"EEPC"},
      {pag:"propio", p:"valentina", adeudado:"Mayo 2025", pactado:48500, pagado:20000, deuda:28500, tipoPag:"EEPC"},
      {pag:"propio", p:"valentina", adeudado:"Noviembre 2022", pactado:45000, pagado:0, deuda:45000, tipoPag:"EEPC"},
      {pag:"inmobiliaria", p:"hector", adeudado:"Diciembre 2024", pactado:72000, pagado:12000, deuda:60000, tipoPag:"EEPC"},
      {pag:"inmobiliaria", p:"hector", adeudado:"Mayo 2022", pactado:64000, pagado:0, deuda:64000, tipoPag:"EEPC"}
    ],
    sep:[
      {pag:"clinica", p:"paulina", adeudado:"Julio 2026", pactado:35000, pagado:10000, deuda:25000, tipoPag:"EEPC"},
      {pag:"inmobiliaria", p:"paulina", adeudado:"Julio 2026", pactado:null, pagado:15000, deuda:null, tipoPag:"NN"},
      {pag:"clinica", p:"paulina", adeudado:"Junio 2026", pactado:35000, pagado:0, deuda:35000, tipoPag:"EEPC"},
      {pag:"inmobiliaria", p:"paulina", adeudado:"Junio 2026", pactado:null, pagado:15000, deuda:null, tipoPag:"NN"},
      {pag:"colegio", p:"marco", adeudado:"Julio 2026", pactado:40000, pagado:30000, deuda:10000, tipoPag:"EEPC"},
      {pag:"afp", p:"marco", adeudado:"Julio 2026", pactado:20000, pagado:20000, deuda:0, tipoPag:"EEPC"},
      {pag:"colegio", p:"marco", adeudado:"Marzo 2026", pactado:40000, pagado:0, deuda:40000, tipoPag:"EEPC"},
      {pag:"afp", p:"marco", adeudado:"Marzo 2026", pactado:20000, pagado:0, deuda:20000, tipoPag:"EEPC"},
      {pag:"servicios", p:"rodrigo", adeudado:"Enero 2026", pactado:50000, pagado:0, deuda:50000, tipoPag:"EEPC"},
      {pag:"propio", p:"valentina", adeudado:"Mayo 2025", pactado:48500, pagado:0, deuda:48500, tipoPag:"EEPC"},
      {pag:"propio", p:"valentina", adeudado:"Noviembre 2022", pactado:45000, pagado:0, deuda:45000, tipoPag:"EEPC"},
      {pag:"inmobiliaria", p:"hector", adeudado:"Diciembre 2024", pactado:72000, pagado:12000, deuda:60000, tipoPag:"EEPC"},
      {pag:"inmobiliaria", p:"hector", adeudado:"Mayo 2022", pactado:64000, pagado:0, deuda:64000, tipoPag:"EEPC"}
    ],
    ago:[
      {pag:"clinica", p:"paulina", adeudado:"Junio 2026", pactado:35000, pagado:0, deuda:35000, tipoPag:"EEPC"},
      {pag:"colegio", p:"marco", adeudado:"Marzo 2026", pactado:40000, pagado:0, deuda:40000, tipoPag:"EEPC"},
      {pag:"afp", p:"marco", adeudado:"Marzo 2026", pactado:20000, pagado:0, deuda:20000, tipoPag:"EEPC"},
      {pag:"servicios", p:"rodrigo", adeudado:"Enero 2026", pactado:50000, pagado:0, deuda:50000, tipoPag:"EEPC"},
      {pag:"propio", p:"valentina", adeudado:"Mayo 2025", pactado:48500, pagado:0, deuda:48500, tipoPag:"EEPC"},
      {pag:"propio", p:"valentina", adeudado:"Noviembre 2022", pactado:45000, pagado:0, deuda:45000, tipoPag:"EEPC"},
      {pag:"inmobiliaria", p:"hector", adeudado:"Diciembre 2024", pactado:72000, pagado:0, deuda:72000, tipoPag:"EEPC"},
      {pag:"inmobiliaria", p:"hector", adeudado:"Mayo 2022", pactado:64000, pagado:0, deuda:64000, tipoPag:"EEPC"}
    ]
  };

  /* Antigüedad del pago (Raúl, 21-10, 30:03–33:15): lo pagado en toda la
     historia de la carga, desde mayo 2022, según los meses entre la
     remuneración y el pago. Grupos: pago en plazo (1 mes), mora temprana
     (2 a 4 meses, de 30 a 90 días) y mora avanzada (5 meses o más, 120 días
     o más). Por monto y por número de pagos. Cada carga suma un mes. */
  var GRUPOS = ["Pago en plazo", "Mora temprana", "Mora avanzada"];
  var ANTIGUEDAD = {
    oct:{monto:[40651937800, 2349612300, 785240100], pagos:[118560, 17519, 3327]},
    sep:{monto:[39842615300, 2318441900, 772814600], pagos:[116240, 17232, 3282]},
    ago:{monto:[39035204100, 2287118400, 760512300], pagos:[113885, 16940, 3236]}
  };
  function porcentajes(lista){
    var t = lista.reduce(function(a, b){ return a + b; }, 0);
    return lista.map(function(x){ return (Math.round(x / t * 1000) / 10).toFixed(1).replace(".", ",") + " %"; });
  }

  /* ── Tabla completa ─────────────────────────────────────────────────────
     FILAS y PAGADORES son los casos que se revisan en Figma. El resto de cada
     carga se completa con personas y pagadores ficticios, para que la tabla
     sea la carga real: del mes más nuevo a mayo 2022, sin repetir filas, y
     cada filtro cuenta las filas que de verdad cumple. El relleno respeta:
     - los registros de la carga, y en Pagadores las líneas que dan las
       proporciones de la muestra (63.941 en octubre);
     - las clases de la muestra de octubre: sin pago o pago parcial, con deuda
       desde $50.000 o menor (así salen 7.105 y 10.657, como en Figma);
     - las NN de la tarjeta (una línea por pagador NN) y las personas deudoras;
     - la deuda, lo pagado y el total a pagar de la tarjeta.
     Es determinista: el mismo periodo da siempre la misma tabla. Cada periodo
     se arma por separado; solo la muestra sigue a la misma persona entre
     cargas. */
  function azar(a, b, c){
    var x = Math.imul(a | 0, 0x27d4eb2d) ^ Math.imul((b | 0) + 0x165667b1, 0x85ebca6b | 0) ^ Math.imul((c | 0) + 0x61c88647, 0xc2b2ae35 | 0);
    x = Math.imul(x ^ (x >>> 15), 0x2c1b3c6d); x = Math.imul(x ^ (x >>> 12), 0x297a2d39); x ^= x >>> 15;
    return (x >>> 0) / 4294967296;
  }
  function elegir(lista, u){ return lista[Math.floor(u * lista.length)]; }
  function mcd(a, b){ while (b) { var t = a % b; a = b; b = t; } return a; }
  /* Multiplicador coprimo con n: j → (m·j + d) mod n recorre 0..n − 1 sin repetir. */
  function paso(n, f){ if (n < 2) return 1; var m = Math.max(1, Math.round(n * f)); while (mcd(m, n) !== 1) m++; return m; }
  /* Reparte un total según pesos (resto mayor): la suma da exacta. */
  function repartir(total, pesos){
    var s = pesos.reduce(function(a, b){ return a + b; }, 0), base = pesos.map(function(w){ return Math.floor(total * w / s); });
    var falta = total - base.reduce(function(a, b){ return a + b; }, 0);
    pesos.map(function(w, i){ return [total * w / s - base[i], i]; }).sort(function(a, b){ return b[0] - a[0] || a[1] - b[1]; })
      .slice(0, falta).forEach(function(r){ base[r[1]]++; });
    return base;
  }
  /* Cuota acumulada: de K casos repartidos en S posiciones, cuántos caen antes de x. */
  function cuota(K, x, S){ return S ? Math.round(x * K / S) : 0; }
  function limpiar(s){ return String(s).toLowerCase().replace(/[.\-\s]/g, ""); }

  var NOMBRES = ["Camila","Javiera","Francisca","Constanza","Catalina","Fernanda","Daniela","Carolina","Andrea","Macarena","Claudia","Patricia","Marcela","Alejandra","Natalia","Bárbara","Carla","Gabriela","Lorena","Verónica","Sofía","Isidora","Antonia","Florencia","Ximena","Pamela","Rocío","Tamara","Ignacia","Josefa","María José","Karina",
    "Sebastián","Matías","Felipe","Nicolás","Diego","Cristóbal","Joaquín","Tomás","Benjamín","Ignacio","Francisco","Javier","Andrés","Gonzalo","Pablo","Mauricio","Claudio","Patricio","Luis","Jorge","Juan Pablo","Cristián","Álvaro","Eduardo","Fernando","Ricardo","Víctor","Manuel","Hernán","Esteban","Vicente","Alonso"];
  var APELLIDOS = ["González","Muñoz","Rojas","Díaz","Pérez","Soto","Contreras","Silva","Martínez","Sepúlveda","Morales","Rodríguez","López","Araya","Fuentes","Hernández","Torres","Espinoza","Flores","Castillo","Valenzuela","Ramírez","Reyes","Gutiérrez","Castro","Vargas","Álvarez","Vásquez","Tapia","Fernández","Sánchez","Cortés",
    "Gómez","Herrera","Carrasco","Núñez","Miranda","Jara","Vergara","Rivera","Figueroa","Riquelme","Bravo","García","Vera","Molina","Campos","Sandoval","Paredes","Orellana","Zúñiga","Gallardo","Ortiz","Garrido","Salazar","Guzmán","Henríquez","Saavedra","Navarro","Aguilera","Parra","Romero","Aravena","Pizarro"];
  var RUBROS = ["Comercial","Constructora","Inversiones","Transportes","Servicios","Distribuidora","Agrícola","Inmobiliaria","Ingeniería","Alimentos","Logística","Importadora","Exportadora","Laboratorio","Panificadora","Ferretería","Textil","Maderas","Pesquera","Consultora",
    "Hotelera","Farmacias","Automotriz","Metalúrgica","Imprenta","Frigorífico","Lavandería","Seguridad","Aseo Industrial","Mantención","Eléctrica","Climatización","Editorial","Productora","Turismo","Packing","Vivero","Centro Médico","Ópticas","Librería"];
  var LUGARES = ["Los Aromos","Cordillera","del Pacífico","Austral","del Valle","Los Robles","El Bosque","Santa Elena","Las Palmas","Atacama","Biobío","Llanquihue","Elqui","Quillota","Rancagua","Osorno","Chiloé","Los Lagos","La Frontera","Andalién","Puerto Varas","Ñuble","Huasco","Limarí","Curicó","Talca","Maipo","Aconcagua","Cachapoal","Itata","Malleco","Cautín",
    "Valdivia","Reloncaví","Magallanes","Antofagasta","Tarapacá","Copiapó","La Serena","Coquimbo","San Felipe","Los Ángeles","Chillán","Linares","Pichilemu","La Calera","Melipilla","Talagante","Peñaflor","Colina","Lampa","Buin","Paine","Machalí","Rengo","San Fernando","Constitución","Cauquenes","Angol","Villarrica","Pucón","Ancud","Castro","Calbuco"];
  var NUCLEOS = APELLIDOS.concat(LUGARES);
  /* Quien paga la pensión de los cotizantes P y DP. */
  var PREVISION = [["96573180", "Seguros de Vida Austral S.A."], ["96687231", "Rentas Vitalicias Pacífico S.A."], ["96745118", "Compañía de Seguros de Vida Cordillera S.A."], ["99012457", "Previsión del Sur S.A."]]
    .map(function(x){ return [rut(x[0]), x[1]]; });
  /* Empleadores del relleno. Desde este número, cada NN tiene su propio pagador. */
  var EMPLEADORES = 3810;
  var RUT_P = Object.keys(P).map(function(c){ return limpiar(P[c].rut); });
  var RUT_PAG = Object.keys(PAG).map(function(c){ return limpiar(PAG[c][0]); });
  /* Ningún RUT del relleno contiene uno de la muestra: buscarlo da solo la muestra. */
  function choca(r, lista){ var x = limpiar(r); return lista.some(function(m){ return x.indexOf(m) !== -1 || m.indexOf(x) !== -1; }); }

  var empresas = {};
  function empresa(n){
    if (empresas[n]) return empresas[n];
    var c = (n * 1999 + 37) % (RUBROS.length * NUCLEOS.length), u = azar(n, 11);
    var nombre = RUBROS[c % RUBROS.length] + " " + NUCLEOS[Math.floor(c / RUBROS.length)] + (u < 0.45 ? " SpA" : u < 0.75 ? " Ltda." : u < 0.9 ? " S.A." : " Limitada");
    var cuerpo = 76000000 + (n * 7919 + 104729) % 2900000, r = rut(String(cuerpo));
    if (choca(r, RUT_PAG)) r = rut(String(cuerpo + 2900000));
    return (empresas[n] = [r, nombre]);
  }
  /* Personas del relleno: «a…» tienen dos pagadores EEPC; «b…», uno. */
  var personas = {};
  function persona(clave){
    if (P[clave]) return P[clave];
    if (personas[clave]) return personas[clave];
    var dos = clave.charAt(0) === "a", i = parseInt(clave.slice(1), 10), g = dos ? i : 20000 + i;
    var cuerpo = 6000000 + (g * 7919993 + 1234567) % 20000000, r = rut(String(cuerpo));
    if (choca(r, RUT_P)) r = rut(String(cuerpo + 20000000));
    var a1 = Math.floor(azar(g, 2) * APELLIDOS.length), a2 = Math.floor(azar(g, 3) * (APELLIDOS.length - 1));
    if (a2 >= a1) a2++;
    var u = azar(g, 4), tipo = dos ? (u < 0.8 ? "D" : "DP") : (u < 0.82 ? "D" : u < 0.9 ? "I" : u < 0.96 ? "P" : "V");
    var e1 = Math.floor(azar(g, 5) * EMPLEADORES), e2 = (e1 + 1 + Math.floor(azar(g, 6) * (EMPLEADORES - 1))) % EMPLEADORES;
    var prev = PREVISION[Math.floor(azar(g, 7) * PREVISION.length)];
    var pagadores = tipo === "D" ? (dos ? [empresa(e1), empresa(e2)] : [empresa(e1)]) : tipo === "DP" ? [empresa(e1), prev] : tipo === "P" ? [prev] : ["propio"];
    return (personas[clave] = {rut:r, nombre:elegir(NOMBRES, azar(g, 1)) + " " + APELLIDOS[a1] + " " + APELLIDOS[a2], tipo:tipo, pagadores:pagadores});
  }

  /* Clases: 0 pago parcial y deuda menor a $50.000, 1 pago parcial y desde
     $50.000, 2 sin pago y desde $50.000, 3 sin pago y menor a $50.000. */
  function clase(f){ return f.pagado > 0 ? (f.deuda >= 50000 ? 1 : 0) : (f.deuda >= 50000 ? 2 : 3); }
  var MUESTRA_CLASES = [0, 0, 0, 0];
  FILAS.oct.forEach(function(f){ MUESTRA_CLASES[clase(f)]++; });
  /* Montos de partida por clase; después la deuda y lo pagado de la clase 0
     se escalan para que la tabla sume la tarjeta. */
  function montoBase(c, u, v){
    if (c === 0) return [1000 + Math.floor(25000 * u * u), 1500 + Math.floor(15000 * v * v)];
    if (c === 1) return [50000 + Math.floor(55000 * u * u * u), 3000 + Math.floor(40000 * v * v)];
    if (c === 2) return [50000 + Math.floor(60000 * u * u * u), 0];
    return [8000 + Math.floor(41000 * Math.pow(u, 1.3)), 0];
  }
  /* Lleva la suma de un campo a la meta: escala y reparte el resto de a peso,
     sin salir del rango. */
  function ajustar(lista, campo, meta, min, max){
    var base = lista.reduce(function(s, f){ return s + f[campo]; }, 0), k = meta / base, r = meta;
    lista.forEach(function(f){ f[campo] = Math.min(max, Math.max(min, Math.round(f[campo] * k))); r -= f[campo]; });
    for (var vuelta = 0; r !== 0 && vuelta < 100; vuelta++) {
      var porFila = Math.trunc(r / lista.length) || (r > 0 ? 1 : -1);
      for (var i = 0; i < lista.length && r !== 0; i++) {
        var f = lista[i], v = Math.min(max, Math.max(min, f[campo] + porFila)), d = v - f[campo];
        if (Math.abs(d) > Math.abs(r)) d = r;
        f[campo] += d; r -= d;
      }
    }
    return k;
  }
  function copia(x, id){ var o = {id:id}; for (var c in x) o[c] = x[c]; return o; }

  var tablas = {};
  function tabla(k){
    if (tablas[k]) return tablas[k];
    var meses = mesesCorte(k), NA = TOTALES[k].registros, semilla = orden(PERIODOS[k].etiqueta);
    var muestraA = FILAS[k].map(copia), muestraL = PAGADORES[k].map(copia);
    var nA = muestraA.length, nL = muestraL.length, NP = Math.round(NA * nL / nA), S = NA - nA;
    /* Filas por mes: más en los meses nuevos, que aún no se cobran. */
    var bloques = repartir(NA, meses.map(function(m, i){ return (0.7 + 1.3 * Math.pow(0.9, i)) * (0.94 + 0.12 * azar(orden(m), 7)); }));
    var deMesA = meses.map(function(m){ return muestraA.filter(function(f){ return f.adeudado === m; }); });
    var deMesL = meses.map(function(m){ return muestraL.filter(function(l){ return l.adeudado === m; }); });
    var cuenta = [0, 0, 0, 0]; muestraA.forEach(function(f){ cuenta[clase(f)]++; });
    var metas = MUESTRA_CLASES.map(function(n){ return Math.round(NA * n / FILAS.oct.length); });
    metas[0] = NA - metas[1] - metas[2] - metas[3];
    var K = metas.map(function(m, c){ return m - cuenta[c]; });
    var NN = TOTALES[k].nn - muestraL.filter(function(l){ return l.tipoPag === "NN"; }).length;
    var T = NP - nL - S - NN;
    /* Personas: cada una aparece en meses seguidos (la ventana avanza un 35 %
       por mes) y todas aparecen: suman las personas deudoras de la tarjeta. */
    var Q = TOTALES[k].afiliados - Object.keys(muestraA.reduce(function(o, f){ o[f.p] = 1; return o; }, {})).length;
    var QA = Math.round(Q * T / S), QB = Q - QA, mA = paso(QA, 0.381966), mB = paso(QB, 0.381966);
    var filas = [], sinA = [], x = 0, offA = 0, offB = 0, rangos = [];
    meses.forEach(function(m, i){
      var s = bloques[i] - deMesA[i].length, x0 = x, x1 = x + s, ord = orden(m);
      var q = K.map(function(Kc){ return cuota(Kc, x1, S) - cuota(Kc, x0, S); });
      q[3] = s - q[0] - q[1] - q[2];
      var Ti = cuota(T, x1, S) - cuota(T, x0, S), NNi = cuota(NN, x1, S) - cuota(NN, x0, S), nnDesde = q[0] - Math.floor(NNi / 2);
      var m1 = paso(s, 0.618034), d1 = Math.floor(azar(ord, 8, semilla) * s), m2 = paso(s, 0.414214), d2 = Math.floor(azar(ord, 9, semilla) * s);
      deMesA[i].forEach(function(f){ filas.push(f); });
      for (var j = 0; j < s; j++) {
        var r1 = s ? (m1 * j + d1) % s : 0, r2 = s ? (m2 * j + d2) % s : 0, dos = r2 < Ti, o = dos ? r2 : r2 - Ti;
        var c = r1 < q[0] ? 0 : r1 < q[0] + q[1] ? 1 : r1 < q[0] + q[1] + q[2] ? 2 : 3;
        var mt = montoBase(c, azar(x + j, 21, semilla), azar(x + j, 22, semilla));
        var f = {id:nA + x + j, p: dos ? "a" + (mA * ((offA + o) % QA)) % QA : "b" + (mB * ((offB + o) % QB)) % QB,
          adeudado:m, total:0, pagado:mt[1], deuda:mt[0], nEepc: dos ? 2 : 1, c:c, nn: r1 >= nnDesde && r1 < nnDesde + NNi};
        filas.push(f); sinA.push(f);
      }
      offA += Math.ceil(0.35 * Ti); offB += Math.ceil(0.35 * (s - Ti));
      rangos.push([x0, x1]); x = x1;
    });
    /* La tabla suma la tarjeta: deuda y pagado del total menos la muestra. */
    var c0 = sinA.filter(function(f){ return f.c === 0; }), fijo = function(campo){ return sinA.reduce(function(s, f){ return s + (f.c === 0 ? 0 : f[campo]); }, 0); };
    var escalaDeuda = ajustar(c0, "deuda", TOTALES[k].deuda - suma(FILAS[k], "deuda") - fijo("deuda"), 500, 49999);
    var escalaPagado = ajustar(c0, "pagado", TOTALES[k].pagado - suma(FILAS[k], "pagado") - fijo("pagado"), 500, 120000);
    sinA.forEach(function(f){ f.total = f.deuda + f.pagado; });
    /* Líneas de Pagadores: por mes, la muestra y luego las de cada fila. */
    var lineas = [], sinL = [], nn = 0;
    meses.forEach(function(m, i){
      deMesL[i].forEach(function(l){ lineas.push(l); });
      for (var xx = rangos[i][0]; xx < rangos[i][1]; xx++) {
        var f = sinA[xx], pers = persona(f.p), propias = [], pnn = 0;
        if (f.nn) pnn = Math.max(1, Math.min(f.pagado, Math.round(f.pagado * (0.4 + 0.6 * azar(xx, 31, semilla)))));
        var pe = f.pagado - pnn, pag = pers.pagadores;
        if (pag.length === 2) {
          var w = (pers.tipo === "DP" ? 0.6 : 0.5) + 0.2 * azar(xx, 32, semilla), p1 = Math.round(f.total * w), p2 = f.total - p1;
          var g1 = Math.min(p1, Math.round(pe * azar(xx, 33, semilla))), g2 = pe - g1;
          if (g2 > p2) { g2 = p2; g1 = pe - p2; }
          propias.push([pag[0], p1, g1], [pag[1], p2, g2]);
        } else propias.push([pag[0], f.total, pe]);
        f.l0 = sinL.length; f.nl = propias.length + (f.nn ? 1 : 0);
        propias.forEach(function(e){
          var l = {id:nL + sinL.length, pag:e[0], p:f.p, adeudado:m, pactado:e[1], pagado:e[2], deuda:e[1] - e[2], tipoPag:"EEPC", fila:f.id};
          lineas.push(l); sinL.push(l);
        });
        if (f.nn) {
          var l = {id:nL + sinL.length, pag:empresa(EMPLEADORES + nn++), p:f.p, adeudado:m, pactado:null, pagado:pnn, deuda:null, tipoPag:"NN", fila:f.id};
          lineas.push(l); sinL.push(l);
        }
      }
    });
    return (tablas[k] = {filas:filas, lineas:lineas, muestraA:muestraA, muestraL:muestraL, sinA:sinA, sinL:sinL, bloques:bloques,
      personas:{a:QA, b:QB}, cuotas:{clases:K, NN:NN, T:T}, escalas:{deuda:escalaDeuda, pagado:escalaPagado}});
  }
  function suma(lista, campo){ return lista.reduce(function(s, x){ return s + (x[campo] || 0); }, 0); }
  /* Fila (tipo «a») o línea (tipo «l») por su id en la tabla. */
  function registro(k, tipo, id){
    var t = tabla(k), nA = t.muestraA.length, nL = t.muestraL.length;
    return tipo === "a" ? (id < nA ? t.muestraA[id] : t.sinA[id - nA]) : (id < nL ? t.muestraL[id] : t.sinL[id - nL]);
  }
  /* Pagadores de la cotización de una fila o de una línea. */
  function lineas(k, x){
    var t = tabla(k), f = x.tipoPag ? (x.fila !== undefined ? registro(k, "a", x.fila) : x) : x;
    if (f.l0 !== undefined) return t.sinL.slice(f.l0, f.l0 + f.nl);
    return t.muestraL.filter(function(l){ return l.p === f.p && l.adeudado === f.adeudado; });
  }

  return {UF:UF, miles:miles, pesos:pesos, uf:uf, monto:monto, dv:dv, rut:rut, orden:orden, mes:mes, MESES:MESES,
    USUARIO:USUARIO, PERIODOS:PERIODOS, corte:corte, mesesCorte:mesesCorte, P:P, PAG:PAG, pagador:pagador, TOTALES:TOTALES, CARGAS:CARGAS,
    CARGA_OCT:CARGA_OCT, FILAS:FILAS, PAGADORES:PAGADORES,
    GRUPOS:GRUPOS, ANTIGUEDAD:ANTIGUEDAD, porcentajes:porcentajes,
    persona:persona, tabla:tabla, registro:registro, lineas:lineas,
    /* Para armar la deuda consolidada (datos-consolidado.js) con las mismas reglas. */
    util:{azar:azar, paso:paso, repartir:repartir, ajustar:ajustar, empresa:empresa, choca:choca, limpiar:limpiar, EMPLEADORES:EMPLEADORES}};
})();
