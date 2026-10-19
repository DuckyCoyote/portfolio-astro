/*
 * Single source of truth for portfolio content.
 *
 * Every section reads from this file. To customize the portfolio for a new
 * developer, edit only this file — the components will pick the changes
 * up automatically.
 *
 * The shape of each entry matches the data the corresponding component
 * needs; there is no abstraction for its own sake.
 */

/* ------------------------------------------------------------------ */
/*  Navigation                                                          */
/* ------------------------------------------------------------------ */

export const navItems = [
  { label: 'Inicio',      href: '#hero' },
  { label: 'Sobre mí',    href: '#about' },
  { label: 'Skills',      href: '#skills' },
  { label: 'Experiencia', href: '#experience' },
  { label: 'Proyectos',   href: '#projects' },
  { label: 'Contacto',    href: '#contact' },
] as const;

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

export const heroContent = {
  greeting: 'Hola.',
  name: 'Soy Alejo.',
  role: 'Full Stack Developer',
  status: 'Disponible para programar',
  tagline: 'Full Stack Developer especializado en crear experiencias digitales únicas',
  primaryCta: { label: 'Ver proyectos', href: '#projects' },
  secondaryCta: { label: 'Contáctame', href: '#contact' },
};

/* ------------------------------------------------------------------ */
/*  About                                                               */
/* ------------------------------------------------------------------ */

export const aboutContent = {
  title: 'Sobre mí',
  paragraphs: [
    'Soy Alejandro Daniel Cruz Hernandez, un desarrollador Full Stack con pasión por crear aplicaciones web modernas y funcionales. Mi viaje en la programación comenzó hace más de 2 años, y desde entonces no he parado de aprender y mejorar mis habilidades.',
    'Me especializo en construir experiencias de usuario excepcionales con tecnologías modernas, siempre buscando el equilibrio perfecto entre diseño y funcionalidad.',
  ],
  /* Rendered as a Mac "Get Info" panel: label → value. */
  facts: [
    { label: 'Tipo',        value: 'Desarrollador Full Stack' },
    { label: 'Experiencia', value: '2+ años programando' },
    { label: 'Combustible', value: '∞ cafés consumidos' },
    { label: 'Pasión',      value: 'El código limpio' },
  ],
  level: 'Mid Developer',
  levelProgress: 85,
  levelLabel: '85% XP',
};

/* ------------------------------------------------------------------ */
/*  Skills                                                              */
/* ------------------------------------------------------------------ */

export type SkillCategory = {
  title: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: ['Angular.js', 'React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'HTML/CSS'],
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Java', 'Express', 'PostgreSQL', 'Spring Boot', 'REST APIs'],
  },
  {
    title: 'Mobile',
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Expo', 'PWA'],
  },
  {
    title: 'Herramientas',
    skills: ['Git', 'Docker', 'AWS', 'Figma', 'Kubernetes', 'CI/CD'],
  },
];

export const skillStats = [
  { label: 'Proyectos',  value: '20+' },
  { label: 'Clientes',   value: '10+' },
  { label: 'Años Exp.',  value: '2+'  },
  { label: 'Cafés',      value: '∞'   },
];

/* ------------------------------------------------------------------ */
/*  Experience                                                          */
/* ------------------------------------------------------------------ */

export type Experience = {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
};

export const experiences: Experience[] = [
  {
    title: 'Full Stack Developer',
    company: 'Credibusiness',
    period: 'Mayo 2025 - Mayo 2026',
    description:
      'Trabajo con equipo de desarrollo, arquitectura de aplicaciones escalables, y desarrollo de software.',
    technologies: ['Angular.Js', 'Node.js', 'AWS', 'MySQL'],
  },
  {
    title: 'Full Stack Developer',
    company: 'Hey Banco',
    period: 'Mayo 2024 - Mayo 2025',
    description:
      'Desarrollo de aplicaciones web completas, implementación de APIs RESTful, y optimización de rendimiento.',
    technologies: ['Angular.Js', 'Spring Boot', 'PostgreSQL', 'Red Hat'],
  },
  {
    title: 'Full Stack Developer',
    company: 'AMX Contenido',
    period: 'Enero 2024 - Mayo 2024',
    description:
      'Creación de interfaces de usuario interactivas, implementación de diseños responsive, y desarrollo de API REST.',
    technologies: ['React', 'TypeScript', 'Express.Js', 'MySQL'],
  },
];

