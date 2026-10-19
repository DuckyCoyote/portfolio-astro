# 🎨 Portfolio Retro (Astro)

A pixel-perfect Astro port of the original React + Tailwind **Crear Portfolio Estética Retro** portfolio, rebuilt with **pure CSS** — no utility framework, no runtime UI library.

The design is intentionally bold: thick black borders, flat neon colors, hard offset shadows, no rounded corners — straight 80s / 90s neobrutalism.

---

## ✨ Highlights

- 🚀 **Astro 5** static output — zero JS by default, fastest possible deploy.
- 🎨 **Pure CSS** written by hand, organized into `tokens.css`, `base.css`, `components.css`, and `utilities.css`. No Tailwind.
- 🟢 **Same retro aesthetic** as the original: green-on-black, magenta corners, cream background, neobrutalist offset shadows.
- 📬 **EmailJS contact form** with rate limiting (1-minute cooldown + 5 messages per day).
- 📱 **Mobile-first responsive design** (no Tailwind, but breakpoints are written directly in the CSS).
- 🔧 **Single source of truth**: every visible string comes from `src/data/portfolio.ts`.

---

## 📦 Installation

```bash
npm install
```

## 🚀 Scripts

```bash
npm run dev      # local dev server on http://localhost:4321
npm run build    # static production build into ./dist
npm run preview  # preview the built site
```

---

## 📁 Project Layout

```
src/
├── components/         # One .astro file per section
│   ├── Icon.astro      # Inline SVG icons (Lucide paths)
│   ├── Navigation.astro
│   ├── Hero.astro
│   ├── About.astro
│   ├── Skills.astro
│   ├── Experience.astro
│   ├── Projects.astro
│   ├── Contact.astro
│   └── Footer.astro
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   └── index.astro
├── data/
│   └── portfolio.ts    # All copy + config — single source of truth
├── scripts/
│   └── contact-form.ts # Form behavior (vanilla TS + EmailJS)
└── styles/
    ├── tokens.css      # CSS custom properties (colors, spacing, etc.)
    ├── base.css        # Reset + global defaults
    ├── components.css  # Component classes (.card, .btn, ...)
    └── utilities.css   # Small helper classes (.grid--3, .anim-pulse, ...)
```

### Why this layout?

- **`tokens.css`** — every visual value lives here. To re-theme the portfolio, edit only this file.
- **`components.css`** — semantic, role-based classes (`section`, `card`, `btn`). The HTML reads like English.
- **`utilities.css`** — narrow one-purpose classes (`grid--3`, `text-2xl`, `anim-pulse`). Used sparingly, never invented on the fly.
- **`data/portfolio.ts`** — copy, projects, skills, social links. Change content without touching markup.

---

## 📧 EmailJS setup

1. Create an account on [emailjs.com](https://www.emailjs.com/).
2. Copy **Service ID**, **Template ID**, and **Public Key** from the dashboard.
3. Set them as environment variables (Vite-style, names must be prefixed with `PUBLIC_` because Astro exposes them to the client):

```env
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

If the variables are missing, the form falls back to safe placeholder strings so the site still loads.

---

## ✏️ Customization

All content lives in **`src/data/portfolio.ts`**:

| Want to change…           | Edit                                                                  |
| ------------------------- | --------------------------------------------------------------------- |
| Navigation links          | `navItems`                                                            |
| Hero copy                 | `heroContent`                                                         |
| About copy + XP bar       | `aboutContent`                                                        |
| Skills + categories       | `skillCategories` and `skillStats`                                    |
| Job history               | `experiences`                                                         |
| Projects, images, links   | `projects` (set `image: ''` to use the generic fallback)             |
| Social links              | `socialLinks`                                                         |
| Contact email / phone     | `contactEmail`, `contactPhone`                                        |
| Site title / meta         | `siteMeta`                                                            |

To re-theme colors, spacing, or shadows, edit **`src/styles/tokens.css`**.

---

## 📄 License

Open source — copy, fork, remix. Made with ❤️ and pixels.
