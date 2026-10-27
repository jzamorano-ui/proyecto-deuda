# Deuda de cotizaciones · prototipos HTML · Fase 2

Versión: v2.0 · Fecha: 29-10-2026

Estos prototipos muestran funcionando la sección **Deuda** del Sistema de Recaudación CME con sus tres tipos de deuda: del mes (flujo), histórica (stock) y consolidada (flujo y stock), tal como está en el handoff de Figma.

## Qué es y qué no es

- **Es una referencia** de comportamiento, textos, estados y medidas. Sirve para ver cómo responde cada pantalla: qué carga, qué cambia y qué dice.
- **No es código de producción.** Usa datos de ejemplo y no se conecta a ningún servicio.
- **El diseño manda.** Si algo difiere entre un prototipo y el handoff de Figma, vale Figma.

## Los nueve prototipos

| Prototipo | Objetivo | Link |
|---|---|---|
| Principal | Recorrer la sección Deuda cuando todo sale bien: elegir el tipo de deuda, cargar la deuda histórica de un periodo, consultar la deuda consolidada y exportar | [deuda.html](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/deuda.html) |
| Deuda histórica con carga | Cargar otro archivo en un periodo que ya tiene uno: confirmar el reemplazo y revisar el historial de cargas | [stock.html?caso=con-carga](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/stock.html?caso=con-carga) |
| Error del sistema al cargar | Ver qué pasa cuando el sistema no responde al cargar el archivo | [stock.html?caso=error-sistema](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/stock.html?caso=error-sistema) |
| Campos con errores | Ver el detalle de los campos vacíos o con formato incorrecto del archivo | [stock.html?caso=error-registros](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/stock.html?caso=error-registros) |
| Error al consultar la deuda histórica | Ver qué pasa cuando la consulta del periodo no responde | [stock.html?caso=error-consultar](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/stock.html?caso=error-consultar) |
| Error al exportar la deuda histórica | Ver qué pasa cuando falla la descarga del archivo | [stock.html?caso=error-exportar](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/stock.html?caso=error-exportar) |
| Periodo sin deuda consolidada | Ver la pantalla cuando la deuda del mes no cierra y la histórica no se cargó | [consolidado.html?caso=sin-carga](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/consolidado.html?caso=sin-carga) |
| Error al consultar la deuda consolidada | Ver qué pasa cuando la consulta del periodo no responde | [consolidado.html?caso=error-consultar](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/consolidado.html?caso=error-consultar) |
| Error al exportar la deuda consolidada | Ver qué pasa cuando falla la descarga del archivo | [consolidado.html?caso=error-exportar](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/consolidado.html?caso=error-exportar) |

El principal abre en Deuda, sin tipo de deuda elegido. Los casos abren con la deuda histórica o la consolidada ya elegida. En todos se elige un periodo en el selector y se presiona **Seleccionar**.

## Cómo recorrer cada uno

### Principal

Corresponde a la página «Happy path» del handoff: «FASE 2 / Carga & visualización deuda Stock» y «FASE 2 / Visualización deuda Consolidada».

1. Elegir **Deuda histórica** y un periodo:
   - «Octubre 2026»: periodo en curso, sin carga. Presionar **Cargar archivo** y elegir `deuda-stock-octubre-2026.xlsx` de [archivos de prueba](#archivos-de-prueba).
   - «Septiembre 2026» o «Agosto 2026»: periodos anteriores, ya cargados.
2. Elegir **Deuda consolidada** y un periodo:
   - «Septiembre 2026» o «Agosto 2026»: la deuda del mes está cerrada y la histórica cargada. Abrir **Deuda por segmento** con «Ver detalle».
   - «Octubre 2026»: la deuda histórica está cargada, pero la del mes aún no cierra.
   - «Julio 2026»: la deuda del mes está cerrada, pero la histórica no se cargó.
3. Abrir **Exportar** y elegir una opción.

Qué observar:

- La deuda histórica de un periodo considera las remuneraciones hasta dos meses antes: Octubre 2026 llega hasta Agosto 2026.
- Un periodo anterior de deuda histórica es solo consulta: **Cargar archivo** queda deshabilitado.
- Los totales de la deuda consolidada muestran su origen: la deuda del mes y la histórica que la forman.
- Cuando falta una de las dos partes, la deuda consolidada muestra el estado de cada una.
- Al cambiar de tipo de deuda, cada vista queda como estaba. **Deuda** en el menú lateral vuelve a la vista inicial.

### Deuda histórica con carga

Corresponde a «Carga de archivo» en la página «Errores / casuísticas».

1. Elegir «Octubre 2026», que ya tiene cargado `deuda-stock-octubre-2026.xlsx`.
2. Presionar **Cargar archivo** y elegir ese mismo archivo.
3. Presionar **Cargar archivo**, elegir `deuda-stock-octubre-2026-v2.xlsx` y confirmar el reemplazo.
4. Presionar **Revisar historial de cargas**.

Qué observar:

- Mientras se valida el archivo, **Cargar archivo** queda en carga.
- Un archivo distinto se confirma antes de cargarlo y reemplaza completo al vigente.
- Un archivo idéntico al vigente no se carga y la deuda del periodo se mantiene.
- El historial aparece desde la segunda carga del periodo.

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

### Periodo sin deuda consolidada

Corresponde a «Consolidado · Periodo en curso».

1. Elegir «Octubre 2026».

Qué observar:

- El estado vacío muestra las dos partes pendientes: la deuda del mes sin cerrar y la histórica sin cargar.

### Error al exportar

Corresponde a «Stock · Error al exportar» y «Consolidado · Error al exportar».

1. Elegir «Septiembre 2026».
2. Abrir **Exportar** y elegir cualquier opción.

Qué observar:

- El botón queda en carga y después aparece el aviso de error.
- El periodo sigue disponible y se puede reintentar.

## Archivos de prueba

Excel de ejemplo para la carga de la deuda histórica, en [archivos-de-prueba](https://github.com/jzamorano-ui/proyecto-deuda/tree/main/fase-2/archivos-de-prueba). No traen registros: cada uno indica qué resultado muestra el prototipo.

| Archivo | Resultado |
|---|---|
| `deuda-stock-octubre-2026.xlsx` | Carga correcta. Si el periodo ya tiene este archivo, avisa que ya fue cargado. |
| `deuda-stock-octubre-2026-v2.xlsx` | Carga correcta, otra versión. Con carga vigente, se confirma y la reemplaza. |
| `deuda-stock-octubre-2026-campos-con-errores.xlsx` | Campos vacíos o con formato incorrecto. |
| `deuda-stock-octubre-2026-sistema-sin-respuesta.xlsx` | El sistema no responde. |

Cualquier otro Excel se carga como correcto.

## Qué cambia en flujo desde la entrega N°1

- **Deuda histórica** deja de estar como «Próximamente» y abre su vista. Se suma **Deuda consolidada**.
- **Deuda** en el menú lateral vuelve a la vista inicial de Deuda, sin tipo de deuda elegido.
- Íconos de los avisos, colores y sombras quedan alineados con los estilos del proyecto en Figma.

Los casos de la entrega N°1 siguen disponibles en `flujo.html`, con `?caso=inconsistencias`, `sin-deuda`, `error-generar` y `error-exportar`.

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
