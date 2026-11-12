# Deuda de cotizaciones · prototipos HTML · Fase 2

Versión: v2.0 · Fecha: 27-10-2026 · Ajuste: 12-11-2026

Estos prototipos muestran funcionando la sección **Deuda** del Sistema de Recaudación CME con sus tres tipos de deuda: del mes (flujo), histórica (stock) y consolidada (flujo y stock), tal como está en el handoff de Figma.

## Qué es y qué no es

- **Es una referencia** de comportamiento, textos, estados y medidas. Sirve para ver cómo responde cada pantalla: qué carga, qué cambia y qué dice.
- **No es código de producción.** Usa datos de ejemplo y no se conecta a ningún servicio.
- **El diseño manda.** Si algo difiere entre un prototipo y el handoff de Figma, vale Figma.

## Los nueve prototipos

| Prototipo | Objetivo | Link |
|---|---|---|
| Principal | Recorrer la sección Deuda cuando todo sale bien: elegir el tipo de deuda, cargar la deuda histórica de un periodo, consultar la deuda consolidada y exportar | [deuda.html](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/deuda.html) |
| Deuda histórica con carga | Cargar otro archivo en un periodo que ya tiene uno: confirmar el reemplazo, revisar el historial de cargas y descargar sus archivos | [stock.html?caso=con-carga](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/stock.html?caso=con-carga) |
| Error del sistema al cargar | Ver qué pasa cuando el sistema no responde al cargar el archivo | [stock.html?caso=error-sistema](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/stock.html?caso=error-sistema) |
| Campos con errores | Ver el detalle de los campos vacíos o con formato incorrecto del archivo | [stock.html?caso=error-registros](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/stock.html?caso=error-registros) |
| Error al consultar la deuda histórica | Ver qué pasa cuando la consulta del periodo no responde | [stock.html?caso=error-consultar](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/stock.html?caso=error-consultar) |
| Error al exportar la deuda histórica | Ver qué pasa cuando falla la descarga del archivo | [stock.html?caso=error-exportar](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/stock.html?caso=error-exportar) |
| Error al descargar del historial | Ver qué pasa cuando falla la descarga de un archivo del historial de carga | [stock.html?caso=error-descargar](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/stock.html?caso=error-descargar) |
| Generación de la deuda consolidada | Recorrer los requisitos, la generación y sus casos: falla al generar, registros con errores, registros corregidos y deuda histórica reemplazada | [consolidado.html](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/consolidado.html) |
| Error al consultar la deuda consolidada | Ver qué pasa cuando la consulta del periodo no responde | [consolidado.html?caso=error-consultar](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/consolidado.html?caso=error-consultar) |
| Error al exportar la deuda consolidada | Ver qué pasa cuando falla la descarga del archivo | [consolidado.html?caso=error-exportar](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/consolidado.html?caso=error-exportar) |

El principal abre en Deuda, sin tipo de deuda elegido. Los casos abren con la deuda histórica o la consolidada ya elegida. En todos se elige un periodo en el selector y se presiona **Seleccionar**.

