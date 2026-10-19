/*
 * Preferences controller — language, theme and terminal font.
 *
 * The saved values are already applied before first paint by the inline
 * script in BaseLayout.astro (so there is no flash of the wrong theme).
 * This module wires up the controls that change them:
 *
 *   1. The radios in the Panel de control dialog.
 *   2. The sun/moon toggle in the menu bar (flips light ↔ dark).
 *   3. The "Panel de control…" entry in the duck menu that opens the dialog.
 *   4. The language switch (menu bar link + Control Panel radios), which
 *      saves the choice and opens the other version at the same section.
 *
 * Theme and font changes apply to <html> immediately; all three are saved
 * to localStorage.
 */

import {
  STORAGE_KEYS,
  DEFAULT_THEME,
  DEFAULT_TERMINAL_FONT,
  DEFAULT_SCROLL_MODE,
  SCROLL_MODE_OPTIONS,
  THEME_OPTIONS,
  TERMINAL_FONT_OPTIONS,
  type Theme,
  type TerminalFont,
  type ScrollMode,
} from './preferences-options';
import { clientStrings } from '../i18n/client';

const root = document.documentElement;
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

/* ------------------------------------------------------------------ */
/*  Storage — wrapped because private windows can throw on access.     */
/* ------------------------------------------------------------------ */

function load(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function save(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Not persisted; the choice still applies for this visit. */
  }
}

const isTheme = (value: string | null): value is Theme =>
  THEME_OPTIONS.includes(value as Theme);

const isScrollMode = (value: string | null): value is ScrollMode =>
  SCROLL_MODE_OPTIONS.includes(value as ScrollMode);

const isTerminalFont = (value: string | null): value is TerminalFont =>
  TERMINAL_FONT_OPTIONS.some((option) => option.value === value);

/* ------------------------------------------------------------------ */
/*  Apply                                                              */
/* ------------------------------------------------------------------ */

function applyTheme(theme: Theme): void {
  if (theme === 'system') delete root.dataset.theme;
  else root.dataset.theme = theme;
}

function applyTerminalFont(font: TerminalFont): void {
  if (font === DEFAULT_TERMINAL_FONT) delete root.dataset.termFont;
  else root.dataset.termFont = font;
}

/* desktops.ts watches this attribute and takes it from there. */
function applyScrollMode(mode: ScrollMode): void {
  if (mode === 'desktops') root.dataset.desktops = '';
  else delete root.dataset.desktops;
}

/** The theme actually on screen, resolving "system" through the OS. */
function effectiveTheme(): 'light' | 'dark' {
  const explicit = root.dataset.theme;
  if (explicit === 'light' || explicit === 'dark') return explicit;
  return darkQuery.matches ? 'dark' : 'light';
}

/* ------------------------------------------------------------------ */
/*  Init                                                               */
/* ------------------------------------------------------------------ */

function init(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-preferences]');
  const openButton = document.querySelector<HTMLButtonElement>('[data-open-preferences]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  const themeRadios = document.querySelectorAll<HTMLInputElement>('[data-pref-theme]');
  const fontRadios = document.querySelectorAll<HTMLInputElement>('[data-pref-font]');

  const storedTheme = load(STORAGE_KEYS.theme);
  const storedFont = load(STORAGE_KEYS.terminalFont);
  let theme: Theme = isTheme(storedTheme) ? storedTheme : DEFAULT_THEME;
  const font: TerminalFont = isTerminalFont(storedFont) ? storedFont : DEFAULT_TERMINAL_FONT;

  const syncThemeControls = () => {
    themeRadios.forEach((radio) => (radio.checked = radio.value === theme));
    if (toggle) {
      const label = clientStrings().theme.switchTo(effectiveTheme() === 'dark' ? 'light' : 'dark');
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
    }
  };

  const setTheme = (value: Theme) => {
    theme = value;
    applyTheme(theme);
    save(STORAGE_KEYS.theme, theme);
    syncThemeControls();
  };

  themeRadios.forEach((radio) =>
    radio.addEventListener('change', () => isTheme(radio.value) && setTheme(radio.value)),
  );

  fontRadios.forEach((radio) => {
    radio.checked = radio.value === font;
    radio.addEventListener('change', () => {
      if (!isTerminalFont(radio.value)) return;
      applyTerminalFont(radio.value);
      save(STORAGE_KEYS.terminalFont, radio.value);
    });
  });

  const storedScroll = load(STORAGE_KEYS.scrollMode);
  const scrollMode: ScrollMode = isScrollMode(storedScroll) ? storedScroll : DEFAULT_SCROLL_MODE;
  document.querySelectorAll<HTMLInputElement>('[data-pref-scroll]').forEach((radio) => {
    radio.checked = radio.value === scrollMode;
    radio.addEventListener('change', () => {
      if (!isScrollMode(radio.value)) return;
      applyScrollMode(radio.value);
      save(STORAGE_KEYS.scrollMode, radio.value);
    });
  });

  // The quick toggle always picks an explicit theme: the opposite of what's showing.
  toggle?.addEventListener('click', () => setTheme(effectiveTheme() === 'dark' ? 'light' : 'dark'));

  // When following the OS, keep the toggle's label honest if the OS flips.
  darkQuery.addEventListener('change', syncThemeControls);

  openButton?.addEventListener('click', () => dialog?.showModal());

  // Language: remember the choice and land on the same section over there.
  const switchLanguage = (language: string, href: string) => {
    save(STORAGE_KEYS.language, language);
    window.location.href = href + window.location.hash;
  };

  document.querySelectorAll<HTMLAnchorElement>('[data-lang-switch]').forEach((link) =>
    link.addEventListener('click', (event) => {
      event.preventDefault();
      switchLanguage(link.dataset.langSwitch!, link.getAttribute('href')!);
    }),
  );

  document.querySelectorAll<HTMLInputElement>('[data-pref-lang]').forEach((radio) =>
    radio.addEventListener('change', () => switchLanguage(radio.value, radio.dataset.href!)),
  );

  syncThemeControls();
}

init();
