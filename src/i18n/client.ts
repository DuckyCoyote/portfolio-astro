/*
 * Interface text needed by browser scripts (contact form, trash, theme
 * toggle, clock). Kept apart from ./ui.ts so the client bundles only carry
 * these strings; ui.ts re-exports them for server-rendered markup, so each
 * sentence exists exactly once.
 *
 * Scripts pick their language from <html lang> via `clientStrings()`.
 */

const es = {
  dateLocale: 'es-ES',
  form: {
    send: 'Enviar mensaje',
    sending: 'Enviando…',
    wait: (seconds: number) => `Espera ${seconds}s`,
    success: '¡Mensaje enviado exitosamente!',
    invalid: 'Revisa el mensaje: entre 10 y 1000 caracteres y sin enlaces.',
    cooldown: (seconds: number) => `Espera ${seconds}s antes de enviar otro mensaje.`,
    limit: (max: number) => `Has alcanzado el límite diario de mensajes (${max}).`,
    failed: (email: string) => `No se pudo enviar. Inténtalo de nuevo o escríbeme a ${email}.`,
  },
  trash: {
    items: (count: number) => `${count} ${count === 1 ? 'elemento' : 'elementos'}`,
    hint: 'Haz clic en un archivo para ver qué es.',
    achievement: '¡Cuac! Logro desbloqueado: mantenimiento preventivo.',
  },
  theme: {
    switchTo: (theme: 'light' | 'dark') => `Cambiar a tema ${theme === 'dark' ? 'oscuro' : 'claro'}`,
  },
};

export type ClientStrings = typeof es;

const en: ClientStrings = {
  dateLocale: 'en-GB',
  form: {
    send: 'Send message',
    sending: 'Sending…',
    wait: (seconds) => `Wait ${seconds}s`,
    success: 'Message sent successfully!',
    invalid: 'Check your message: 10 to 1000 characters and no links.',
    cooldown: (seconds) => `Wait ${seconds}s before sending another message.`,
    limit: (max) => `You've reached the daily message limit (${max}).`,
    failed: (email) => `Couldn't send it. Try again or email me at ${email}.`,
  },
  trash: {
    items: (count) => `${count} ${count === 1 ? 'item' : 'items'}`,
    hint: 'Click a file to see what it is.',
    achievement: 'Quack! Achievement unlocked: preventive maintenance.',
  },
  theme: {
    switchTo: (theme) => `Switch to ${theme} theme`,
  },
};

export const CLIENT_STRINGS = { es, en } as const;

/** Strings for the page's language, read from <html lang>. */
export function clientStrings(): ClientStrings {
  return document.documentElement.lang === 'en' ? en : es;
}
