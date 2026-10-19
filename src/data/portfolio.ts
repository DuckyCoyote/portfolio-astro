/*
 * Single source of truth for portfolio content.
 *
 * Every section reads from this file. Text that changes with the language
 * is written as a Localized value — { es: '…', en: '…' } — right next to
 * the data that doesn't (links, technologies, images), so each project or
 * job is described in one place. Components pick the active language with
 * `l()` from getI18n() (see src/i18n).
 *
 * Interface text (buttons, labels, alerts) is not here: see src/i18n/ui.ts.
 */

import type { Localized } from '../i18n';

/* ------------------------------------------------------------------ */
/*  Navigation                                                          */
/* ------------------------------------------------------------------ */

export const navItems: { label: Localized; href: string }[] = [
  { label: { es: 'Inicio',      en: 'Home' },       href: '#hero' },
  { label: { es: 'Sobre mí',    en: 'About' },      href: '#about' },
  { label: { es: 'Skills',      en: 'Skills' },     href: '#skills' },
  { label: { es: 'Experiencia', en: 'Experience' }, href: '#experience' },
  { label: { es: 'Proyectos',   en: 'Projects' },   href: '#projects' },
  { label: { es: 'Contacto',    en: 'Contact' },    href: '#contact' },
];

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

export const heroContent = {
  greeting: { es: 'Hola.', en: 'Hi.' } as Localized,
  name: { es: 'Soy Alejo.', en: "I'm Alejo." } as Localized,
  role: 'Full Stack Developer',
  status: { es: 'Disponible para programar', en: 'Available for work' } as Localized,
  tagline: {
    es: 'Full Stack Developer especializado en crear experiencias digitales únicas',
    en: 'Full Stack Developer focused on building one-of-a-kind digital experiences',
  } as Localized,
  primaryCta: { label: { es: 'Ver proyectos', en: 'See projects' } as Localized, href: '#projects' },
  secondaryCta: { label: { es: 'Contáctame', en: 'Get in touch' } as Localized, href: '#contact' },
};

/* ------------------------------------------------------------------ */
/*  About                                                               */
/* ------------------------------------------------------------------ */

export const aboutContent = {
  title: { es: 'Sobre mí', en: 'About me' } as Localized,
  paragraphs: {
    es: [
      'Soy Alejandro Daniel Cruz Hernandez, un desarrollador Full Stack con pasión por crear aplicaciones web modernas y funcionales. Mi viaje en la programación comenzó hace más de 2 años, y desde entonces no he parado de aprender y mejorar mis habilidades.',
      'Me especializo en construir experiencias de usuario excepcionales con tecnologías modernas, siempre buscando el equilibrio perfecto entre diseño y funcionalidad.',
    ],
    en: [
      "I'm Alejandro Daniel Cruz Hernandez, a Full Stack developer with a passion for building modern, functional web applications. I started programming over 2 years ago and haven't stopped learning and sharpening my skills since.",
      'I specialise in building great user experiences with modern technologies, always looking for the right balance between design and functionality.',
    ],
  } as Localized<string[]>,
  /* Rendered as a Mac "Get Info" panel: label → value. */
  facts: [
    { label: { es: 'Tipo',        en: 'Kind' },       value: { es: 'Desarrollador Full Stack', en: 'Full Stack Developer' } },
    { label: { es: 'Experiencia', en: 'Experience' }, value: { es: '2+ años programando',      en: '2+ years coding' } },
    { label: { es: 'Combustible', en: 'Fuel' },       value: { es: '∞ cafés consumidos',       en: '∞ cups of coffee' } },
    { label: { es: 'Pasión',      en: 'Passion' },    value: { es: 'El código limpio',         en: 'Clean code' } },
  ] as { label: Localized; value: Localized }[],
  level: 'Mid Developer',
  levelProgress: 85,
  levelLabel: '85% XP',
};

/* ------------------------------------------------------------------ */
/*  Skills                                                              */
/* ------------------------------------------------------------------ */

export type SkillCategory = {
  title: Localized;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: { es: 'Frontend', en: 'Frontend' },
    skills: ['Angular.js', 'React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'HTML/CSS'],
  },
  {
    title: { es: 'Backend', en: 'Backend' },
    skills: ['Node.js', 'Java', 'Express', 'PostgreSQL', 'Spring Boot', 'REST APIs'],
  },
  {
    title: { es: 'Mobile', en: 'Mobile' },
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Expo', 'PWA'],
  },
  {
    title: { es: 'Herramientas', en: 'Tools' },
    skills: ['Git', 'Docker', 'AWS', 'Figma', 'Kubernetes', 'CI/CD'],
  },
];

