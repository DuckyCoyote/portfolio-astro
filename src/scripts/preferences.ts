/*
 * Preferences controller — theme + terminal font.
 *
 * The saved values are already applied before first paint by the inline
 * script in BaseLayout.astro (so there is no flash of the wrong theme).
 * This module wires up the controls that change them:
 *
 *   1. The radios in the Panel de control dialog.
 *   2. The sun/moon toggle in the menu bar (flips light ↔ dark).
 *   3. The "Panel de control…" entry in the duck menu that opens the dialog.
 *
 * Every change is applied to <html> immediately and saved to localStorage.
 */

import {
  STORAGE_KEYS,
  DEFAULT_THEME,
  DEFAULT_TERMINAL_FONT,
  THEME_OPTIONS,
  TERMINAL_FONT_OPTIONS,
  type Theme,
  type TerminalFont,
} from './preferences-options';

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
  THEME_OPTIONS.some((option) => option.value === value);

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
      const next = effectiveTheme() === 'dark' ? 'claro' : 'oscuro';
      toggle.setAttribute('aria-label', `Cambiar a tema ${next}`);
      toggle.title = `Tema ${next}`;
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

  // The quick toggle always picks an explicit theme: the opposite of what's showing.
  toggle?.addEventListener('click', () => setTheme(effectiveTheme() === 'dark' ? 'light' : 'dark'));

  // When following the OS, keep the toggle's label honest if the OS flips.
  darkQuery.addEventListener('change', syncThemeControls);

  openButton?.addEventListener('click', () => dialog?.showModal());

  syncThemeControls();
}

init();