Todos los casos de la carga también se prueban en el principal, con los Excel de prueba: ver [Probar la carga](#probar-la-carga).

## Cómo recorrer cada uno

### Principal

Corresponde a la página «Happy path» del handoff: «FASE 2 / Carga & visualización deuda Stock» y «FASE 2 / Visualización deuda Consolidada».

1. Elegir **Deuda histórica** y un periodo:
   - «Octubre 2026»: periodo en curso, sin carga. Presionar **Cargar archivo** y elegir `deuda-stock-octubre-2026.xlsx` de los [Excel de prueba](#probar-la-carga).
   - «Septiembre 2026» o «Agosto 2026»: periodos anteriores, ya cargados.
2. Elegir **Deuda consolidada** y un periodo:
   - «Septiembre 2026» o «Agosto 2026»: la deuda del mes está cerrada y la histórica cargada. Abrir **Deuda por segmento** con «Ver detalle».
   - «Octubre 2026 · Requisitos listos»: presionar **Generar deuda consolidada**. Ver [Generación de la deuda consolidada](#generación-de-la-deuda-consolidada) para los demás casos de octubre.
   - «Julio 2026»: la deuda del mes está cerrada, pero la histórica no se cargó.
3. Abrir **Exportar** y elegir una opción.

Qué observar:

- La deuda histórica de un periodo considera las remuneraciones hasta dos meses antes: Octubre 2026 llega hasta Agosto 2026.
- Un periodo anterior de deuda histórica es solo consulta: **Cargar archivo** queda deshabilitado y el aviso de la carga parte con «Periodo cerrado.».
- Los totales de la deuda consolidada muestran su origen: la deuda del mes y la histórica que la forman.
- Cuando falta una de las dos partes, la deuda consolidada muestra el estado de cada una.
- Al cambiar de tipo de deuda, cada vista queda como estaba. **Deuda** en el menú lateral vuelve a la vista inicial.

### Deuda histórica con carga

Corresponde a «Carga de archivo» en la página «Errores / casuísticas».

1. Elegir «Octubre 2026», que ya tiene cargado `deuda-stock-octubre-2026.xlsx`.
2. Presionar **Cargar archivo** y elegir ese mismo archivo.
3. Presionar **Cargar archivo**, elegir `deuda-stock-octubre-2026-v2.xlsx` y confirmar el reemplazo.
4. Presionar **Revisar historial de cargas**.
5. Presionar **Descargar** en cualquiera de los archivos.

Qué observar:

- Mientras se valida el archivo, **Cargar archivo** queda en carga.
- Un archivo distinto se confirma antes de cargarlo y reemplaza completo al vigente.
- Un archivo idéntico al vigente no se carga y la deuda del periodo se mantiene.
- El historial aparece desde la segunda carga del periodo.
- Cada archivo del historial, vigente o reemplazado, se puede descargar. **Descargar** queda en carga y después aparece el aviso de éxito, con el historial abierto.

### Error del sistema al cargar

Corresponde a «Stock · Error del sistema».

1. Elegir «Octubre 2026», presionar **Cargar archivo** y elegir cualquier Excel.

Qué observar:

- Aparece el modal «Tuvimos un problema» y el periodo queda como estaba.

### Campos con errores

Corresponde a «Stock · Campos con errores».

1. Elegir «Octubre 2026», presionar **Cargar archivo** y elegir cualquier Excel.

Qué observar:

- El modal lista los campos vacíos o con formato incorrecto, con su fila y su motivo, y se cierra con ✕.
- No se carga ningún registro.

### Error al consultar

Corresponde a «Stock · Error al consultar» y «Consolidado · Error al consultar».

1. Elegir cualquier periodo.

Qué observar:

- Aparece el modal «Tuvimos un problema» y la pantalla vuelve a quedar sin periodo seleccionado.

### Generación de la deuda consolidada

Corresponde a «Happy path / deuda consolidada» y a las casuísticas de la deuda consolidada.

«Octubre 2026» es el periodo en curso: la deuda consolidada se genera sin esperar el cierre del mes. Si en el mes se carga otra deuda histórica, se genera de nuevo. Al cerrar el mes ya no se carga deuda histórica y la deuda consolidada queda como se generó.

En el selector, «Octubre 2026» trae opciones de demostración, marcadas en gris. Solo existen en este prototipo:

| Opción | Qué muestra |
|---|---|
| Requisitos listos | Los tres requisitos cumplidos. **Generar deuda consolidada** genera la deuda del periodo. |
| Requisitos pendientes | Los tres requisitos pendientes: no se puede generar. |
| Error al generar | La generación falla y aparece el modal «Tuvimos un problema». |
| Registros con errores | La generación termina con registros con errores. **Ver registros** los lista y se pueden descargar desde Exportar. |
| Registros corregidos | Al consultar, avisa que ya hay una nueva versión. |
| Deuda histórica reemplazada | La deuda consolidada queda desactualizada y se genera de nuevo. |

Qué observar:

- Mientras se genera, la vista muestra la carga y pide mantenerse en ella.
- En **Historial de descargas**, al generar de nuevo (registros corregidos o deuda histórica reemplazada), las descargas anteriores se mantienen con la etiqueta «Versión anterior».

### Error al exportar

Corresponde a «Stock · Error al exportar» y «Consolidado · Error al exportar».

1. Elegir «Septiembre 2026».
2. Abrir **Exportar** y elegir cualquier opción.

Qué observar:

- El botón queda en carga y después aparece el aviso de error.
- El periodo sigue disponible y se puede reintentar.

## Probar la carga

Excel de ejemplo para la carga de la deuda histórica. No traen registros: cada uno indica qué resultado muestra el prototipo. Cada link descarga el archivo.

| Archivo | Resultado |
|---|---|
| [deuda-stock-octubre-2026.xlsx](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/archivos-de-prueba/deuda-stock-octubre-2026.xlsx) | Archivo base. Carga correcta. Si el periodo ya tiene este archivo, avisa que ya fue cargado. |
| [deuda-stock-octubre-2026-v2.xlsx](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/archivos-de-prueba/deuda-stock-octubre-2026-v2.xlsx) | Otra versión del archivo base. Con carga vigente, se confirma y la reemplaza. |
| [deuda-stock-octubre-2026-campos-con-errores.xlsx](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/archivos-de-prueba/deuda-stock-octubre-2026-campos-con-errores.xlsx) | Campos vacíos o con formato incorrecto. |
| [deuda-stock-octubre-2026-sistema-sin-respuesta.xlsx](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/archivos-de-prueba/deuda-stock-octubre-2026-sistema-sin-respuesta.xlsx) | El sistema no responde. |
| [deuda-stock-octubre-2026-excede-4-mb.xlsx](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/archivos-de-prueba/deuda-stock-octubre-2026-excede-4-mb.xlsx) | Pesa más de 4 MB. |

Cualquier otro Excel se carga como correcto.

Para probarlos, abrir el [principal](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/deuda.html), elegir **Deuda histórica** y «Octubre 2026», y presionar **Seleccionar**. Luego presionar **Cargar archivo** y elegir el Excel:

| Para probar | Elegir | Qué aparece |
|---|---|---|
| Campos con errores | `deuda-stock-octubre-2026-campos-con-errores.xlsx` | Modal «No pudimos cargar el archivo» con los campos y su fila. No se carga ningún registro. |
| Error del sistema | `deuda-stock-octubre-2026-sistema-sin-respuesta.xlsx` | Modal «Tuvimos un problema». El periodo queda como estaba. |
| Archivo que excede el peso | `deuda-stock-octubre-2026-excede-4-mb.xlsx` | Modal «El archivo excede el peso». El periodo queda como estaba. El máximo de 4 MB es referencial: lo define el equipo de desarrollo. |
| Carga correcta | `deuda-stock-octubre-2026.xlsx` | Loader y luego la deuda del periodo, con el aviso de la carga. |
| Archivo igual al vigente | Después de la carga correcta, otra vez `deuda-stock-octubre-2026.xlsx` | Modal «Este archivo ya fue cargado». La deuda del periodo se mantiene. |
| Reemplazo | Después de la carga correcta, `deuda-stock-octubre-2026-v2.xlsx` | Modal «Reemplazar archivo». Con **Reemplazar**, loader y luego el aviso con la carga nueva. **Revisar historial de cargas** muestra la carga anterior como reemplazada y permite descargar cada archivo. |

El archivo igual y el reemplazo necesitan que el periodo ya tenga una carga: primero va la carga correcta.

## Qué cambia en flujo desde la entrega N°1

- **Deuda histórica** deja de estar como «Próximamente» y abre su vista. Se suma **Deuda consolidada**.
- **Deuda** en el menú lateral vuelve a la vista inicial de Deuda, sin tipo de deuda elegido.
- Íconos de los avisos, colores y sombras quedan alineados con los estilos del proyecto en Figma.

Los casos de la entrega N°1 siguen disponibles en `flujo.html`, con `?caso=inconsistencias`, `sin-deuda`, `error-generar` y `error-exportar`.

## Ajustes del 02-11-2026

- En la deuda histórica, el aviso de un periodo cerrado parte con «Periodo cerrado.».
- En el historial de cargas, cada archivo, vigente o reemplazado, suma **Descargar**. Al terminar, aparece el aviso «El archivo se descargó correctamente».

## Ajustes del 03-11-2026

- En la deuda histórica, «Cargar archivo» sigue como botón terciario mientras se valida el archivo.
- Cuando el periodo no tiene carga, el formato y el peso máximo van bajo «Cargar archivo».
- «Última carga realizada…» usa un gris distinto al del texto de arriba.
- Un archivo de más de 4 MB abre el modal «El archivo excede el peso».
- En la deuda consolidada, el periodo en curso muestra las dos partes pendientes: «Pendiente de cierre» y «Pendiente de carga».

## Ajustes del 10-11-2026

En la deuda histórica, la tabla toma la estructura de la HU 4146. Los nombres y datos de las columnas son de ejemplo y pueden cambiar.

- Afiliados y Pagadores suman «RUT y nombre compensado» y «Segmento»; «Tipo cotizante» pasa a «Tipo de trabajador».
- **Ver filtros** abre montos, pago y tipo de trabajador. No repite los filtros rápidos de la pestaña.
- El RUT de los filtros rápidos toma puntos y guion al escribirlo, en el campo y en el chip.
- Tipo de trabajador suma DP (Dependiente - pensionado). Cada opción filtra solo su valor.
- **Ver detalle** muestra arriba nombre · RUT, deuda y periodo; debajo, la lista con los campos que no están en la tabla.
- Si falla la descarga de un archivo del historial, aparece el aviso «No pudimos descargar el archivo. Vuelve a intentarlo.».

## Ajustes del 11-11-2026

En la deuda consolidada:

- Se genera desde la vista cuando se cumplen los tres requisitos, con los casos de [Generación de la deuda consolidada](#generación-de-la-deuda-consolidada).
- La tabla toma la estructura de la deuda histórica y suma «Origen» (flujo o stock). Los filtros y **Ver detalle** siguen a la deuda histórica.
- Se suma la pestaña **Historial de descargas**. Al generar de nuevo, las descargas anteriores quedan con la etiqueta «Versión anterior» y se descargan tal como se bajaron.
- Texto de la deuda histórica reemplazada: «Hay una nueva deuda histórica. Genera la deuda consolidada nuevamente.».

En flujo, deuda histórica y deuda consolidada:

- La tabla muestra como máximo la cabecera y 10 filas. Con 25 o 50 filas por página, las filas se recorren con scroll dentro de la tabla, con la cabecera fija. Al cambiar de página, de filas por página, de filtros o de pestaña, vuelve arriba.
- En los modales, la cabecera con la ✕ queda fija al recorrer el contenido.

## Ajustes del 12-11-2026

En la deuda consolidada:

- Octubre queda como periodo en curso, con su propia deuda del mes. El aviso «Periodo cerrado» aparece solo en los periodos cerrados.
- En **Historial de descargas**, las filas con «Versión anterior» muestran los registros y el total de esa versión. La fecha lleva la hora con «hrs».
- La lista de periodos muestra cada opción en una línea.
- Texto de la deuda histórica reemplazada: «Se actualizó la deuda histórica. Debes volver a generar la deuda consolidada.».
- Texto del modal «Registros con errores», en una línea y igual al de la franja: «Hay 10 registros con errores. Revísalos y comunícate con soporte TI para resolverlos.».
- Los avisos «Se corrigieron los registros con errores» y «La deuda consolidada se actualizó» abren 300 ms después de que se muestra la vista.
- **Historial de descargas** vacío lleva la ampolleta, como los demás estados vacíos.
- En el modal «Registros con errores», **Cerrar** y **Descargar registros con errores** quedan siempre fijos y visibles, con 24 de espacio sobre ellos; si no cabe, solo la tabla hace scroll.
- En 1280, los montos de flujo y stock de los totales caben en una línea.

En flujo, deuda histórica y deuda consolidada:

- Al pasar el cursor por una fila, las columnas fijas toman el mismo fondo que el resto de la fila.

La versión entregada el 27-10-2026 queda en la marca `v2.0-entrega-ntt`.

## Dónde está lo demás

- **Pantallas, medidas y notas de cada estado:** handoff de Figma.
  - [Happy path · Deuda histórica](https://www.figma.com/design/WVlFKjquEjndqYyrQahokS/RC-Handoff-Gesti%C3%B3n-deuda?node-id=5094-51351)
  - [Happy path · Deuda consolidada](https://www.figma.com/design/WVlFKjquEjndqYyrQahokS/RC-Handoff-Gesti%C3%B3n-deuda?node-id=5098-93045)
  - [Errores / casuísticas · Deuda histórica](https://www.figma.com/design/WVlFKjquEjndqYyrQahokS/RC-Handoff-Gesti%C3%B3n-deuda?node-id=5094-73329)
  - [Errores / casuísticas · Deuda consolidada](https://www.figma.com/design/WVlFKjquEjndqYyrQahokS/RC-Handoff-Gesti%C3%B3n-deuda?node-id=5112-56476)
- **Racionales y reglas del módulo:** están en el Read me del handoff de Figma. Aquí no se repiten, para que exista una sola versión.
- **Entrega N°1 (deuda del mes):** [proyecto-deuda](https://jzamorano-ui.github.io/proyecto-deuda/), sin cambios.

## Sobre los datos

Los montos son de ejemplo y los totales cuadran entre sí. La deuda consolidada de un periodo es la suma de su deuda del mes y su deuda histórica.

## Archivos

```
index.html               abre deuda.html
deuda.html               principal: vista inicial de Deuda
flujo.html               deuda del mes
stock.html               deuda histórica
consolidado.html         deuda consolidada
recursos/
  estilos.css            estilos, con los tokens de color y tipografía al inicio
  estilos-fusion.css     selector de tipo de deuda
  estilos-stock.css      deuda histórica
  estilos-consolidado.css  deuda consolidada
  datos.js               datos de ejemplo de la deuda del mes
  datos-stock.js         datos de ejemplo de la deuda histórica
  datos-consolidado.js   datos de ejemplo de la deuda consolidada
  inicio.js, flujo.js, stock.js, consolidado.js   comportamiento
archivos-de-prueba/      Excel para la carga de la deuda histórica
```

Los HTML comparten los archivos de `recursos/`. Funcionan publicados y también abriéndolos directamente desde la carpeta.
