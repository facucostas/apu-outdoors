# Cómo profesionalizar las fotos de producto de Apu Outdoors

Las fotos actuales son prototipos. Para reemplazarlas, hay dos caminos (se pueden combinar).
En ambos casos, **guardá la foto nueva con el mismo nombre de archivo** en `assets/img/`
y el sitio la toma automáticamente, sin tocar código:

| Archivo a reemplazar | Qué muestra |
|---|---|
| `producto-magnesiera.jpg` | Magnesiera naranja |
| `producto-bolsa-atardecer.jpg` | Bolsa de dormir en el terreno |
| `producto-detalle-pared.jpg` | Sombrero + magnesiera |
| `taller-costura.jpg` | Fabricación en el taller |
| `esencia-amanecer.jpg` | Bolsa de dormir al amanecer |

## Camino 1 — Sesión de fotos casera pero pro (recomendado)

Es el más honesto para una marca artesanal: el cliente vende SU producto real.

1. **Luz**: cerca de una ventana grande, de día, sin sol directo. Nunca flash.
2. **Fondo**: una pared lisa o una sábana neutra (crema, gris) sin arrugas; o mejor:
   roca, pasto seco, madera — el mundo Apu.
3. **Ángulo**: producto centrado, cámara a la altura del producto, no desde arriba.
4. **Serie**: 3 tomas por producto — frente, detalle de costura, en uso.
5. **Formato**: vertical 4:5 para producto, horizontal para escenas.
6. Editar con Snapseed/Lightroom móvil (gratis): subir un poco contraste y nitidez,
   temperatura levemente cálida, recorte parejo.

## Camino 2 — IA de retoque/generación

- **Retocar la foto real** (mantiene el producto verdadero): Photoshop
  (Generative Fill para limpiar fondos), Photoroom o Claid.ai — sacan el fondo
  del taller y ponen fondo de estudio o montaña.
- **Generar escena desde la foto real**: subir la foto del producto a una IA de
  imagen (Gemini, ChatGPT/DALL·E, Midjourney) con un prompt tipo:

> "Product photography of this handmade climbing chalk bag, placed on a granite
> rock at golden hour in the Andean highlands of Salta, Argentina, dry golden
> grass, snowy peak out of focus in the background, soft natural light,
> professional outdoor gear catalog style, 4:5"

⚠️ Ojo con generar el producto completo por IA: cambia costuras, correas y
detalles — el cliente estaría mostrando algo que no vende. Usar IA para el
**fondo y la luz**, no para inventar el producto.

## Al reemplazar

- Peso ideal por foto: menos de 300 KB (exportar a ~1600 px de ancho).
- Mantener los nombres de archivo exactos (tabla de arriba).
- Después de subir a hosting, refrescar con Ctrl+Shift+R.
