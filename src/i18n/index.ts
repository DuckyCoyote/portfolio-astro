/*
 * Internationalisation helpers.
 *
 * The site ships in Spanish (default, at "/") and English (at "/en/").
 * Two kinds of text are translated:
 *
 *   • Content (projects, jobs, bio…) lives in src/data/portfolio.ts, where
 *     each translatable field is a `Localized` value: { es: '…', en: '…' }.
 *     Keeping both languages side by side means a project's links and
 *     technologies are written once and can't drift between languages.
 *   • Interface text (buttons, labels, alerts) lives in ./ui.ts.
 *
 * Components call `getI18n(Astro)` and get back the locale, the interface
 * strings for it (`t`) and a function to pick a Localized value (`l`).
 */

import { ui } from './ui';

export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

/** A value written once per language. */
export type Localized<T = string> = Record<Locale, T>;

export const isLocale = (value: unknown): value is Locale =>
  LOCALES.includes(value as Locale);

/** Home page path for a locale: "/" or "/en/". */
export const localePath = (locale: Locale): string =>
  locale === DEFAULT_LOCALE ? '/' : `/${locale}/`;

/** Name of each language, written in that language (for the switcher). */
export const LANGUAGE_NAMES: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export function getI18n(astro: { currentLocale?: string }) {
  const locale: Locale = isLocale(astro.currentLocale) ? astro.currentLocale : DEFAULT_LOCALE;
  return {
    locale,
    t: ui[locale],
    l: <T>(value: Localized<T>): T => value[locale],
  };
}
