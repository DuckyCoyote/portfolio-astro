/*
 * Papelera — the easter egg controller (markup in Trash.astro).
 *
 *   1. The desktop icon selects on click and opens on double click; a
 *      keyboard activation (Enter / Space) opens it straight away.
 *   2. The window zooms out of the icon. Clicking a file shows its note.
 *   3. "Vaciar papelera" → alert → files blink out one by one, the Mac's
 *      "Quack" alert sound plays, and an achievement shows up.
 *   4. The emptied state is saved; "Restaurar archivos" brings them back.
 *
 * <html data-trash="empty"> (also set before paint by BaseLayout.astro)
 * swaps the full icon for the empty one.
 */

import { zoomRects, motionAllowed } from './motion';
import { STORAGE_KEYS } from './preferences-options';
import { clientStrings } from '../i18n/client';

const root = document.documentElement;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const text = clientStrings().trash;

/* ------------------------------------------------------------------ */
/*  Storage                                                            */
/* ------------------------------------------------------------------ */

function loadEmptied(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.trash) === '1';
  } catch {
    return false;
  }
}

function saveEmptied(emptied: boolean): void {
  try {
    if (emptied) localStorage.setItem(STORAGE_KEYS.trash, '1');
    else localStorage.removeItem(STORAGE_KEYS.trash);
  } catch {
    /* Not persisted; still works for this visit. */
  }
}

/* ------------------------------------------------------------------ */
/*  Quack — a tiny synthesized take on the classic Mac alert sound.    */
/* ------------------------------------------------------------------ */

function quack(): void {
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1400;
  filter.connect(ctx.destination);

  // Two short nasal "quacks": a sawtooth sliding down, with a fast envelope.
  [0, 0.17].forEach((offset) => {
    const start = ctx.currentTime + offset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(560, start);
    osc.frequency.exponentialRampToValueAtTime(280, start + 0.13);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.12, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
    osc.connect(gain).connect(filter);
    osc.start(start);
    osc.stop(start + 0.15);
  });

  setTimeout(() => ctx.close(), 600);
}

/* ------------------------------------------------------------------ */
/*  Init                                                               */
/* ------------------------------------------------------------------ */

function init(): void {
  const icon = document.querySelector<HTMLButtonElement>('[data-trash-icon]');
  const dialog = document.querySelector<HTMLDialogElement>('[data-trash-dialog]');
  const alert = document.querySelector<HTMLDialogElement>('[data-trash-alert]');
  if (!icon || !dialog || !alert) return;

  const fileList = dialog.querySelector<HTMLElement>('[data-trash-files]')!;
  const files = Array.from(dialog.querySelectorAll<HTMLButtonElement>('.trash__file'));
  const emptyMessage = dialog.querySelector<HTMLElement>('[data-trash-empty-message]')!;
  const status = dialog.querySelector<HTMLElement>('[data-trash-status]')!;
  const emptyButton = dialog.querySelector<HTMLButtonElement>('[data-trash-empty]')!;
  const restoreButton = dialog.querySelector<HTMLButtonElement>('[data-trash-restore]')!;
  const itemCount = dialog.querySelector<HTMLElement>('.window__info span');

  let emptied = loadEmptied();

  const render = () => {
    root.dataset.trash = emptied ? 'empty' : 'full';
    fileList.hidden = emptied;
    emptyMessage.hidden = !emptied;
    emptyButton.hidden = emptied;
    restoreButton.hidden = !emptied;
    if (itemCount) itemCount.textContent = text.items(emptied ? 0 : files.length);
  };

  const selectFile = (file: HTMLButtonElement | null) => {
    files.forEach((other) => other.setAttribute('aria-pressed', String(other === file)));
    status.textContent = file?.dataset.note ?? text.hint;
  };

  /* ---------- Desktop icon: click selects, double click opens ---------- */

  const open = async () => {
    icon.classList.remove('is-selected');
    selectFile(null);
    if (emptied) status.textContent = '';
    dialog.showModal();
    if (!motionAllowed()) return;
    dialog.classList.add('is-zooming');
    // Zoom out of whichever glyph (full or empty) is showing.
    const glyph = Array.from(icon.querySelectorAll('svg')).find((svg) => svg.getClientRects().length > 0);
    const from = (glyph ?? icon).getBoundingClientRect();
    await zoomRects(from, dialog.getBoundingClientRect());
    dialog.classList.remove('is-zooming');
  };

  icon.addEventListener('click', (event) => {
    // detail === 0 means the keyboard pressed it: open right away.
    if (event.detail === 0) open();
    else icon.classList.add('is-selected');
  });
  icon.addEventListener('dblclick', open);
  document.addEventListener('click', (event) => {
    if (!icon.contains(event.target as Node)) icon.classList.remove('is-selected');
  });

  /* ---------- Window ---------- */

  dialog.querySelector('[data-window-close]')?.addEventListener('click', () => dialog.close());
  files.forEach((file) => file.addEventListener('click', () => selectFile(file)));

  emptyButton.addEventListener('click', () => {
    alert.returnValue = '';
    alert.showModal();
  });

  alert.addEventListener('close', async () => {
    if (alert.returnValue !== 'confirm') return;
    selectFile(null);
    if (motionAllowed()) {
      for (const file of files) {
        file.classList.add('is-trashed');
        await wait(80);
      }
      await wait(120);
    }
    quack();
    emptied = true;
    saveEmptied(true);
    render();
    status.textContent = text.achievement;
    restoreButton.focus();
  });

  restoreButton.addEventListener('click', () => {
    emptied = false;
    saveEmptied(false);
    files.forEach((file) => file.classList.remove('is-trashed'));
    render();
    selectFile(null);
    emptyButton.focus();
  });

  render();
}

init();
