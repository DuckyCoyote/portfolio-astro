/*
 * Contact form controller.
 *
 * The form lives in /src/components/Contact.astro and exposes its elements
 * via data-* attributes. This module wires up behavior:
 *
 *   1. Read submission cooldown from localStorage and disable the submit
 *      button until it expires.
 *   2. Cap the number of submissions per day (default: 5).
 *   3. Validate the message content (length and obvious spam patterns).
 *   4. Call EmailJS to deliver the message. The library is imported only at
 *      submit time, so the submit handler is attached even if the import is
 *      blocked (ad blockers often block anything named "emailjs") — in that
 *      case the visitor gets an error pointing to the email address instead
 *      of a native form submission.
 *   5. Show one of four banners — success, error, cooldown, limit.
 *
 * Readability over cleverness: each step is its own short function so the
 * flow of `init()` reads like an English description of the workflow.
 */


/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ONE_MINUTE_MS = 60_000;

const COOLDOWN_MS = ONE_MINUTE_MS;       // Time between submissions
const MAX_ATTEMPTS_PER_DAY = 5;          // Hard cap per calendar day

const STORAGE_LAST_SUBMIT = 'last_submit_time';
const STORAGE_ATTEMPTS    = 'contact_attempts';

const SERVICE_ID  = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID  ?? 'YOUR_SERVICE_ID';
const TEMPLATE_ID = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID ?? 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY  = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY  ?? 'YOUR_PUBLIC_KEY';

const TO_EMAIL = 'daniel_719021@hotmail.es';

/* ------------------------------------------------------------------ */
/*  DOM lookups                                                        */
/* ------------------------------------------------------------------ */

function getFormElements() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  const name = document.querySelector<HTMLInputElement>('[data-contact-name]');
  const email = document.querySelector<HTMLInputElement>('[data-contact-email]');
  const message = document.querySelector<HTMLTextAreaElement>('[data-contact-message]');
  const submit = document.querySelector<HTMLButtonElement>('[data-contact-submit]');
  const counter = document.querySelector<HTMLElement>('[data-contact-counter]');
  const submitLabel = document.querySelector<HTMLElement>('[data-contact-submit-label]');
  const banner = document.querySelector<HTMLElement>('[data-contact-banner]');

  if (!form || !name || !email || !message || !submit || !submitLabel || !counter || !banner) {
    throw new Error('Contact form markup is missing required data-* attributes.');
  }

  return { form, name, email, message, submit, submitLabel, counter, banner };
}

/* ------------------------------------------------------------------ */
/*  Cooldown — tracks the time since the last successful submission.   */
/* ------------------------------------------------------------------ */

type CooldownState = { remaining: number };

function readCooldown(): CooldownState {
  const lastSubmitRaw = localStorage.getItem(STORAGE_LAST_SUBMIT);
  if (!lastSubmitRaw) return { remaining: 0 };

  const lastSubmitMs = parseInt(lastSubmitRaw, 10);
  const elapsed = Date.now() - lastSubmitMs;
  const remainingMs = COOLDOWN_MS - elapsed;

  return { remaining: remainingMs > 0 ? remainingMs : 0 };
}

function isWithinCooldown(): boolean {
  return readCooldown().remaining > 0;
}

function markSubmittedNow() {
  localStorage.setItem(STORAGE_LAST_SUBMIT, String(Date.now()));
}

/* ------------------------------------------------------------------ */
/*  Daily attempt counter                                              */
/* ------------------------------------------------------------------ */

function readAttemptCount(): number {
  const raw = localStorage.getItem(STORAGE_ATTEMPTS);
  if (!raw) return 0;

  try {
    const data = JSON.parse(raw) as { date: string; count: number };
    const today = new Date().toDateString();
    if (data.date !== today) {
      // Stale — reset for the new day.
      localStorage.setItem(STORAGE_ATTEMPTS, JSON.stringify({ date: today, count: 0 }));
      return 0;
    }
    return data.count;
  } catch {
    return 0;
  }
}

function incrementAttemptCount(): void {
  const today = new Date().toDateString();
  const newCount = readAttemptCount() + 1;
  localStorage.setItem(STORAGE_ATTEMPTS, JSON.stringify({ date: today, count: newCount }));
}

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

const SPAM_PATTERNS: RegExp[] = [
  /(.)\1{10,}/,                    // Same character repeated 10+ times
  /https?:\/\//i,                  // Any URL inside the message (no `g`: test() would keep lastIndex)
];

