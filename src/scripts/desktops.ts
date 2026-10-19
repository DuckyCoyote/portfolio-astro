/*
 * Virtual desktops — each section is a full-screen desktop (experiment).
 *
 * Scrolling snaps one desktop at a time (styles in desktops.css). This
 * module adds what CSS can't:
 *
 *   • Windows open only once a switch has fully settled: when the snap
 *     scroll ends, the arriving desktop's windows zoom open in order, and
 *     the ones on the desktop just left close so they open again on return.
 *   • One wheel/trackpad gesture moves exactly one desktop. Native snapping
 *     alone would bounce short gestures back; here the rest of a gesture
 *     (trackpad inertia included) is ignored until the switch settles.
 *     Windows that can still scroll in that direction scroll first.
 *   • The pager in the menu bar marks the current desktop and jumps on click.
 *   • A small on-screen display names the desktop after each switch.
 *
 * It only acts while desktopsActive() — the preference is on and the screen
 * is large enough. Turning the mode off shows every window right away.
 */

import { openWindows, closeWindow, revealWindow, motionAllowed } from './motion';
import { desktopQuery, desktopsActive } from './desktop-mode';
import { clientStrings } from '../i18n/client';

const root = document.documentElement;
const OSD_MS = 700;
const GESTURE_GAP_MS = 220;   // wheel silence that ends one gesture

function init(): void {
  const pagerButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-desktop-target]'));
  const desktops = pagerButtons
    .map((button) => document.querySelector<HTMLElement>(button.dataset.desktopTarget!))
    .filter((desktop): desktop is HTMLElement => desktop !== null);
  if (desktops.length === 0) return;

  const windowsOf = (desktop: HTMLElement) =>
    Array.from(desktop.querySelectorAll<HTMLElement>('[data-zoom]'));

  let current = -1;
  let switching = false;   // a gesture-driven switch is in flight

  /* ---------- On-screen display ---------- */

  const osd = document.createElement('div');
  osd.className = 'desktop-osd';
  osd.setAttribute('aria-hidden', 'true');
  osd.innerHTML = `
    <div class="desktop-osd__pager">${desktops.map(() => '<span></span>').join('')}</div>
    <p class="desktop-osd__number"></p>
    <p class="desktop-osd__name"></p>`;
  document.body.append(osd);
  let osdTimer = 0;

  const showOsd = (index: number) => {
    osd.querySelectorAll('.desktop-osd__pager span').forEach((cell, i) =>
      cell.classList.toggle('is-current', i === index),
    );
    osd.querySelector('.desktop-osd__number')!.textContent = clientStrings().desktop(index + 1);
    osd.querySelector('.desktop-osd__name')!.textContent = pagerButtons[index].dataset.label ?? '';
    osd.classList.add('is-visible');
    clearTimeout(osdTimer);
    osdTimer = window.setTimeout(() => osd.classList.remove('is-visible'), OSD_MS);
  };

  /* ---------- Which desktop is on screen ---------- */

  const menubarHeight = () => document.querySelector('.menubar')?.getBoundingClientRect().height ?? 0;

  // The desktop whose top edge sits closest to the bottom of the menu bar.
  const desktopOnScreen = () => {
    const top = menubarHeight();
    let best = 0;
    desktops.forEach((desktop, i) => {
      const distance = Math.abs(desktop.getBoundingClientRect().top - top);
      if (distance < Math.abs(desktops[best].getBoundingClientRect().top - top)) best = i;
    });
    return best;
  };

  const markPager = (index: number) =>
    pagerButtons.forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });

  /* ---------- Arriving at a desktop ---------- */

  const settle = () => {
    switching = false;
    if (!desktopsActive()) return;
    const index = desktopOnScreen();
    if (index === current) return;
    const previous = current;
    current = index;
    markPager(index);

    if (previous !== -1) {
      showOsd(index);
      windowsOf(desktops[previous]).forEach(closeWindow);
    }

    const arriving = windowsOf(desktops[index]);
    if (motionAllowed()) openWindows(arriving, () => current === index);
    else arriving.forEach(revealWindow);
  };

  // `scrollend` fires once the snap has finished moving; older browsers get
  // a short quiet period instead.
  if ('onscrollend' in window) {
    window.addEventListener('scrollend', settle);
  } else {
    let quiet = 0;
    window.addEventListener('scroll', () => {
      clearTimeout(quiet);
      quiet = window.setTimeout(settle, 140);
    }, { passive: true });
  }

  pagerButtons.forEach((button, i) =>
    button.addEventListener('click', () => desktops[i].scrollIntoView()),
  );

  /* ---------- One gesture, one desktop ---------- */

  let lastWheel = 0;

  // Can something under the pointer still scroll this way? Then let it.
  const scrollsInside = (target: EventTarget | null, deltaY: number) => {
    for (let el = target as HTMLElement | null; el && el !== document.body; el = el.parentElement) {
      const { overflowY } = getComputedStyle(el);
      if (overflowY !== 'auto' && overflowY !== 'scroll') continue;
      if (deltaY > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
      if (deltaY < 0 && el.scrollTop > 0) return true;
    }
    return false;
  };

  window.addEventListener('wheel', (event) => {
    if (!desktopsActive() || event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    if (document.querySelector('dialog[open]')) return;
    if (scrollsInside(event.target, event.deltaY)) return;

    event.preventDefault();
    const now = performance.now();
    const newGesture = now - lastWheel > GESTURE_GAP_MS;
    lastWheel = now;
    if (switching || !newGesture) return;

    const from = current === -1 ? desktopOnScreen() : current;
    const to = Math.min(Math.max(from + Math.sign(event.deltaY), 0), desktops.length - 1);
    if (to === from) return;
    switching = true;
    desktops[to].scrollIntoView();
  }, { passive: false });

  /* ---------- Switching the mode on and off ---------- */

  const onModeChange = () => {
    if (desktopsActive()) {
      current = -1;
      settle();
    } else {
      // Continuous page: nothing should stay hidden waiting for a desktop.
      desktops.flatMap(windowsOf).forEach(revealWindow);
      osd.classList.remove('is-visible');
    }
  };

  new MutationObserver(onModeChange).observe(root, { attributes: true, attributeFilter: ['data-desktops'] });
  desktopQuery.addEventListener('change', onModeChange);

  // First desktop on load (also covers arriving at /#projects directly).
  requestAnimationFrame(() => setTimeout(settle, 100));
}

init();
