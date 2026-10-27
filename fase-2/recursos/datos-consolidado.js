/* Datos de ejemplo de la deuda consolidada. En el periodo de recaudación X
   junta la deuda del mes (flujo: remuneración X − 1, datos.js) y la deuda
   histórica cargada en X (stock: mayo 2022 a X − 2, datos-stock.js). No hay
   meses repetidos entre las dos: los montos se suman y las personas y los
   pagadores que están en las dos se cuentan una vez (CRUCE). Los totales
   cuadran entre sí: no cambiarlos. Se carga después de datos.js y
   datos-stock.js. */
window.CONSOLIDADO_DATOS = (function(){
  "use strict";
  var F = window.DATOS, S = window.STOCK_DATOS, U = S.util;
  var DESDE = "Mayo 2022";

  /* Periodos de recaudación, del más nuevo al más antiguo. La vista se
     habilita cuando cerró la deuda del mes y se cargó la histórica (Raúl,
     21-10). Octubre está en curso: el mes no cierra y la histórica se cargó
     el 19/10. Julio cerró, pero no tiene carga de deuda histórica. */
  var PERIODOS = {
    oct:{etiqueta:"Octubre 2026", rem:"Septiembre 2026", enCurso:true, flujo:null, carga:S.CARGA_OCT},
    sep:{etiqueta:"Septiembre 2026", rem:"Agosto 2026", flujo:F.PERIODOS["2026-09-cerrado"], carga:S.CARGAS.sep[0]},
    ago:{etiqueta:"Agosto 2026", rem:"Julio 2026", flujo:F.PERIODOS["2026-08"], carga:S.CARGAS.ago[0]},
    jul:{etiqueta:"Julio 2026", rem:"Junio 2026", flujo:F.PERIODOS["2026-07"], carga:null}
  };
  function disponible(k){ return !!(PERIODOS[k].flujo && PERIODOS[k].carga); }
  /* Remuneraciones que suma: de mayo 2022 al mes del flujo. El stock llega
     hasta el mes anterior. */
  function rango(k){ return {desde:DESDE, hasta:PERIODOS[k].rem}; }
  function corteStock(k){ return {desde:DESDE, hasta:S.mes(S.orden(PERIODOS[k].rem) - 1)}; }
  function mesesCorte(k){
    var out = [];
    for (var n = S.orden(PERIODOS[k].rem); n >= S.orden(DESDE); n--) out.push(S.mes(n));
    return out;
  }

  /* Afiliados, pagadores EEPC y pagadores NN que están en el flujo y en el
     stock del mismo periodo. */
  var CRUCE = {sep:{afiliados:2950, eepc:2450, nn:310}, ago:{afiliados:2870, eepc:2079, nn:263}};

  /* Tarjetas: los montos suman flujo y stock; los conteos restan el cruce. */
  function totales(k){
    var f = PERIODOS[k].flujo.tot, s = S.TOTALES[k], c = CRUCE[k];
    var t = {total:f.total + s.total, pagado:f.pagado + s.pagado, deuda:f.deuda + s.deuda, deudaEepc:f.deudaEepc + s.deudaEepc,
      afiliados:f.afiliados + s.afiliados - c.afiliados, eepc:f.eepc + s.eepc - c.eepc, nn:f.nn + s.nn - c.nn,
      registros:f.afiliados + s.registros,
      flujo:{deuda:f.deuda, deudaEepc:f.deudaEepc, afiliados:f.afiliados},
      stock:{deuda:s.deuda, deudaEepc:s.deudaEepc, afiliados:s.afiliados}};
    t.pagadores = t.eepc + t.nn;
    return t;
  }

  /* Deuda por segmento: las 6 carteras de cobranza (HU 3689). Septiembre es
     la muestra; agosto reparte su deuda con el mismo peso y escala los
     deudores. Una persona puede estar en más de un segmento: los deudores no
     suman el total. */
  var SEGMENTOS = [
    {k:"Cartera Mayor 12 Meses", deudores:5214, deuda:1107363350},
    {k:"Cartera Menor 13 Meses", deudores:5421, deuda:436022300},
    {k:"Cartera con deuda menor", deudores:2140, deuda:19846300},
    {k:"Cartera Soporte", deudores:186, deuda:38874000},
    {k:"Cartera LM del Período", deudores:1150, deuda:47160000},
    {k:"Cartera empresa sin deuda mayor a 12 meses", deudores:829, deuda:64100000}
  ];
  function segmentos(k){
    var t = totales(k), base = totales("sep");
    var deudas = U.repartir(t.deuda, SEGMENTOS.map(function(x){ return x.deuda; }));
    return SEGMENTOS.map(function(x, i){
      return {k:x.k, deudores: k === "sep" ? x.deudores : Math.round(x.deudores * t.afiliados / base.afiliados), deuda:deudas[i], pct:deudas[i] / t.deuda * 100};
    }).sort(function(a, b){ return b.deuda - a.deuda; });
  }
  /* % de la deuda con un decimal. Bajo 0,1 % no se redondea a cero. */
  function pct(x){ return x === 0 ? "0 %" : x < 0.1 ? "< 0,1 %" : (Math.round(x * 10) / 10).toFixed(1).replace(".", ",") + " %"; }

  /* Antigüedad del pago: la del stock. Lo pagado en el flujo es pago en
     plazo y, sobre toda la historia, no mueve los porcentajes. */
  function antiguedad(k){ return S.ANTIGUEDAD[k]; }

  /* ── Personas ────────────────────────────────────────────────────────── */
  /* Muestra: las seis personas del flujo (datos.js) y las cinco del stock;
     Marco, Rodrigo y Paulina están en los dos. Relleno del flujo: x0 a x59
     de datos.js. Lo demás, las personas ficticias del stock (a…, b…). */
  var ORDEN = ["paulina","marco","rodrigo","andrea","javiera","sergio","valentina","hector"];
  var ID = {andrea:"a1", marco:"a2", javiera:"a3", rodrigo:"a4", paulina:"a5", sergio:"a6"};
  var AFIL = {}, LIN_DE = {};
  F.AFILIADOS.forEach(function(a){ AFIL[a.id] = a; });
  F.LINEAS.forEach(function(l){ (LIN_DE[l.a] = LIN_DE[l.a] || []).push(l); });
  function persona(clave){
    if (S.P[clave]) return S.P[clave];
    var a = ID[clave] ? AFIL[ID[clave]] : clave.charAt(0) === "x" ? AFIL[clave] : null;
    return a ? {rut:a.rut, nombre:a.nombre, tipo:a.tipo} : S.persona(clave);
  }
  function pagador(l){
    if (l.pag === "propio") { var x = persona(l.p); return [x.rut, x.nombre]; }
    return Array.isArray(l.pag) ? l.pag : S.PAG[l.pag];
  }
  /* Ninguna persona nueva del relleno contiene el RUT de una del flujo:
     buscarlo da solo esa persona. */
  var RUT_FLUJO = F.AFILIADOS.map(function(a){ return U.limpiar(a.rut); });

  /* ── Tabla completa ─────────────────────────────────────────────────────
     Afiliados: una fila por persona, periodo de remuneración y origen.
     Primero la muestra por persona (su fila del flujo y luego las del stock),
     después el relleno del flujo y al final el del stock, que es la tabla de
     la vista stock tal cual. Pagadores sigue el mismo orden.
     El flujo se completa como el stock: suma la deuda, lo pagado, lo pagado
     por NN y los afiliados de su tarjeta, y una línea NN por pagador NN.
     Las personas que están en los dos son personas del stock que también
     deben el mes; las demás son nuevas. Septiembre lleva 71.042 líneas
     (50.744 × 21/15, la proporción de su muestra); el flujo pone las 11.438
     que no trae el stock y agosto usa la misma proporción por afiliado. */
  var LINEAS_POR_AFILIADO = 11438 / 9480;
  function pagadoLinea(l, datos){ return (l.pagos[datos] || []).reduce(function(s, p){ return s + p[2]; }, 0); }
  function deFlujo(a, clave, per){
    var ls = LIN_DE[a.id] || [], total = a.pactado + (a.comp ? a.comp.monto : 0), pagado = 0;
    var lineas = ls.map(function(l){
      var g = pagadoLinea(l, per.flujo.datos), nn = l.tipo === "NN"; pagado += g;
      return {pag:l.pag, p:clave, adeudado:per.rem, origen:"Flujo", pactado: nn ? null : l.pactado, pagado:g, deuda: nn ? null : l.pactado - g, tipoPag:l.tipo};
    });
    return {fila:{p:clave, adeudado:per.rem, origen:"Flujo", total:total, pagado:pagado, deuda:total - pagado,
      nEepc:ls.filter(function(l){ return l.tipo === "EEPC"; }).length}, lineas:lineas};
  }
  function deStock(x){
    var o = {}; ["p","adeudado","total","pagado","deuda","nEepc","pag","pactado","tipoPag"].forEach(function(c){ if (x[c] !== undefined) o[c] = x[c]; });
    o.origen = "Stock"; return o;
  }

  function relleno(k, st, hecho){
    var per = PERIODOS[k], tf = per.flujo.tot, semilla = S.orden(per.etiqueta) + 101;
    var n = tf.afiliados - hecho.filas, L = Math.round(tf.afiliados * LINEAS_POR_AFILIADO) - hecho.lineas;
    var NN = tf.nn - hecho.nn, T = L - NN - n;
    /* Personas: las del cruce se toman del stock; las de dos pagadores EEPC
       son «a…» y las de uno, «b…». */
    var reuso = CRUCE[k].afiliados - hecho.cruce, rA = Math.round(T * reuso / n), rB = reuso - rA;
    var QA = st.personas.a, QB = st.personas.b, mA = U.paso(QA, 0.2763932), mB = U.paso(QB, 0.2763932);
    var claves = [], i;
    for (i = 0; i < rA; i++) claves.push("a" + (mA * i + 17) % QA);
    for (i = 0; i < rB; i++) claves.push("b" + (mB * i + 29) % QB);
    function nuevas(letra, desde, cuantas){
      for (var j = desde, hechas = 0; hechas < cuantas; j++) {
        if (U.choca(S.persona(letra + j).rut, RUT_FLUJO)) continue;
        claves.push(letra + j); hechas++;
      }
    }
    nuevas("a", QA, T - rA);
    nuevas("b", QB, n - T - rB);
    /* Orden de la tabla: mezcla fija de las claves. */
    var m = U.paso(n, 0.618034), d = Math.floor(U.azar(n, 3, semilla) * n), m2 = U.paso(n, 0.414214), d2 = Math.floor(U.azar(n, 4, semilla) * n);
    var filas = [];
    for (var j = 0; j < n; j++) {
      var u = U.azar(j, 41, semilla), v = U.azar(j, 42, semilla);
      filas.push({p:claves[(m * j + d) % n], adeudado:per.rem, origen:"Flujo",
        deuda:6000 + Math.floor(120000 * u * u), pe: v < 0.42 ? 0 : 3000 + Math.floor(45000 * v * v),
        pnn:0, nn:(m2 * j + d2) % n < NN});
    }
    filas.forEach(function(f, j){ if (f.nn) f.pnn = 8000 + Math.floor(60000 * U.azar(j, 44, semilla)); });
    /* Suma la tarjeta del flujo: deuda, lo pagado a pagadores EEPC y lo
       pagado por NN (deuda EEPC − deuda). */
    var metaNN = tf.deudaEepc - tf.deuda - hecho.pagadoNN;
    U.ajustar(filas, "deuda", tf.deuda - hecho.deuda, 1000, 600000);
    U.ajustar(filas.filter(function(f){ return f.pe > 0; }), "pe", tf.pagado - hecho.pagado - metaNN, 500, 300000);
    U.ajustar(filas.filter(function(f){ return f.nn; }), "pnn", metaNN, 1000, 300000);
    /* Pagadores NN: los del cruce son pagadores NN del stock; los demás, nuevos. */
    var reusoNN = CRUCE[k].nn - hecho.cruceNN, nnStock = st.cuotas.NN, nn = 0;
    return filas.map(function(f, j){
      var pers = S.persona(f.p), pag = pers.pagadores, propias = [], lineas = [];
      f.pagado = f.pe + f.pnn; f.total = f.deuda + f.pagado;
      if (pag.length === 2) {
        var w = (pers.tipo === "DP" ? 0.6 : 0.5) + 0.2 * U.azar(j, 32, semilla), p1 = Math.round(f.total * w), p2 = f.total - p1;
        var g1 = Math.min(p1, Math.round(f.pe * U.azar(j, 33, semilla))), g2 = f.pe - g1;
        if (g2 > p2) { g2 = p2; g1 = f.pe - p2; }
        propias.push([pag[0], p1, g1], [pag[1], p2, g2]);
      } else propias.push([pag[0], f.total, f.pe]);
      propias.forEach(function(e){
        lineas.push({pag:e[0], p:f.p, adeudado:f.adeudado, origen:"Flujo", pactado:e[1], pagado:e[2], deuda:e[1] - e[2], tipoPag:"EEPC"});
      });
      if (f.nn) {
        var e = nn < reusoNN ? U.empresa(U.EMPLEADORES + nn) : U.empresa(U.EMPLEADORES + nnStock + nn - reusoNN); nn++;
        lineas.push({pag:e, p:f.p, adeudado:f.adeudado, origen:"Flujo", pactado:null, pagado:f.pnn, deuda:null, tipoPag:"NN"});
      }
      return {fila:{p:f.p, adeudado:f.adeudado, origen:"Flujo", total:f.total, pagado:f.pagado, deuda:f.deuda, nEepc:propias.length}, lineas:lineas};
    });
  }

  var tablas = {};
  function tabla(k){
    if (tablas[k]) return tablas[k];
    var per = PERIODOS[k], st = S.tabla(k), filas = [], lineas = [];
    function poner(f, ls){
      f.id = filas.length; f.l0 = lineas.length; f.nl = ls.length; filas.push(f);
      ls.forEach(function(l){ l.id = lineas.length; l.fila = f.id; lineas.push(l); });
    }
    var hecho = {filas:0, lineas:0, nn:0, deuda:0, pagado:0, pagadoNN:0, cruce:0, cruceNN:0};
    function contar(x){
      hecho.filas++; hecho.lineas += x.lineas.length; hecho.deuda += x.fila.deuda; hecho.pagado += x.fila.pagado;
      x.lineas.forEach(function(l){ if (l.tipoPag === "NN") { hecho.nn++; hecho.pagadoNN += l.pagado; } });
    }
    /* Muestra, por persona. */
    var nnStock = {};
    S.PAGADORES[k].forEach(function(l){ if (l.tipoPag === "NN") nnStock[pagador(l)[0]] = 1; });
    ORDEN.forEach(function(c){
      if (ID[c]) {
        var x = deFlujo(AFIL[ID[c]], c, per); contar(x); poner(x.fila, x.lineas);
        if (S.FILAS[k].some(function(f){ return f.p === c; })) hecho.cruce++;
        x.lineas.forEach(function(l){ if (l.tipoPag === "NN" && nnStock[pagador(l)[0]]) { hecho.cruceNN++; delete nnStock[pagador(l)[0]]; } });
      }
      S.FILAS[k].filter(function(f){ return f.p === c; }).forEach(function(f){
        poner(deStock(f), S.PAGADORES[k].filter(function(l){ return l.p === c && l.adeudado === f.adeudado; }).map(deStock));
      });
    });
    var muestra = {a:filas.length, l:lineas.length};
    /* Relleno del flujo (datos.js), luego el que suma la tarjeta. */
    F.AFILIADOS.slice(F.BASE_A).forEach(function(a){ var x = deFlujo(a, a.id, per); contar(x); poner(x.fila, x.lineas); });
    relleno(k, st, hecho).forEach(function(x){ poner(x.fila, x.lineas); });
    var flujo = filas.length - muestra.a + 6;
    /* Relleno del stock, tal cual la vista stock. */
    st.sinA.forEach(function(f){ poner(deStock(f), st.sinL.slice(f.l0, f.l0 + f.nl).map(deStock)); });
    return (tablas[k] = {filas:filas, lineas:lineas, muestra:muestra, flujo:flujo});
  }
  function registro(k, tipo, id){ var t = tabla(k); return tipo === "a" ? t.filas[id] : t.lineas[id]; }
  /* Pagadores de la cotización de una fila o de una línea. */
  function lineas(k, x){
    var t = tabla(k), f = x.tipoPag ? t.filas[x.fila] : x;
    return t.lineas.slice(f.l0, f.l0 + f.nl);
  }

  return {miles:S.miles, pesos:S.pesos, uf:S.uf, monto:S.monto, orden:S.orden, USUARIO:S.USUARIO,
    PERIODOS:PERIODOS, disponible:disponible, rango:rango, corteStock:corteStock, mesesCorte:mesesCorte,
    CRUCE:CRUCE, totales:totales, SEGMENTOS:SEGMENTOS, segmentos:segmentos, pct:pct,
    GRUPOS:S.GRUPOS, antiguedad:antiguedad, porcentajes:S.porcentajes,
    ORDEN:ORDEN, persona:persona, pagador:pagador, tabla:tabla, registro:registro, lineas:lineas};
})();
