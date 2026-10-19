/*
 * Motion — the desktop's animations, all borrowed from the classic Mac.
 *
 *   • Zoom rects: windows open with the Finder's expanding outlines, the
 *     first time they scroll into view (hero windows open on load).
 *   • Typewriter: terminals type their commands once their window is open;
 *     output appears line by line.
 *   • Desktop icons zoom out to the screen before jumping to their section.
 *   • Hero windows can be dragged by their title bar (wide screens only);
 *     double-click the title bar to put a window back.
 *
 * Nothing here is required to read the page. The inline script in
 * BaseLayout.astro sets <html data-motion> (unless reduced motion is on),
 * which hides [data-zoom] windows until this module opens them; if the
 * module never boots, that script drops the attribute after a few seconds.
 *
 * zoomRects() is exported for other desktop toys (see trash.ts), and the
 * window helpers (openWindows, closeWindow, revealWindow) for the virtual
 * desktops (desktops.ts), which take over window opening in that mode.
 */

import { desktopsActive } from './desktop-mode';

const root = document.documentElement;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/* ------------------------------------------------------------------ */
/*  Zoom rects                                                         */
/* ------------------------------------------------------------------ */

const ZOOM_STEPS = 7;
const ZOOM_STEP_MS = 18;

export type Box = { left: number; top: number; width: number; height: number };

/** True unless the visitor asked for reduced motion. */
export const motionAllowed = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Flash a series of outlines interpolated from one box to another. */
export function zoomRects(from: Box, to: Box): Promise<void> {
  const rects: HTMLElement[] = [];
  for (let i = 1; i <= ZOOM_STEPS; i++) {
    const t = i / ZOOM_STEPS;
    const rect = document.createElement('div');
    rect.className = 'zoom-rect';
    rect.style.left = `${from.left + (to.left - from.left) * t}px`;
    rect.style.top = `${from.top + (to.top - from.top) * t}px`;
    rect.style.width = `${from.width + (to.width - from.width) * t}px`;
    rect.style.height = `${from.height + (to.height - from.height) * t}px`;
    rect.style.animationDelay = `${(i - 1) * ZOOM_STEP_MS}ms`;
    rect.style.animationDuration = `${ZOOM_STEP_MS * 2}ms`;
    rects.push(rect);
  }
  document.body.append(...rects);
  return wait((ZOOM_STEPS + 1) * ZOOM_STEP_MS).then(() => rects.forEach((rect) => rect.remove()));
}

/** A box a tenth of the size of `box`, sharing its centre. */
function seedOf(box: Box): Box {
  const width = box.width * 0.1;
  const height = box.height * 0.1;
  return { left: box.left + (box.width - width) / 2, top: box.top + (box.height - height) / 2, width, height };
}

/**
 * Zoom hidden windows open one after another, then let any terminal inside
 * them type. `stillWanted` is checked before each window so a desktop that
 * was switched away from mid-way stops opening.
 */
export async function openWindows(
  wins: HTMLElement[],
  stillWanted: () => boolean = () => true,
): Promise<void> {
  const opened: HTMLElement[] = [];
  for (const win of wins) {
    if (win.classList.contains('is-open')) continue;
    if (!stillWanted()) return;
    const box = win.getBoundingClientRect();
    await zoomRects(seedOf(box), box);
    win.classList.add('is-open');
    opened.push(win);
  }
  for (const win of opened) {
    const session = win.querySelector<HTMLElement>('[data-typewriter]');
    if (session) await typewriter(session);
  }
}

/** Hide a window again so it can zoom open next time. */
export function closeWindow(win: HTMLElement): void {
  win.classList.remove('is-open');
}

/** Show a window at once, terminal fully typed — no animation. */
export function revealWindow(win: HTMLElement): void {
  win.classList.add('is-open');
  win.querySelectorAll<HTMLElement>('[data-typewriter]').forEach(finishTypewriter);
}

/* ------------------------------------------------------------------ */
/*  Typewriter                                                         */
/* ------------------------------------------------------------------ */

const TYPE_MS = 28;

/*
 * Each direct child of a [data-typewriter] session is one step:
 *   data-kind="cmd"  → its [data-text] is typed character by character
 *   data-stagger     → its children appear one after another
 *   anything else    → appears in one go
 * Pending steps keep their space (visibility, not display) so the
 * window never changes height while it types.
 */
function prepareTypewriter(session: HTMLElement): void {
  for (const step of Array.from(session.children) as HTMLElement[]) {
    step.classList.add('is-pending');
    if (step.hasAttribute('data-stagger')) {
      for (const item of Array.from(step.children)) item.classList.add('is-pending');
    }
  }
}

