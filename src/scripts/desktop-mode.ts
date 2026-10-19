/*
 * Is the page in "virtual desktops" mode right now?
 *
 * The mode is a preference (<html data-desktops>, see preferences.ts) that
 * only takes effect on large screens; on smaller ones the page stays a
 * continuous scroll. The media query matches the one in desktops.css.
 */

export const desktopQuery = window.matchMedia('(min-width: 64rem) and (min-height: 40rem)');

export const desktopsActive = (): boolean =>
  'desktops' in document.documentElement.dataset && desktopQuery.matches;