export const skillStats: { label: Localized; value: string }[] = [
  { label: { es: 'Proyectos', en: 'Projects' },  value: '20+' },
  { label: { es: 'Clientes',  en: 'Clients' },   value: '10+' },
  { label: { es: 'Años Exp.', en: 'Years exp.' }, value: '2+'  },
  { label: { es: 'Cafés',     en: 'Coffees' },   value: '∞'   },
];

/* ------------------------------------------------------------------ */
/*  Experience                                                          */
/* ------------------------------------------------------------------ */

export type Experience = {
  title: string;
  company: string;
  period: Localized;
  description: Localized;
  technologies: string[];
};

export const experiences: Experience[] = [
  {
    title: 'Full Stack Developer',
    company: 'Credibusiness',
    period: { es: 'Mayo 2025 - Mayo 2026', en: 'May 2025 - May 2026' },
    description: {
      es: 'Trabajo con equipo de desarrollo, arquitectura de aplicaciones escalables, y desarrollo de software.',
      en: 'Working with the development team on scalable application architecture and software development.',
    },
    technologies: ['Angular.Js', 'Node.js', 'AWS', 'MySQL'],
  },
  {
    title: 'Full Stack Developer',
    company: 'Hey Banco',
    period: { es: 'Mayo 2024 - Mayo 2025', en: 'May 2024 - May 2025' },
    description: {
      es: 'Desarrollo de aplicaciones web completas, implementación de APIs RESTful, y optimización de rendimiento.',
      en: 'Built end-to-end web applications, implemented RESTful APIs and optimised performance.',
    },
    technologies: ['Angular.Js', 'Spring Boot', 'PostgreSQL', 'Red Hat'],
  },
  {
    title: 'Full Stack Developer',
    company: 'AMX Contenido',
    period: { es: 'Enero 2024 - Mayo 2024', en: 'January 2024 - May 2024' },
    description: {
      es: 'Creación de interfaces de usuario interactivas, implementación de diseños responsive, y desarrollo de API REST.',
      en: 'Built interactive user interfaces, implemented responsive designs and developed REST APIs.',
    },
    technologies: ['React', 'TypeScript', 'Express.Js', 'MySQL'],
  },
];

/* ------------------------------------------------------------------ */
/*  Projects                                                            */
/* ------------------------------------------------------------------ */

export type Project = {
  title: string;
  description: Localized;
  technologies: string[];
  image: string;       // empty string falls back to the generic project image
  link: string;        // "#" marks the project as in progress
  github: string;
};

/* The generic project image is used as a fallback for projects without a
   dedicated screenshot. */
export const FALLBACK_PROJECT_IMAGE = '/images/generic-project.jpeg';

export const projects: Project[] = [
  {
    title: 'Operative System Web',
    description: {
      es: 'Sistema operativo basado en la web con gestión de archivos, aplicaciones integradas y personalización del usuario.',
      en: 'A web-based operating system with file management, built-in apps and user customisation.',
    },
    technologies: ['React', 'Node.js', 'TailwindCSS', 'TypeScript'],
    image: '/images/so-project.webp',
    link: 'https://so-simulation.netlify.app',
    github: 'https://github.com/DuckyCoyote/SO-simulation',
  },
  {
    title: 'Server Monitoring Dashboard',
    description: {
      es: 'Dashboard para monitoreo de servidores en tiempo real con alertas y análisis de rendimiento.',
      en: 'Real-time server monitoring dashboard with alerts and performance analytics.',
    },
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    image: '/images/server-manager.png',
    link: 'https://servermanagerfront.netlify.app',
    github: 'https://github.com/DuckyCoyote/server-manager-front',
  },
  {
    title: 'Task Manager Pro',
    description: {
      es: 'Aplicación de gestión de tareas con colaboración en tiempo real, notificaciones y análisis de productividad.',
      en: 'Task management app with real-time collaboration, notifications and productivity insights.',
    },
    technologies: ['Next.js', 'Socket.io', 'PostgreSQL', 'Prisma'],
    image: '',
    link: '#',
    github: '#',
  },
  {
    title: 'Social Media Dashboard',
    description: {
      es: 'Dashboard para gestión de múltiples redes sociales con análisis de métricas y programación de publicaciones.',
      en: 'Dashboard for managing multiple social networks, with metrics and post scheduling.',
    },
    technologies: ['Vue.js', 'Express', 'Redis', 'Chart.js'],
    image: '',
    link: '#',
    github: '#',
  },
  {
    title: 'Portfolio Builder',
    description: {
      es: 'Herramienta para crear portfolios profesionales sin código, con plantillas personalizables y hosting incluido.',
      en: 'No-code tool for building professional portfolios, with customisable templates and hosting included.',
    },
    technologies: ['React', 'Tailwind', 'Firebase', 'Vercel'],
    image: '',
    link: '#',
    github: '#',
  },
  {
    title: 'Fitness Tracker',
    description: {
      es: 'App para seguimiento de ejercicios, nutrición y objetivos fitness con gráficos de progreso.',
      en: 'App for tracking workouts, nutrition and fitness goals, with progress charts.',
    },
    technologies: ['Flutter', 'Firebase', 'HealthKit', 'Charts'],
    image: '',
    link: '#',
    github: '#',
  },
];