/* ------------------------------------------------------------------ */
/*  Projects                                                            */
/* ------------------------------------------------------------------ */

export type Project = {
  title: string;
  description: string;
  technologies: string[];
  image: string;       // empty string falls back to the generic project image
  link: string;
  github: string;
};

/* The generic project image is used as a fallback for projects without a
   dedicated screenshot. */
export const FALLBACK_PROJECT_IMAGE = '/images/generic-project.jpeg';

export const projects: Project[] = [
  {
    title: 'Operative System Web',
    description:
      'Sistema operativo basado en la web con gestión de archivos, aplicaciones integradas y personalización del usuario.',
    technologies: ['React', 'Node.js', 'TailwindCSS', 'TypeScript'],
    image: '/images/so-project.webp',
    link: 'https://so-simulation.netlify.app',
    github: 'https://github.com/DuckyCoyote/SO-simulation',
  },
  {
    title: 'Server Monitoring Dashboard',
    description:
      'Dashboard para monitoreo de servidores en tiempo real con alertas y análisis de rendimiento.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    image: '/images/server-manager.png',
    link: 'https://servermanagerfront.netlify.app',
    github: 'https://github.com/DuckyCoyote/server-manager-front',
  },
  {
    title: 'Task Manager Pro',
    description:
      'Aplicación de gestión de tareas con colaboración en tiempo real, notificaciones y análisis de productividad.',
    technologies: ['Next.js', 'Socket.io', 'PostgreSQL', 'Prisma'],
    image: '',
    link: '#',
    github: '#',
  },
  {
    title: 'Social Media Dashboard',
    description:
      'Dashboard para gestión de múltiples redes sociales con análisis de métricas y programación de publicaciones.',
    technologies: ['Vue.js', 'Express', 'Redis', 'Chart.js'],
    image: '',
    link: '#',
    github: '#',
  },
  {
    title: 'Portfolio Builder',
    description:
      'Herramienta para crear portfolios profesionales sin código, con plantillas personalizables y hosting incluido.',
    technologies: ['React', 'Tailwind', 'Firebase', 'Vercel'],
    image: '',
    link: '#',
    github: '#',
  },
  {
    title: 'Fitness Tracker',
    description:
      'App para seguimiento de ejercicios, nutrición y objetivos fitness con gráficos de progreso.',
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
export const contactIntro =
  'Estoy disponible para proyectos freelance, colaboraciones o posiciones full-time. No dudes en contactarme si tienes una idea interesante.';

/* ------------------------------------------------------------------ */
/*  Trash — the easter egg behind the desktop's Papelera icon           */
/* ------------------------------------------------------------------ */

export type TrashItem = {
  name: string;
  icon: 'document' | 'folder';
  note: string;   // shown in the window's status strip when selected
};

export const trashItems: TrashItem[] = [
  { name: 'hola_mundo.html', icon: 'document', note: 'Mi primer programa. Funcionaba en mi máquina.' },
  { name: 'node_modules',    icon: 'folder',   note: 'Pesaba más que el proyecto entero.' },
  { name: 'TODO.txt',        icon: 'document', note: '"Lo arreglo después." Nunca fue después.' },
  { name: 'estilos.css',     icon: 'document', note: '214 usos de !important. Especificidad: sí.' },
  { name: 'deploy_viernes.sh', icon: 'document', note: 'Ejecutado un viernes a las 18:00. Nunca más.' },
];

/* ------------------------------------------------------------------ */
/*  Misc                                                                */
/* ------------------------------------------------------------------ */

export const siteMeta = {
  title: 'Portfolio - Alejadron',
  description:
    'Portfolio de Alejadron, desarrollador Full Stack especializado en tecnologías modernas.',
  author: 'Alejandro Daniel Cruz Hernandez',
};