/* A session types once; reopening its window later shows it already typed. */
async function typewriter(session: HTMLElement): Promise<void> {
  if ('typed' in session.dataset) return;
  session.dataset.typed = '';
  for (const step of Array.from(session.children) as HTMLElement[]) {
    const text = step.querySelector<HTMLElement>('[data-text]');

    if (step.dataset.kind === 'cmd' && text) {
      const full = text.textContent ?? '';
      text.textContent = '';
      step.classList.remove('is-pending');
      for (const char of full) {
        text.textContent += char;
        await wait(TYPE_MS);
      }
      await wait(120);
    } else if (step.hasAttribute('data-stagger')) {
      step.classList.remove('is-pending');
      for (const item of Array.from(step.children)) {
        item.classList.remove('is-pending');
        await wait(40);
      }
    } else {
      step.classList.remove('is-pending');
      await wait(50);
    }
  }
}

/** Skip the animation: show every step of a session now. */
function finishTypewriter(session: HTMLElement): void {
  session.dataset.typed = '';
  session.querySelectorAll('.is-pending').forEach((step) => step.classList.remove('is-pending'));
}

/* ------------------------------------------------------------------ */
/*  Desktop icons                                                      */
/* ------------------------------------------------------------------ */

function wireDesktopIcons(): void {
  document.querySelectorAll<HTMLAnchorElement>('.desk-icon[href^="#"]').forEach((icon) => {
    icon.addEventListener('click', async (event) => {
      event.preventDefault();
      icon.classList.add('is-selected');
      const glyph = icon.querySelector('svg')?.getBoundingClientRect() ?? icon.getBoundingClientRect();
      await zoomRects(glyph, { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight });
      icon.classList.remove('is-selected');
      const href = icon.getAttribute('href')!;
      document.querySelector(href)?.scrollIntoView();
      history.pushState(null, '', href);
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Draggable hero windows                                             */
/* ------------------------------------------------------------------ */

const wideQuery = window.matchMedia('(min-width: 64rem) and (pointer: fine)');

function wireDragging(): void {
  const desktop = document.querySelector<HTMLElement>('#hero');
  if (!desktop) return;
  // Only the windows lying on the desktop — not ones inside dialogs.
  const windows = Array.from(desktop.querySelectorAll<HTMLElement>('.hero__windows > .window'));
  let topZ = 2;

  windows.forEach((win) => {
    const bar = win.querySelector<HTMLElement>('.window__titlebar');
    if (!bar) return;
    let x = 0;
    let y = 0;
    let start: { px: number; py: number; x: number; y: number; base: DOMRect } | null = null;

    const place = () => (win.style.translate = x || y ? `${x}px ${y}px` : '');

    bar.addEventListener('pointerdown', (event) => {
      if (!wideQuery.matches || event.button !== 0) return;
      if ((event.target as Element).closest('button')) return;   // e.g. a working close box
      event.preventDefault();
      bar.setPointerCapture(event.pointerId);
      win.style.zIndex = String(++topZ);
      const now = win.getBoundingClientRect();
      // Where the window would sit with no drag applied.
      const base = new DOMRect(now.left - x, now.top - y, now.width, now.height);
      start = { px: event.clientX, py: event.clientY, x, y, base };
      bar.classList.add('is-dragging');
    });

    bar.addEventListener('pointermove', (event) => {
      if (!start) return;
      const bounds = desktop.getBoundingClientRect();
      const nextX = start.x + event.clientX - start.px;
      const nextY = start.y + event.clientY - start.py;
      // Keep the whole window on the hero desktop.
      x = Math.min(Math.max(nextX, bounds.left - start.base.left), bounds.right - start.base.right);
      y = Math.min(Math.max(nextY, bounds.top - start.base.top), bounds.bottom - start.base.bottom);
      place();
    });

    const stop = () => {
      start = null;
      bar.classList.remove('is-dragging');
    };
    bar.addEventListener('pointerup', stop);
    bar.addEventListener('pointercancel', stop);

    bar.addEventListener('dblclick', () => {
      x = 0;
      y = 0;
      place();
    });

    wideQuery.addEventListener('change', () => {
      if (wideQuery.matches) return;
      x = 0;
      y = 0;
      place();
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Init                                                               */
/* ------------------------------------------------------------------ */

async function init(): Promise<void> {
  wireDragging();

  if (!('motion' in root.dataset)) return;   // reduced motion, or booted too late
  root.dataset.motionReady = '';

  const windows = Array.from(document.querySelectorAll<HTMLElement>('[data-zoom]'));
  document.querySelectorAll<HTMLElement>('[data-typewriter]').forEach(prepareTypewriter);
  wireDesktopIcons();

  // Continuous page: hero windows open in order on load; the rest wait to
  // be scrolled to. In virtual desktops mode desktops.ts does all of this,
  // once each desktop switch has settled.
  const hero = windows.filter((win) => win.closest('#hero'));
  const rest = windows.filter((win) => !hero.includes(win));

  const observer = new IntersectionObserver(
    (entries) => {
      if (desktopsActive()) return;
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, i) => {
          observer.unobserve(entry.target);
          setTimeout(() => openWindows([entry.target as HTMLElement]), i * 140);
        });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
  );
  rest.forEach((win) => observer.observe(win));

  if (desktopsActive()) return;
  await wait(100);
  await openWindows(hero);
}

init();
