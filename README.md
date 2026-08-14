# RAP · Diario de Oración

PWA de oración diaria en español basada en el método **RAP**: **R**elación (devocional del día),
**A**mor (tres personas por quienes orar) y **P**etición (tu petición personal).

> "Nunca estás demasiado ocupado para no orar."

Inspirada en la metodología de oración de Ensancha Guatemala.

## Qué incluye

- **365 devocionales**, uno por día del año, con versículo, reflexión y declaración.
- **Método RAP** en tres pasos, con contactos frecuentes y marca de "ya oré".
- **12 versículos para memorizar** (uno por mes) con modo práctica.
- **Racha de constancia** con anillo de progreso y calendario mensual.
- **Muro de testimonios** para registrar oraciones respondidas.
- **5 temas de color**: Bosque, Marfil, Lavanda, Rosa y Azul.
- **Funciona sin conexión** e instalable como app en el teléfono.

Todos los datos (oraciones, testimonios, racha, ajustes) se guardan **solo en el dispositivo**,
en `localStorage`. No hay servidor ni cuentas: nada sale del teléfono. Desde Ajustes se puede
descargar una copia de seguridad y restaurarla.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # genera dist/ con base /RAP/
npm run preview  # sirve la build en http://localhost:4173/RAP/
```

Vite + JavaScript sin framework. Los componentes viven en `src/components/*.js` y exportan
funciones `render<X>(container, props)`; todos los estilos están en `src/style.css` sobre
variables CSS.

## Despliegue

Cada push a `main` publica automáticamente en GitHub Pages mediante
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

La build usa `base: '/RAP/'` porque Pages sirve el sitio en una subcarpeta. Para alojarla en la
raíz de otro dominio:

```bash
BASE_PATH=/ npm run build
```

## Tipografía

Newsreader (editorial) y Manrope (interfaz), cargadas desde Google Fonts. Sin conexión, la app
funciona igual pero cae a las fuentes del sistema.
