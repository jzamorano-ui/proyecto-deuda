# Deuda de cotizaciones · prototipos HTML

## Entregas

| Entrega | Fecha | Qué incluye | Link |
|---|---|---|---|
| N°1 · Fase 1 | 30-09-2026 | Deuda del mes (flujo) | [proyecto-deuda](https://jzamorano-ui.github.io/proyecto-deuda/) |
| N°2 · Fase 2 | 27-10-2026 | Deuda histórica (stock) y deuda consolidada | [proyecto-deuda/fase-2](https://jzamorano-ui.github.io/proyecto-deuda/fase-2/) |

Lo que sigue es el Read me de la entrega N°1. La entrega N°2 tiene el suyo en [fase-2](fase-2/README.md).

---

Versión: v1.0 · Fecha: 30-09-2026

Estos cinco prototipos muestran funcionando el módulo **Deuda de cotizaciones** del Sistema de Recaudación CME, tal como está en el handoff de Figma.

## Qué es y qué no es

- **Es una referencia** de comportamiento, textos, estados y medidas. Sirve para ver cómo responde cada pantalla: qué carga, qué cambia y qué dice.
- **No es código de producción.** Usa datos de ejemplo y no se conecta a ningún servicio.
- **El diseño manda.** Si algo difiere entre un prototipo y el handoff de Figma, vale Figma.

## Los cinco prototipos

| Prototipo | Objetivo | Link |
|---|---|---|
| Principal | Recorrer el flujo completo cuando todo sale bien | [happy-path-deuda.html](https://jzamorano-ui.github.io/proyecto-deuda/happy-path-deuda.html) |
| Deuda con inconsistencias | Ver el aviso y el detalle de los registros que no pasaron la validación | [inconsistencias.html](https://jzamorano-ui.github.io/proyecto-deuda/inconsistencias.html) |
| Periodo sin deuda | Ver la pantalla cuando el periodo no tiene deuda | [sin-deuda.html](https://jzamorano-ui.github.io/proyecto-deuda/sin-deuda.html) |
| Error al generar la deuda | Ver qué pasa cuando el sistema no logra generar la deuda | [error-generar.html](https://jzamorano-ui.github.io/proyecto-deuda/error-generar.html) |
| Error al exportar | Ver qué pasa cuando falla la descarga del archivo | [error-exportar.html](https://jzamorano-ui.github.io/proyecto-deuda/error-exportar.html) |

En todos se parte igual: elegir un periodo en el selector y presionar **Seleccionar**.

## Cómo recorrer cada uno

### Principal

Corresponde a la página «Happy path» del handoff y a «Deuda de meses anteriores».

1. Elegir un periodo:
   - «Septiembre 2026 (en curso)»: deuda preliminar.
   - «Septiembre 2026 (cerrado)»: el mismo mes con la deuda final.
   - Agosto, Julio o Junio 2026: meses anteriores.
2. Cambiar entre las pestañas **Afiliados** y **Pagadores**.
3. Abrir **Ver filtros**, aplicar un criterio y después **Limpiar filtros**.
4. Abrir **Exportar** y elegir una opción.
5. Abrir el menú ⋮ de una fila y entrar a cada detalle.

Qué observar:

- El mes en curso se genera y entra con loader y mensaje. Un mes anterior ya existe y entra con skeleton.
- Al cambiar de pestaña, la tabla entra con skeleton; los totales no se mueven.
- Exportar ofrece siempre «Deuda consolidada» y la deuda de la pestaña activa.
- Las dos variantes de septiembre existen solo para mostrar los dos estados del mismo mes. En la plataforma hay una a la vez.

### Deuda con inconsistencias

Corresponde a «Deuda con inconsistencias» en la página «Errores / casuísticas».

1. Elegir «Septiembre 2026 (varios tipos)» y presionar «Ver detalle» en el aviso.
2. Repetir con «Septiembre 2026 (un solo tipo)».

Qué observar:

- Con varios tipos, el modal muestra una pestaña por tipo, con su conteo y su regla.
- Con un solo tipo, el modal no lleva pestañas.
- El modal nunca supera el 85% del alto de la pantalla: si no cabe, la tabla hace scroll por dentro y el resto queda fijo.
- Qué se considera inconsistencia está pendiente de definición de producto. Los tipos y registros son de ejemplo y muestran la estructura.

### Periodo sin deuda

Corresponde a «Consulta sin deuda».

1. Elegir «Septiembre 2026».

Qué observar:

- Después del loader aparece el estado vacío, sin aviso, totales, tabla ni exportación.

### Error al generar la deuda

Corresponde a «Errores · Error al generar la deuda».

1. Elegir «Septiembre 2026».

Qué observar:

- Después del loader aparece el modal «Tuvimos un problema».
- El modal se cierra solo con «Entendido» y la pantalla queda sin periodo seleccionado.

### Error al exportar

Corresponde a «Errores · Error al exportar».

1. Elegir «Agosto 2026».
2. Abrir **Exportar** y elegir cualquier opción.

Qué observar:

- El botón queda en carga y después aparece el aviso de error.
- La tabla sigue disponible y se puede reintentar.

## Dónde está lo demás

- **Pantallas, medidas y notas de cada estado:** handoff de Figma.
  - [Happy path](https://www.figma.com/design/WVlFKjquEjndqYyrQahokS/RC-Handoff-Gesti%C3%B3n-deuda?node-id=5019-96440)
  - [Errores / casuísticas](https://www.figma.com/design/WVlFKjquEjndqYyrQahokS/RC-Handoff-Gesti%C3%B3n-deuda?node-id=5019-140337)
- **Racionales y reglas del módulo:** están en el Read me del handoff de Figma. Aquí no se repiten, para que exista una sola versión.

## Sobre los datos

Los nombres, RUT y montos son de ejemplo. Los totales, las filas y los detalles cuadran entre sí, así que se puede seguir un mismo caso de una pantalla a otra.

## Archivos

```
happy-path-deuda.html    principal
inconsistencias.html
sin-deuda.html
error-generar.html
error-exportar.html
recursos/
  estilos.css            estilos, con los tokens de color y tipografía al inicio
  datos.js               datos de ejemplo
  app.js                 comportamiento
```

Los cinco HTML comparten los archivos de `recursos/`. Funcionan publicados y también abriéndolos directamente desde la carpeta.
