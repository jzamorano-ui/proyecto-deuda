/* Comportamiento de Deuda consolidada (flujo y stock) en el prototipo
   fusionado. Necesita datos.js, datos-stock.js y datos-consolidado.js. Es
   solo de consulta: en el periodo de recaudación suma la deuda del mes y la
   deuda histórica. El caso llega en la URL (?caso=) y consolidado.html lo
   deja en window.CASO. Sale de stock.js: mismos patrones de selector, tabla,
   filtros, exportar y modales. */
(function(){
  "use strict";
  var D = window.CONSOLIDADO_DATOS;
  var miles = D.miles, pesos = D.pesos, uf = D.uf, monto = D.monto;
  var PERIODOS = D.PERIODOS;
  var $ = function(id){ return document.getElementById(id); };

  /* ── El caso ─────────────────────────────────────────────────────────── */
  /* Octubre está en curso: la deuda del mes aún no cierra. Julio cerró, pero
     no tiene deuda histórica. En sin-carga, octubre tampoco la tiene. */
  var TODOS = ["oct", "sep", "ago", "jul"];
  var CASOS = {
    "principal":      {periodos:TODOS},
    "sin-carga":      {periodos:TODOS, sinCarga:"oct"},
    "error-exportar": {periodos:TODOS, exportar:"error"},
    "error-consultar":{periodos:TODOS, consulta:"error"}
  };
  var CFG = CASOS[window.CASO] || CASOS.principal;

  function escapar(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function numero(s){ return parseInt(String(s).replace(/\D/g, ""), 10) || 0; }

  /* La deuda consolidada existe cuando cerró la deuda del mes y se cargó la
     deuda histórica del periodo. */
  function carga(k){ return CFG.sinCarga === k ? null : PERIODOS[k].carga; }
  function disponible(k){ return !!(k && PERIODOS[k] && PERIODOS[k].flujo && carga(k)); }
  /* Dentro de una frase el mes va con mayúscula, como en Figma: «Mayo 2022».
     El mes y el año no se separan al cortar la línea. */
  function enFrase(mes){ return mes.replace(" ", " "); }

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
  var SVG_LUPA = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m21 21-5.8-5.8"/></svg>';
  /* Íconos del DS exportados de Figma: check de la lista, reloj y check del
     estado de cada parte, flechas de «Ver detalle» y los de antigüedad. */
  var SVG_CHECK = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect width="20" height="20" rx="4" fill="#857BE2"/><path fill="#fff" d="M8.39644 13.3107L5.14644 10.0607C4.95119 9.86541 4.95119 9.54883 5.14644 9.35355L5.85353 8.64644C6.04879 8.45117 6.36539 8.45117 6.56064 8.64644L8.75 10.8358L13.4394 6.14644C13.6346 5.95119 13.9512 5.95119 14.1465 6.14644L14.8536 6.85355C15.0488 7.0488 15.0488 7.36539 14.8536 7.56066L9.10355 13.3107C8.90828 13.5059 8.5917 13.5059 8.39644 13.3107V13.3107Z"/></svg>';
  var ANTIGUEDAD = [
    {tono:"plazo", regla:"Anticipado y en plazo",
      icono:'<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><path fill="#006B27" d="M29.3334 15.9993C29.3334 23.3631 23.3639 29.3327 16.0001 29.3327C8.63628 29.3327 2.66675 23.3631 2.66675 15.9993C2.66675 8.63555 8.63628 2.66602 16.0001 2.66602C23.3639 2.66602 29.3334 8.63555 29.3334 15.9993Z"/><path fill="#fff" d="M21.6484 10.0173C21.9934 9.58647 22.6222 9.51632 23.0533 9.861C23.4846 10.206 23.5546 10.836 23.2096 11.2673L14.6379 21.9808C14.3006 22.4025 13.6898 22.4804 13.2577 22.1566L8.97128 18.9417C8.52981 18.6103 8.4408 17.9837 8.77206 17.542C9.10352 17.1005 9.73011 17.0115 10.1718 17.3428L13.6809 19.9743L21.6484 10.0173Z"/></svg>'},
    {tono:"temprana", regla:"30 a 90 días",
      icono:'<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><path fill="#BF7900" d="M17.8267 3.78251C17.6545 3.44635 17.3928 3.16424 17.0706 2.96725C16.7483 2.77025 16.3779 2.66602 16.0002 2.66602C15.6225 2.66602 15.2521 2.77025 14.9299 2.96725C14.6076 3.16424 14.346 3.44635 14.1738 3.78251L2.88653 26.357C2.7291 26.6693 2.65415 27.0167 2.66879 27.3664C2.68343 27.7159 2.78718 28.0558 2.97018 28.354C3.15318 28.6522 3.40936 28.8986 3.7144 29.0698C4.01942 29.2412 4.36317 29.3317 4.71301 29.3327H27.2874C27.6373 29.3317 27.9811 29.2412 28.286 29.0698C28.5912 28.8986 28.8473 28.6522 29.0304 28.354C29.2132 28.0558 29.3171 27.7159 29.3316 27.3664C29.3464 27.0167 29.2713 26.6693 29.1139 26.357L17.8267 3.78251Z"/><path fill="#fff" d="M15.0001 18.5583V11.889C15.0001 11.3367 15.4479 10.889 16.0001 10.889C16.5524 10.889 17.0001 11.3367 17.0001 11.889V18.5583C17.0001 19.1105 16.5524 19.5583 16.0001 19.5583C15.4479 19.5582 15.0001 19.1105 15.0001 18.5583ZM17.5132 23.6898C17.5129 24.5254 16.8355 25.2028 16.0001 25.2028C15.2166 25.2028 14.5722 24.6067 14.4949 23.8434L14.4871 23.6898L14.4949 23.5348C14.5723 22.7716 15.2167 22.1768 16.0001 22.1767L16.1551 22.1846C16.9179 22.2622 17.5132 22.9064 17.5132 23.6898Z"/></svg>'},
    {tono:"avanzada", regla:"+120 días",
      icono:'<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><path fill="#B71C2C" d="M29.3332 15.9993C29.3332 23.3631 23.3636 29.3327 15.9998 29.3327C8.63604 29.3327 2.6665 23.3631 2.6665 15.9993C2.6665 8.63555 8.63604 2.66602 15.9998 2.66602C23.3636 2.66602 29.3332 8.63555 29.3332 15.9993Z"/><path fill="#fff" d="M14.6665 15.9993V10.666C14.6665 9.92964 15.2635 9.33268 15.9998 9.33268C16.7362 9.33268 17.3332 9.92964 17.3332 10.666V15.9994C17.3332 16.7357 16.7362 17.3327 15.9998 17.3327C15.2635 17.3327 14.6665 16.7357 14.6665 15.9993Z"/><path fill="#fff" d="M15.9998 19.9993C16.7362 19.9993 17.3332 20.5963 17.3332 21.3327C17.3332 22.0691 16.7362 22.666 15.9998 22.666C15.2635 22.666 14.6665 22.0691 14.6665 21.3327C14.6665 20.5963 15.2635 19.9993 15.9998 19.9993Z"/></svg>'}
  ];
  var SVG_RELOJ = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 2C5.58065 2 2 5.58065 2 10C2 14.4194 5.58065 18 10 18C14.4194 18 18 14.4194 18 10C18 5.58065 14.4194 2 10 2ZM10 16.4516C6.43548 16.4516 3.54839 13.5645 3.54839 10C3.54839 6.43548 6.43548 3.54839 10 3.54839C13.5645 3.54839 16.4516 6.43548 16.4516 10C16.4516 13.5645 13.5645 16.4516 10 16.4516ZM11.9935 13.0839L9.25484 11.0935C9.15484 11.0194 9.09677 10.9032 9.09677 10.7806L9.09677 5.48387C9.09677 5.27097 9.27097 5.09677 9.48387 5.09677H10.5161C10.729 5.09677 10.9032 5.27097 10.9032 5.48387L10.9032 10.0548L13.0581 11.6226C13.2323 11.7484 13.2677 11.9903 13.1419 12.1645L12.5355 13C12.4097 13.171 12.1677 13.2097 11.9935 13.0839Z"/></svg>';
  var SVG_LISTO = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 2C5.58171 2 2 5.58171 2 10C2 14.4183 5.58171 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58171 14.4183 2 10 2ZM10 3.54839C13.5655 3.54839 16.4516 6.4339 16.4516 10C16.4516 13.5655 13.5661 16.4516 10 16.4516C6.43445 16.4516 3.54839 13.5661 3.54839 10C3.54839 6.43445 6.4339 3.54839 10 3.54839ZM14.5227 7.75055L13.7957 7.01771C13.6452 6.86594 13.4001 6.86494 13.2483 7.01552L8.68858 11.5386L6.75981 9.59419C6.60926 9.44242 6.36416 9.44142 6.21239 9.59197L5.47952 10.3189C5.32774 10.4695 5.32674 10.7146 5.47732 10.8664L8.40574 13.8185C8.55629 13.9703 8.80139 13.9713 8.95316 13.8207L14.5205 8.298C14.6723 8.14742 14.6733 7.90232 14.5227 7.75055V7.75055Z"/></svg>';
  var SVG_ABAJO = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M17.8726 5.84272L17.1573 5.12736C16.9875 4.95755 16.7129 4.95755 16.5431 5.12736L10 11.656L3.45693 5.12736C3.28712 4.95755 3.01253 4.95755 2.84272 5.12736L2.12736 5.84272C1.95755 6.01253 1.95755 6.28712 2.12736 6.45693L9.6929 14.0225C9.86271 14.1923 10.1373 14.1923 10.3071 14.0225L17.8726 6.45693C18.0425 6.28712 18.0425 6.01253 17.8726 5.84272V5.84272Z"/></svg>';
  var SVG_ARRIBA = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M2.12701 13.3066L2.84238 14.0219C3.01169 14.1913 3.28621 14.1913 3.45556 14.0219L10 7.49305L16.5445 14.0219C16.7138 14.1912 16.9883 14.1912 17.1577 14.0219L17.873 13.3065C18.0423 13.1372 18.0423 12.8627 17.873 12.6934L10.3066 5.12698C10.1373 4.95767 9.86273 4.95767 9.69339 5.12698L2.12701 12.6934C1.95766 12.8627 1.95766 13.1373 2.12701 13.3066Z"/></svg>';

  /* ── Columnas ────────────────────────────────────────────────────────── */
  /* Las de stock, con Origen después del RUT: dice si el registro viene de
     la deuda del mes (Flujo) o de la histórica (Stock). Anchos de Figma. */
  var AYUDAS = {
    tipoCot:["D: Dependiente · P: Pensionado", "I: Independiente · V: Voluntario", "Pueden combinarse, por ejemplo DP."],
    eepc:["EEPC: Entidad Encargada del Pago de Cotizaciones.", "Cuenta solo las que figuran en el contrato."],
    tipoPag:["EEPC: figura en el contrato de la persona afiliada.", "NN: pagó sin figurar en el contrato."]
  };
  var COL_AFILIADOS = [
    {k:"afiliado", t:"RUT y nombre\nafiliado", w:212},
    {k:"origen", t:"Origen", w:115},
    {k:"adeudado", t:"Periodo de\nremuneración", w:120},
    {k:"tipoCot", t:"Tipo\ncotizante", w:115, ayuda:"tipoCot"},
    {k:"total", t:"Pactado", w:115},
    {k:"pagado", t:"Pagado", w:115},
    {k:"deuda", t:"Deuda", w:115},
    {k:"nEepc", t:"N° de\nEEPC", w:115, ayuda:"eepc"},
    {k:"acciones", t:"Acciones", w:100, fijaDer:true}
  ];
  var COL_PAGADORES = [
    {k:"pagador", t:"RUT y nombre\npagador", w:232},
    {k:"afiliado", t:"RUT y nombre\nafiliado", w:200},
    {k:"origen", t:"Origen", w:115},
    {k:"adeudado", t:"Periodo de\nremuneración", w:136},
    {k:"tipoCot", t:"Tipo\ncotizante", w:130, ayuda:"tipoCot"},
    {k:"pactado", t:"Pactado", w:115},
    {k:"pagado", t:"Pagado", w:115},
    {k:"deuda", t:"Deuda", w:120},
    {k:"tipoPag", t:"Tipo de\npagador", w:120, ayuda:"tipoPag"},
    {k:"acciones", t:"Acciones", w:100, fijaDer:true}
  ];
  /* Origen: tag del DS, verde para Flujo y lila para Stock. */
  function tag(origen){ return '<span class="tag-origen" data-origen="' + origen.toLowerCase() + '">' + origen + '</span>'; }

  /* El id es la posición del registro en D.tabla: lo usa «Ver detalle». */
  function filaAfiliado(f){
    var p = D.persona(f.p);
    return {id:f.id, tipoFila:"a", _p:p, afiliado:[p.rut, p.nombre], origen:f.origen, adeudado:f.adeudado, tipoCot:p.tipo,
      total:monto(f.total), pagado:monto(f.pagado), deuda:monto(f.deuda), nEepc:String(f.nEepc)};
  }
  /* La NN no tiene pactado ni deuda: solo lo que pagó. */
  function filaLinea(l){
    var p = D.persona(l.p), nn = l.tipoPag === "NN";
    return {id:l.id, tipoFila:"l", _p:p, pagador:D.pagador(l), afiliado:[p.rut, p.nombre], origen:l.origen, adeudado:l.adeudado,
      pactado: nn ? "—" : monto(l.pactado), pagado:monto(l.pagado), deuda: nn ? "—" : monto(l.deuda),
      tipoPag:l.tipoPag, tipoCot:p.tipo};
  }

  /* ── Estado ──────────────────────────────────────────────────────────── */
  /* Los filtros rápidos y los de «Ver filtros» son de cada pestaña, como en
     flujo. La tabla de segmentos queda como se dejó al cambiar de pestaña o
     de periodo. */
  var estado = {periodo:"", vista:"afiliados", pagina:1, paginas:1, porPagina:10,
    filtros:{afiliados:{}, pagadores:{}}, rapidos:{afiliados:{}, pagadores:{}}, filtrados:0, firma:"", segAbierto:false};
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
  /* La tabla es la deuda consolidada (D.tabla): primero la muestra, cada
     persona con su deuda del mes y su deuda histórica; luego el resto. Cada
     página trae las filas que siguen, sin repetir, y el conteo es el de las
     filas que cumplen los filtros. */
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
    var espacio = $("tabla").parentNode.clientWidth;
    var k = espacio > total ? (espacio - fijo) / (total - fijo) : 1;
    var anchos = cols.map(function(c){ return c.fijaDer ? c.w : Math.floor(c.w * k); });
    var suma = anchos.reduce(function(s, w){ return s + w; }, 0);
    if (k > 1) { anchos[0] += espacio - suma; suma = espacio; }
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
    if (col.k === "origen") return '<td>' + tag(v) + '</td>';
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
    var k = estado.periodo; if (!disponible(k)) return;
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
    if (!disponible(estado.periodo)) return;
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

  /* Bloque del periodo: sin periodo, consultando o sin deuda consolidada.
     partes: la caja con el estado de la deuda del mes y de la histórica. */
  function bloque(titulo, texto, arte, partes){
    $("bloque-arte").innerHTML = arte === "rueda" ? '<div class="rueda-grande"></div>' : '<div class="arte">' + SVG_AMPOLLETA + '</div>';
    $("bloque-titulo").textContent = titulo; $("bloque-texto").textContent = texto; $("bloque-texto").hidden = !texto;
    $("bloque").setAttribute("aria-busy", arte === "rueda" ? "true" : "false");
    $("bloque-partes").innerHTML = partes || ""; mostrar("bloque-partes", !!partes);
    mostrar("bloque", true);
    ["totales", "antiguedad", "segmentos", "vistas", "tabla-card"].forEach(function(id){ mostrar(id, false); });
  }
  /* Sin deuda consolidada: falta que cierre la deuda del mes, que se cargue
     la histórica o las dos. La caja dice en qué está cada parte. */
  function parte(rotulo, lista, texto){
    return '<li><span class="parte-icono">' + (lista ? SVG_LISTO : SVG_RELOJ) + '</span>' +
      '<span class="parte-rotulo">' + rotulo + '</span><span class="parte-estado">' + texto + '</span></li>';
  }
  function sinConsolidado(k){
    var p = PERIODOS[k], c = carga(k);
    var falta = !p.flujo && !c ? "cierre la deuda del mes y se cargue la deuda histórica" : !p.flujo ? "cierre la deuda del mes" : "se cargue la deuda histórica";
    bloque("Este periodo aún no tiene deuda consolidada.", "Estará disponible cuando " + falta + ".", null,
      parte("Deuda del mes", !!p.flujo, p.flujo ? "Cerrada el " + p.flujo.cierre : "Pendiente de cierre") +
      parte("Deuda histórica", !!c, c ? "Cargada el " + c.fecha : "Pendiente de carga"));
  }
  /* Como en flujo y stock: el periodo de recaudación que se eligió y, debajo,
     las remuneraciones que suma (de Mayo 2022 al mes de la deuda del mes). */
  function pintarPeriodo(k){
    if (!k) { $("periodo-txt").textContent = "No se ha seleccionado periodo de recaudación"; return; }
    var r = D.rango(k);
    $("periodo-txt").innerHTML = '<span class="linea">Periodo de recaudación <b>' + PERIODOS[k].etiqueta + '</b></span>' +
      '<span class="linea">Remuneraciones de <b>' + r.desde + '</b> a <b>' + r.hasta + '</b></span>';
  }
  /* Debajo de cada monto, cuánto viene de cada parte. */
  function origenes(k){
    var c = D.corteStock(k);
    return {flujo:"Flujo · " + enFrase(PERIODOS[k].rem), stock:"Stock · " + enFrase(c.desde) + " a " + enFrase(c.hasta)};
  }
  function pintarTotales(k){
    var t = D.totales(k), o = origenes(k);
    $("t-deuda").textContent = pesos(t.deuda); $("t-deuda-uf").textContent = uf(t.deuda);
    $("t-afiliados").textContent = miles(t.afiliados); $("t-total").textContent = pesos(t.total);
    $("t-pagado").textContent = pesos(t.pagado);
    $("t-eepc").textContent = pesos(t.deudaEepc); $("t-eepc-uf").textContent = uf(t.deudaEepc);
    $("t-pagadores").textContent = miles(t.pagadores); $("t-pag-eepc").textContent = miles(t.eepc); $("t-pag-nn").textContent = miles(t.nn);
    $("t-o-flujo-lbl").textContent = o.flujo; $("t-o-flujo").textContent = pesos(t.flujo.deuda);
    $("t-o-stock-lbl").textContent = o.stock; $("t-o-stock").textContent = pesos(t.stock.deuda);
    $("t-e-flujo-lbl").textContent = o.flujo; $("t-e-flujo").textContent = pesos(t.flujo.deudaEepc);
    $("t-e-stock-lbl").textContent = o.stock; $("t-e-stock").textContent = pesos(t.stock.deudaEepc);
  }
  /* Antigüedad del pago: la de la deuda histórica, por monto. */
  $("antiguedad").innerHTML = D.GRUPOS.map(function(g, i){
    var a = ANTIGUEDAD[i];
    return '<div class="ant-card" data-tono="' + a.tono + '"><div class="ant-txt"><h3>' + g + '</h3>' +
      '<p class="ant-valor" id="a-' + i + '"></p><p class="ant-regla">' + a.regla + '</p></div>' +
      '<span class="ant-icono">' + a.icono + '</span></div>';
  }).join("");
  function pintarAntiguedad(k){
    D.porcentajes(D.antiguedad(k).monto).forEach(function(v, i){ $("a-" + i).textContent = v; });
  }

  /* ── Deuda por segmento: la tabla se abre y se cierra con el botón ───── */
  /* Siempre las 6 carteras, de la que más deuda tiene a la que menos. La
     barra es el % de la deuda; bajo 0,1 % se lee «< 0,1 %». */
  function pintarSegmentos(k){
    $("seg-filas").innerHTML = D.segmentos(k).map(function(s){
      return '<tr><td>' + s.k + '</td><td>' + miles(s.deudores) + '</td><td>' + pesos(s.deuda) + '</td>' +
        '<td><span class="seg-pct"><span class="seg-barra" aria-hidden="true"><span style="width:' + Math.min(100, s.pct) + '%"></span></span>' +
        '<span class="seg-num">' + D.pct(s.pct) + '</span></span></td></tr>';
    }).join("");
  }
  function esqueletoSegmentos(){
    var fila = '<tr><td><span class="skel" style="width:220px"></span></td><td><span class="skel" style="width:56px"></span></td>' +
      '<td><span class="skel" style="width:110px"></span></td><td><span class="skel" style="width:80%"></span></td></tr>';
    var out = ""; for (var i = 0; i < 6; i++) out += fila;
    $("seg-filas").innerHTML = out;
  }
  function pintarBotonSegmentos(){
    var a = estado.segAbierto;
    $("btn-segmentos").setAttribute("aria-expanded", String(a));
    $("btn-segmentos-txt").textContent = a ? "Ocultar detalle" : "Ver detalle";
    $("btn-segmentos-flecha").innerHTML = a ? SVG_ARRIBA : SVG_ABAJO;
    mostrar("seg-tabla", a);
  }
  $("btn-segmentos").addEventListener("click", function(){ estado.segAbierto = !estado.segAbierto; pintarBotonSegmentos(); });

  function render(){
    var k = estado.periodo, p = PERIODOS[k];
    cerrarMenuExportar(); cerrarMenuFila(); window.clearTimeout(relojTabla);
    if (!p) { pintarPeriodo(null); bloque("Aún no hay un periodo seleccionado.", "Elige un periodo de recaudación para consultar la deuda consolidada."); return; }
    pintarPeriodo(k);
    if (!disponible(k)) { sinConsolidado(k); return; }
    mostrar("bloque", false);
    $("btn-exportar").disabled = false; $("btn-filtros").disabled = false; $("btn-segmentos").disabled = false;
    pintarTotales(k); pintarAntiguedad(k); pintarSegmentos(k); pintarBotonSegmentos();
    mostrar("totales", true); mostrar("antiguedad", true); mostrar("segmentos", true); mostrar("vistas", true);
    pintarCabecera(); pintarRapidos(); estado.pagina = 1; pintarFilas(); mostrar("tabla-card", true);
  }
  /* Periodo con deuda consolidada: totales, antigüedad, segmentos (si están
     abiertos) y tabla llegan con skeleton, como un mes cerrado en flujo. */
  function esqueleto(){
    mostrar("bloque", false); mostrar("vistas", true); pintarCabecera(); pintarRapidos();
    mostrar("filtros-aplicados", false); mostrar("sin-resultados", false); mostrar("tabla-datos", true);
    /* Medidas del skeleton de Figma: monto 190×20, UF 120×16, origen 96×16
       y 110×16, y métricas 96×16. */
    var MEDIDAS = {"t-deuda":[190,20], "t-eepc":[190,20], "t-deuda-uf":[120,16], "t-eepc-uf":[120,16],
      "t-o-flujo":[110,16], "t-o-stock":[110,16], "t-e-flujo":[110,16], "t-e-stock":[110,16]};
    ["t-deuda","t-deuda-uf","t-afiliados","t-total","t-pagado","t-eepc","t-eepc-uf","t-pagadores","t-pag-eepc","t-pag-nn",
     "t-o-flujo-lbl","t-o-flujo","t-o-stock-lbl","t-o-stock","t-e-flujo-lbl","t-e-flujo","t-e-stock-lbl","t-e-stock"].forEach(function(id){
      var m = MEDIDAS[id] || [96, 16];
      $(id).innerHTML = '<span class="skel" style="width:' + m[0] + 'px; height:' + m[1] + 'px"></span>';
    });
    D.GRUPOS.forEach(function(g, i){ $("a-" + i).innerHTML = '<span class="skel" style="width:80px; height:24px; margin:4px 0"></span>'; });
    esqueletoSegmentos(); pintarBotonSegmentos(); $("btn-segmentos").disabled = true;
    mostrar("totales", true); mostrar("antiguedad", true); mostrar("segmentos", true);
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
    return '<li role="option" data-valor="' + k + '" data-mostrar="' + PERIODOS[k].etiqueta + '" aria-selected="false">' + PERIODOS[k].etiqueta + '</li>';
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

  var relojPeriodo = null;
  $("btn-seleccionar").addEventListener("click", function(){
    var valor = $("periodo").value;
    if (!valor) { $("t-periodo").focus(); return; }
    var btn = this;
    window.clearTimeout(relojPeriodo); window.clearTimeout(relojTabla); cargando(btn, false);
    estado.periodo = valor; estado.vista = "afiliados"; estado.firma = "";
    reiniciarFiltros(); pintarVistas(); cerrarMenuExportar(); cerrarMenuFila();
    /* Error al consultar: la consulta no responde y la pantalla vuelve a
       quedar sin periodo, como «Error al generar» en flujo. */
    if (CFG.consulta === "error") {
      cargando(btn, true); pintarPeriodo(valor);
      bloque("Consultando deuda consolidada", "", "rueda");
      relojPeriodo = window.setTimeout(function(){
        cargando(btn, false); estado.periodo = ""; reiniciarPeriodo(); render(); abrirError();
      }, 1200);
      return;
    }
    /* Como un mes cerrado en flujo: con deuda consolidada, lo demás carga
       con skeleton. */
    pintarPeriodo(valor);
    if (disponible(valor)) {
      esqueleto();
      relojPeriodo = window.setTimeout(function(){ render(); }, 1200);
      return;
    }
    /* Sin deuda consolidada: la consulta responde con el estado de cada parte. */
    cargando(btn, true);
    bloque("Consultando deuda consolidada", "", "rueda");
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
     La lista trae todos los meses que suma la deuda consolidada, del más
     nuevo al más antiguo. «Limpiar» desmarca todo y deja el campo en «Todos». */
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
    var k = estado.periodo; if (!disponible(k)) return;
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

  /* clase (opcional): cambia el ancho del modal. */
  var disparadorModal = null;
  function abrirConsulta(titulo, glosa, grupos, contenido, boton, clase){
    $("c-modal").className = "modal" + (clase ? " " + clase : "");
    $("c-titulo").textContent = titulo; $("c-glosa").textContent = glosa;
    $("c-ctx").innerHTML = ctx(grupos); $("c-ctx").hidden = !grupos.length;
    $("c-contenido").innerHTML = contenido; $("c-contenido").hidden = !contenido;
    disparadorModal = boton || null; mostrar("scrim-consulta", true); $("c-x").focus();
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
  /* Origen va al final, como un dato más del registro. */
  function abrirDetalle(tipo, id, boton){
    var k = estado.periodo;
    if (tipo === "a") {
      var f = D.registro(k, "a", id), p = D.persona(f.p);
      abrirConsulta("Detalle de la deuda consolidada", "Revisa los montos de esta cotización y sus pagadores.",
        [{crece:true, datos:[["Afiliado", nombreRut(p.nombre, p.rut)]]}, {datos:[["Tipo cotizante", p.tipo]]},
         {datos:[["N° de EEPC", String(f.nEepc)]]}, {datos:[["Periodo de remuneración", f.adeudado]]}, {datos:[["Origen", tag(f.origen)]]}],
        montosModal(f.total, f.pagado, f.deuda) + pagadoresModal(D.lineas(k, f)), boton);
    } else {
      var l = D.registro(k, "l", id), q = D.persona(l.p), g = D.pagador(l), nn = l.tipoPag === "NN";
      abrirConsulta("Detalle de la deuda consolidada", "Revisa los montos de este pagador y cómo se reparte la cotización.",
        [{crece:true, datos:[["Pagador", nombreRut(g[1], g[0])], ["Afiliado", nombreRut(q.nombre, q.rut)]]},
         {datos:[["Tipo de pagador", l.tipoPag], ["Tipo cotizante", q.tipo]]}, {datos:[["Periodo de remuneración", l.adeudado]]}, {datos:[["Origen", tag(l.origen)]]}],
        montosModal(nn ? null : l.pactado, l.pagado, nn ? null : l.deuda) + pagadoresModal(D.lineas(k, l)), boton);
    }
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
    if (!$("scrim-consulta").hidden) { cerrarConsulta(); return; }
    if (!$("scrim-filtros").hidden) { cerrarFiltros(); return; }
  });

  /* ── Modal de error: se cierra solo con «Entendido» ──────────────────── */
  function abrirError(){ mostrar("scrim-error", true); $("e-entendido").focus(); }
  function cerrarError(){ mostrar("scrim-error", false); $("t-periodo").focus(); }
  $("e-entendido").addEventListener("click", cerrarError);

  /* ── Al cambiar de tipo de deuda, la vista queda como estaba ─────────── */
  /* Se guarda en la sesión del navegador: periodo, pestaña, filtros, página
     y si los segmentos están abiertos. «Deuda» en el menú vuelve a la vista
     inicial. */
  var GUARDADO = "fusion-consolidado";
  function leerGuardado(clave){ try { return JSON.parse(sessionStorage.getItem(clave)); } catch (e) { return null; } }
  /* Solo dentro de Deuda: al cambiar de tipo de deuda (o volver atrás entre
     ellos) la vista vuelve como quedó. Al recargar o al llegar desde otra
     sección, las tres parten de cero. */
  var desdeDeuda = false, llegada = ((performance.getEntriesByType && performance.getEntriesByType("navigation")[0]) || {}).type;
  try { desdeDeuda = sessionStorage.getItem("fusion-cambio") === "1"; sessionStorage.removeItem("fusion-cambio"); } catch (e) {}
  if (!desdeDeuda && !(llegada === "back_forward" && leerGuardado(GUARDADO))) {
    try { ["fusion-flujo", "fusion-stock", "fusion-consolidado"].forEach(function(c){ sessionStorage.removeItem(c); }); } catch (e) {}
  }
  /* Las otras dos opciones son enlaces con rol de radio: también responden
     a la barra espaciadora. */
  ["op-flujo", "op-stock"].forEach(function(id){
    $(id).addEventListener("click", function(){ try { sessionStorage.setItem("fusion-cambio", "1"); } catch (e) {} });
    $(id).addEventListener("keydown", function(e){ if (e.key === " ") { e.preventDefault(); this.click(); } });
  });
  /* Si el navegador la devuelve desde su caché y otra sección ya borró lo
     guardado, se recarga para partir de cero. */
  window.addEventListener("pageshow", function(e){ if (e.persisted && !leerGuardado(GUARDADO)) location.reload(); });
  window.addEventListener("pagehide", function(){
    try {
      sessionStorage.setItem(GUARDADO, JSON.stringify({caso:window.CASO, periodo:estado.periodo, vista:estado.vista, pagina:estado.pagina,
        porPagina:estado.porPagina, filtros:estado.filtros, rapidos:estado.rapidos, segAbierto:estado.segAbierto}));
    } catch (e) {}
  });
  /* Flujo y stock vuelven con su caso. */
  [["fusion-flujo", "op-flujo", "flujo.html"], ["fusion-stock", "op-stock", "stock.html"]].forEach(function(x){
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
    if (g.pagina > 1 && disponible(g.periodo)) { estado.pagina = Math.min(g.pagina, estado.paginas); pintarFilas(); }
  }
  var guardado = leerGuardado(GUARDADO);
  if (!(guardado && guardado.caso === window.CASO)) guardado = null;
  if (guardado) estado.segAbierto = !!guardado.segAbierto;

  pintarVistas();
  pintarBotonSegmentos();
  render();

  /* Acceso directo desde la portada: consolidado.html#periodo=sep abre la
     vista con ese periodo ya seleccionado y se quita de la dirección, para
     que al recargar vuelva la vista inicial. Sin él, vuelve la vista guardada. */
  var directo = /(?:^|&)periodo=(\w+)/.exec(location.hash.slice(1));
  var opDirecta = directo && document.querySelector('#lista-periodo li[data-valor="' + directo[1] + '"]');
  if (location.hash) try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
  if (opDirecta) { elegir(opDirecta.closest(".combo"), opDirecta); $("btn-seleccionar").click(); $("t-periodo").blur(); }
  else if (guardado) restaurar(guardado);
})();
