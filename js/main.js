/* =====================================================================
   Mirza Ki Mehfil — interactions
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initCountdown();
  initReveals();
  initNotifyModal();
});

/* ----------------------- Header scroll state ----------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  // Pages that opt into a permanently solid header (e.g. schedule) keep it.
  if (header.classList.contains('scrolled')) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --------------------------- Mobile nav ---------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMobile');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) setOpen(false);
  });
}

/* ---------------------------- Countdown ---------------------------- */
function initCountdown() {
  const elDays = document.getElementById('days');
  if (!elDays) return; // not on a page with a countdown

  const elHours = document.getElementById('hours');
  const elMinutes = document.getElementById('minutes');
  const elSeconds = document.getElementById('seconds');
  const target = new Date('2026-07-25T20:00:00').getTime();
  let timer;

  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      const grid = document.getElementById('countdown-grid');
      if (grid) grid.innerHTML = '<p class="count-done">The mehfil has begun.</p>';
      clearInterval(timer);
      return;
    }
    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff % 864e5) / 36e5);
    const m = Math.floor((diff % 36e5) / 6e4);
    const s = Math.floor((diff % 6e4) / 1e3);
    elDays.textContent = String(d).padStart(2, '0');
    elHours.textContent = String(h).padStart(2, '0');
    elMinutes.textContent = String(m).padStart(2, '0');
    elSeconds.textContent = String(s).padStart(2, '0');
  };

  tick();
  timer = setInterval(tick, 1000);
}

/* ------------------------- Scroll reveals -------------------------- */
function initReveals() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sib = [...entry.target.parentElement.querySelectorAll('.reveal')];
        entry.target.style.transitionDelay = Math.min(sib.indexOf(entry.target), 5) * 70 + 'ms';
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  items.forEach(el => io.observe(el));

  // Safety net: never leave content hidden if the observer never fires
  // (stalled JS, exotic browser). Reveal anything still pending after 3s.
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in)').forEach(el => {
      el.style.transitionDelay = '0ms';
      el.classList.add('in');
    });
  }, 3000);
}

/* --------------------- Notify / booking modal ---------------------- */
function initNotifyModal() {
  const modal = document.getElementById('ticket-modal');
  if (!modal) return; // not on the schedule page

  const card = modal.querySelector('.modal-card');
  const closeBtn = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('btn-cancel');
  const form = document.getElementById('notify-form');
  const elCity = document.getElementById('modal-city');
  const elDate = document.getElementById('modal-date');
  const cityInput = document.getElementById('notify-city');
  const nameInput = document.getElementById('notify-name');
  const emailInput = document.getElementById('notify-email');
  const msg = document.getElementById('notify-msg');

  let lastFocus = null;
  const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea';

  const open = (city, date) => {
    lastFocus = document.activeElement;
    elCity.textContent = city;
    elDate.textContent = date;
    cityInput.value = city;
    msg.textContent = '';
    msg.className = 'form-msg';
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('active'));
    document.body.style.overflow = 'hidden';
    setTimeout(() => nameInput.focus(), 60);
  };

  const close = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { modal.hidden = true; form.reset(); }, 400);
    if (lastFocus) lastFocus.focus();
  };

  // Open from every "Notify Me" button — reads card data attributes.
  document.querySelectorAll('.js-notify').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cardEl = e.currentTarget.closest('.show-card');
      open(cardEl?.dataset.city || 'This city', cardEl?.dataset.date || 'TBA');
    });
  });

  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') {
      const f = [...card.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    if (!name) { showMsg('Please enter your name.', 'error'); nameInput.focus(); return; }
    if (!validEmail(email)) { showMsg('Please enter a valid email address.', 'error'); emailInput.focus(); return; }

    const submit = form.querySelector('button[type="submit"]');
    const original = submit.textContent;
    submit.disabled = true; submit.textContent = 'Adding you…';

    // No backend yet — simulate. Swap for a real endpoint when available.
    setTimeout(() => {
      showMsg(`You’re on the list for ${cityInput.value}. We’ll email ${email} the moment tickets drop.`, 'success');
      submit.disabled = false; submit.textContent = original;
      setTimeout(close, 2200);
    }, 900);
  });

  function showMsg(text, type) {
    msg.textContent = text;
    msg.className = 'form-msg ' + type;
  }
}
