/* Comportamiento de Deuda histórica (stock) en el prototipo fusionado.
   Necesita datos-stock.js. El caso llega en la URL (?caso=) y stock.html lo
   deja en window.CASO. Sale de app.js de la entrega N°1: mismos
   patrones de selector, tabla, filtros, exportar, modales y avisos. */
(function(){
  "use strict";
  var D = window.STOCK_DATOS;
  var miles = D.miles, pesos = D.pesos, uf = D.uf, monto = D.monto;
  var PERIODOS = D.PERIODOS, TOTALES = D.TOTALES, USUARIO = D.USUARIO;
  var $ = function(id){ return document.getElementById(id); };

  /* ── El caso ─────────────────────────────────────────────────────────── */
  /* Define con qué carga parte octubre y qué pasa al cargar el archivo o al
     exportar. Los errores de carga salen en el periodo en curso. */
  var TODOS = ["oct", "sep", "ago"];
  var CASOS = {
    "principal":        {periodos:TODOS},
    "con-carga":        {periodos:TODOS, previa:true},
    "error-sistema":    {periodos:TODOS, carga:"sistema"},
    "error-registros":  {periodos:TODOS, carga:"registros"},
    "error-exportar":   {periodos:TODOS, exportar:"error"},
    "error-consultar":  {periodos:TODOS, consulta:"error"}
  };
  var CFG = CASOS[window.CASO] || CASOS.principal;

  function dos(n){ return (n < 10 ? "0" : "") + n; }
  function ahora(){ var d = new Date(); return {fecha: dos(d.getDate()) + "/" + dos(d.getMonth() + 1) + "/" + d.getFullYear(), hora: dos(d.getHours()) + ":" + dos(d.getMinutes())}; }
  function escapar(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function numero(s){ return parseInt(String(s).replace(/\D/g, ""), 10) || 0; }

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

  var SVG_AMPOLLETA = '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18.5 30.5a9.5 9.5 0 1 1 11 0v3.5h-11z"/><path d="M19.5 38.5h9"/><path d="M21 42h6"/><path d="M24 4v3"/><path d="M38 12.5 36 14"/><path d="M10 12.5 12 14"/><path d="M43 26h-3"/><path d="M8 26H5"/></svg>';
  var SVG_AYUDA = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><circle cx="8" cy="8" r="6.6"/><path d="M8 7.2v4" stroke-linecap="round"/><path d="M8 4.9h.01" stroke-linecap="round"/></svg>';
  /* Flecha del input del DS (exportada de Figma). */
  var SVG_FLECHA = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.3347 6.50013L22.0005 6.16592C21.7792 5.94469 21.4215 5.94469 21.2003 6.16592L12.0026 15.3682L2.80033 6.16592C2.5791 5.94469 2.22136 5.94469 2.00013 6.16592L1.66592 6.50013C1.44469 6.72136 1.44469 7.0791 1.66592 7.30033L11.5978 17.2369C11.8191 17.4582 12.1768 17.4582 12.398 17.2369L22.33 7.30033C22.5559 7.0791 22.5559 6.72136 22.3347 6.50013Z"/></svg>';
  var SVG_KEBAB = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>';
  var SVG_OK = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#fff"/><path fill="currentColor" d="M12 2C6.47714 2 2 6.47714 2 12C2 17.5229 6.47714 22 12 22C17.5229 22 22 17.5229 22 12C22 6.47714 17.5229 2 12 2ZM12 20.7097C7.21516 20.7097 3.29032 16.8365 3.29032 12C3.29032 7.2152 7.16351 3.29032 12 3.29032C16.7848 3.29032 20.7097 7.16351 20.7097 12C20.7097 16.7848 16.8365 20.7097 12 20.7097ZM17.7109 9.62254L10.4335 16.8416C10.2437 17.0298 9.93738 17.0285 9.74919 16.8388L6.28637 13.348C6.09819 13.1583 6.0994 12.8519 6.28911 12.6637L6.63266 12.323C6.82238 12.1348 7.12875 12.136 7.31694 12.3257L10.0982 15.1295L16.6886 8.59198C16.8783 8.40379 17.1847 8.405 17.3729 8.59472L17.7136 8.93827C17.9019 9.12798 17.9006 9.43435 17.7109 9.62254Z"/></svg>';
  var SVG_FALLA = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#fff"/><path fill="currentColor" d="M12 2C6.47581 2 2 6.47581 2 12C2 17.5242 6.47581 22 12 22C17.5242 22 22 17.5242 22 12C22 6.47581 17.5242 2 12 2ZM12 20.7097C7.21371 20.7097 3.29032 16.8347 3.29032 12C3.29032 7.21371 7.16532 3.29032 12 3.29032C16.7863 3.29032 20.7097 7.16532 20.7097 12C20.7097 16.7863 16.8347 20.7097 12 20.7097ZM15.8226 9.20564L13.0282 12L15.8226 14.7944C16.0121 14.9839 16.0121 15.2903 15.8226 15.4798L15.4798 15.8226C15.2903 16.0121 14.9839 16.0121 14.7944 15.8226L12 13.0282L9.20564 15.8226C9.01613 16.0121 8.70968 16.0121 8.52016 15.8226L8.17742 15.4798C7.9879 15.2903 7.9879 14.9839 8.17742 14.7944L10.9718 12L8.17742 9.20564C7.9879 9.01613 7.9879 8.70968 8.17742 8.52016L8.52016 8.17742C8.70968 7.9879 9.01613 7.9879 9.20564 8.17742L12 10.9718L14.7944 8.17742C14.9839 7.9879 15.2903 7.9879 15.4798 8.17742L15.8226 8.52016C16.0081 8.70968 16.0081 9.01613 15.8226 9.20564Z"/></svg>';
  /* Íconos del SmallMessage del DS (exportados de Figma): círculo blanco y glifo en el color del propósito. */
  var SVG_INFO = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#fff"/><path fill="currentColor" d="M12 3.29032C16.7831 3.29032 20.7097 7.16431 20.7097 12C20.7097 16.8101 16.8141 20.7097 12 20.7097C7.19177 20.7097 3.29032 16.816 3.29032 12C3.29032 7.19343 7.18556 3.29032 12 3.29032ZM12 2C6.47754 2 2 6.47915 2 12C2 17.5241 6.47754 22 12 22C17.5225 22 22 17.5241 22 12C22 6.47915 17.5225 2 12 2ZM10.5484 15.871H11.0323V11.0323H10.5484C10.2812 11.0323 10.0645 10.8156 10.0645 10.5484V10.2258C10.0645 9.95859 10.2812 9.74194 10.5484 9.74194H12.4839C12.7511 9.74194 12.9677 9.95859 12.9677 10.2258V15.871H13.4516C13.7188 15.871 13.9355 16.0876 13.9355 16.3548V16.6774C13.9355 16.9446 13.7188 17.1613 13.4516 17.1613H10.5484C10.2812 17.1613 10.0645 16.9446 10.0645 16.6774V16.3548C10.0645 16.0876 10.2812 15.871 10.5484 15.871ZM12 6.19355C11.2874 6.19355 10.7097 6.77125 10.7097 7.48387C10.7097 8.19649 11.2874 8.77419 12 8.77419C12.7126 8.77419 13.2903 8.19649 13.2903 7.48387C13.2903 6.77125 12.7126 6.19355 12 6.19355Z"/></svg>';
  var SVG_LUPA = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m21 21-5.8-5.8"/></svg>';
  /* Íconos del DS exportados de Figma: subir archivo, check de la lista y los de antigüedad. */
  var SVG_SUBIR = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M4.26786 10.8536L9.55357 5.55357C9.72143 5.38571 9.99286 5.38571 10.1607 5.55357L15.4464 10.8536C15.6143 11.0214 15.6143 11.2929 15.4464 11.4607L14.7464 12.1607C14.575 12.3321 14.3 12.3286 14.1357 12.1536L10.7857 8.68571V17.5714C10.7857 17.8071 10.5929 18 10.3571 18H9.35714C9.12143 18 8.92857 17.8071 8.92857 17.5714V8.68571L5.58214 12.1536C5.41429 12.325 5.13929 12.3286 4.97143 12.1607L4.27143 11.4607C4.1 11.2929 4.1 11.0214 4.26786 10.8536V10.8536ZM3.42857 3.85714H16.2857C16.5214 3.85714 16.7143 3.66429 16.7143 3.42857V2.42857C16.7143 2.19286 16.5214 2 16.2857 2H3.42857C3.19286 2 3 2.19286 3 2.42857V3.42857C3 3.66429 3.19286 3.85714 3.42857 3.85714Z"/></svg>';
  var SVG_CHECK = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect width="20" height="20" rx="4" fill="#857BE2"/><path fill="#fff" d="M8.39644 13.3107L5.14644 10.0607C4.95119 9.86541 4.95119 9.54883 5.14644 9.35355L5.85353 8.64644C6.04879 8.45117 6.36539 8.45117 6.56064 8.64644L8.75 10.8358L13.4394 6.14644C13.6346 5.95119 13.9512 5.95119 14.1465 6.14644L14.8536 6.85355C15.0488 7.0488 15.0488 7.36539 14.8536 7.56066L9.10355 13.3107C8.90828 13.5059 8.5917 13.5059 8.39644 13.3107V13.3107Z"/></svg>';
  var ANTIGUEDAD = [
    {tono:"plazo", regla:"Anticipado y en plazo",
      icono:'<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><path fill="#006B27" d="M29.3334 15.9993C29.3334 23.3631 23.3639 29.3327 16.0001 29.3327C8.63628 29.3327 2.66675 23.3631 2.66675 15.9993C2.66675 8.63555 8.63628 2.66602 16.0001 2.66602C23.3639 2.66602 29.3334 8.63555 29.3334 15.9993Z"/><path fill="#fff" d="M21.6484 10.0173C21.9934 9.58647 22.6222 9.51632 23.0533 9.861C23.4846 10.206 23.5546 10.836 23.2096 11.2673L14.6379 21.9808C14.3006 22.4025 13.6898 22.4804 13.2577 22.1566L8.97128 18.9417C8.52981 18.6103 8.4408 17.9837 8.77206 17.542C9.10352 17.1005 9.73011 17.0115 10.1718 17.3428L13.6809 19.9743L21.6484 10.0173Z"/></svg>'},
    {tono:"temprana", regla:"30 a 90 días",
      icono:'<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><path fill="#BF7900" d="M17.8267 3.78251C17.6545 3.44635 17.3928 3.16424 17.0706 2.96725C16.7483 2.77025 16.3779 2.66602 16.0002 2.66602C15.6225 2.66602 15.2521 2.77025 14.9299 2.96725C14.6076 3.16424 14.346 3.44635 14.1738 3.78251L2.88653 26.357C2.7291 26.6693 2.65415 27.0167 2.66879 27.3664C2.68343 27.7159 2.78718 28.0558 2.97018 28.354C3.15318 28.6522 3.40936 28.8986 3.7144 29.0698C4.01942 29.2412 4.36317 29.3317 4.71301 29.3327H27.2874C27.6373 29.3317 27.9811 29.2412 28.286 29.0698C28.5912 28.8986 28.8473 28.6522 29.0304 28.354C29.2132 28.0558 29.3171 27.7159 29.3316 27.3664C29.3464 27.0167 29.2713 26.6693 29.1139 26.357L17.8267 3.78251Z"/><path fill="#fff" d="M15.0001 18.5583V11.889C15.0001 11.3367 15.4479 10.889 16.0001 10.889C16.5524 10.889 17.0001 11.3367 17.0001 11.889V18.5583C17.0001 19.1105 16.5524 19.5583 16.0001 19.5583C15.4479 19.5582 15.0001 19.1105 15.0001 18.5583ZM17.5132 23.6898C17.5129 24.5254 16.8355 25.2028 16.0001 25.2028C15.2166 25.2028 14.5722 24.6067 14.4949 23.8434L14.4871 23.6898L14.4949 23.5348C14.5723 22.7716 15.2167 22.1768 16.0001 22.1767L16.1551 22.1846C16.9179 22.2622 17.5132 22.9064 17.5132 23.6898Z"/></svg>'},
    {tono:"avanzada", regla:"+120 días",
      icono:'<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><path fill="#B71C2C" d="M29.3332 15.9993C29.3332 23.3631 23.3636 29.3327 15.9998 29.3327C8.63604 29.3327 2.6665 23.3631 2.6665 15.9993C2.6665 8.63555 8.63604 2.66602 15.9998 2.66602C23.3636 2.66602 29.3332 8.63555 29.3332 15.9993Z"/><path fill="#fff" d="M14.6665 15.9993V10.666C14.6665 9.92964 15.2635 9.33268 15.9998 9.33268C16.7362 9.33268 17.3332 9.92964 17.3332 10.666V15.9994C17.3332 16.7357 16.7362 17.3327 15.9998 17.3327C15.2635 17.3327 14.6665 16.7357 14.6665 15.9993Z"/><path fill="#fff" d="M15.9998 19.9993C16.7362 19.9993 17.3332 20.5963 17.3332 21.3327C17.3332 22.0691 16.7362 22.666 15.9998 22.666C15.2635 22.666 14.6665 22.0691 14.6665 21.3327C14.6665 20.5963 15.2635 19.9993 15.9998 19.9993Z"/></svg>'}
  ];

  /* ── Cargas de cada periodo ──────────────────────────────────────────── */
  /* Una sola carga vigente por periodo: la nueva reemplaza completa a la
     anterior. En el caso con-carga, octubre parte con la del 19/10. */
  var cargas = {};
  Object.keys(PERIODOS).forEach(function(k){
    var previas = CFG.previa && k === "oct" ? [D.CARGA_OCT] : (D.CARGAS[k] || []);
    cargas[k] = previas.map(function(c, i){
      return {fecha:c.fecha, hora:c.hora, archivo:c.archivo, registros:c.registros, por:c.por, estado: i === 0 ? "Vigente" : "Reemplazado", huella:c.huella || null};
    });
  });
  function cargada(k){ return !!(cargas[k] && cargas[k].length); }
  function vigente(k){ return cargas[k][0]; }
  /* Dentro de una frase el mes va con mayúscula, como en Figma: «Mayo 2022».
     El mes y el año no se separan al cortar la línea. */
  function enFrase(mes){ return mes.replace(" ", "\u00a0"); }

  /* ── Columnas ────────────────────────────────────────────────────────── */
  var AYUDAS = {
    tipoCot:["D: Dependiente · P: Pensionado", "I: Independiente · V: Voluntario", "Pueden combinarse, por ejemplo DP."],
    eepc:["EEPC: Entidad Encargada del Pago de Cotizaciones.", "Cuenta solo las que figuran en el contrato."],
    tipoPag:["EEPC: figura en el contrato de la persona afiliada.", "NN: pagó sin figurar en el contrato."]
  };
  var COL_AFILIADOS = [
    {k:"afiliado", t:"RUT y nombre\nafiliado", w:212},
    {k:"adeudado", t:"Periodo de\nremuneración", w:148},
    {k:"tipoCot", t:"Tipo\ncotizante", w:115, ayuda:"tipoCot"},
    {k:"total", t:"Pactado", w:125},
    {k:"pagado", t:"Pagado", w:125},
    {k:"deuda", t:"Deuda", w:125},
    {k:"nEepc", t:"N° de\nEEPC", w:128, ayuda:"eepc"},
    {k:"acciones", t:"Acciones", w:100, fijaDer:true}
  ];
  var COL_PAGADORES = [
    {k:"pagador", t:"RUT y nombre\npagador", w:232},
    {k:"afiliado", t:"RUT y nombre\nafiliado", w:200},
    {k:"adeudado", t:"Periodo de\nremuneración", w:136},
    {k:"tipoCot", t:"Tipo\ncotizante", w:130, ayuda:"tipoCot"},
    {k:"pactado", t:"Pactado", w:115},
    {k:"pagado", t:"Pagado", w:115},
    {k:"deuda", t:"Deuda", w:120},
    {k:"tipoPag", t:"Tipo de\npagador", w:120, ayuda:"tipoPag"},
    {k:"acciones", t:"Acciones", w:100, fijaDer:true}
  ];

  /* El id es la posición del registro en D.tabla: lo usa «Ver detalle». */
  function filaAfiliado(f){
    var p = D.persona(f.p);
    return {id:f.id, tipoFila:"a", _p:p, afiliado:[p.rut, p.nombre], adeudado:f.adeudado, tipoCot:p.tipo,
      total:monto(f.total), pagado:monto(f.pagado), deuda:monto(f.deuda), nEepc:String(f.nEepc)};
  }
  /* La NN no tiene pactado ni deuda: solo lo que pagó. */
  function filaLinea(l){
    var p = D.persona(l.p), nn = l.tipoPag === "NN";
    return {id:l.id, tipoFila:"l", _p:p, pagador:D.pagador(l), afiliado:[p.rut, p.nombre], adeudado:l.adeudado,
      pactado: nn ? "—" : monto(l.pactado), pagado:monto(l.pagado), deuda: nn ? "—" : monto(l.deuda),
      tipoPag:l.tipoPag, tipoCot:p.tipo};
  }

  /* ── Estado ──────────────────────────────────────────────────────────── */
  /* Los filtros rápidos y los de «Ver filtros» son de cada pestaña, como en flujo. */
  var estado = {periodo:"", vista:"afiliados", pagina:1, paginas:1, porPagina:10,
    filtros:{afiliados:{}, pagadores:{}}, rapidos:{afiliados:{}, pagadores:{}}, filtrados:0, firma:""};
  function columnas(){ return estado.vista === "pagadores" ? COL_PAGADORES : COL_AFILIADOS; }

  /* ── Filtros ─────────────────────────────────────────────────────────── */
  var TIPO_COT = {id:"tipoCot", tipo:"combo", label:"Tipo cotizante", ops:[["D","D - Dependiente","Dependiente"],["I","I - Independiente","Independiente"],["P","P - Pensionado","Pensionado"],["V","V - Voluntario","Voluntario"]]};
  var CAMPOS = {
    afiliados:[
      {id:"desde", tipo:"monto", label:"Deuda desde", ph:"Ingresa monto"},
      {id:"hasta", tipo:"monto", label:"Deuda hasta", ph:"Ingresa monto"},
      {id:"pago", tipo:"combo", label:"Pago", ops:[["sin","Sin pago"],["parcial","Pago parcial"]]},
      TIPO_COT
    ],
    pagadores:[
      {id:"desde", tipo:"monto", label:"Deuda desde", ph:"Ingresa monto"},
      {id:"hasta", tipo:"monto", label:"Deuda hasta", ph:"Ingresa monto"},
      {id:"pago", tipo:"combo", label:"Pago", ops:[["sin","Sin pago"],["parcial","Pago parcial"]]},
      TIPO_COT,
      {id:"tipoPag", tipo:"combo", label:"Tipo de pagador", ops:[["EEPC","EEPC"],["NN","NN"]]}
    ]
  };
  function filtrosActivos(){ return estado.filtros[estado.vista]; }
  function rapidosActivos(){ return estado.rapidos[estado.vista]; }
  function hayAvanzados(){ return Object.keys(filtrosActivos()).length > 0; }
  function hayRapidos(){ return Object.keys(rapidosActivos()).length > 0; }
  /* El RUT se compara sin puntos, guion ni espacios, y puede ser parcial. */
  function limpio(s){ return String(s).toLowerCase().replace(/[.\-\s]/g, ""); }
  function incluye(txt, buscado){ return limpio(txt).indexOf(limpio(buscado)) !== -1; }

  /* Los filtros revisan los registros de D.tabla (filas de Afiliados o líneas
     de Pagadores). RUT pagador solo existe en Pagadores: cada línea tiene su pagador. */
  function pasaRapidos(x, r){
    if (r.rutAfi && !incluye(D.persona(x.p).rut, r.rutAfi)) return false;
    if (r.rutPag && (!x.tipoPag || !incluye(D.pagador(x)[0], r.rutPag))) return false;
    if (r.meses && r.meses.indexOf(x.adeudado) === -1) return false;
    return true;
  }
  function pasaAfiliado(f, filtros){
    return Object.keys(filtros).every(function(k){
      var v = filtros[k];
      if (k === "tipoCot") return D.persona(f.p).tipo.indexOf(v) !== -1;
      if (k === "pago") return v === "sin" ? f.pagado === 0 : f.pagado > 0 && f.pagado < f.total;
      if (k === "desde") return f.deuda >= numero(v);
      if (k === "hasta") return f.deuda <= numero(v);
      return true;
    });
  }
  /* Las líneas NN no tienen pactado ni deuda: no entran en Pago ni en los montos. */
  function pasaLinea(l, filtros){
    var nn = l.tipoPag === "NN";
    return Object.keys(filtros).every(function(k){
      var v = filtros[k];
      if (k === "tipoCot") return D.persona(l.p).tipo.indexOf(v) !== -1;
      if (k === "tipoPag") return l.tipoPag === v;
      if (k === "pago") return !nn && (v === "sin" ? l.pagado === 0 : l.pagado > 0 && l.pagado < l.pactado);
      if (k === "desde") return !nn && l.deuda >= numero(v);
      if (k === "hasta") return !nn && l.deuda <= numero(v);
      return true;
    });
  }

  /* ── Tabla ───────────────────────────────────────────────────────────── */
  /* La tabla es la carga completa (D.tabla): del mes más nuevo a mayo 2022 y,
     dentro del mes, primero la muestra. Cada página trae las filas que siguen,
     sin repetir, y el conteo es el de las filas que cumplen los filtros. */
  function datos(k){ var t = D.tabla(k); return estado.vista === "pagadores" ? t.lineas : t.filas; }
  function paginasDe(n, por){ return Math.max(1, Math.ceil(n / por)); }
  /* Al pasar de página no se vuelve a filtrar: la lista se guarda por consulta. */
  var filtro = {firma:"", lista:[]};
  function filtradas(k){
    var clave = firma();
    if (filtro.firma !== clave) {
      var f = filtrosActivos(), r = rapidosActivos(), prueba = estado.vista === "pagadores" ? pasaLinea : pasaAfiliado;
      filtro = {firma:clave, lista:datos(k).filter(function(x){ return pasaRapidos(x, r) && prueba(x, f); })};
    }
    return filtro.lista;
  }
  function filasDePagina(lista, pagina, por){
    return lista.slice((pagina - 1) * por, pagina * por).map(estado.vista === "pagadores" ? filaLinea : filaAfiliado);
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
      var quien = fila.tipoFila === "a" ? fila._p.nombre + ", " + fila.adeudado : fila.pagador[1] + " y " + fila._p.nombre + ", " + fila.adeudado;
      return '<td class="fija-der"><button class="kebab" type="button" aria-haspopup="menu" aria-expanded="false" data-fila="' + fila.tipoFila + ':' + fila.id + '" aria-label="Acciones de ' + escapar(quien) + '">' + SVG_KEBAB + '</button></td>';
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
  /* Cada filtro aplicado, rápido o de «Ver filtros», tiene su chip con ✕.
     Con tres periodos o más, el chip nombra el más reciente y cuenta el resto. */
  function textoMeses(ms){ return ms.length <= 2 ? ms.join(", ") : ms[0] + " y " + (ms.length - 1) + " más"; }
  function chip(texto, id){
    return '<span class="chip-filtro">' + texto + '<button type="button" data-quitar="' + id + '" aria-label="Quitar filtro ' + texto + '">✕</button></span>';
  }
  /* pendiente: la consulta aún no responde y el conteo llega con skeleton. */
  function pintarChips(pendiente){
    var filtros = filtrosActivos(), r = rapidosActivos(), piezas = [];
    if (r.rutPag) piezas.push(chip("RUT pagador: " + escapar(r.rutPag), "r:rutPag"));
    if (r.rutAfi) piezas.push(chip("RUT afiliado: " + escapar(r.rutAfi), "r:rutAfi"));
    if (r.meses) piezas.push(chip("Periodo de remuneración: " + escapar(textoMeses(r.meses)), "r:meses"));
    CAMPOS[estado.vista].forEach(function(c){ if (filtros[c.id]) piezas.push(chip(c.label + ": " + escapar(legible(c, filtros[c.id])), c.id)); });
    if (!piezas.length) { mostrar("filtros-aplicados", false); return; }
    var n = estado.filtrados;
    if (pendiente) $("etiqueta-filtros").innerHTML = '<span class="skel" style="width:200px; height:16px; margin:4px 0"></span>';
    else $("etiqueta-filtros").textContent = n === 1 ? "1 registro filtrado por:" : n > 0 ? miles(n) + " registros filtrados por:" : "Resultados filtrados por:";
    /* Al repintar, el foco sigue en el ✕ del mismo chip. */
    var enFoco = $("chips").contains(document.activeElement) ? document.activeElement.getAttribute("data-quitar") : null;
    $("chips").innerHTML = piezas.join("");
    if (enFoco) { var b = $("chips").querySelector('[data-quitar="' + enFoco + '"]'); if (b) b.focus(); }
    mostrar("filtros-aplicados", true);
  }

  function firma(){ return JSON.stringify([estado.periodo, estado.vista, filtrosActivos(), rapidosActivos()]); }
  function pintarFilas(){
    var k = estado.periodo; if (!cargada(k)) return;
    window.clearTimeout(relojTabla);
    var filtrando = hayAvanzados() || hayRapidos(), lista = filtrando ? filtradas(k) : datos(k);
    var paginas = paginasDe(lista.length, estado.porPagina);
    estado.filtrados = filtrando ? lista.length : 0;
    estado.pagina = Math.min(estado.pagina, paginas);
    var filas = filasDePagina(lista, estado.pagina, estado.porPagina);
    estado.paginas = paginas; estado.firma = firma();
    pintarChips(false);
    if (!filas.length) { mostrar("tabla-datos", false); mostrar("sin-resultados", true); return; }
    mostrar("sin-resultados", false); mostrar("tabla-datos", true); ajustarAnchos();
    var cols = columnas();
    $("tbody").innerHTML = filas.map(function(x){ return '<tr>' + cols.map(function(c){ return celda(c, x); }).join("") + '</tr>'; }).join("");
    marcarTruncados();
    $("conteo").textContent = estado.pagina + " de " + miles(paginas);
    $("pg-prev").disabled = estado.pagina <= 1;
    $("pg-next").disabled = estado.pagina >= paginas;
  }
  /* Toda consulta a la tabla (filtros, página, filas por página o pestaña)
     responde con skeleton. Los chips cambian de inmediato; el conteo, solo
     cuando cambian los criterios. Al pasar de página, el paginador sigue activo. */
  var relojTabla = null;
  function consultar(){
    if (!cargada(estado.periodo)) return;
    esconderPista();
    var cambia = firma() !== estado.firma;
    if (cambia) estado.pagina = 1;
    pintarChips(cambia);
    mostrar("sin-resultados", false); mostrar("tabla-datos", true);
    esqueletoTabla(!cambia);
    window.clearTimeout(relojTabla);
    relojTabla = window.setTimeout(pintarFilas, 700);
  }

  $("pg-prev").addEventListener("click", function(){ if (estado.pagina > 1) { estado.pagina--; consultar(); } });
  $("pg-next").addEventListener("click", function(){ if (estado.pagina < estado.paginas) { estado.pagina++; consultar(); } });
  $("por-pagina").addEventListener("change", function(){ estado.porPagina = parseInt(this.value, 10); estado.pagina = 1; consultar(); });

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

  /* carga: «accion» suma el botón para cargar el archivo; «cargando» es la
     carga en curso. Las dos guardan el mismo alto para que el bloque no salte. */
  function bloque(titulo, texto, arte, carga){
    $("bloque-arte").innerHTML = arte === "rueda" ? '<div class="rueda-grande"></div>' : '<div class="arte">' + SVG_AMPOLLETA + '</div>';
    $("bloque-titulo").textContent = titulo; $("bloque-texto").textContent = texto; $("bloque-texto").hidden = !texto;
    $("bloque").setAttribute("aria-busy", arte === "rueda" ? "true" : "false");
    $("bloque").setAttribute("data-alto", carga ? "1" : "0");
    mostrar("bloque-accion", carga === "accion");
    mostrar("bloque", true);
    ["totales", "antiguedad", "vistas", "tabla-card"].forEach(function(id){ mostrar(id, false); });
  }
  /* Quién cargó el archivo vigente y cuándo. Mientras carga, no se muestra.
     Desde la segunda carga del periodo, suma el acceso al historial. */
  function pintarAviso(k){
    if (!k || !cargada(k)) { mostrar("aviso", false); return; }
    var c = vigente(k);
    $("aviso-icono").innerHTML = SVG_INFO;
    $("aviso-texto").textContent = "Archivo cargado el " + c.fecha + " a las " + c.hora + " hrs por " + c.por + ".";
    mostrar("aviso-accion", cargas[k].length > 1);
    mostrar("aviso", true);
  }
  /* «Cargar archivo» en el dashboard: activo en el periodo en curso que ya
     tiene carga (sin carga, la acción está en el bloque del periodo). En los
     periodos anteriores se mantiene, deshabilitado: solo se carga en curso. */
  function pintarRecargar(k, ocupado){
    var p = k && PERIODOS[k];
    mostrar("btn-recargar", !!(p && (cargada(k) || !p.enCurso)));
    $("btn-recargar").disabled = !!ocupado || !(p && p.enCurso);
  }
  /* Como en flujo: el periodo de recaudación que se eligió y, debajo, las
     remuneraciones que cubre su deuda histórica (de Mayo 2022 a dos meses antes). */
  function pintarPeriodo(k){
    if (!k) { $("periodo-txt").textContent = "No se ha seleccionado periodo de recaudación"; return; }
    var c = D.corte(k);
    $("periodo-txt").innerHTML = '<span class="linea">Periodo de recaudación <b>' + PERIODOS[k].etiqueta + '</b></span>' +
      '<span class="linea">Remuneraciones de <b>' + c.desde + '</b> a <b>' + c.hasta + '</b></span>';
  }
  function pintarTotales(k){
    var t = TOTALES[k];
    $("t-deuda").textContent = pesos(t.deuda); $("t-deuda-uf").textContent = uf(t.deuda);
    $("t-afiliados").textContent = miles(t.afiliados); $("t-total").textContent = pesos(t.total);
    $("t-pagado").textContent = pesos(t.pagado);
    $("t-eepc").textContent = pesos(t.deudaEepc); $("t-eepc-uf").textContent = uf(t.deudaEepc);
    $("t-pagadores").textContent = miles(t.eepc + t.nn); $("t-pag-eepc").textContent = miles(t.eepc); $("t-pag-nn").textContent = miles(t.nn);
  }
  /* Antigüedad del pago: lo pagado en la historia de la carga, por monto. */
  $("antiguedad").innerHTML = D.GRUPOS.map(function(g, i){
    var a = ANTIGUEDAD[i];
    return '<div class="ant-card" data-tono="' + a.tono + '"><div class="ant-txt"><h3>' + g + '</h3>' +
      '<p class="ant-valor" id="a-' + i + '"></p><p class="ant-regla">' + a.regla + '</p></div>' +
      '<span class="ant-icono">' + a.icono + '</span></div>';
  }).join("");
  function pintarAntiguedad(k){
    D.porcentajes(D.ANTIGUEDAD[k].monto).forEach(function(v, i){ $("a-" + i).textContent = v; });
  }
  function render(animado){
    var k = estado.periodo, p = PERIODOS[k];
    cerrarMenuExportar(); cerrarMenuFila(); window.clearTimeout(relojTabla);
    if (!p) { pintarAviso(null); pintarPeriodo(null); pintarRecargar(null); bloque("Aún no hay un periodo seleccionado.", "Elige un periodo de recaudación para consultar la deuda histórica."); return; }
    pintarPeriodo(k); pintarAviso(k); pintarRecargar(k);
    /* Solo el periodo en curso puede estar sin carga: los anteriores ya la tienen. */
    if (!cargada(k)) {
      var c = D.corte(k);
      bloque("Este periodo aún no tiene deuda histórica.", "Carga el archivo con la deuda de las remuneraciones hasta " + enFrase(c.hasta) + ".", null, "accion");
      return;
    }
    mostrar("bloque", false);
    $("btn-exportar").disabled = false; $("btn-filtros").disabled = false;
    pintarTotales(k); pintarAntiguedad(k);
    mostrar("totales", true); mostrar("antiguedad", true); mostrar("vistas", true);
    pintarCabecera(); pintarRapidos(); estado.pagina = 1; pintarFilas(); mostrar("tabla-card", true);
    if (animado) animar($("aviso"));
  }
  /* Periodo con carga: totales, antigüedad y tabla llegan con skeleton, como
     un mes cerrado en flujo. */
  function esqueleto(){
    mostrar("bloque", false); mostrar("vistas", true); pintarCabecera(); pintarRapidos();
    mostrar("filtros-aplicados", false); mostrar("sin-resultados", false); mostrar("tabla-datos", true);
    /* Medidas del skeleton de Figma: monto 190×20, UF 120×16 y métricas 96×16. */
    var MEDIDAS = {"t-deuda":[190,20], "t-eepc":[190,20], "t-deuda-uf":[120,16], "t-eepc-uf":[120,16]};
    ["t-deuda","t-deuda-uf","t-afiliados","t-total","t-pagado","t-eepc","t-eepc-uf","t-pagadores","t-pag-eepc","t-pag-nn"].forEach(function(id){
      var m = MEDIDAS[id] || [96, 16];
      $(id).innerHTML = '<span class="skel" style="width:' + m[0] + 'px; height:' + m[1] + 'px"></span>';
    });
    D.GRUPOS.forEach(function(g, i){ $("a-" + i).innerHTML = '<span class="skel" style="width:80px; height:24px; margin:4px 0"></span>'; });
    mostrar("totales", true); mostrar("antiguedad", true);
    esqueletoTabla();
    $("btn-exportar").disabled = true;
    mostrar("tabla-card", true);
  }
  function esqueletoTabla(paginando){
    $("tbody").innerHTML = filasSkeleton(estado.porPagina);
    $("conteo").innerHTML = '<span class="skel" style="width:64px; display:inline-block"></span>';
    if (!paginando) { $("pg-prev").disabled = true; $("pg-next").disabled = true; }
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
    return '<li role="option" data-valor="' + k + '" data-mostrar="' + PERIODOS[k].etiqueta + '" aria-selected="false">' + PERIODOS[k].opcion + '</li>';
  }).join("");

  /* Vuelve al estado inicial: el caso «error al consultar» deja la pantalla sin periodo. */
  function reiniciarPeriodo(){
    var combo = document.querySelector('[data-combo="periodo"]');
    $("periodo").value = "";
    combo.querySelector(".combo-valor").textContent = "Selecciona un periodo";
    combo.setAttribute("data-lleno", "0");
    Array.prototype.forEach.call(combo.querySelectorAll('[role="option"]'), function(o){ o.setAttribute("aria-selected", "false"); });
  }

  /* Cambiar de periodo deja la tabla sin filtros, en Afiliados y en la página 1. */
  function reiniciarFiltros(){
    estado.filtros = {afiliados:{}, pagadores:{}}; estado.rapidos = {afiliados:{}, pagadores:{}}; estado.pagina = 1;
  }

  var relojPeriodo = null, relojCarga = null;
  $("btn-seleccionar").addEventListener("click", function(){
    var valor = $("periodo").value;
    if (!valor) { $("t-periodo").focus(); return; }
    var btn = this;
    window.clearTimeout(relojPeriodo); window.clearTimeout(relojTabla); window.clearTimeout(relojCarga);
    window.clearTimeout(relojValida); cargando($("btn-recargar"), false);
    estado.periodo = valor; estado.vista = "afiliados"; estado.firma = "";
    reiniciarFiltros(); pintarVistas(); cerrarMenuExportar(); cerrarMenuFila();
    /* Error al consultar: la consulta no responde y la pantalla vuelve a
       quedar sin periodo, como «Error al generar» en flujo. */
    if (CFG.consulta === "error") {
      cargando(btn, true); pintarAviso(null); pintarPeriodo(valor); pintarRecargar(null);
      bloque("Consultando deuda histórica", "", "rueda");
      relojPeriodo = window.setTimeout(function(){
        cargando(btn, false); estado.periodo = ""; reiniciarPeriodo(); render(); origenCarga = null;
        abrirError("Tuvimos un problema", "No es posible consultar la deuda histórica en estos momentos. Vuelve a intentarlo en unos minutos.");
      }, 1200);
      return;
    }
    /* Como un mes cerrado en flujo: con carga, el aviso aparece de inmediato,
       solo totales y tabla cargan con skeleton, y al llegar los datos el aviso
       entra animado. Sin carga, el aviso espera. */
    pintarAviso(cargada(valor) ? valor : null); pintarPeriodo(valor);
    if (cargada(valor)) {
      pintarRecargar(valor, true); esqueleto();
      relojPeriodo = window.setTimeout(function(){ render(true); }, 1200);
      return;
    }
    /* Sin carga: la consulta responde con el estado del periodo. */
    cargando(btn, true); pintarRecargar(null);
    bloque("Consultando deuda histórica", "", "rueda");
    relojPeriodo = window.setTimeout(function(){ cargando(btn, false); render(); }, 700);
  });

  /* ── Pestañas: al cambiar, la tabla entra con skeleton ───────────────── */
  function pintarVistas(){
    Array.prototype.forEach.call(document.querySelectorAll("#vistas .vista"), function(t){
      var activa = t.getAttribute("data-vista") === estado.vista;
      t.setAttribute("aria-selected", String(activa)); t.tabIndex = activa ? 0 : -1;
      if (activa) $("tabla-card").setAttribute("aria-labelledby", t.id);
    });
    $("op-vista").textContent = estado.vista === "pagadores" ? "Deuda pagadores" : "Deuda afiliados";
  }
  function cambiarVista(v){
    if (v === estado.vista) return;
    estado.vista = v;
    cerrarMenuExportar(); cerrarMenuFila(); cerrarCombos(null); esconderPista();
    pintarVistas(); pintarCabecera(); pintarRapidos();
    consultar();
  }
  $("vistas").addEventListener("click", function(e){ var t = e.target.closest(".vista"); if (t) cambiarVista(t.getAttribute("data-vista")); });
  $("vistas").addEventListener("keydown", function(e){
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault(); var otra = estado.vista === "afiliados" ? "pagadores" : "afiliados";
    cambiarVista(otra); $("tab-" + otra).focus();
  });

  /* ── Filtros rápidos de la pestaña ───────────────────────────────────── */
  /* Afiliados: RUT afiliado y periodo de remuneración. Pagadores suma el RUT
     pagador, primero, como su primera columna. */
  /* El RUT se escribe con puntos y guion mientras se ingresa; la K solo al final. */
  function formatoRut(v){
    var s = String(v).replace(/[^0-9kK]/g, "").toUpperCase().replace(/K(?=.)/g, "").slice(0, 9);
    if (s.length < 2) return s;
    return s.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + s.slice(-1);
  }
  function campoRut(id, label){
    var v = rapidosActivos()[id] || "";
    return '<div class="campo"><label for="q-' + id + '">' + label + '</label><div class="buscar">' +
      '<input type="text" id="q-' + id + '" data-rapido="' + id + '" placeholder="Ej.: 12.345.678-9" autocomplete="off" maxlength="12" value="' + escapar(v) + '" data-lleno="' + (v ? 1 : 0) + '">' +
      '<button class="lupa-btn" type="button" data-buscar="' + id + '" aria-label="Buscar por ' + label + '">' + SVG_LUPA + '</button></div></div>';
  }
  function valorMeses(sel){ return !sel.length ? "Todos" : sel.length === 1 ? sel[0] : sel.length + " periodos"; }
  /* Selección múltiple: los periodos se marcan y se aplican con «Filtrar».
     La lista trae todos los meses que cubre la carga, del más nuevo al más
     antiguo. «Limpiar» desmarca todo y deja el campo en «Todos». */
  function campoMeses(k){
    var sel = rapidosActivos().meses || [];
    return '<div class="campo campo-periodo"><span class="label" id="lb-meses">Periodo de remuneración</span>' +
      '<div class="combo combo-meses" data-combo="meses" data-lleno="' + (sel.length ? 1 : 0) + '">' +
      '<button class="combo-trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="lb-meses v-meses"><span class="combo-valor" id="v-meses">' + valorMeses(sel) + '</span><span class="flecha" aria-hidden="true">' + SVG_FLECHA + '</span></button>' +
      '<div class="combo-panel panel-meses" hidden>' +
      '<ul class="lista-meses" role="listbox" aria-multiselectable="true" aria-labelledby="lb-meses">' +
      D.mesesCorte(k).map(function(m){ return '<li role="option" data-valor="' + m + '" aria-selected="' + (sel.indexOf(m) !== -1) + '"><span class="check" aria-hidden="true">' + SVG_CHECK + '</span>' + m + '</li>'; }).join("") +
      '</ul><div class="pie-meses">' +
      '<button class="btn btn-sec" type="button" id="m-limpiar"' + (sel.length ? '' : ' disabled') + '><span class="btn-txt">Limpiar</span></button>' +
      '<button class="btn btn-pri" type="button" id="m-filtrar"' + (sel.length ? '' : ' disabled') + '><span class="btn-txt">Filtrar</span></button>' +
      '</div></div></div></div>';
  }
  function pintarRapidos(){
    var k = estado.periodo; if (!cargada(k)) return;
    $("filtros-rapidos").innerHTML = estado.vista === "pagadores"
      ? campoRut("rutPag", "RUT pagador") + campoRut("rutAfi", "RUT afiliado") + campoMeses(k)
      : campoRut("rutAfi", "RUT afiliado") + campoMeses(k);
  }
  /* El RUT se aplica con Enter o con la lupa; vacío, quita el filtro. */
  function aplicarRapido(id){
    var el = $("q-" + id), v = formatoRut(el.value), r = rapidosActivos();
    el.value = v;
    if (v) r[id] = v; else delete r[id];
    consultar();
  }
  /* Al abrir, la lista muestra lo aplicado: lo marcado sin filtrar se descarta. */
  function sincronizarMeses(combo){
    var sel = rapidosActivos().meses || [];
    Array.prototype.forEach.call(combo.querySelectorAll('[role="option"]'), function(o){ o.setAttribute("aria-selected", String(sel.indexOf(o.getAttribute("data-valor")) !== -1)); });
    $("m-filtrar").disabled = !sel.length; $("m-limpiar").disabled = !sel.length;
  }
  /* Limpiar se habilita con algo marcado o con el filtro aplicado. */
  function alternarMes(o){
    var combo = o.closest(".combo");
    o.setAttribute("aria-selected", String(o.getAttribute("aria-selected") !== "true"));
    Array.prototype.forEach.call(combo.querySelectorAll("[data-activo]"), function(x){ x.removeAttribute("data-activo"); });
    o.setAttribute("data-activo", "1");
    var marcados = !!combo.querySelector('[role="option"][aria-selected="true"]');
    $("m-filtrar").disabled = !marcados;
    $("m-limpiar").disabled = !marcados && !rapidosActivos().meses;
  }
  /* Si el filtro estaba aplicado, lo quita y la tabla vuelve a consultar. */
  function limpiarMeses(){
    var combo = document.querySelector('[data-combo="meses"]'), r = rapidosActivos(), aplicado = !!r.meses;
    Array.prototype.forEach.call(combo.querySelectorAll('[role="option"]'), function(o){ o.setAttribute("aria-selected", "false"); });
    delete r.meses;
    combo.querySelector(".combo-valor").textContent = valorMeses([]);
    combo.setAttribute("data-lleno", "0");
    cerrarCombos(null); combo.querySelector(".combo-trigger").focus();
    if (aplicado) consultar();
  }
  function aplicarMeses(){
    var combo = document.querySelector('[data-combo="meses"]'), r = rapidosActivos();
    var sel = Array.prototype.map.call(combo.querySelectorAll('[role="option"][aria-selected="true"]'), function(o){ return o.getAttribute("data-valor"); });
    if (sel.length) r.meses = sel; else delete r.meses;
    combo.querySelector(".combo-valor").textContent = valorMeses(sel);
    combo.setAttribute("data-lleno", sel.length ? "1" : "0");
    cerrarCombos(null); combo.querySelector(".combo-trigger").focus();
    consultar();
  }
  $("filtros-rapidos").addEventListener("keydown", function(e){
    var el = e.target.closest("[data-rapido]");
    if (el && e.key === "Enter") { e.preventDefault(); aplicarRapido(el.getAttribute("data-rapido")); }
  });
  $("filtros-rapidos").addEventListener("input", function(e){
    var el = e.target.closest("[data-rapido]"); if (!el) return;
    var tras = el.value.length - el.selectionEnd;
    el.value = formatoRut(el.value);
    var pos = Math.max(0, el.value.length - tras); el.setSelectionRange(pos, pos);
    el.setAttribute("data-lleno", el.value ? "1" : "0");
  });
  $("filtros-rapidos").addEventListener("click", function(e){
    var b = e.target.closest("[data-buscar]");
    if (b) { aplicarRapido(b.getAttribute("data-buscar")); return; }
    if (e.target.closest("#m-limpiar")) { limpiarMeses(); return; }
    if (e.target.closest("#m-filtrar")) aplicarMeses();
  });

  /* ── Exportar: consolidada y la de la pestaña activa, con los filtros ── */
  var relojAviso = null;
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
  function abrirMenuExportar(){ cerrarCombos(null); cerrarMenuFila(); mostrar("menu-exportar", true); $("btn-exportar").setAttribute("aria-expanded", "true"); $("op-consolidada").focus(); }
  function cerrarMenuExportar(foco){
    if ($("menu-exportar").hidden) return;
    mostrar("menu-exportar", false); $("btn-exportar").setAttribute("aria-expanded", "false");
    if (foco) $("btn-exportar").focus();
  }
  $("btn-exportar").addEventListener("click", function(){ if ($("menu-exportar").hidden) abrirMenuExportar(); else cerrarMenuExportar(); });
  /* En el caso error-exportar, la descarga falla y la tabla sigue disponible. */
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

  /* ── Menú ⋮ de la fila: el de flujo, aunque tenga una sola opción ──── */
  /* Al cerrar el detalle, el foco vuelve al ⋮ de la fila. */
  var disparador = null;
  function abrirMenuFila(boton){
    cerrarMenuFila(); cerrarMenuExportar(); cerrarCombos(null);
    var menu = $("menu-fila");
    menu.innerHTML = '<li role="none"><button type="button" role="menuitem" data-accion="detalle">Ver detalle</button></li>';
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
    var partes = disparador.getAttribute("data-fila").split(":");
    cerrarMenuFila();
    abrirDetalle(partes[0], parseInt(partes[1], 10), disparador);
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
  /* anchos (opcional): fijos, para que no dependan del contenido. */
  function tablaModal(cabeceras, filas, pagina, paginas, anchos){
    var cols = anchos ? '<colgroup>' + anchos.map(function(w){ return '<col style="width:' + w + 'px">'; }).join("") + '</colgroup>' : "";
    return '<div class="tabla-m"><table' + (anchos ? ' class="fija"' : '') + '>' + cols + '<thead><tr>' + cabeceras.map(function(c){ return '<th scope="col">' + c + '</th>'; }).join("") + '</tr></thead><tbody>' +
      filas.map(function(f){ return '<tr>' + f.map(function(v){
        return Array.isArray(v) ? '<td><span class="val">' + v[0] + '</span><span class="sub">' + v[1] + '</span></td>' : '<td>' + v + '</td>';
      }).join("") + '</tr>'; }).join("") +
      '</tbody></table>' + paginadorModal(pagina || 1, paginas || 1) + '</div>';
  }

  /* clase (opcional): cambia el ancho del modal, como en el historial. */
  var disparadorModal = null;
  function abrirConsulta(titulo, glosa, grupos, contenido, origen, clase){
    $("c-modal").className = "modal" + (clase ? " " + clase : "");
    $("c-titulo").textContent = titulo; $("c-glosa").textContent = glosa;
    $("c-ctx").innerHTML = ctx(grupos); $("c-ctx").hidden = !grupos.length;
    $("c-contenido").innerHTML = contenido; $("c-contenido").hidden = !contenido;
    disparadorModal = origen || null; mostrar("scrim-consulta", true); $("c-x").focus();
  }
  function cerrarConsulta(){ mostrar("scrim-consulta", false); if (disparadorModal) disparadorModal.focus(); }
  $("c-x").addEventListener("click", cerrarConsulta);
  $("scrim-consulta").addEventListener("mousedown", function(e){ if (e.target === this) cerrarConsulta(); });

  /* Detalle de un registro: solo lectura, con la forma de los modales de
     consulta de la fase 1. Arriba, quién y qué periodo; luego los montos del
     registro, que se leen como el cálculo (pactado, pagado, deuda); abajo,
     los pagadores de la cotización, que suman el pactado y el pagado de
     arriba. La deuda no va por línea: un pago NN la baja sin ser del contrato.
     Al cerrarlo, el foco vuelve al botón de la fila. */
  function montosModal(pactado, pagado, deuda){
    function m(rotulo, n){
      return '<dl><dt>' + rotulo + '</dt><dd>' + (n === null ? "—" : '<span class="val">' + pesos(n) + '</span><span class="sub">' + D.uf(n) + '</span>') + '</dd></dl>';
    }
    return '<div class="montos-m">' + m("Pactado", pactado) + '<span class="sep" aria-hidden="true"></span>' + m("Pagado", pagado) + '<span class="sep" aria-hidden="true"></span>' + m("Deuda", deuda) + '</div>';
  }
  function pagadoresModal(lineas){
    return tablaModal(["RUT y nombre pagador","Tipo de pagador","Pactado","Pagado"],
      lineas.map(function(l){
        var g = D.pagador(l);
        return [[g[0], g[1]], l.tipoPag, l.tipoPag === "NN" ? "—" : monto(l.pactado), monto(l.pagado)];
      }), 1, 1, [310, 144, 140, 140]);
  }
  /* Nombre y, debajo, el RUT: como el monto y su UF. */
  function nombreRut(nombre, rut){ return '<span class="val">' + nombre + '</span><span class="sub">' + rut + '</span>'; }
  function abrirDetalle(tipo, id, origen){
    var k = estado.periodo;
    if (tipo === "a") {
      var f = D.registro(k, "a", id), p = D.persona(f.p);
      abrirConsulta("Detalle de la deuda histórica", "Revisa los montos de esta cotización y sus pagadores.",
        [{crece:true, datos:[["Afiliado", nombreRut(p.nombre, p.rut)]]}, {datos:[["Tipo cotizante", p.tipo]]},
         {datos:[["N° de EEPC", String(f.nEepc)]]}, {datos:[["Periodo de remuneración", f.adeudado]]}],
        montosModal(f.total, f.pagado, f.deuda) + pagadoresModal(D.lineas(k, f)), origen);
    } else {
      var l = D.registro(k, "l", id), q = D.persona(l.p), g = D.pagador(l), nn = l.tipoPag === "NN";
      abrirConsulta("Detalle de la deuda histórica", "Revisa los montos de este pagador y cómo se reparte la cotización.",
        [{crece:true, datos:[["Pagador", nombreRut(g[1], g[0])], ["Afiliado", nombreRut(q.nombre, q.rut)]]},
         {datos:[["Tipo de pagador", l.tipoPag], ["Tipo cotizante", q.tipo]]}, {datos:[["Periodo de remuneración", l.adeudado]]}],
        montosModal(nn ? null : l.pactado, l.pagado, nn ? null : l.deuda) + pagadoresModal(D.lineas(k, l)), origen);
    }
  }

  /* ── Historial de cargas: modal de consulta, una carga por hito ──────── */
  /* De la más nueva a la más antigua; cada hito se nombra por su archivo. */
  function abrirHistorial(){
    var lista = cargas[estado.periodo];
    abrirConsulta("Historial de cargas", "Revisa los archivos cargados en este periodo.", [],
      '<ol class="hitos">' + lista.map(function(x){
        return '<li class="hito" data-estado="' + (x.estado === "Vigente" ? "vigente" : "reemplazado") + '">' +
          '<span class="hito-riel" aria-hidden="true"></span><div class="hito-txt">' +
          '<div class="hito-cabeza"><h3>' + escapar(x.archivo) + '</h3><span class="hito-estado">' + x.estado + '</span></div>' +
          '<p class="hito-quien">' + escapar(x.por) + '</p>' +
          '<p class="hito-dato"><span>' + x.fecha + ' · ' + x.hora + ' hrs</span> <span>·</span> <span>' + miles(x.registros) + ' registros</span></p></div></li>';
      }).join("") + '</ol>', $("aviso-accion"), "modal-historial");
  }
  $("aviso-accion").addEventListener("click", abrirHistorial);

  /* ── Carga del archivo: se elige el Excel y la carga parte de inmediato ─ */
  /* Sin carga, el botón está en el bloque del periodo; con carga, en el
     dashboard, y el archivo nuevo reemplaza completo al vigente. */
  var origenCarga = null, relojValida = null, casoArchivo = null;
  /* En Chrome, el selector solo deja elegir Excel y se abre en la última
     carpeta usada (por ejemplo, archivos-de-prueba). Si no está, el input. */
  var EXCEL = [{description:"Excel", accept:{"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":[".xlsx"], "application/vnd.ms-excel":[".xls"]}}];
  function elegirArchivo(btn){
    origenCarga = btn;
    if (window.showOpenFilePicker) {
      window.showOpenFilePicker({id:"deuda-historica-escritorio", startIn:"desktop", types:EXCEL, excludeAcceptAllOption:true})
        .then(function(hs){ return hs[0].getFile(); })
        .then(procesarArchivo, function(e){ if (e && e.name !== "AbortError") { $("archivo").value = ""; $("archivo").click(); } });
      return;
    }
    $("archivo").value = ""; $("archivo").click();
  }
  $("btn-recargar").addEventListener("click", function(){ if (!this.hasAttribute("data-cargando")) elegirArchivo(this); });
  $("bloque-accion").addEventListener("click", function(){ elegirArchivo(this); });
  function procesarArchivo(f){
    if (!f) return;
    if (!/\.xlsx?$/i.test(f.name)) { abrirError(ERRORES_CARGA.sistema[0], ERRORES_CARGA.sistema[1]); return; }
    leerArchivo(f).then(function(r){ casoArchivo = r.caso; revisarArchivo(f.name, r.huella); });
  }
  $("archivo").addEventListener("change", function(){ procesarArchivo(this.files && this.files[0]); });
  /* Huella del contenido (FNV-1a de 32 bits): el mismo archivo con otro
     nombre es el mismo archivo. Si no se puede leer, cuenta como distinto.
     Los archivos de archivos-de-prueba traen una marca que elige el
     resultado (sistema o registros); sin marca, la carga sale bien. */
  function leerArchivo(f){
    if (!f.arrayBuffer) return Promise.resolve({huella:null, caso:null});
    return f.arrayBuffer().then(function(buf){
      var b = new Uint8Array(buf), h = 0x811c9dc5, s = "", i;
      for (i = 0; i < b.length; i++) { h ^= b[i]; h = Math.imul(h, 0x01000193) >>> 0; }
      for (i = 0; i < b.length; i += 8192) s += String.fromCharCode.apply(null, b.subarray(i, i + 8192));
      var m = /prototipo-caso:(sistema|registros)/.exec(s);
      return {huella:h.toString(16), caso:m ? m[1] : null};
    }, function(){ return {huella:null, caso:null}; });
  }
  /* Sin carga, el archivo se carga de inmediato. Con carga, se valida contra
     el vigente mientras «Cargar archivo» muestra la rueda: el idéntico no se
     carga y el distinto se confirma antes de reemplazar al vigente. */
  function revisarArchivo(nombre, h){
    var k = estado.periodo;
    if (!cargada(k)) { cargarArchivo(nombre, h); return; }
    var b = $("btn-recargar");
    cargando(b, true);
    relojValida = window.setTimeout(function(){
      cargando(b, false);
      var c = vigente(k);
      if (h && c.huella === h) { abrirError("Este archivo ya fue cargado", "Es idéntico al archivo cargado el " + c.fecha + " a las " + c.hora + " hrs. La deuda histórica del periodo se mantiene.", {aviso:true}); return; }
      /* Un archivo que falla no llega a la confirmación: la carga vigente se mantiene. */
      if (casoArchivo) { errorDeCarga(casoArchivo); return; }
      abrirConfirmar(c, nombre, h);
    }, 1500);
  }
  /* Errores de carga del caso: todo o nada, el archivo no se carga y el
     periodo queda como estaba. Sistema: no responde o el archivo no se puede
     subir (el selector solo deja elegir Excel). Registros: suma la tabla de
     los campos con errores y destaca la causa. */
  var ERRORES_CARGA = {
    sistema:["Tuvimos un problema", "No fue posible cargar el archivo. Vuelve a intentarlo en unos minutos."],
    registros:["No pudimos cargar el archivo", 'El archivo tiene <span class="destaca">12 campos vacíos o con formato incorrecto</span>. Revísalo y vuelve a cargarlo.']
  };
  function errorDeCarga(tipo){ var e = ERRORES_CARGA[tipo]; abrirError(e[0], e[1], {registros:tipo === "registros" ? REGISTROS_CON_ERRORES : null}); }
  /* Campos con errores del caso, uno por fila de la tabla, en el orden del
     Excel: fila, RUT afiliado, periodo de remuneración, campo y motivo. */
  var REGISTROS_CON_ERRORES = [
    ["14", "9455312-K", "Agosto 2026", "Pagado", "Vacío"],
    ["27", "—", "Julio 2026", "RUT afiliado", "Vacío"],
    ["63", "11622567-8", "—", "Periodo de remuneración", "Vacío"],
    ["118", "28831161-7", "Enero 2026", "Pactado", "Formato incorrecto"],
    ["240", "16234890-6", "Agosto 2026", "Tipo cotizante", "Vacío"],
    ["241", "16234890-6", "Julio 2026", "RUT pagador", "Formato incorrecto"],
    ["512", "8745231-K", "Diciembre 2024", "Pagado", "Formato incorrecto"],
    ["1.087", "9455312-K", "Junio 2026", "Pactado", "Vacío"],
    ["1.087", "9455312-K", "Junio 2026", "Pagado", "Vacío"],
    ["2.304", "11622567-8", "Marzo 2026", "Pactado", "Formato incorrecto"],
    ["3.918", "28831161-7", "Mayo 2025", "Tipo cotizante", "Formato incorrecto"],
    ["4.102", "8745231-K", "Febrero 2025", "RUT pagador", "Vacío"]
  ];
  function cargarArchivo(nombre, h){
    var k = estado.periodo;
    cerrarMenuExportar(); cerrarCombos(null);
    window.clearTimeout(relojPeriodo); window.clearTimeout(relojTabla); window.clearTimeout(relojCarga);
    pintarAviso(null); pintarRecargar(k, true);
    bloque("Cargando deuda histórica", "Puede tardar unos minutos; mantén esta pantalla abierta.", "rueda", "cargando");
    $("bloque").focus();
    relojCarga = window.setTimeout(function(){
      var falla = CFG.carga || casoArchivo;
      if (falla) { render(); errorDeCarga(falla); return; }
      var t = ahora();
      cargas[k].forEach(function(c){ c.estado = "Reemplazado"; });
      cargas[k].unshift({fecha:t.fecha, hora:t.hora, archivo:nombre, registros:TOTALES[k].registros, por:USUARIO, estado:"Vigente", huella:h});
      estado.vista = "afiliados"; estado.firma = ""; reiniciarFiltros(); pintarVistas();
      render(true); $("aviso").focus({preventScroll:true});
    }, 1800);
  }

  /* ── Modal de filtros: con acciones (sin ✕; Esc cancela) ─────────────── */
  function campoHtml(c, valor){
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
    cerrarMenuExportar(); cerrarCombos(null);
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
    estado.filtros[estado.vista] = valoresFiltros(); cerrarFiltros(); consultar();
  });
  /* Los filtros rápidos y los de «Ver filtros» se suman: cada registro cumple
     todos. Limpiar filtros los quita todos, también los de la otra pestaña. */
  $("btn-limpiar").addEventListener("click", function(){
    reiniciarFiltros(); pintarRapidos(); consultar();
    $("filtros-rapidos").querySelector("input").focus();
  });
  /* Quitar un filtro rápido también vacía su campo. El foco pasa al chip
     siguiente o, si no quedan, al primer filtro rápido. */
  $("chips").addEventListener("click", function(e){
    var b = e.target.closest("[data-quitar]"); if (!b) return;
    var id = b.getAttribute("data-quitar");
    if (id.indexOf("r:") === 0) { delete rapidosActivos()[id.slice(2)]; pintarRapidos(); }
    else delete filtrosActivos()[id];
    consultar();
    var siguiente = $("chips").querySelector("[data-quitar]");
    (siguiente || $("filtros-rapidos").querySelector("input")).focus();
  });

  /* ── Desplegables (periodo, periodo de remuneración y filtros) ───────── */
  function cerrarCombos(salvo){
    Array.prototype.forEach.call(document.querySelectorAll(".combo"), function(c){
      if (c === salvo) return;
      c.setAttribute("data-abierto", "0"); c.querySelector(".combo-panel").hidden = true;
      c.querySelector(".combo-trigger").setAttribute("aria-expanded", "false");
    });
  }
  function elegir(combo, opcion){
    var oculto = combo.querySelector('input[type="hidden"]'), elegido = opcion.getAttribute("data-valor");
    var fijo = combo.getAttribute("data-combo") === "periodo";
    oculto.value = (!fijo && oculto.value === elegido) ? "" : elegido;
    combo.querySelector(".combo-valor").textContent = oculto.value ? (opcion.getAttribute("data-mostrar") || opcion.textContent) : "Selecciona";
    combo.setAttribute("data-lleno", oculto.value ? "1" : "0");
    Array.prototype.forEach.call(combo.querySelectorAll('[role="option"]'), function(o){ o.setAttribute("aria-selected", String(o.getAttribute("data-valor") === oculto.value)); });
    if (!fijo) revisarFiltros();
    cerrarCombos(null); combo.querySelector(".combo-trigger").focus();
  }
  function esMeses(combo){ return combo.getAttribute("data-combo") === "meses"; }
  document.addEventListener("click", function(e){
    var trigger = e.target.closest(".combo-trigger");
    if (trigger) {
      var combo = trigger.parentNode, abierto = combo.getAttribute("data-abierto") === "1";
      cerrarCombos(combo); cerrarMenuExportar();
      combo.setAttribute("data-abierto", abierto ? "0" : "1");
      var panel = combo.querySelector(".combo-panel");
      panel.hidden = abierto; trigger.setAttribute("aria-expanded", String(!abierto));
      if (!abierto && esMeses(combo)) sincronizarMeses(combo);
      /* Se abre hacia arriba solo si abajo no cabe y arriba sí, bajo la barra fija. */
      combo.removeAttribute("data-arriba");
      if (!abierto) { var r = trigger.getBoundingClientRect(), h = panel.offsetHeight + 12; if (r.bottom + h > window.innerHeight && r.top - h > document.querySelector("header").getBoundingClientRect().bottom) combo.setAttribute("data-arriba", "1"); }
      return;
    }
    var opcion = e.target.closest('.combo-panel [role="option"]');
    if (opcion) { var c = opcion.closest(".combo"); if (esMeses(c)) alternarMes(opcion); else elegir(c, opcion); return; }
    if (!e.target.closest(".combo")) cerrarCombos(null);
    if (!e.target.closest(".exportar")) cerrarMenuExportar();
    if (!e.target.closest("#menu-fila") && !e.target.closest(".kebab")) cerrarMenuFila();
  });
  document.addEventListener("keydown", function(e){
    var trigger = e.target.closest && e.target.closest(".combo-trigger");
    if (trigger && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault(); var combo = trigger.parentNode, panel = combo.querySelector(".combo-panel");
      if (combo.getAttribute("data-abierto") !== "1") trigger.click();
      var lista = panel.matches('[role="listbox"]') ? panel : panel.querySelector('[role="listbox"]');
      var primera = lista.querySelector('[aria-selected="true"]') || lista.querySelector('[role="option"]');
      Array.prototype.forEach.call(lista.querySelectorAll("[data-activo]"), function(x){ x.removeAttribute("data-activo"); });
      if (primera) { primera.setAttribute("data-activo", "1"); lista.tabIndex = -1; lista.focus(); }
      return;
    }
    /* Solo con el foco en la lista: los botones del pie de Periodo de
       remuneración responden por su cuenta. */
    var lista2 = e.target.matches && e.target.matches('[role="listbox"]') ? e.target : null;
    var multi = lista2 && esMeses(lista2.closest(".combo"));
    if (lista2 && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || (multi && e.key === " "))) {
      e.preventDefault();
      var ops = Array.prototype.slice.call(lista2.querySelectorAll('[role="option"]')), actual = lista2.querySelector('[data-activo="1"]'), i = ops.indexOf(actual);
      if (e.key === "Enter" || e.key === " ") { if (actual) { if (multi) alternarMes(actual); else elegir(lista2.closest(".combo"), actual); } return; }
      if (actual) actual.removeAttribute("data-activo");
      i = e.key === "ArrowDown" ? Math.min(i + 1, ops.length - 1) : Math.max(i - 1, 0);
      ops[i].setAttribute("data-activo", "1"); ops[i].scrollIntoView({block:"nearest"});
      return;
    }
    if (e.key !== "Escape") return;
    var abierto = document.querySelector('.combo[data-abierto="1"]');
    if (abierto) { cerrarCombos(null); abierto.querySelector(".combo-trigger").focus(); return; }
    if (!$("menu-fila").hidden) { cerrarMenuFila(true); return; }
    if (!$("menu-exportar").hidden) { cerrarMenuExportar(true); return; }
    if (!$("scrim-confirmar").hidden) { cerrarConfirmar(); return; }
    if (!$("scrim-error").hidden && registrosError) { cerrarError(); return; }
    if (!$("scrim-consulta").hidden) { cerrarConsulta(); return; }
    if (!$("scrim-filtros").hidden) { cerrarFiltros(); return; }
  });
  /* Las opciones de flujo y consolidada son enlaces con rol de radio: también responden a la barra espaciadora. */
  ["op-flujo", "op-consolidado"].forEach(function(id){
    $(id).addEventListener("keydown", function(e){ if (e.key === " ") { e.preventDefault(); this.click(); } });
  });

  /* ── Modal de error o aviso: se cierra solo con «Entendido» ──────────── */
  /* Tras un error de carga, el foco vuelve al botón que la inició. El texto
     puede traer una parte destacada. op.aviso: ícono ámbar (archivo ya
     cargado). op.registros: la tabla de campos con errores, 5 por página,
     dentro del mismo modal; sin pie, se cierra con ✕, Esc o clic fuera,
     como los de consulta. */
  var registrosError = null, paginaRegistros = 1;
  function focoTrasError(){ var b = origenCarga; (b && !b.hidden && b.offsetParent ? b : $("t-periodo")).focus(); }
  function abrirError(titulo, texto, op){
    op = op || {};
    registrosError = op.registros || null; paginaRegistros = 1;
    var modal = $("scrim-error").querySelector(".modal");
    modal.className = "modal modal-error" + (op.aviso ? " modal-aviso" : "") + (registrosError ? " con-registros" : "");
    $("e-titulo").textContent = titulo; $("e-texto").innerHTML = texto;
    pintarRegistros(); $("e-detalle").hidden = !registrosError;
    mostrar("scrim-error", true); $(registrosError ? "e-x" : "e-entendido").focus();
  }
  function cerrarError(){ mostrar("scrim-error", false); focoTrasError(); }
  function pintarRegistros(){
    if (!registrosError) { $("e-detalle").innerHTML = ""; return; }
    var por = 5, paginas = Math.ceil(registrosError.length / por), desde = (paginaRegistros - 1) * por;
    $("e-detalle").innerHTML = tablaModal(["Fila", "RUT afiliado y periodo", "Campo", "Motivo"],
      registrosError.slice(desde, desde + por).map(function(r){ return [r[0], [r[1], r[2]], r[3], r[4]]; }),
      paginaRegistros, paginas, [88, 210, 240, 196]);
  }
  /* Al cambiar de página, el foco queda en la misma flecha; si se deshabilita, en la otra. */
  $("e-detalle").addEventListener("click", function(e){
    var b = e.target.closest(".pg"); if (!b || b.disabled) return;
    var etiqueta = b.getAttribute("aria-label");
    paginaRegistros = parseInt(b.getAttribute("data-pagina"), 10); pintarRegistros();
    var flechas = this.querySelectorAll(".pg"), misma = this.querySelector('.pg[aria-label="' + etiqueta + '"]');
    (misma.disabled ? (flechas[0] === misma ? flechas[1] : flechas[0]) : misma).focus();
  });
  $("e-entendido").addEventListener("click", cerrarError);
  $("e-x").addEventListener("click", cerrarError);
  $("scrim-error").addEventListener("mousedown", function(e){ if (e.target === this && registrosError) cerrarError(); });

  /* ── Reemplazar archivo: confirmación con acciones (sin ✕) ───────────── */
  /* Cancelar o Esc cierran sin cambios; el clic fuera no cierra. Reemplazar
     carga el archivo nuevo, que pasa a ser el vigente. */
  var pendiente = null;
  function abrirConfirmar(c, nombre, h){
    pendiente = {nombre:nombre, huella:h};
    $("k-texto").innerHTML = "Ya existe un archivo cargado el " + c.fecha + " a las " + c.hora + ' hrs. <span class="destaca">Si continúas, el archivo nuevo reemplaza toda la deuda histórica del periodo.</span>';
    mostrar("scrim-confirmar", true); $("k-cancelar").focus();
  }
  function cerrarConfirmar(){ pendiente = null; mostrar("scrim-confirmar", false); focoTrasError(); }
  $("k-cancelar").addEventListener("click", cerrarConfirmar);
  $("k-reemplazar").addEventListener("click", function(){
    var p = pendiente; pendiente = null; mostrar("scrim-confirmar", false);
    if (p) cargarArchivo(p.nombre, p.huella);
  });

  /* ── Al cambiar de tipo de deuda, la vista queda como estaba ─────────── */
  /* Se guarda en la sesión del navegador: periodo, pestaña, filtros, página y
     las cargas hechas. «Deuda» en el menú vuelve a la vista inicial. */
  var GUARDADO = "fusion-stock";
  function leerGuardado(clave){ try { return JSON.parse(sessionStorage.getItem(clave)); } catch (e) { return null; } }
  /* Solo dentro de Deuda: al cambiar de tipo de deuda (o volver atrás entre
     ellos) la vista vuelve como quedó. Al recargar o al llegar desde otra
     sección, los tres parten de cero. */
  var desdeDeuda = false, llegada = ((performance.getEntriesByType && performance.getEntriesByType("navigation")[0]) || {}).type;
  try { desdeDeuda = sessionStorage.getItem("fusion-cambio") === "1"; sessionStorage.removeItem("fusion-cambio"); } catch (e) {}
  if (!desdeDeuda && !(llegada === "back_forward" && leerGuardado(GUARDADO))) {
    try { ["fusion-flujo", "fusion-stock", "fusion-consolidado"].forEach(function(c){ sessionStorage.removeItem(c); }); } catch (e) {}
  }
  ["op-flujo", "op-consolidado"].forEach(function(id){
    $(id).addEventListener("click", function(){ try { sessionStorage.setItem("fusion-cambio", "1"); } catch (e) {} });
  });
  /* Si el navegador la devuelve desde su caché y otra sección ya borró lo
     guardado, se recarga para partir de cero. */
  window.addEventListener("pageshow", function(e){ if (e.persisted && !leerGuardado(GUARDADO)) location.reload(); });
  window.addEventListener("pagehide", function(){
    try {
      sessionStorage.setItem(GUARDADO, JSON.stringify({caso:window.CASO, periodo:estado.periodo, vista:estado.vista, pagina:estado.pagina,
        porPagina:estado.porPagina, filtros:estado.filtros, rapidos:estado.rapidos, cargas:cargas}));
    } catch (e) {}
  });
  /* Flujo y consolidada vuelven con su caso. */
  [["fusion-flujo", "op-flujo", "flujo.html"], ["fusion-consolidado", "op-consolidado", "consolidado.html"]].forEach(function(x){
    var g = leerGuardado(x[0]);
    if (g && g.caso && g.caso !== "principal") $(x[1]).href = x[2] + "?caso=" + g.caso;
  });
  function restaurar(g){
    var op = g.periodo && document.querySelector('#lista-periodo li[data-valor="' + g.periodo + '"]');
    if (!op) return;
    elegir(op.closest(".combo"), op); $("t-periodo").blur();
    estado.periodo = g.periodo; estado.vista = g.vista; estado.filtros = g.filtros; estado.rapidos = g.rapidos;
    estado.porPagina = g.porPagina; $("por-pagina").value = String(g.porPagina);
    pintarVistas(); render();
    if (g.pagina > 1 && cargada(g.periodo)) { estado.pagina = Math.min(g.pagina, estado.paginas); pintarFilas(); }
  }
  var guardado = leerGuardado(GUARDADO);
  if (guardado && guardado.caso === window.CASO) {
    Object.keys(guardado.cargas || {}).forEach(function(k){ if (PERIODOS[k]) cargas[k] = guardado.cargas[k]; });
  } else guardado = null;

  Array.prototype.forEach.call(document.querySelectorAll(".icono-subir"), function(el){ el.innerHTML = SVG_SUBIR; });
  pintarVistas();
  render();

  /* Acceso directo desde la portada: stock.html#periodo=sep abre la vista
     con ese periodo ya seleccionado y se quita de la dirección, para que al
     recargar vuelva la vista inicial. Sin él, vuelve la vista guardada. */
  var directo = /(?:^|&)periodo=(\w+)/.exec(location.hash.slice(1));
  var opDirecta = directo && document.querySelector('#lista-periodo li[data-valor="' + directo[1] + '"]');
  if (location.hash) try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
  if (opDirecta) { elegir(opDirecta.closest(".combo"), opDirecta); $("btn-seleccionar").click(); $("t-periodo").blur(); }
  else if (guardado) restaurar(guardado);
})();
