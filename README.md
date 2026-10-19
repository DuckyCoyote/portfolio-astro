# Portfolio Retro

Portfolio personal de Alejandro Daniel Cruz Hernández, desarrollador Full Stack, con la estética del Macintosh clásico de 1 bit y terminales TUI.

Es una página de una sola vista, pero cada sección es una ventana del escritorio: barras de título a rayas, trama de puntos de fondo, iconos pixelados y un menú desplegable con un pato en lugar de la manzana. Las terminales, en verde fósforo, son el único color de la página.

Construido con **Astro** y **CSS escrito a mano**, sin frameworks de UI ni de utilidades.

---

## Características

- **Escritorio Mac de 1 bit**: ventanas, diálogos, iconos de escritorio, vista de lista del Finder y panel "Obtener información".
- **Terminales TUI**: `neofetch`, paneles con borde doble y una sesión que escribe sus comandos al aparecer.
- **Español e inglés**: `/` y `/en/`, con selector en la barra de menús y en el Panel de control. Se recuerda el idioma elegido.
- **Tema claro y oscuro**: sigue al sistema operativo o se fija desde la barra de menús. La elección se guarda en el navegador.
- **Panel de control**: idioma, tema y fuente de las terminales (VT323, IBM Plex Mono o JetBrains Mono).
- **Animaciones del Finder**: las ventanas se abren con el zoom de rectángulos, los menús parpadean al elegir una opción y las ventanas del inicio se pueden arrastrar. Todo se desactiva con `prefers-reduced-motion`.
- **Formulario de contacto con EmailJS**: validación, espera de 1 minuto entre envíos y límite de 5 mensajes al día.
- **Accesible y responsive**: navegación por teclado, foco visible y diseño adaptado a móvil.
- **Contenido centralizado**: todo el texto vive en `src/data/portfolio.ts`.
- Y una sorpresa en la papelera.

---

## Instalación

```bash
npm install
```

## Scripts

```bash
npm run dev      # servidor local en http://localhost:4321
npm run build    # build estático en ./dist
npm run preview  # previsualiza el build
```

---

## Estructura

```
src/
├── components/
│   ├── Window.astro        # Marco de ventana (título a rayas, info, cuerpo)
│   ├── PixelIcon.astro     # Iconos de 1 bit dibujados desde rejillas de texto
│   ├── HomePage.astro      # La portada, compartida por los dos idiomas
│   ├── Navigation.astro    # Barra de menús, menú del pato, idioma, tema y reloj
│   ├── Hero.astro          # Escritorio inicial: "Léeme", terminal e iconos
│   ├── About.astro         # Historia + panel "Obtener información"
│   ├── Skills.astro        # Terminal con neofetch y paneles TUI
│   ├── Experience.astro    # Vista de lista del Finder
│   ├── Projects.astro      # Ventana con los proyectos
│   ├── Contact.astro       # Diálogo con el formulario + terminal de contacto
│   ├── Preferences.astro   # Panel de control (idioma, tema y fuente de terminal)
│   ├── Trash.astro         # Papelera
│   └── Footer.astro
├── layouts/
│   └── BaseLayout.astro    # <head>, preferencias antes del primer pintado, scripts
├── pages/
│   ├── index.astro         # Español ("/")
│   └── en/index.astro      # Inglés ("/en/")
├── data/
│   └── portfolio.ts        # Todo el contenido, en los dos idiomas
├── i18n/
│   ├── index.ts            # Idiomas, getI18n() y rutas
│   ├── ui.ts               # Textos de interfaz (botones, etiquetas, avisos)
│   └── client.ts           # Textos que usan los scripts del navegador
├── scripts/
│   ├── contact-form.ts     # Validación, límites y envío con EmailJS
│   ├── motion.ts           # Zoom de ventanas, escritura de terminales, arrastre
│   ├── preferences.ts      # Idioma, tema y fuente de terminal
│   ├── preferences-options.ts
│   └── trash.ts
└── styles/
    ├── tokens.css          # Colores (claro/oscuro), espaciado, tipografía
    ├── base.css            # Reset, fuentes y fondo del escritorio
    ├── components.css      # Ventana, terminal, botones, campos, diálogos…
    └── utilities.css
```

- **`tokens.css`**: cada color es un par `light-dark()`, así que el tema oscuro se define en el mismo sitio que el claro. Para cambiar la paleta, edita solo este archivo.
- **`Window.astro`**: todas las secciones lo usan; `variant="terminal"` convierte el cuerpo en una terminal.
- **`PixelIcon.astro`**: para añadir un icono, dibuja su rejilla con `X` (tinta), `o` (papel) y `.` (transparente).

---

## Configurar EmailJS

1. Crea una cuenta en [emailjs.com](https://www.emailjs.com/).
2. Copia el **Service ID**, el **Template ID** y la **Public Key**.
3. Crea un archivo `.env` en la raíz (ya está en `.gitignore`). Astro solo expone al navegador las variables con prefijo `PUBLIC_`:

```env
PUBLIC_EMAILJS_SERVICE_ID=tu_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=tu_public_key
```

4. Al desplegar (Netlify, Vercel…), define las mismas tres variables en el panel del hosting y añade tu dominio a los permitidos en EmailJS si lo tienes restringido.

La librería se carga al pulsar "Enviar". Si no puede cargarse (por ejemplo, por un bloqueador de anuncios), el formulario muestra un aviso con el email de contacto. Sin JavaScript, el formulario abre el cliente de correo del visitante.

---

## Personalizar

Todo el contenido está en **`src/data/portfolio.ts`**. Los textos que cambian con el idioma se escriben juntos, como `{ es: '…', en: '…' }`, al lado de los datos que no cambian (enlaces, tecnologías, imágenes):

| Para cambiar…                 | Edita                                         |
| ----------------------------- | --------------------------------------------- |
| Enlaces de navegación         | `navItems`                                    |
| Textos del inicio             | `heroContent`                                 |
| Historia, datos y barra de XP | `aboutContent`                                |
| Skills y estadísticas         | `skillCategories`, `skillStats`               |
| Experiencia                   | `experiences`                                 |
| Proyectos, imágenes, enlaces  | `projects` (`image: ''` usa la imagen genérica; `link: '#'` lo marca "En desarrollo") |
| Email, redes y teléfono       | `contactEmail`, `socialLinks`, `contactPhone` |
| Texto de contacto             | `contactIntro`                                |
| Archivos de la papelera       | `trashItems`                                  |
| Título y metadatos            | `siteMeta`                                    |

Los textos de la interfaz (botones, etiquetas, avisos del formulario y de la papelera) están en **`src/i18n/ui.ts`** y **`src/i18n/client.ts`**. El bloque en inglés está tipado a partir del español, así que si falta una traducción, TypeScript lo marca.

Colores, espaciado y tipografía se cambian en **`src/styles/tokens.css`**.

Al publicar, define `site` en `astro.config.mjs` con tu dominio para que los enlaces `hreflang` entre idiomas sean URLs absolutas.

---

## Licencia

Código abierto: cópialo, haz un fork, remézclalo. Hecho con ❤️ y píxeles.