/* ------------------------------------------------------------------ */
/*  Contact                                                             */
/* ------------------------------------------------------------------ */

/* Shown as `key  value` rows in the contact terminal. */
export type SocialLink = {
  label: string;
  handle: string;
  url: string;
};

export const contactEmail = 'daniel_719021@hotmail.es';

export const socialLinks: SocialLink[] = [
  { label: 'email',    handle: contactEmail,                          url: `mailto:${contactEmail}` },
  { label: 'github',   handle: 'github.com/DuckyCoyote',              url: 'https://github.com/DuckyCoyote' },
  { label: 'linkedin', handle: 'in/alejandro-daniel-cruz-hernández',  url: 'https://www.linkedin.com/in/alejandro-daniel-cruz-hernández-05bb0b200' },
];

export const contactPhone = '+34 123 456 789';
export const contactIntro: Localized = {
  es: 'Estoy disponible para proyectos freelance, colaboraciones o posiciones full-time. No dudes en contactarme si tienes una idea interesante.',
  en: "I'm available for freelance projects, collaborations and full-time roles. Don't hesitate to reach out if you have an interesting idea.",
};

/* ------------------------------------------------------------------ */
/*  Trash — the easter egg behind the desktop's trash icon              */
/* ------------------------------------------------------------------ */

export type TrashItem = {
  name: Localized;
  icon: 'document' | 'folder';
  note: Localized;   // shown in the window's status strip when selected
};

export const trashItems: TrashItem[] = [
  {
    name: { es: 'hola_mundo.html', en: 'hello_world.html' },
    icon: 'document',
    note: { es: 'Mi primer programa. Funcionaba en mi máquina.', en: 'My first program. It worked on my machine.' },
  },
  {
    name: { es: 'node_modules', en: 'node_modules' },
    icon: 'folder',
    note: { es: 'Pesaba más que el proyecto entero.', en: 'It weighed more than the whole project.' },
  },
  {
    name: { es: 'TODO.txt', en: 'TODO.txt' },
    icon: 'document',
    note: { es: '"Lo arreglo después." Nunca fue después.', en: '"I\'ll fix it later." Later never came.' },
  },
  {
    name: { es: 'estilos.css', en: 'styles.css' },
    icon: 'document',
    note: { es: '214 usos de !important. Especificidad: sí.', en: '214 uses of !important. Specificity: yes.' },
  },
  {
    name: { es: 'deploy_viernes.sh', en: 'friday_deploy.sh' },
    icon: 'document',
    note: { es: 'Ejecutado un viernes a las 18:00. Nunca más.', en: 'Run on a Friday at 6 pm. Never again.' },
  },
];

/* ------------------------------------------------------------------ */
/*  Misc                                                                */
/* ------------------------------------------------------------------ */

export const siteMeta = {
  title: { es: 'Portfolio - Alejadron', en: 'Portfolio - Alejadron' } as Localized,
  description: {
    es: 'Portfolio de Alejadron, desarrollador Full Stack especializado en tecnologías modernas.',
    en: 'Portfolio of Alejadron, a Full Stack developer specialising in modern technologies.',
  } as Localized,
  author: 'Alejandro Daniel Cruz Hernandez',
};
