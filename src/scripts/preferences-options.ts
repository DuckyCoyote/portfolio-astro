/*
 * Preference values shared by the Panel de control markup, its controller
 * (preferences.ts) and the pre-paint script in BaseLayout.astro. The trash
 * easter egg (trash.ts) keeps its saved state under the same roof.
 *
 * The CSS that reacts to them lives in styles/tokens.css:
 *   <html data-theme="light|dark">          (absent = follow the OS)
 *   <html data-term-font="plex|jetbrains">  (absent = VT323)
 */

export const STORAGE_KEYS = {
  theme: 'pref-theme',
  terminalFont: 'pref-terminal-font',
  trash: 'trash-emptied',   // not a preference, but read before paint too
} as const;

export type Theme = 'system' | 'light' | 'dark';
export type TerminalFont = 'vt323' | 'plex' | 'jetbrains';

export const DEFAULT_THEME: Theme = 'system';
export const DEFAULT_TERMINAL_FONT: TerminalFont = 'vt323';

export const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'system', label: 'Automático (como el sistema)' },
  { value: 'light',  label: 'Claro' },
  { value: 'dark',   label: 'Oscuro' },
];

export const TERMINAL_FONT_OPTIONS: {
  value: TerminalFont;
  label: string;
  family: string;
  sampleSize: string;
}[] = [
  { value: 'vt323',     label: 'VT323 (CRT)',    family: '"VT323", monospace',          sampleSize: '1.3rem' },
  { value: 'plex',      label: 'IBM Plex Mono',  family: '"IBM Plex Mono", monospace',  sampleSize: '0.95rem' },
  { value: 'jetbrains', label: 'JetBrains Mono', family: '"JetBrains Mono", monospace', sampleSize: '0.9rem' },
];
