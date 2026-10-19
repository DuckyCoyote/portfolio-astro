/*
 * Interface text for server-rendered markup, one block per language.
 * Content (bio, jobs, projects…) is not here: see src/data/portfolio.ts.
 *
 * `en` is typed from `es`, so a missing translation is a type error.
 */

import { CLIENT_STRINGS } from './client';

const es = {
  ...CLIENT_STRINGS.es,
  nav: {
    label: 'Principal',
    about: 'Acerca de Alejo…',
    controlPanel: 'Panel de control…',
    clock: 'Hora local',
    switchLanguage: 'Ver en inglés',
  },
  hero: {
    window: 'Léeme',
    available: 'Disponible',
    terminal: 'Terminal',
    statusFile: 'estado.txt',
    shortcuts: 'Accesos directos',
  },
  about: {
    story: 'Mi historia',
    info: 'Información',
    level: 'Nivel',
    meter: (label: string) => `Experiencia: ${label}`,
  },
  skills: {
    window: 'Skills y tecnologías',
    role: 'Rol',
  },
  experience: {
    window: 'Experiencia',
    jobs: (count: number) => `${count} puestos`,
    since: (year: number) => `Desde ${year}`,
    newestFirst: 'Más reciente primero',
    columns: { role: 'Puesto', company: 'Empresa', period: 'Período' },
    technologies: 'Tecnologías',
  },
  projects: {
    window: 'Proyectos',
    total: (count: number) => `${count} proyectos`,
    live: (count: number) => `${count} publicados`,
    inProgress: (count: number) => `${count} en desarrollo`,
    statusLive: 'Publicado',
    statusInProgress: 'En desarrollo',
    screenshot: (title: string) => `Captura del proyecto ${title}`,
    open: 'Abrir',
    code: 'Código',
  },
  contact: {
    title: 'Contacto',
    lead: 'Envíame un mensaje y te respondo por email.',
    name: 'Nombre',
    namePlaceholder: 'Tu nombre',
    email: 'Email',
    emailPlaceholder: 'tu@email.com',
    message: 'Mensaje',
    messagePlaceholder: 'Cuéntame tu idea (mínimo 10 caracteres)',
    clear: 'Borrar',
    terminal: 'contacto.sh',
    readme: 'léeme.txt',
    listCommand: 'contacto --list',
    phone: 'teléfono',
    available: 'Disponible',
  },
  trashUi: {
    name: 'Papelera',
    open: 'Papelera (doble clic para abrir)',
    disk: '12K en disco',
    lessons: '∞ lecciones aprendidas',
    empty: 'La papelera está vacía. Como mi lista de bugs… casi.',
    emptyButton: 'Vaciar papelera',
    restore: 'Restaurar archivos',
    alertTitle: '¿Vaciar la Papelera?',
    alertText: (count: number) =>
      `Se eliminarán ${count} elementos para siempre. Bueno… siguen en el historial de git.`,
    cancel: 'Cancelar',
    confirm: 'Vaciar',
  },
  preferences: {
    title: 'Panel de control',
    lead: 'Los cambios se guardan en este navegador.',
    language: 'Idioma',
    appearance: 'Apariencia',
    themes: { system: 'Automático (como el sistema)', light: 'Claro', dark: 'Oscuro' },
    terminalFont: 'Fuente de la terminal',
    done: 'Listo',
  },
  window: {
    close: 'Cerrar ventana',
  },
  footer: '© 2026 Alejo. Hecho con ❤️ y píxeles.',
};

export type UiStrings = typeof es;

const en: UiStrings = {
  ...CLIENT_STRINGS.en,
  nav: {
    label: 'Main',
    about: 'About Alejo…',
    controlPanel: 'Control Panel…',
    clock: 'Local time',
    switchLanguage: 'Ver en español',
  },
  hero: {
    window: 'Read Me',
    available: 'Available',
    terminal: 'Terminal',
    statusFile: 'status.txt',
    shortcuts: 'Shortcuts',
  },
  about: {
    story: 'My story',
    info: 'Get Info',
    level: 'Level',
    meter: (label) => `Experience: ${label}`,
  },
  skills: {
    window: 'Skills & technologies',
    role: 'Role',
  },
  experience: {
    window: 'Experience',
    jobs: (count) => `${count} roles`,
    since: (year) => `Since ${year}`,
    newestFirst: 'Newest first',
    columns: { role: 'Role', company: 'Company', period: 'Period' },
    technologies: 'Technologies',
  },
  projects: {
    window: 'Projects',
    total: (count) => `${count} projects`,
    live: (count) => `${count} live`,
    inProgress: (count) => `${count} in progress`,
    statusLive: 'Live',
    statusInProgress: 'In progress',
    screenshot: (title) => `Screenshot of ${title}`,
    open: 'Open',
    code: 'Code',
  },
  contact: {
    title: 'Contact',
    lead: "Send me a message and I'll reply by email.",
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    emailPlaceholder: 'you@email.com',
    message: 'Message',
    messagePlaceholder: 'Tell me about your idea (10 characters minimum)',
    clear: 'Clear',
    terminal: 'contact.sh',
    readme: 'readme.txt',
    listCommand: 'contact --list',
    phone: 'phone',
    available: 'Available',
  },
  trashUi: {
    name: 'Trash',
    open: 'Trash (double-click to open)',
    disk: '12K in disk',
    lessons: '∞ lessons learned',
    empty: 'The Trash is empty. Like my bug list… almost.',
    emptyButton: 'Empty Trash',
    restore: 'Restore files',
    alertTitle: 'Empty the Trash?',
    alertText: (count) =>
      `This permanently removes ${count} items. Well… they're still in the git history.`,
    cancel: 'Cancel',
    confirm: 'Empty',
  },
  preferences: {
    title: 'Control Panel',
    lead: 'Changes are saved in this browser.',
    language: 'Language',
    appearance: 'Appearance',
    themes: { system: 'Automatic (match system)', light: 'Light', dark: 'Dark' },
    terminalFont: 'Terminal font',
    done: 'Done',
  },
  window: {
    close: 'Close window',
  },
  footer: '© 2026 Alejo. Made with ❤️ and pixels.',
};

export const ui = { es, en } as const;
