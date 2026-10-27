/* Comportamiento del prototipo de Deuda de cotizaciones.
   Necesita datos.js. El caso se declara en cada HTML con window.CASO. */
(function(){
  "use strict";
  var D = window.DATOS;
  var miles = D.miles, pesos = D.pesos, uf = D.uf, monto = D.monto;
  var PERIODOS = D.PERIODOS, AFILIADOS = D.AFILIADOS, LINEAS = D.LINEAS;
  var BASE_A = D.BASE_A, BASE_L = D.BASE_L;
  var DEUDORES = D.DEUDORES, relleno = D.relleno, INCONSISTENCIAS = D.INCONSISTENCIAS;
  var $ = function(id){ return document.getElementById(id); };

  /* ── El caso ─────────────────────────────────────────────────────────── */
  /* Cada HTML declara el suyo con window.CASO antes de cargar los scripts.
     Define qué periodos ofrece el selector, cómo se muestra el periodo una
     vez generado y qué pasa al exportar. */
  var CASOS = {
    "principal":       {periodos:["2026-09", "2026-09-cerrado", "2026-08", "2026-07", "2026-06"]},
    "inconsistencias": {periodos:["2026-09-inc", "2026-09-inc-uno"]},
    "sin-deuda":       {periodos:["2026-09"], opciones:{"2026-09":"Septiembre 2026"}, generar:"vacio"},
    "error-generar":   {periodos:["2026-09"], opciones:{"2026-09":"Septiembre 2026"}, generar:"error"},
    "error-exportar":  {periodos:["2026-09", "2026-09-cerrado", "2026-08", "2026-07", "2026-06"], exportar:"error"}
  };
  var CFG = CASOS[window.CASO] || CASOS.principal;

  function dos(n){ return (n < 10 ? "0" : "") + n; }
  function ahora(){ var d = new Date(); return {fecha: dos(d.getDate()) + "/" + dos(d.getMonth() + 1) + "/" + d.getFullYear(), hora: dos(d.getHours()) + ":" + dos(d.getMinutes())}; }
  function escapar(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function numero(s){ return parseInt(String(s).replace(/\D/g, ""), 10) || 0; }
  var USUARIO = "Carlos Inostroza Martínez";

  /* ── Menú lateral ────────────────────────────────────────────────────── */
  var MENU = [
    {t:"Recaudación", i:"carpeta"}, {t:"Deuda", i:"carpeta", activo:true, href:"deuda.html"}, {t:"Gestión de Beneficios", i:"carpeta"},
    {t:"Distribución", i:"carpeta"}, {t:"Centralización", i:"carpeta"}, {t:"Excedentes y Excesos", i:"carpeta"},
    {t:"Devolución", i:"carpeta"}, {t:"Consultas por RUT", i:"persona"}, {t:"Configuraciones", i:"rueda"}
  ];
  /* Íconos del DS, exportados del componente Plataforma / Sidebar de Figma. */
  var ICONOS = {
    carpeta:'<path d="M16.6644 8.58333H15.3338V7.20833C15.3338 6.44922 14.7365 5.83333 14.0004 5.83333H9.5558L7.77797 4H3.33338C2.59724 4 2 4.61589 2 5.375V13.625C2 14.3841 2.59724 15 3.33338 15H14.4449C14.9032 15 15.331 14.7565 15.5754 14.3526L17.795 10.6859C18.3505 9.77214 17.7116 8.58333 16.6644 8.58333ZM3.33338 5.54688C3.33338 5.45234 3.40838 5.375 3.50005 5.375H7.22517L9.00301 7.20833H13.8337C13.9254 7.20833 14.0004 7.28568 14.0004 7.38021V8.58333H6.22236C5.75568 8.58333 5.32233 8.83542 5.08066 9.24792L3.33338 12.2328V5.54688ZM14.4449 13.625H4.00007L6.14458 9.95833H16.6671L14.4449 13.625Z"/>',
    persona:'<path d="M10 2C5.58065 2 2 5.58065 2 10C2 14.4194 5.58065 18 10 18C14.4194 18 18 14.4194 18 10C18 5.58065 14.4194 2 10 2ZM10 5.09677C11.5677 5.09677 12.8387 6.36774 12.8387 7.93548C12.8387 9.50323 11.5677 10.7742 10 10.7742C8.43226 10.7742 7.16129 9.50323 7.16129 7.93548C7.16129 6.36774 8.43226 5.09677 10 5.09677ZM10 16.1935C8.10645 16.1935 6.40968 15.3355 5.27419 13.9935C5.88065 12.8516 7.06774 12.0645 8.45161 12.0645C8.52903 12.0645 8.60645 12.0774 8.68064 12.1C9.1 12.2355 9.53871 12.3226 10 12.3226C10.4613 12.3226 10.9032 12.2355 11.3194 12.1C11.3935 12.0774 11.471 12.0645 11.5484 12.0645C12.9323 12.0645 14.1194 12.8516 14.7258 13.9935C13.5903 15.3355 11.8935 16.1935 10 16.1935Z"/>',
    rueda:'<path d="M16.5407 9.38712L17.6005 8.79415C17.9143 8.61864 18.0664 8.26054 17.9725 7.92144C17.593 6.54948 16.8462 5.32315 15.8405 4.34734C15.5849 4.09934 15.1889 4.04909 14.8757 4.22441L13.8178 4.8166C13.4742 4.57824 13.1075 4.37276 12.7228 4.20305V3.01747C12.7228 2.84671 12.6646 2.68074 12.5572 2.54536C12.4498 2.40998 12.2993 2.31279 12.129 2.26889C10.7391 1.9106 9.26274 1.91015 7.87106 2.26886C7.52095 2.35912 7.27715 2.66631 7.27715 3.01744V4.20302C6.89254 4.37273 6.52582 4.57821 6.18216 4.81657L5.12425 4.22438C4.81105 4.04905 4.41515 4.09931 4.15953 4.34731C3.15384 5.32312 2.40703 6.54941 2.02746 7.92141C1.93364 8.26051 2.08574 8.61861 2.39947 8.79412L3.45931 9.38712C3.41871 9.79477 3.41871 10.2053 3.45931 10.6129L2.39947 11.2059C2.08574 11.3814 1.93364 11.7395 2.02746 12.0786C2.40703 13.4505 3.15384 14.6769 4.15953 15.6527C4.41515 15.9007 4.81105 15.9509 5.12425 15.7756L6.18216 15.1834C6.52582 15.4218 6.89253 15.6272 7.27715 15.7969V16.9825C7.27717 17.1533 7.33541 17.3193 7.4428 17.4546C7.55019 17.59 7.70073 17.6872 7.87099 17.7311C9.26094 18.0894 10.7373 18.0899 12.1289 17.7311C12.479 17.6409 12.7228 17.3337 12.7228 16.9825V15.797C13.1075 15.6273 13.4742 15.4218 13.8178 15.1835L14.8757 15.7756C15.1889 15.951 15.5849 15.9007 15.8405 15.6527C16.8462 14.6769 17.593 13.4506 17.9725 12.0786C18.0664 11.7395 17.9143 11.3814 17.6005 11.2059L16.5407 10.6129C16.5813 10.2049 16.5813 9.79519 16.5407 9.38712ZM14.7873 11.42L16.2458 12.2358C15.9834 12.9225 15.6025 13.5609 15.1192 14.1238L13.6604 13.3074C12.5959 14.1911 12.4403 14.2776 11.1253 14.7276V16.3599C10.3805 16.4831 9.61952 16.4831 8.87472 16.3599V14.7276C7.55989 14.2776 7.40373 14.1908 6.33959 13.3074L4.88081 14.1238C4.39753 13.5609 4.01656 12.9225 3.75421 12.2358L5.21265 11.42C4.9587 10.0878 4.95856 9.91293 5.21265 8.58006L3.75421 7.76428C4.01548 7.07948 4.39691 6.44012 4.88081 5.87625L6.33959 6.69267C7.40413 5.80889 7.55976 5.72241 8.87472 5.27238V3.64018C9.61952 3.51696 10.3805 3.51696 11.1253 3.64018V5.27241C12.4401 5.72241 12.5963 5.80925 13.6604 6.6927L15.1192 5.87628C15.6025 6.43915 15.9834 7.0776 16.2458 7.76431L14.7873 8.58009C15.0413 9.91235 15.0414 10.0871 14.7873 11.42ZM10 6.90325C8.23814 6.90325 6.80479 8.29244 6.80479 10C6.80479 11.7076 8.23814 13.0968 10 13.0968C11.7619 13.0968 13.1952 11.7076 13.1952 10C13.1952 8.29244 11.7619 6.90325 10 6.90325ZM10 11.5484C9.11905 11.5484 8.4024 10.8538 8.4024 10C8.4024 9.14625 9.11905 8.45164 10 8.45164C10.8809 8.45164 11.5976 9.14625 11.5976 10C11.5976 10.8538 10.8809 11.5484 10 11.5484Z"/>'
  };
  /* «Deuda» lleva a su vista inicial, sin tipo de deuda elegido. */
  $("nav-lista").innerHTML = MENU.map(function(m){
    var etiqueta = m.href ? 'a' : 'button';
    return '<' + etiqueta + ' class="nav-item"' + (m.href ? ' href="' + m.href + '"' : ' type="button"') + (m.activo ? ' aria-current="page"' : '') + '>' +
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">' + ICONOS[m.i] + '</svg><span>' + m.t + '</span></' + etiqueta + '>';
  }).join("");
  $("btn-nav").addEventListener("click", function(){
    var abierto = $("app").getAttribute("data-nav") === "on";
    $("app").setAttribute("data-nav", abierto ? "off" : "on");
    this.setAttribute("aria-label", abierto ? "Expandir menú" : "Contraer menú");
  });

  /* Íconos del SmallMessage del DS (exportados de Figma): círculo blanco y glifo en el color del propósito. */
  var SVG_INFO = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#fff"/><path fill="currentColor" d="M12 3.29032C16.7831 3.29032 20.7097 7.16431 20.7097 12C20.7097 16.8101 16.8141 20.7097 12 20.7097C7.19177 20.7097 3.29032 16.816 3.29032 12C3.29032 7.19343 7.18556 3.29032 12 3.29032ZM12 2C6.47754 2 2 6.47915 2 12C2 17.5241 6.47754 22 12 22C17.5225 22 22 17.5241 22 12C22 6.47915 17.5225 2 12 2ZM10.5484 15.871H11.0323V11.0323H10.5484C10.2812 11.0323 10.0645 10.8156 10.0645 10.5484V10.2258C10.0645 9.95859 10.2812 9.74194 10.5484 9.74194H12.4839C12.7511 9.74194 12.9677 9.95859 12.9677 10.2258V15.871H13.4516C13.7188 15.871 13.9355 16.0876 13.9355 16.3548V16.6774C13.9355 16.9446 13.7188 17.1613 13.4516 17.1613H10.5484C10.2812 17.1613 10.0645 16.9446 10.0645 16.6774V16.3548C10.0645 16.0876 10.2812 15.871 10.5484 15.871ZM12 6.19355C11.2874 6.19355 10.7097 6.77125 10.7097 7.48387C10.7097 8.19649 11.2874 8.77419 12 8.77419C12.7126 8.77419 13.2903 8.19649 13.2903 7.48387C13.2903 6.77125 12.7126 6.19355 12 6.19355Z"/></svg>';
  var SVG_ALERTA = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#fff"/><path fill="currentColor" d="M12 3.29032C16.7831 3.29032 20.7097 7.16431 20.7097 12C20.7097 16.8101 16.8141 20.7097 12 20.7097C7.19177 20.7097 3.29032 16.816 3.29032 12C3.29032 7.19343 7.18556 3.29032 12 3.29032ZM12 2C6.47754 2 2 6.47915 2 12C2 17.5241 6.47754 22 12 22C17.5225 22 22 17.5241 22 12C22 6.47915 17.5225 2 12 2ZM11.5367 6.83871H12.4633C12.7384 6.83871 12.9582 7.06782 12.9467 7.34274L12.6645 14.1169C12.6537 14.3761 12.4404 14.5806 12.181 14.5806H11.819C11.5596 14.5806 11.3463 14.3761 11.3355 14.1169L11.0532 7.34274C11.0418 7.06782 11.2616 6.83871 11.5367 6.83871ZM12 15.3871C11.3765 15.3871 10.871 15.8926 10.871 16.5161C10.871 17.1397 11.3765 17.6452 12 17.6452C12.6235 17.6452 13.129 17.1397 13.129 16.5161C13.129 15.8926 12.6235 15.3871 12 15.3871Z"/></svg>';
  var SVG_AMPOLLETA = '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18.5 30.5a9.5 9.5 0 1 1 11 0v3.5h-11z"/><path d="M19.5 38.5h9"/><path d="M21 42h6"/><path d="M24 4v3"/><path d="M38 12.5 36 14"/><path d="M10 12.5 12 14"/><path d="M43 26h-3"/><path d="M8 26H5"/></svg>';
  var SVG_AYUDA = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><circle cx="8" cy="8" r="6.6"/><path d="M8 7.2v4" stroke-linecap="round"/><path d="M8 4.9h.01" stroke-linecap="round"/></svg>';
  var SVG_KEBAB = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>';
  /* Flecha del input del DS (exportada de Figma). */
  var SVG_FLECHA = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.3347 6.50013L22.0005 6.16592C21.7792 5.94469 21.4215 5.94469 21.2003 6.16592L12.0026 15.3682L2.80033 6.16592C2.5791 5.94469 2.22136 5.94469 2.00013 6.16592L1.66592 6.50013C1.44469 6.72136 1.44469 7.0791 1.66592 7.30033L11.5978 17.2369C11.8191 17.4582 12.1768 17.4582 12.398 17.2369L22.33 7.30033C22.5559 7.0791 22.5559 6.72136 22.3347 6.50013Z"/></svg>';


  function afiliado(id){ return AFILIADOS.filter(function(a){ return a.id === id; })[0]; }
  function linea(id){ return LINEAS.filter(function(l){ return l.id === id; })[0]; }
  function lineasDe(aid){ return LINEAS.filter(function(l){ return l.a === aid; }); }
  function pagosDe(l, p){ return (l.pagos[p.datos] || []).map(function(x){ return {fecha:x[0] + "/" + p.rec, medio:x[1], monto:x[2]}; }); }
  function pagadoLinea(l, p){ return pagosDe(l, p).reduce(function(s, x){ return s + x.monto; }, 0); }
  function totalAPagar(a){ return a.pactado + (a.comp ? a.comp.monto : 0); }
  function pagadoAfiliado(a, p){ return lineasDe(a.id).reduce(function(s, l){ return s + pagadoLinea(l, p); }, 0); }
  /* Un periodo es un mes: se muestra «Agosto 2026». Las fechas reales (pago,
     cierre) van en dd/mm/aaaa. */
  var MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  function recaudacion(p){ var m = p.rec.split("/"); return MESES[parseInt(m[0], 10) - 1] + " " + m[1]; }

  /* Marca especial: queda asociada al RUT del afiliado. */
  var marcas = {};
  function marcaDe(a){ return marcas[a.rut] || null; }

  /* ── Columnas (Figma: Tabla / Deuda y Tabla / Deuda · pagadores) ─────── */
  var AYUDAS = {
    tipoCot:["D: Dependiente · P: Pensionado", "I: Independiente · V: Voluntario", "Pueden combinarse, por ejemplo DP."],
    total:["Pactado más la compensación.", "La compensación puede ser a favor o en contra."],
    eepc:["EEPC: Entidad Encargada del Pago de Cotizaciones.", "Cuenta solo las que figuran en el contrato."],
    comp:["Monto que otro afiliado compensa sobre esta cotización.", "Puede ser a favor o en contra."],
    tipoPag:["EEPC: figura en el contrato del afiliado.", "NN: pagó sin figurar en el contrato."]
  };
  var COL_AFILIADOS = [
    {k:"afiliado", t:"RUT y nombre\nafiliado", w:212},
    {k:"marca", t:"Marca", w:140},
    {k:"periodo", t:"Periodo de\nremuneración", w:120},
    {k:"tipoCot", t:"Tipo\ncotizante", w:120, ayuda:"tipoCot"},
    {k:"total", t:"Total a\npagar", w:130, ayuda:"total"},
    {k:"pagado", t:"Pagado", w:115},
    {k:"deuda", t:"Deuda", w:115},
    {k:"nEepc", t:"N° de\nEEPC", w:110, ayuda:"eepc"},
    {k:"comp", t:"RUT y nombre\ncompensado", w:220},
    {k:"montoComp", t:"Monto\ncompensación", w:150, ayuda:"comp"},
    {k:"pactado", t:"Pactado", w:115},
    {k:"obs", t:"Observación", w:240},
    {k:"acciones", t:"Acciones", w:100, fijaDer:true}
  ];
  var COL_PAGADORES = [
    {k:"pagador", t:"RUT y nombre\npagador", w:232},
    {k:"afiliado", t:"RUT y nombre\nafiliado", w:200},
    {k:"periodo", t:"Periodo de\nremuneración", w:120},
    {k:"pactado", t:"Pactado", w:130},
    {k:"pagado", t:"Pagado", w:115},
    {k:"deuda", t:"Deuda", w:115},
    {k:"tipoPag", t:"Tipo de\npagador", w:120, ayuda:"tipoPag"},
    {k:"tipoCot", t:"Tipo\ncotizante", w:120, ayuda:"tipoCot"},
    {k:"medio", t:"Medio de\npago", w:130},
    {k:"acciones", t:"Acciones", w:100, fijaDer:true}
  ];

  function filaAfiliado(a, p){
    var total = totalAPagar(a), pagado = pagadoAfiliado(a, p), m = marcaDe(a);
    return {id:a.id, tipoFila:"a", _a:a, _pagado:pagado, _total:total, _deuda:total - pagado,
      afiliado:[a.rut, a.nombre], marca: m ? m.tipo : "Sin marca", periodo:p.rem, tipoCot:a.tipo,
      total:monto(total), pagado:monto(pagado), deuda:monto(total - pagado),
      nEepc:String(lineasDe(a.id).filter(function(l){ return l.tipo === "EEPC"; }).length),
      comp: a.comp ? [a.comp.rut, a.comp.nombre] : "—",
      montoComp: a.comp ? pesos(a.comp.monto) : "—",
      pactado: uf(a.pactado),
      obs: m ? escapar(m.registros[m.registros.length - 1].obs) : "Sin info"};
  }
  /* Una fila por par pagador × afiliado, así pactado − pagado = deuda cuadra
     en cada fila. Si el pagador pagó por más de un canal, Medio de pago dice
     «2 pagos» y Detalle de pago muestra cada uno con su medio. */
  function filaLinea(l, p){
    var a = afiliado(l.a), nn = l.pactado === null, pagos = pagosDe(l, p), pagado = pagadoLinea(l, p);
    return {id:l.id, tipoFila:"l", _l:l, _a:a, _pagado:pagado, _pactado:l.pactado, _deuda: nn ? null : l.pactado - pagado,
      pagador:l.pag, afiliado:[a.rut, a.nombre], periodo:p.rem,
      pactado: nn ? "—" : monto(l.pactado), pagado:monto(pagado), deuda: nn ? "—" : monto(l.pactado - pagado),
      tipoPag:l.tipo, tipoCot:a.tipo, medio: !pagos.length ? "—" : pagos.length === 1 ? pagos[0].medio : pagos.length + " pagos"};
  }

  /* ── Estado ──────────────────────────────────────────────────────────── */
  var estado = {periodo:"", vista:"afiliados", pagina:1, paginas:1, porPagina:10, filtros:{afiliados:{}, pagadores:{}}, filtrados:0};
  function periodoActual(){ return PERIODOS[estado.periodo] || null; }
  function columnas(){ return estado.vista === "pagadores" ? COL_PAGADORES : COL_AFILIADOS; }

  /* ── Filtros: se filtra por lo que muestra cada tabla ────────────────── */
  var CAMPOS = {
    afiliados:[
      /* Filas: RUT y marca · montos · pago y tipo cotizante. Medio de pago no es dato
         de la tabla de afiliados: solo se filtra en Pagadores. */
      {id:"rutAfi", tipo:"texto", label:"RUT afiliado", ph:"Ingresa RUT"},
      {id:"marca", tipo:"combo", label:"Marca", ops:[["Sin marca","Sin marca"],["Especial","Especial"],["Reputacional","Reputacional"]]},
      {id:"desde", tipo:"monto", label:"Deuda desde", ph:"Ingresa monto"},
      {id:"hasta", tipo:"monto", label:"Deuda hasta", ph:"Ingresa monto"},
      {id:"pago", tipo:"combo", label:"Pago", ops:[["sin","Sin pago"],["parcial","Pago parcial"]]},
      {id:"tipoCot", tipo:"combo", label:"Tipo cotizante", ops:[["D","D - Dependiente","Dependiente"],["I","I - Independiente","Independiente"],["P","P - Pensionado","Pensionado"],["V","V - Voluntario","Voluntario"]]}
    ],
    pagadores:[
      /* Mismo orden que Afiliados: RUT · montos · pago y medio · tipo (el hueco queda al final). */
      {id:"rutPag", tipo:"texto", label:"RUT pagador", ph:"Ingresa RUT"},
      {id:"rutAfi", tipo:"texto", label:"RUT afiliado", ph:"Ingresa RUT"},
      {id:"desde", tipo:"monto", label:"Deuda desde", ph:"Ingresa monto"},
      {id:"hasta", tipo:"monto", label:"Deuda hasta", ph:"Ingresa monto"},
      {id:"pago", tipo:"combo", label:"Pago", ops:[["sin","Sin pago"],["parcial","Pago parcial"]]},
      {id:"medio", tipo:"combo", label:"Medio de pago", ops:[["CAJA","CAJA"],["PREVIRED","PREVIRED"],["SV","SV"],["Seguro de cesantía","Seguro de cesantía"],["TGR","TGR"]]},
      {id:"tipoPag", tipo:"combo", label:"Tipo de pagador", ops:[["EEPC","EEPC"],["NN","NN"]]}
    ]
  };
  function filtrosActivos(){ return estado.filtros[estado.vista]; }
  function hayFiltros(){ return Object.keys(filtrosActivos()).length > 0; }
  function incluye(txt, buscado){ return txt.toLowerCase().replace(/\./g, "").indexOf(String(buscado).toLowerCase().replace(/\./g, "").trim()) !== -1; }

  function pasaAfiliado(f, filtros){
    return Object.keys(filtros).every(function(k){
      var v = filtros[k];
      if (k === "rutAfi") return incluye(f._a.rut, v);
      if (k === "marca") return f.marca === v;
      if (k === "tipoCot") return f.tipoCot.indexOf(v) !== -1;
      if (k === "pago") return v === "sin" ? f._pagado === 0 : f._pagado > 0 && f._pagado < f._total;
      if (k === "desde") return f._deuda >= numero(v);
      if (k === "hasta") return f._deuda <= numero(v);
      return true;
    });
  }
  /* Las líneas NN no tienen pactado ni deuda: no entran en Pago ni en los montos. */
  function pasaLinea(f, filtros){
    var nn = f._deuda === null;
    return Object.keys(filtros).every(function(k){
      var v = filtros[k];
      if (k === "rutPag") return incluye(f._l.pag[0], v);
      if (k === "rutAfi") return incluye(f._a.rut, v);
      if (k === "tipoPag") return f.tipoPag === v;
      /* La línea entra si alguno de sus pagos del periodo usó ese medio. */
      if (k === "medio") return pagosDe(f._l, periodoActual()).some(function(x){ return x.medio === v; });
      if (k === "pago") return !nn && (v === "sin" ? f._pagado === 0 : f._pagado > 0 && f._pagado < f._pactado);
      if (k === "desde") return !nn && f._deuda >= numero(v);
      if (k === "hasta") return !nn && f._deuda <= numero(v);
      return true;
    });
  }

  /* ── Tabla ───────────────────────────────────────────────────────────── */
  /* Los registros salen de los totales: afiliados deudores en Afiliados; en
     Pagadores, las líneas se estiman con la proporción de la muestra. */
  function registros(p){
    var n = p.tot.afiliados;
    return estado.vista === "pagadores" ? Math.round(n * BASE_L / BASE_A) : n;
  }
  function paginasDe(n, por){ return Math.max(1, Math.ceil(n / por)); }
  function base(p){
    return estado.vista === "pagadores"
      ? LINEAS.map(function(l){ return filaLinea(l, p); })
      : AFILIADOS.map(function(a){ return filaAfiliado(a, p); });
  }
  /* Cada página muestra los registros de la muestra una sola vez, como el
     Figma; al avanzar, el orden rota para que se note el cambio de página. */
  function filasDePagina(lista, pagina, por){
    var out = [], n = Math.min(por, lista.length);
    var desde = lista.length > n ? ((pagina - 1) * n) % lista.length : (pagina - 1) % lista.length;
    for (var i = 0; i < n; i++) out.push(lista[(desde + i) % lista.length]);
    return out;
  }
  /* Conteo del subconjunto filtrado. */
  function contar(p, lista, coinciden, f){
    if (!coinciden.length) return 0;
    var claves = Object.keys(f);
    /* Cada pagador NN tiene una sola línea: filtrar por tipo da el conteo de la card. */
    if (estado.vista === "pagadores" && claves.length === 1 && claves[0] === "tipoPag") return f.tipoPag === "NN" ? p.tot.nn : registros(p) - p.tot.nn;
    if (f.rutAfi) return coinciden.length;
    if (estado.vista === "pagadores" && f.rutPag) {
      var rut = coinciden[0]._l.pag[0], delPagador = lista.filter(function(x){ return x._l.pag[0] === rut; }).length;
      return Math.max(coinciden.length, Math.round(coinciden[0]._l.nAfil * coinciden.length / delPagador));
    }
    /* Solo los registros del diseño escalan al total; el relleno cuenta uno a uno. */
    if (estado.vista === "afiliados") {
      var peso = coinciden.reduce(function(t, x){ return t + x._a.peso; }, 0);
      return Math.max(coinciden.length, Math.round(registros(p) * peso));
    }
    var delDiseno = coinciden.filter(function(x){ return !x._l.extra; }).length;
    var filasDiseno = lista.filter(function(x){ return !x._l.extra; }).length;
    return delDiseno ? Math.max(coinciden.length, Math.round(registros(p) * delDiseno / filasDiseno)) : coinciden.length;
  }

  function pintarCabecera(){
    var cols = columnas();
    $("thead-fila").innerHTML = cols.map(function(c){
      var ayuda = c.ayuda ? '<button class="ayuda" type="button" data-ayuda="' + c.ayuda + '" aria-label="Qué significa ' + c.t.replace("\n", " ") + '">' + SVG_AYUDA + '</button>' : "";
      return '<th scope="col" style="width:' + c.w + 'px"' + (c.fijaDer ? ' class="fija-der"' : "") + '>' +
        (c.fijaDer ? c.t : '<span class="cab"><span>' + c.t + '</span>' + ayuda + '</span>') + '</th>';
    }).join("");
    ajustarAnchos();
  }
  /* La tabla ocupa el ancho disponible: si sobra espacio, las columnas crecen
     en proporción y Acciones se queda en su ancho; si falta, hay scroll
     horizontal con la primera columna y Acciones fijas. */
  function ajustarAnchos(){
    var cols = columnas(), ths = $("thead-fila").children;
    if (ths.length !== cols.length) return;
    var total = cols.reduce(function(s, c){ return s + c.w; }, 0);
    var fijo = cols.reduce(function(s, c){ return s + (c.fijaDer ? c.w : 0); }, 0);
    var disponible = $("tabla").parentNode.clientWidth;
    var k = disponible > total ? (disponible - fijo) / (total - fijo) : 1;
    var anchos = cols.map(function(c){ return c.fijaDer ? c.w : Math.floor(c.w * k); });
    var suma = anchos.reduce(function(s, w){ return s + w; }, 0);
    if (k > 1) { anchos[0] += disponible - suma; suma = disponible; }
    anchos.forEach(function(w, i){ ths[i].style.width = w + "px"; });
    $("tabla").style.width = suma + "px";
    sombras();
  }
  function sombras(){
    var s = $("tabla").parentNode;
    s.setAttribute("data-izq", s.scrollLeft > 0 ? "1" : "0");
    s.setAttribute("data-der", s.scrollLeft + s.clientWidth < s.scrollWidth - 1 ? "1" : "0");
  }

  function celda(col, fila){
    var v = fila[col.k];
    if (col.k === "acciones") {
      var quien = fila.tipoFila === "a" ? fila._a.nombre : fila._l.pag[1] + " y " + fila._a.nombre;
      return '<td class="fija-der"><button class="kebab" type="button" aria-haspopup="menu" aria-expanded="false" data-fila="' + fila.tipoFila + ':' + fila.id + '" aria-label="Acciones de ' + quien + '">' + SVG_KEBAB + '</button></td>';
    }
    if (Array.isArray(v)) return '<td><span class="val">' + v[0] + '</span><span class="sub">' + v[1] + '</span></td>';
    return '<td><span class="val">' + v + '</span></td>';
  }

  function filasSkeleton(por){
    var celdas = columnas().map(function(c){
      return c.k === "acciones" ? '<td class="fija-der"></td>' : '<td><span class="skel" style="width:70%"></span></td>';
    }).join("");
    var out = ""; for (var i = 0; i < por; i++) out += '<tr>' + celdas + '</tr>'; return out;
  }

  function legible(c, v){
    if (c.tipo === "monto") return pesos(numero(v));
    if (c.tipo === "combo") { var o = c.ops.filter(function(x){ return x[0] === v; })[0]; return o ? (o[2] || o[1]) : v; }
    return v;
  }
  function pintarChips(){
    var filtros = filtrosActivos(), activos = CAMPOS[estado.vista].filter(function(c){ return filtros[c.id]; });
    if (!activos.length) { mostrar("filtros-aplicados", false); return; }
    $("etiqueta-filtros").textContent = estado.filtrados === 1 ? "1 registro filtrado por:"
      : estado.filtrados > 0 ? miles(estado.filtrados) + " registros filtrados por:" : "Resultados filtrados por:";
    $("chips").innerHTML = activos.map(function(c){
      var texto = c.label + ": " + escapar(legible(c, filtros[c.id]));
      return '<span class="chip-filtro">' + texto + '<button type="button" data-quitar="' + c.id + '" aria-label="Quitar filtro ' + texto + '">✕</button></span>';
    }).join("");
    mostrar("filtros-aplicados", true);
  }

  function pintarFilas(){
    var p = periodoActual(); if (!p) return;
    var lista = base(p), filas, paginas;
    if (hayFiltros()) {
      var f = filtrosActivos(), prueba = estado.vista === "pagadores" ? pasaLinea : pasaAfiliado;
      var coinciden = lista.filter(function(x){ return prueba(x, f); });
      estado.filtrados = contar(p, lista, coinciden, f);
      paginas = paginasDe(estado.filtrados, estado.porPagina);
      filas = coinciden.length ? filasDePagina(coinciden, estado.pagina, Math.min(estado.porPagina, estado.filtrados)) : [];
    } else {
      estado.filtrados = 0;
      paginas = paginasDe(registros(p), estado.porPagina);
      filas = filasDePagina(lista, estado.pagina, estado.porPagina);
    }
    estado.paginas = paginas;
    pintarChips();
    if (!filas.length) { mostrar("tabla-datos", false); mostrar("sin-resultados", true); return; }
    mostrar("sin-resultados", false); mostrar("tabla-datos", true); ajustarAnchos();
    var cols = columnas();
    $("tbody").innerHTML = filas.map(function(f){ return '<tr>' + cols.map(function(c){ return celda(c, f); }).join("") + '</tr>'; }).join("");
    marcarTruncados();
    $("conteo").textContent = estado.pagina + " de " + paginas;
    $("pg-prev").disabled = estado.pagina <= 1;
    $("pg-next").disabled = estado.pagina >= paginas;
  }

  $("pg-prev").addEventListener("click", function(){ if (estado.pagina > 1) { estado.pagina--; pintarFilas(); } });
  $("pg-next").addEventListener("click", function(){ if (estado.pagina < estado.paginas) { estado.pagina++; pintarFilas(); } });
  $("por-pagina").addEventListener("change", function(){ estado.porPagina = parseInt(this.value, 10); estado.pagina = 1; pintarFilas(); });

  /* Un valor cortado se lee completo con el tooltip nativo; la pista oscura es del ⓘ. */
  function marcarTruncados(){
    Array.prototype.forEach.call($("tbody").querySelectorAll(".val, .sub"), function(el){
      if (el.scrollWidth > el.clientWidth) el.title = el.textContent; else el.removeAttribute("title");
    });
  }

  var pista = document.createElement("div");
  pista.className = "pista"; pista.setAttribute("role", "tooltip"); pista.hidden = true;
  document.body.appendChild(pista);
  function esconderPista(){ pista.setAttribute("data-visible", "0"); pista.hidden = true; }
  function colocarPista(ancla, lineas){
    pista.innerHTML = lineas.map(function(l){ return "<p>" + l + "</p>"; }).join("");
    pista.hidden = false; pista.setAttribute("data-lado", "izquierda");
    var caja = ancla.getBoundingClientRect(), ancho = pista.offsetWidth, alto = pista.offsetHeight;
    var izq = caja.right + 10, arriba = caja.top + caja.height / 2 - alto / 2;
    if (izq + ancho > window.innerWidth - 8) { izq = caja.left - ancho - 10; pista.setAttribute("data-lado", "derecha"); }
    pista.style.left = Math.max(8, izq) + "px";
    pista.style.top = Math.min(Math.max(8, arriba), window.innerHeight - alto - 8) + "px";
    pista.setAttribute("data-visible", "1");
  }
  $("thead-fila").addEventListener("mouseover", function(e){ var b = e.target.closest("[data-ayuda]"); if (b) colocarPista(b, AYUDAS[b.getAttribute("data-ayuda")]); else esconderPista(); });
  $("thead-fila").addEventListener("mouseleave", esconderPista);
  $("thead-fila").addEventListener("focusin", function(e){ var b = e.target.closest("[data-ayuda]"); if (b) colocarPista(b, AYUDAS[b.getAttribute("data-ayuda")]); });
  $("thead-fila").addEventListener("focusout", esconderPista);
  window.addEventListener("scroll", function(e){ esconderPista(); if (!$("menu-fila").contains(e.target)) cerrarMenuFila(); }, true);
  window.addEventListener("resize", function(){ cerrarMenuFila(); });
  /* El ancho cambia con la ventana y al plegar el menú lateral. */
  $("tabla").parentNode.addEventListener("scroll", sombras, {passive:true});
  if (window.ResizeObserver) new ResizeObserver(function(){ ajustarAnchos(); }).observe($("tabla").parentNode);
  else window.addEventListener("resize", ajustarAnchos);

  /* ── Pantalla ────────────────────────────────────────────────────────── */
  function mostrar(id, v){ $(id).hidden = !v; }
  function animar(el){ if (!el) return; el.classList.remove("entra"); void el.offsetWidth; el.classList.add("entra"); }

  function bloque(titulo, texto, arte){
    $("bloque-arte").innerHTML = arte === "rueda" ? '<div class="rueda-grande"></div>' : '<div class="arte">' + SVG_AMPOLLETA + '</div>';
    $("bloque-titulo").textContent = titulo; $("bloque-texto").textContent = texto;
    mostrar("bloque", true); mostrar("totales", false); mostrar("vistas", false); mostrar("tabla-card", false);
  }
  function pintarAviso(a){
    if (!a) { mostrar("aviso", false); return; }
    $("aviso").setAttribute("data-tono", a.tono);
    $("aviso-icono").innerHTML = a.tono === "cerrado" ? SVG_INFO : SVG_ALERTA;
    $("aviso-texto").textContent = a.texto;
    $("aviso-accion").hidden = !a.accion;
    mostrar("aviso", true);
  }
  function pintarPeriodo(p){
    if (!p) { $("periodo-txt").textContent = "No se ha seleccionado periodo de recaudación"; return; }
    $("periodo-txt").innerHTML = '<span class="linea">Periodo de recaudación <b>' + p.etiqueta + '</b></span><span class="linea">Remuneraciones de <b>' + p.rem + '</b></span>';
  }
  function pintarTotales(p){
    var t = p.tot;
    $("t-deuda").textContent = pesos(t.deuda); $("t-deuda-uf").textContent = uf(t.deuda);
    $("t-afiliados").textContent = miles(t.afiliados); $("t-total").textContent = pesos(t.total); $("t-pagado").textContent = pesos(t.pagado);
    $("t-eepc").textContent = pesos(t.deudaEepc); $("t-eepc-uf").textContent = uf(t.deudaEepc);
    $("t-pagadores").textContent = miles(t.pagadores); $("t-pag-eepc").textContent = miles(t.eepc); $("t-pag-nn").textContent = miles(t.nn);
  }
  function render(animado){
    var p = periodoActual();
    if (!p) { pintarAviso(null); pintarPeriodo(null); bloque("Aún no hay un periodo seleccionado.", "Elige un periodo para ver la deuda del mes."); return; }
    pintarAviso(p.aviso); pintarPeriodo(p);
    mostrar("bloque", false);
    $("btn-exportar").disabled = false;
    pintarTotales(p); mostrar("totales", true); mostrar("vistas", true);
    pintarCabecera(); estado.pagina = 1; pintarFilas(); mostrar("tabla-card", true);
    if (animado) animar($("aviso"));
  }
  /* Periodo ya consolidado: se consulta, y la estructura llega con skeleton. */
  function esqueleto(){
    mostrar("bloque", false); mostrar("vistas", true); pintarCabecera();
    mostrar("filtros-aplicados", false); mostrar("sin-resultados", false); mostrar("tabla-datos", true);
    /* Medidas del skeleton de Figma: monto 190×20, UF 120×16 y métricas 96×16. */
    var MEDIDAS = {"t-deuda":[190,20], "t-eepc":[190,20], "t-deuda-uf":[120,16], "t-eepc-uf":[120,16]};
    ["t-deuda","t-deuda-uf","t-afiliados","t-total","t-pagado","t-eepc","t-eepc-uf","t-pagadores","t-pag-eepc","t-pag-nn"].forEach(function(id){
      var m = MEDIDAS[id] || [96, 16];
      $(id).innerHTML = '<span class="skel" style="width:' + m[0] + 'px; height:' + m[1] + 'px"></span>';
    });
    mostrar("totales", true);
    esqueletoTabla();
    $("btn-exportar").disabled = true;
    mostrar("tabla-card", true);
  }
  function esqueletoTabla(){
    $("tbody").innerHTML = filasSkeleton(estado.porPagina);
    $("conteo").innerHTML = '<span class="skel" style="width:64px; display:inline-block"></span>';
    $("pg-prev").disabled = true; $("pg-next").disabled = true;
  }

  function cargando(btn, activo){
    if (activo) {
      btn.setAttribute("data-cargando", "1"); btn.setAttribute("aria-busy", "true");
      if (!btn.querySelector(".rueda")) { var r = document.createElement("span"); r.className = "rueda"; btn.appendChild(r); }
    } else {
      btn.removeAttribute("data-cargando"); btn.removeAttribute("aria-busy");
      var r2 = btn.querySelector(".rueda"); if (r2) r2.parentNode.removeChild(r2);
    }
  }

  /* ── Selector de periodo ─────────────────────────────────────────────── */
  $("lista-periodo").innerHTML = CFG.periodos.map(function(k){
    var opcion = (CFG.opciones && CFG.opciones[k]) || PERIODOS[k].opcion;
    return '<li role="option" data-valor="' + k + '" data-mostrar="' + PERIODOS[k].etiqueta + '" aria-selected="false">' + opcion + '</li>';
  }).join("");
  /* Vuelve al estado inicial: el caso «error al generar» deja la pantalla sin periodo. */
  function reiniciarPeriodo(){
    var combo = document.querySelector('[data-combo="periodo"]');
    $("periodo").value = "";
    combo.querySelector(".combo-valor").textContent = "Selecciona un periodo";
    combo.setAttribute("data-lleno", "0");
    Array.prototype.forEach.call(combo.querySelectorAll('[role="option"]'), function(o){ o.setAttribute("aria-selected", "false"); });
  }

  $("btn-seleccionar").addEventListener("click", function(){
    var valor = $("periodo").value;
    if (!valor) { $("t-periodo").focus(); return; }
    var btn = this;
    estado.periodo = valor; estado.pagina = 1; estado.vista = "afiliados";
    estado.filtros = {afiliados:{}, pagadores:{}};
    pintarVistas(); cerrarMenuExportar(); cerrarMenuFila();
    var p = periodoActual(), consulta = p.carga === "skeleton";
    /* Un mes cerrado ya tiene su estado: el aviso aparece de inmediato y solo
       los totales y la tabla cargan con skeleton. Al generar, el aviso espera. */
    if (!consulta) cargando(btn, true);
    pintarAviso(consulta ? p.aviso : null); pintarPeriodo(p);
    if (consulta) esqueleto();
    else bloque("Generando deuda del periodo", "Puede tardar unos minutos; mantén esta pantalla abierta.", "rueda");
    window.setTimeout(function(){ cargando(btn, false); generado(); }, consulta ? 1200 : 1800);
  });
  /* Qué se ve cuando termina de generar. El happy path pinta la deuda; los
     otros dos casos terminan sin deuda o sin poder generarla. */
  function generado(){
    if (CFG.generar === "vacio") {
      pintarAviso(null); pintarPeriodo(periodoActual());
      bloque("Sin deuda en el periodo", "Todas las cotizaciones del periodo están pagadas. Si llega una impaga, aparecerá aquí.");
      return;
    }
    if (CFG.generar === "error") {
      estado.periodo = ""; reiniciarPeriodo(); render(); abrirError();
      return;
    }
    render(true);
  }

  /* ── Pestañas: al cambiar, la tabla entra con skeleton ───────────────── */
  function pintarVistas(){
    Array.prototype.forEach.call(document.querySelectorAll("#vistas .vista"), function(t){
      var activa = t.getAttribute("data-vista") === estado.vista;
      t.setAttribute("aria-selected", String(activa)); t.tabIndex = activa ? 0 : -1;
      if (activa) $("tabla-card").setAttribute("aria-labelledby", t.id);
    });
    $("op-vista").textContent = estado.vista === "pagadores" ? "Deuda pagadores" : "Deuda afiliados";
  }
  var relojVista = null;
  function cambiarVista(v){
    if (v === estado.vista) return;
    estado.vista = v; estado.pagina = 1;
    cerrarMenuExportar(); cerrarMenuFila(); esconderPista(); pintarVistas(); pintarCabecera();
    mostrar("filtros-aplicados", false); mostrar("sin-resultados", false); mostrar("tabla-datos", true);
    esqueletoTabla();
    window.clearTimeout(relojVista);
    relojVista = window.setTimeout(pintarFilas, 700);
  }
  $("vistas").addEventListener("click", function(e){ var t = e.target.closest(".vista"); if (t) cambiarVista(t.getAttribute("data-vista")); });
  $("vistas").addEventListener("keydown", function(e){
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault(); var otra = estado.vista === "afiliados" ? "pagadores" : "afiliados";
    cambiarVista(otra); $("tab-" + otra).focus();
  });

  /* ── Exportar: consolidada y la de la pestaña activa, con los filtros ── */
  var relojAviso = null;
  var SVG_OK = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#fff"/><path fill="currentColor" d="M12 2C6.47714 2 2 6.47714 2 12C2 17.5229 6.47714 22 12 22C17.5229 22 22 17.5229 22 12C22 6.47714 17.5229 2 12 2ZM12 20.7097C7.21516 20.7097 3.29032 16.8365 3.29032 12C3.29032 7.2152 7.16351 3.29032 12 3.29032C16.7848 3.29032 20.7097 7.16351 20.7097 12C20.7097 16.7848 16.8365 20.7097 12 20.7097ZM17.7109 9.62254L10.4335 16.8416C10.2437 17.0298 9.93738 17.0285 9.74919 16.8388L6.28637 13.348C6.09819 13.1583 6.0994 12.8519 6.28911 12.6637L6.63266 12.323C6.82238 12.1348 7.12875 12.136 7.31694 12.3257L10.0982 15.1295L16.6886 8.59198C16.8783 8.40379 17.1847 8.405 17.3729 8.59472L17.7136 8.93827C17.9019 9.12798 17.9006 9.43435 17.7109 9.62254Z"/></svg>';
  var SVG_FALLA = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#fff"/><path fill="currentColor" d="M12 2C6.47581 2 2 6.47581 2 12C2 17.5242 6.47581 22 12 22C17.5242 22 22 17.5242 22 12C22 6.47581 17.5242 2 12 2ZM12 20.7097C7.21371 20.7097 3.29032 16.8347 3.29032 12C3.29032 7.21371 7.16532 3.29032 12 3.29032C16.7863 3.29032 20.7097 7.16532 20.7097 12C20.7097 16.7863 16.8347 20.7097 12 20.7097ZM15.8226 9.20564L13.0282 12L15.8226 14.7944C16.0121 14.9839 16.0121 15.2903 15.8226 15.4798L15.4798 15.8226C15.2903 16.0121 14.9839 16.0121 14.7944 15.8226L12 13.0282L9.20564 15.8226C9.01613 16.0121 8.70968 16.0121 8.52016 15.8226L8.17742 15.4798C7.9879 15.2903 7.9879 14.9839 8.17742 14.7944L10.9718 12L8.17742 9.20564C7.9879 9.01613 7.9879 8.70968 8.17742 8.52016L8.52016 8.17742C8.70968 7.9879 9.01613 7.9879 9.20564 8.17742L12 10.9718L14.7944 8.17742C14.9839 7.9879 15.2903 7.9879 15.4798 8.17742L15.8226 8.52016C16.0081 8.70968 16.0081 9.01613 15.8226 9.20564Z"/></svg>';
  /* El aviso de error comparte lugar, entrada y duración con el de éxito. */
  function aviso(texto, tono){
    var s = $("snackbar"), falla = tono === "error";
    s.setAttribute("data-tono", falla ? "error" : "exito");
    s.setAttribute("role", falla ? "alert" : "status");
    s.querySelector(".icono").innerHTML = falla ? SVG_FALLA : SVG_OK;
    $("snackbar-texto").textContent = texto; s.hidden = false;
    s.classList.remove("sube"); void s.offsetWidth; s.classList.add("sube");
    window.clearTimeout(relojAviso); relojAviso = window.setTimeout(function(){ s.hidden = true; }, 5000);
  }
  function abrirMenuExportar(){ cerrarMenuFila(); mostrar("menu-exportar", true); $("btn-exportar").setAttribute("aria-expanded", "true"); $("op-consolidada").focus(); }
  function cerrarMenuExportar(foco){
    if ($("menu-exportar").hidden) return;
    mostrar("menu-exportar", false); $("btn-exportar").setAttribute("aria-expanded", "false");
    if (foco) $("btn-exportar").focus();
  }
  $("btn-exportar").addEventListener("click", function(){ if ($("menu-exportar").hidden) abrirMenuExportar(); else cerrarMenuExportar(); });
  function descargar(){
    var btn = $("btn-exportar"), falla = CFG.exportar === "error";
    cerrarMenuExportar(); btn.focus(); cargando(btn, true);
    window.setTimeout(function(){
      cargando(btn, false);
      if (falla) aviso("No pudimos generar el archivo. Vuelve a intentarlo.", "error");
      else aviso("La deuda se descargó correctamente");
    }, 1800);
  }
  $("op-consolidada").addEventListener("click", descargar);
  $("op-vista").addEventListener("click", descargar);
  function navegarMenu(menu, e, cerrar){
    var ops = Array.prototype.slice.call(menu.querySelectorAll('[role="menuitem"]'));
    var i = ops.indexOf(document.activeElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); ops[(i + (e.key === "ArrowDown" ? 1 : ops.length - 1)) % ops.length].focus(); }
    else if (e.key === "Tab") cerrar();
  }
  $("menu-exportar").addEventListener("keydown", function(e){ navegarMenu(this, e, function(){ cerrarMenuExportar(); }); });

  /* ── Menú ⋮ de la fila ───────────────────────────────────────────────── */
  var disparador = null, filaMenu = null;
  function abrirMenuFila(boton){
    cerrarMenuFila(); cerrarMenuExportar();
    var partes = boton.getAttribute("data-fila").split(":");
    filaMenu = {tipo:partes[0], id:partes[1]};
    var ops;
    if (filaMenu.tipo === "a") {
      /* La marca se ve en su columna, pero no se agrega ni se edita desde aquí. */
      ops = [["pagos","Ver pagos asociados"],["eepc","Ver EEPC relacionadas"]];
    } else {
      /* Un pagador NN no figura en ningún contrato: no tiene cotizaciones ni deuda que detallar. */
      ops = linea(filaMenu.id).tipo === "NN" ? [["detallePago","Detalle de pago"]]
        : [["detallePago","Detalle de pago"],["cotizaciones","Detalle de cotizaciones"]];
    }
    var menu = $("menu-fila");
    menu.innerHTML = ops.map(function(o){ return '<li role="none"><button type="button" role="menuitem" data-accion="' + o[0] + '">' + o[1] + '</button></li>'; }).join("");
    menu.setAttribute("aria-label", boton.getAttribute("aria-label"));
    menu.hidden = false;
    var caja = boton.getBoundingClientRect(), alto = menu.offsetHeight;
    var arriba = caja.bottom + 4;
    if (arriba + alto > window.innerHeight - 8) arriba = caja.top - alto - 4;
    menu.style.top = arriba + "px";
    menu.style.left = Math.max(8, caja.right + 16 - 232) + "px";
    boton.setAttribute("aria-expanded", "true");
    disparador = boton;
    menu.querySelector("button").focus();
  }
  function cerrarMenuFila(foco){
    if ($("menu-fila").hidden) return;
    $("menu-fila").hidden = true;
    if (disparador) { disparador.setAttribute("aria-expanded", "false"); if (foco) disparador.focus(); }
  }
  $("tbody").addEventListener("click", function(e){
    var b = e.target.closest(".kebab"); if (!b) return;
    if (!$("menu-fila").hidden && disparador === b) cerrarMenuFila(); else abrirMenuFila(b);
  });
  $("menu-fila").addEventListener("keydown", function(e){ navegarMenu(this, e, function(){ cerrarMenuFila(); }); });
  $("menu-fila").addEventListener("click", function(e){
    var b = e.target.closest("[data-accion]"); if (!b) return;
    var accion = b.getAttribute("data-accion"), id = filaMenu.id;
    cerrarMenuFila();
    if (accion === "pagos") abrirPagos(id);
    if (accion === "eepc") abrirEepc(id);
    if (accion === "marca") abrirMarca(id, "agregar");
    if (accion === "verMarca") abrirMarca(id, "detalle");
    if (accion === "detallePago") abrirDetallePago(id);
    if (accion === "cotizaciones") abrirCotizaciones(id, 1);
  });

  /* ── Modales de consulta: solo ✕ (también Esc y clic fuera) ─────────── */
  function ctx(grupos){
    return grupos.map(function(g){
      return '<div' + (g.crece ? ' class="crece"' : '') + '>' + g.datos.map(function(d){
        return '<dl><dt>' + d[0] + '</dt><dd>' + d[1] + '</dd></dl>';
      }).join("") + '</div>';
    }).join("");
  }
  function paginadorModal(pagina, paginas){
    return '<div class="paginador"><span>Mostrar por página</span>' +
      '<span class="mini"><select aria-label="Filas por página"><option>5</option></select><span class="flecha" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></span></span>' +
      '<span class="conteo">' + pagina + ' de ' + paginas + '</span>' +
      '<button class="pg" type="button" data-pagina="' + (pagina - 1) + '" aria-label="Página anterior"' + (pagina <= 1 ? ' disabled' : '') + '><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>' +
      '<button class="pg" type="button" data-pagina="' + (pagina + 1) + '" aria-label="Página siguiente"' + (pagina >= paginas ? ' disabled' : '') + '><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button></div>';
  }
  /* anchos (opcional): los de las columnas en Figma, para que no dependan del contenido. */
  function tablaModal(cabeceras, filas, pagina, paginas, anchos){
    var cols = anchos ? '<colgroup>' + anchos.map(function(w){ return '<col style="width:' + w + 'px">'; }).join("") + '</colgroup>' : "";
    return '<div class="tabla-m"><table' + (anchos ? ' class="fija"' : '') + '>' + cols + '<thead><tr>' + cabeceras.map(function(c){ return '<th scope="col">' + c + '</th>'; }).join("") + '</tr></thead><tbody>' +
      filas.map(function(f){ return '<tr>' + f.map(function(v){
        return Array.isArray(v) ? '<td><span class="val">' + v[0] + '</span><span class="sub">' + v[1] + '</span></td>' : '<td>' + v + '</td>';
      }).join("") + '</tr>'; }).join("") +
      '</tbody></table>' + paginadorModal(pagina || 1, paginas || 1) + '</div>';
  }
  function vacioModal(titulo, texto){ return '<div class="vacio-m"><b>' + titulo + '</b><span>' + texto + '</span></div>'; }

  var disparadorModal = null, paginarConsulta = null;
  function abrirConsulta(titulo, glosa, grupos, contenido){
    $("c-titulo").textContent = titulo; $("c-glosa").textContent = glosa;
    $("c-ctx").innerHTML = ctx(grupos); $("c-contenido").innerHTML = contenido;
    if ($("scrim-consulta").hidden) { disparadorModal = disparador; mostrar("scrim-consulta", true); $("c-x").focus(); }
  }
  function cerrarConsulta(){ mostrar("scrim-consulta", false); paginarConsulta = null; if (disparadorModal) disparadorModal.focus(); }
  $("c-x").addEventListener("click", cerrarConsulta);
  $("scrim-consulta").addEventListener("mousedown", function(e){ if (e.target === this) cerrarConsulta(); });
  $("c-contenido").addEventListener("click", function(e){
    var b = e.target.closest("[data-pagina]"); if (b && !b.disabled && paginarConsulta) paginarConsulta(parseInt(b.getAttribute("data-pagina"), 10));
  });

  function abrirPagos(aid){
    var a = afiliado(aid), p = periodoActual(), filas = [];
    lineasDe(aid).forEach(function(l){
      pagosDe(l, p).forEach(function(x){ filas.push([l.pag, recaudacion(p), l.tipo, x.medio, monto(x.monto)]); });
    });
    abrirConsulta("Pagos asociados", "Revisa los pagos recibidos para esta cotización.",
      [{crece:true, datos:[["Afiliado", a.nombre + " · " + a.rut]]}, {datos:[["Total a pagar", pesos(totalAPagar(a))]]}, {datos:[["Periodo de remuneración", p.rem]]}],
      filas.length ? tablaModal(["RUT y nombre pagador","Periodo de recaudación","Tipo de pagador","Medio de pago","Total pagado"], filas, 1, 1, [266, 150, 96, 100, 122])
        : vacioModal("Sin pagos", "Este afiliado no registra pagos para esta cotización en el periodo."));
  }
  function abrirEepc(aid){
    var a = afiliado(aid), p = periodoActual();
    var filas = lineasDe(aid).filter(function(l){ return l.tipo === "EEPC"; }).map(function(l){ return [l.pag[0], l.pag[1]]; });
    abrirConsulta("EEPC relacionadas", "Revisa las entidades encargadas de pagar esta cotización.",
      [{crece:true, datos:[["Afiliado", a.nombre + " · " + a.rut]]}, {datos:[["Periodo de remuneración", p.rem]]}],
      tablaModal(["RUT","Razón social"], filas));
  }
  function abrirDetallePago(lid){
    var l = linea(lid), a = afiliado(l.a), p = periodoActual(), pagos = pagosDe(l, p);
    abrirConsulta("Detalle de pago", "Revisa cada pago de esta cotización y su canal.",
      [{crece:true, datos:[["Pagador", l.pag[1] + " · " + l.pag[0]], ["Afiliado", a.nombre + " · " + a.rut]]}, {datos:[["Total pagado", pesos(pagadoLinea(l, p))]]}],
      pagos.length ? tablaModal(["Fecha de pago","Medio de pago","Periodo de recaudación","Monto pagado"],
          pagos.map(function(x){ return [x.fecha, x.medio, recaudacion(p), monto(x.monto)]; }))
        : vacioModal("Sin pagos", "Este pagador no registra pagos para esta cotización en el periodo."));
  }

  /* Detalle de cotizaciones: solo los afiliados por los que ese pagador tiene
     deuda. Pagado y deuda son la parte de ese pagador, no el total del afiliado. */

  function abrirCotizaciones(lid, pagina){
    var l = linea(lid), p = periodoActual(), d = DEUDORES[l.pag[0]] || {total:0, lineas:[]};
    var por = 5, paginas = Math.max(1, Math.ceil(d.total / por)), filas;
    if (pagina === 1) {
      filas = d.lineas.map(linea).filter(function(x){ return x.pactado !== null && x.pactado - pagadoLinea(x, p) > 0; }).map(function(x){
        var a = afiliado(x.a), pagado = pagadoLinea(x, p); return [a.rut, a.nombre, pagado, x.pactado - pagado];
      }).concat(d.extra || []).slice(0, Math.min(por, d.total));
      filas = filas.concat(relleno(numero(l.pag[0]) % 97, Math.max(0, Math.min(por, d.total) - filas.length)));
    } else {
      filas = relleno(numero(l.pag[0]) % 97 + pagina * 5, pagina === paginas ? d.total - por * (paginas - 1) : por);
    }
    filas.sort(function(x, y){ return x[1].localeCompare(y[1], "es"); });
    paginarConsulta = function(n){ abrirCotizaciones(lid, n); };
    abrirConsulta("Detalle de cotizaciones", "Revisa los afiliados por los que este pagador tiene deuda.",
      [{crece:true, datos:[["Pagador", l.pag[1] + " · " + l.pag[0]]]}, {datos:[["Periodo de remuneración", p.rem]]}],
      d.total && filas.length ? tablaModal(["RUT","Nombre","Pagado","Deuda"], filas.map(function(f){ return [f[0], f[1], monto(f[2]), monto(f[3])]; }), pagina, paginas)
        : vacioModal("Sin deuda", "Este pagador no tiene afiliados con deuda en el periodo."));
  }

  /* ── Marca especial: modal con acciones (sin ✕; Esc cancela) ────────── */
  var marcaAbierta = null;
  function registroTexto(r){ return r.tipo + " · " + r.accion + " por " + USUARIO + " el " + r.fecha + " a las " + r.hora + " hrs."; }
  function abrirMarca(aid, modo){
    var a = afiliado(aid), m = marcaDe(a);
    marcaAbierta = {aid:aid, modo:modo};
    var cuerpo = '<div class="ctx"><div class="crece"><dl><dt>Afiliado</dt><dd>' + a.nombre + ' · ' + a.rut + '</dd></dl></div></div>';
    var pie;
    if (modo === "detalle") {
      $("m-titulo").textContent = "Detalle de la marca";
      var regs = m.registros.slice().reverse();
      cuerpo += '<div class="dato"><span class="label">Tipo de marca</span><span class="v">' + m.tipo + '</span></div>' +
        '<div class="dato"><span class="label">' + (regs.length > 1 ? "Observaciones" : "Observación") + '</span><div class="registros">' +
        regs.map(function(r){ return '<div class="registro"><p>' + escapar(r.obs) + '</p><span>' + registroTexto(r) + '</span></div>'; }).join("") + '</div></div>';
      pie = '<button class="btn btn-sec" type="button" data-m="cerrar"><span class="btn-txt">Cerrar</span></button>' +
            '<button class="btn btn-pri" type="button" data-m="editar"><span class="btn-txt">Editar marca</span></button>';
    } else {
      var editar = modo === "editar", tipo = editar ? m.tipo : "", obs = editar ? m.registros[m.registros.length - 1].obs : "";
      marcaAbierta.inicial = tipo + "|" + obs;
      $("m-titulo").textContent = editar ? "Editar marca" : "Agregar marca";
      cuerpo += '<fieldset class="grupo-radio"><legend>Tipo de marca</legend><div class="radios">' +
        ["Especial","Reputacional"].map(function(t){ return '<label class="radio"><input type="radio" name="m-tipo" value="' + t + '"' + (t === tipo ? " checked" : "") + '>' + t + '</label>'; }).join("") +
        '</div></fieldset>' +
        '<div class="campo"><label for="m-obs">Observación</label><textarea id="m-obs" maxlength="120" placeholder="Cuéntanos por qué este caso necesita una marca" aria-describedby="m-ayuda">' + escapar(obs) + '</textarea>' +
        '<div class="ayuda-campo" id="m-ayuda"><span>Obligatoria</span><span id="m-cuenta">' + obs.length + '/120</span></div></div>';
      pie = '<button class="btn btn-sec" type="button" data-m="cancelar"><span class="btn-txt">Cancelar</span></button>' +
            '<button class="btn btn-pri" type="button" data-m="guardar" disabled><span class="btn-txt">' + (editar ? "Guardar cambios" : "Guardar marca") + '</span></button>';
    }
    $("m-cuerpo").innerHTML = cuerpo; $("m-pie").innerHTML = pie;
    if ($("scrim-marca").hidden) { disparadorModal = disparador; mostrar("scrim-marca", true); }
    revisarMarca();
    var foco = $("scrim-marca").querySelector('input[name="m-tipo"]:checked') || $("scrim-marca").querySelector('input[name="m-tipo"]') || $("m-pie").querySelector("button");
    foco.focus();
  }
  function valoresMarca(){
    var t = $("scrim-marca").querySelector('input[name="m-tipo"]:checked');
    return {tipo: t ? t.value : "", obs: $("m-obs") ? $("m-obs").value.trim() : ""};
  }
  function revisarMarca(){
    var g = $("m-pie").querySelector('[data-m="guardar"]'); if (!g) return;
    var v = valoresMarca(), valido = !!(v.tipo && v.obs);
    if (marcaAbierta.modo === "editar") valido = valido && (v.tipo + "|" + v.obs) !== marcaAbierta.inicial;
    g.disabled = !valido;
    $("m-cuenta").textContent = $("m-obs").value.length + "/120";
  }
  $("m-cuerpo").addEventListener("input", revisarMarca);
  $("m-cuerpo").addEventListener("change", revisarMarca);
  function cerrarMarca(){ mostrar("scrim-marca", false); marcaAbierta = null; if (disparadorModal) disparadorModal.focus(); }
  $("m-pie").addEventListener("click", function(e){
    var b = e.target.closest("[data-m]"); if (!b) return;
    var accion = b.getAttribute("data-m");
    if (accion === "cerrar" || accion === "cancelar") { cerrarMarca(); return; }
    if (accion === "editar") { abrirMarca(marcaAbierta.aid, "editar"); return; }
    if (accion === "guardar") {
      var a = afiliado(marcaAbierta.aid), v = valoresMarca(), t = ahora(), editar = marcaAbierta.modo === "editar";
      var m = marcas[a.rut] || {registros:[]};
      m.tipo = v.tipo;
      m.registros.push({tipo:v.tipo, obs:v.obs, accion: editar ? "Editada" : "Registrada", fecha:t.fecha, hora:t.hora});
      marcas[a.rut] = m;
      cerrarMarca(); pintarFilas();
      aviso(editar ? "La marca se actualizó correctamente" : "La marca se guardó correctamente");
    }
  });

  /* ── Modal de filtros: con acciones (sin ✕; Esc cancela) ─────────────── */
  function campoHtml(c, valor){
    if (c.tipo === "vacio") return '<div class="campo-vacio" aria-hidden="true"></div>';
    if (c.tipo === "combo") {
      var o = c.ops.filter(function(x){ return x[0] === valor; })[0];
      return '<div class="campo"><span class="label" id="lb-' + c.id + '">' + c.label + '</span>' +
        '<div class="combo" data-combo="' + c.id + '" data-lleno="' + (valor ? 1 : 0) + '">' +
        '<button class="combo-trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="lb-' + c.id + '"><span class="combo-valor">' + (o ? o[1] : "Selecciona") + '</span><span class="flecha" aria-hidden="true">' + SVG_FLECHA + '</span></button>' +
        '<ul class="combo-panel" role="listbox" aria-labelledby="lb-' + c.id + '" hidden>' +
        c.ops.map(function(x){ return '<li role="option" data-valor="' + x[0] + '" data-mostrar="' + x[1] + '" aria-selected="' + (x[0] === valor) + '">' + x[1] + '</li>'; }).join("") +
        '</ul><input type="hidden" data-campo="' + c.id + '" value="' + (valor || "") + '"></div></div>';
    }
    var v = valor ? (c.tipo === "monto" ? pesos(numero(valor)) : escapar(valor)) : "";
    return '<div class="campo"><label for="f-' + c.id + '">' + c.label + '</label><input type="text" id="f-' + c.id + '" data-campo="' + c.id + '" data-tipo="' + c.tipo + '" placeholder="' + c.ph + '" autocomplete="off" value="' + v + '" data-lleno="' + (v ? 1 : 0) + '"' + (c.tipo === "monto" ? ' inputmode="numeric"' : "") + '></div>';
  }
  function abrirFiltros(){
    var f = filtrosActivos();
    $("f-campos").innerHTML = CAMPOS[estado.vista].map(function(c){ return campoHtml(c, f[c.id]); }).join("");
    revisarFiltros(); mostrar("scrim-filtros", true);
    $("f-campos").querySelector("input[type='text'], .combo-trigger").focus();
  }
  function cerrarFiltros(){ cerrarCombos(null); mostrar("scrim-filtros", false); $("btn-filtros").focus(); }
  function valoresFiltros(){
    var out = {};
    Array.prototype.forEach.call($("f-campos").querySelectorAll("[data-campo]"), function(el){
      var v = el.value.trim(); if (!v) return;
      if (el.getAttribute("data-tipo") === "monto") v = String(numero(v));
      out[el.getAttribute("data-campo")] = v;
    });
    return out;
  }
  function revisarFiltros(){ $("f-filtrar").disabled = !Object.keys(valoresFiltros()).length; }
  $("f-campos").addEventListener("input", function(e){
    var el = e.target;
    if (el.getAttribute("data-tipo") === "monto") el.value = el.value.replace(/\D/g, "") ? pesos(numero(el.value)) : "";
    el.setAttribute("data-lleno", el.value.trim() ? "1" : "0");
    revisarFiltros();
  });
  $("btn-filtros").addEventListener("click", abrirFiltros);
  $("f-cancelar").addEventListener("click", cerrarFiltros);
  $("f-filtrar").addEventListener("click", function(){
    estado.filtros[estado.vista] = valoresFiltros(); cerrarFiltros(); estado.pagina = 1; pintarFilas();
  });
  $("btn-limpiar").addEventListener("click", function(){ estado.filtros[estado.vista] = {}; estado.pagina = 1; pintarFilas(); });
  $("chips").addEventListener("click", function(e){
    var b = e.target.closest("[data-quitar]"); if (!b) return;
    delete filtrosActivos()[b.getAttribute("data-quitar")]; estado.pagina = 1; pintarFilas();
  });

  /* ── Desplegables (periodo y filtros) ────────────────────────────────── */
  function cerrarCombos(salvo){
    Array.prototype.forEach.call(document.querySelectorAll(".combo"), function(c){
      if (c === salvo) return;
      c.setAttribute("data-abierto", "0"); c.querySelector(".combo-panel").hidden = true;
      c.querySelector(".combo-trigger").setAttribute("aria-expanded", "false");
    });
  }
  function elegir(combo, opcion){
    var oculto = combo.querySelector('input[type="hidden"]'), elegido = opcion.getAttribute("data-valor");
    var esPeriodo = combo.getAttribute("data-combo") === "periodo";
    oculto.value = (!esPeriodo && oculto.value === elegido) ? "" : elegido;
    combo.querySelector(".combo-valor").textContent = oculto.value ? (opcion.getAttribute("data-mostrar") || opcion.textContent) : "Selecciona";
    combo.setAttribute("data-lleno", oculto.value ? "1" : "0");
    Array.prototype.forEach.call(combo.querySelectorAll('[role="option"]'), function(o){ o.setAttribute("aria-selected", String(o.getAttribute("data-valor") === oculto.value)); });
    if (!esPeriodo) revisarFiltros();
    cerrarCombos(null); combo.querySelector(".combo-trigger").focus();
  }
  document.addEventListener("click", function(e){
    var trigger = e.target.closest(".combo-trigger");
    if (trigger) {
      var combo = trigger.parentNode, abierto = combo.getAttribute("data-abierto") === "1";
      cerrarCombos(combo); combo.setAttribute("data-abierto", abierto ? "0" : "1");
      var panel = combo.querySelector(".combo-panel");
      panel.hidden = abierto; trigger.setAttribute("aria-expanded", String(!abierto));
      /* Se abre hacia arriba solo si abajo no cabe y arriba sí, bajo la barra fija. */
      combo.removeAttribute("data-arriba");
      if (!abierto) { var r = trigger.getBoundingClientRect(), h = panel.offsetHeight + 12; if (r.bottom + h > window.innerHeight && r.top - h > document.querySelector("header").getBoundingClientRect().bottom) combo.setAttribute("data-arriba", "1"); }
      return;
    }
    var opcion = e.target.closest('.combo-panel [role="option"]');
    if (opcion) { elegir(opcion.closest(".combo"), opcion); return; }
    if (!e.target.closest(".combo")) cerrarCombos(null);
    if (!e.target.closest(".exportar")) cerrarMenuExportar();
    if (!e.target.closest("#menu-fila") && !e.target.closest(".kebab")) cerrarMenuFila();
  });
  document.addEventListener("keydown", function(e){
    var trigger = e.target.closest && e.target.closest(".combo-trigger");
    if (trigger && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault(); var combo = trigger.parentNode, panel = combo.querySelector(".combo-panel");
      if (combo.getAttribute("data-abierto") !== "1") trigger.click();
      var primera = panel.querySelector('[aria-selected="true"]') || panel.querySelector('[role="option"]');
      Array.prototype.forEach.call(panel.querySelectorAll("[data-activo]"), function(x){ x.removeAttribute("data-activo"); });
      if (primera) { primera.setAttribute("data-activo", "1"); panel.tabIndex = -1; panel.focus(); }
      return;
    }
    var panelF = e.target.closest && e.target.closest(".combo-panel");
    if (panelF && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")) {
      e.preventDefault();
      var ops = Array.prototype.slice.call(panelF.querySelectorAll('[role="option"]')), actual = panelF.querySelector('[data-activo="1"]'), i = ops.indexOf(actual);
      if (e.key === "Enter") { if (actual) elegir(panelF.closest(".combo"), actual); return; }
      if (actual) actual.removeAttribute("data-activo");
      i = e.key === "ArrowDown" ? Math.min(i + 1, ops.length - 1) : Math.max(i - 1, 0);
      ops[i].setAttribute("data-activo", "1"); ops[i].scrollIntoView({block:"nearest"});
      return;
    }
    if (e.key !== "Escape") return;
    if (document.querySelector('.combo[data-abierto="1"]')) { cerrarCombos(null); return; }
    if (!$("menu-fila").hidden) { cerrarMenuFila(true); return; }
    if (!$("menu-exportar").hidden) { cerrarMenuExportar(true); return; }
    if (!$("scrim-consulta").hidden) { cerrarConsulta(); return; }
    if (!$("scrim-marca").hidden) { cerrarMarca(); return; }
    if (!$("scrim-filtros").hidden) { cerrarFiltros(); return; }
  });


  /* ── Modal de error: se cierra solo con «Entendido» ──────────────────── */
  function abrirError(){ mostrar("scrim-error", true); $("e-entendido").focus(); }
  function cerrarError(){ mostrar("scrim-error", false); $("t-periodo").focus(); }
  $("e-entendido").addEventListener("click", cerrarError);

  /* ── Panel de registros con inconsistencias (consulta: solo ✕) ─────── */

  var inc_panelDatos = null;
  function inc_nInconsistencias(d){ return d.grupos.reduce(function(t, g){ return t + g.filas.length; }, 0); }
  function inc_celda(col, v){
    if (col === "Valor") return '<td class="corta" title="' + v + '">' + v + '</td>';
    if (col === "Motivo") return '<td class="motivo"><span title="' + v + '">' + v + '</span></td>';
    return '<td>' + v + '</td>';
  }
  var inc_tab = 0, inc_pag = 1, inc_porPag = 5;
  function inc_paginador(pag, total){
    var ops = [5, 10, 25].map(function(n){ return '<option' + (n === inc_porPag ? ' selected' : '') + '>' + n + '</option>'; }).join("");
    return paginadorModal(pag, total).replace('<select aria-label="Filas por página"><option>5</option></select>', '<select aria-label="Filas por página" id="i-porpag">' + ops + '</select>');
  }
  function inc_pintarTab(){
    var d = inc_panelDatos, g = d.grupos[inc_tab], total = Math.max(1, Math.ceil(g.filas.length / inc_porPag));
    Array.prototype.forEach.call(document.querySelectorAll("#i-tabs .vista"), function(t, i){
      t.setAttribute("aria-selected", String(i === inc_tab)); t.tabIndex = i === inc_tab ? 0 : -1;
    });
    $("i-regla").textContent = g.desc;
    var filas = g.filas.slice((inc_pag - 1) * inc_porPag, inc_pag * inc_porPag);
    $("i-contenido").innerHTML = '<div class="tabla-m"><div class="inc-cuerpo"><table><thead><tr>' + g.cols.map(function(c){ return '<th scope="col">' + c + '</th>'; }).join("") + '</tr></thead><tbody>' +
      filas.map(function(f){ return '<tr>' + f.map(function(v, k){ return inc_celda(g.cols[k], v); }).join("") + '</tr>'; }).join("") + '</tbody></table></div>' +
      inc_paginador(inc_pag, total) + '</div>';
    /* Todas las filas miden lo mismo (el motivo ocupa hasta dos líneas), así que
       basta medir la cabecera y una fila. */
    var cab = document.querySelector("#i-contenido thead").getBoundingClientRect().height,
        fila = document.querySelector("#i-contenido tbody tr").getBoundingClientRect().height;
    /* Alto definido por el contenido: la página más llena entre todas las
       pestañas, con tope de 5 filas. No cambia al pasar de pestaña ni de página;
       con 10 o 25 por página, la tabla hace scroll por dentro con la cabecera fija. */
    var filasAlto = Math.min(5, Math.max.apply(null, d.grupos.map(function(x){ return x.filas.length; })));
    document.querySelector("#i-contenido .inc-cuerpo").style.height = (Math.ceil(cab + fila * filasAlto) + 1) + "px";
  }
  function abrirModalInc(){
    var p = periodoActual(), d = INCONSISTENCIAS[p.inc], r = d.registros, n = inc_nInconsistencias(d);
    inc_panelDatos = d; inc_tab = 0; inc_pag = 1; inc_porPag = 5;
    var datos = [["Recaudación", p.etiqueta], ["Remuneración", p.rem], ["Registros", miles(r)]].concat(n !== r ? [["Inconsistencias", miles(n)]] : []);
    $("i-ctx").innerHTML = datos.map(function(x){ return '<li>' + x[0] + ': <b>' + x[1] + '</b></li>'; }).join("");
    $("i-glosa").textContent = "Registros de la deuda que no pasaron la validación del 23/09/2026 a las 09:12 hrs.";
    /* Con un solo tipo no hay pestañas: la regla y la tabla bastan. */
    $("i-tabs").hidden = d.grupos.length < 2;
    $("i-tabs").innerHTML = d.grupos.map(function(g, i){
      return '<button class="vista" type="button" role="tab" data-i="' + i + '" aria-controls="i-contenido">' + g.titulo + '<span class="n">' + miles(g.filas.length) + '</span></button>';
    }).join("");
    /* Se muestra antes de pintar: el alto de la tabla se mide con el modal visible. */
    mostrar("scrim-inc", true);
    inc_pintarTab();
    $("i-x").focus();
  }
  function cerrarModalInc(){ mostrar("scrim-inc", false); $("aviso-accion").focus(); }
  $("i-x").addEventListener("click", cerrarModalInc);
  $("scrim-inc").addEventListener("mousedown", function(e){ if (e.target === this) cerrarModalInc(); });
  document.addEventListener("keydown", function(e){ if (e.key === "Escape" && !$("scrim-inc").hidden) cerrarModalInc(); });
  $("i-tabs").addEventListener("click", function(e){ var t = e.target.closest(".vista"); if (!t) return; inc_tab = Number(t.getAttribute("data-i")); inc_pag = 1; inc_pintarTab(); });
  $("i-tabs").addEventListener("keydown", function(e){
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault(); var n = inc_panelDatos.grupos.length;
    inc_tab = (inc_tab + (e.key === "ArrowRight" ? 1 : n - 1)) % n; inc_pag = 1; inc_pintarTab();
    document.querySelector('#i-tabs .vista[data-i="' + inc_tab + '"]').focus();
  });
  $("i-contenido").addEventListener("click", function(e){ var b = e.target.closest(".pg"); if (!b || b.disabled) return; inc_pag = Number(b.getAttribute("data-pagina")); inc_pintarTab(); });
  $("i-contenido").addEventListener("change", function(e){ if (e.target.id !== "i-porpag") return; inc_porPag = Number(e.target.value); inc_pag = 1; inc_pintarTab(); });
  $("aviso-accion").addEventListener("click", abrirModalInc);

  /* ── Al cambiar de tipo de deuda, la vista queda como estaba ─────────── */
  /* Se guarda en la sesión del navegador: periodo, pestaña, filtros, página y
     las marcas. «Deuda» en el menú vuelve a la vista inicial. */
  var GUARDADO = "fusion-flujo";
  function leerGuardado(clave){ try { return JSON.parse(sessionStorage.getItem(clave)); } catch (e) { return null; } }
  /* Solo dentro de Deuda: al cambiar de tipo de deuda (o volver atrás entre
     ellos) la vista vuelve como quedó. Al recargar o al llegar desde otra
     sección, los tres parten de cero. */
  var desdeDeuda = false, llegada = ((performance.getEntriesByType && performance.getEntriesByType("navigation")[0]) || {}).type;
  try { desdeDeuda = sessionStorage.getItem("fusion-cambio") === "1"; sessionStorage.removeItem("fusion-cambio"); } catch (e) {}
  if (!desdeDeuda && !(llegada === "back_forward" && leerGuardado(GUARDADO))) {
    try { ["fusion-flujo", "fusion-stock", "fusion-consolidado"].forEach(function(c){ sessionStorage.removeItem(c); }); } catch (e) {}
  }
  ["op-stock", "op-consolidado"].forEach(function(id){
    $(id).addEventListener("click", function(){ try { sessionStorage.setItem("fusion-cambio", "1"); } catch (e) {} });
  });
  /* Si el navegador la devuelve desde su caché y otra sección ya borró lo
     guardado, se recarga para partir de cero. */
  window.addEventListener("pageshow", function(e){ if (e.persisted && !leerGuardado(GUARDADO)) location.reload(); });
  window.addEventListener("pagehide", function(){
    try {
      sessionStorage.setItem(GUARDADO, JSON.stringify({caso:window.CASO, periodo:estado.periodo, vista:estado.vista, pagina:estado.pagina,
        porPagina:estado.porPagina, filtros:estado.filtros, marcas:marcas}));
    } catch (e) {}
  });
  /* Stock y consolidada vuelven con su caso. */
  [["fusion-stock", "op-stock", "stock.html"], ["fusion-consolidado", "op-consolidado", "consolidado.html"]].forEach(function(x){
    var g = leerGuardado(x[0]);
    if (g && g.caso && g.caso !== "principal") $(x[1]).href = x[2] + "?caso=" + g.caso;
  });
  /* Termina igual que al seleccionar el periodo, sin volver a generarlo. */
  function restaurar(g){
    Object.keys(g.marcas || {}).forEach(function(r){ marcas[r] = g.marcas[r]; });
    var op = g.periodo && document.querySelector('#lista-periodo li[data-valor="' + g.periodo + '"]');
    if (!op || CFG.generar === "error") return;
    elegir(op.closest(".combo"), op); $("t-periodo").blur();
    estado.periodo = g.periodo; estado.vista = g.vista; estado.filtros = g.filtros;
    estado.porPagina = g.porPagina; $("por-pagina").value = String(g.porPagina);
    pintarVistas();
    if (CFG.generar) { generado(); return; }
    render();
    if (g.pagina > 1) { estado.pagina = Math.min(g.pagina, estado.paginas); pintarFilas(); }
  }

  pintarVistas();
  render();
  var guardado = leerGuardado(GUARDADO);
  if (guardado && guardado.caso === window.CASO) restaurar(guardado);
})();