function isMessageValid(name: string, message: string): boolean {
  if (name.length < 2 || name.length > 100)     return false;
  if (message.length < 10 || message.length > 1000) return false;

  return !SPAM_PATTERNS.some((re) =>
    re.test(message) || re.test(name)
  );
}

/* ------------------------------------------------------------------ */
/*  Banner — shows one of: success, error, cooldown, limit.           */
/* ------------------------------------------------------------------ */

type BannerKind = 'success' | 'error' | 'cooldown' | 'limit';

function showBanner(
  banner: HTMLElement,
  kind: BannerKind,
  text: string,
): void {
  banner.textContent = text;
  banner.dataset.kind = kind;
  banner.hidden = false;
}

function hideBanner(banner: HTMLElement): void {
  banner.hidden = true;
  banner.textContent = '';
  banner.dataset.kind = '';
}

/* ------------------------------------------------------------------ */
/*  Submit button label                                                */
/* ------------------------------------------------------------------ */

/* Only the label <span> changes so the send icon stays in the button. */
function setSubmitLabel(
  submit: HTMLButtonElement,
  label: HTMLElement,
  text: string,
  disabled: boolean,
): void {
  submit.disabled = disabled;
  label.textContent = text;
}

/* ------------------------------------------------------------------ */
/*  Initialization                                                     */
/* ------------------------------------------------------------------ */

function init(): void {
  const { form, name, email, message, submit, submitLabel, counter, banner } = getFormElements();

  /* Keep the "message length" counter in sync with what the user types. */
  const updateCounter = () => {
    counter.textContent = String(message.value.length);
  };
  message.addEventListener('input', updateCounter);
  // "Borrar" resets the fields after the event fires, so read on the next tick.
  form.addEventListener('reset', () => {
    window.setTimeout(updateCounter);
    hideBanner(banner);
  });
  updateCounter();

  /* Tick down the cooldown every second. */
  const tickCooldown = () => {
    const { remaining } = readCooldown();
    if (remaining > 0) {
      const seconds = Math.ceil(remaining / 1000);
      setSubmitLabel(submit, submitLabel, `Espera ${seconds}s`, true);
    } else {
      setSubmitLabel(submit, submitLabel, 'Enviar mensaje', false);
    }
  };
  tickCooldown();
  setInterval(tickCooldown, 1000);

  /* The actual submit flow. */
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideBanner(banner);

    const nameValue = name.value.trim();
    const emailValue = email.value.trim();
    const messageValue = message.value.trim();

    // 1) Daily limit
    if (readAttemptCount() >= MAX_ATTEMPTS_PER_DAY) {
      showBanner(
        banner,
        'limit',
        `Has alcanzado el límite diario de mensajes (${MAX_ATTEMPTS_PER_DAY})`,
      );
      return;
    }

    // 2) Cooldown since last submission
    if (isWithinCooldown()) {
      const { remaining } = readCooldown();
      const seconds = Math.ceil(remaining / 1000);
      showBanner(banner, 'cooldown', `Espera ${seconds}s antes de enviar otro mensaje`);
      tickCooldown();
      return;
    }

    // 3) Content validation
    if (!isMessageValid(nameValue, messageValue)) {
      showBanner(
        banner,
        'error',
        'Error al enviar. Verifica que el mensaje sea válido.',
      );
      window.setTimeout(() => hideBanner(banner), 5000);
      return;
    }

    // 4) Send via EmailJS
    setSubmitLabel(submit, submitLabel, 'Enviando…', true);

    try {
      const { default: emailjs } = await import('@emailjs/browser');
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: nameValue,
          email: emailValue,
          title: nameValue,
          message: messageValue,
          to_email: TO_EMAIL,
        },
        PUBLIC_KEY,
      );

      markSubmittedNow();
      incrementAttemptCount();

      // Reset first: the reset handler hides the banner, so show it after.
      form.reset();
      updateCounter();
      showBanner(banner, 'success', '¡Mensaje enviado exitosamente!');
      tickCooldown();
      window.setTimeout(() => hideBanner(banner), 5000);
    } catch (err) {
      console.error('Error al enviar el mensaje:', err);
      showBanner(banner, 'error', `No se pudo enviar. Inténtalo de nuevo o escríbeme a ${TO_EMAIL}.`);
      setSubmitLabel(submit, submitLabel, 'Enviar mensaje', false);
      window.setTimeout(() => hideBanner(banner), 5000);
    }
  });
}

/* Boot only on the contact section so other pages don't crash. */
if (document.querySelector('[data-contact-form]')) {
  init();
}
