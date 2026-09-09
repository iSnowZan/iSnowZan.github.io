/* ─── Animated grid canvas ─── */
const canvas = document.getElementById('grid-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let mouseX = -1000, mouseY = -1000;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function isLightTheme() {
  const t = localStorage.getItem('portfolio-theme') || 'dark';
  if (t === 'light') return true;
  if (t === 'dark')  return false;
  return window.matchMedia('(prefers-color-scheme: light)').matches;
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const spacing = 50;
  const cols = Math.ceil(canvas.width  / spacing) + 1;
  const rows = Math.ceil(canvas.height / spacing) + 1;
  const light = isLightTheme();

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = c * spacing;
      const y = r * spacing;
      const dist = Math.hypot(x - mouseX, y - mouseY);
      const maxDist = 200;
      if (light) {
        // Darker, more opaque dots for contrast on light background
        const alpha = dist < maxDist ? 0.22 + 0.45 * (1 - dist / maxDist) : 0.09;
        ctx.fillStyle = `rgba(0,130,100,${alpha})`;
      } else {
        const alpha = dist < maxDist ? 0.08 + 0.25 * (1 - dist / maxDist) : 0.04;
        ctx.fillStyle = `rgba(0,212,170,${alpha})`;
      }
      ctx.fillRect(x - 1, y - 1, 2, 2);
    }
  }
  requestAnimationFrame(drawGrid);
}
drawGrid();

/* ─── Navbar scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ─── Typed text ─── */
const phrases = [
  'Go + PostgreSQL',
  'Distributed Systems',
  'Payment Architecture',
  'REST API Design',
  'Docker & Linux',
  'Backend Performance',
];
let pi = 0, ci = 0, deleting = false, typedEl = document.getElementById('typed-text');

function type() {
  const phrase = phrases[pi];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.textContent = phrase.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 45 : 75);
}
type();

/* ─── Scroll reveal ─── */
const revealEls = document.querySelectorAll(
  '#about, #experience, #skills, #projects, #contact, .skill-cat, .stack-card, .contact-card, .principle-item, .timeline-card'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } }),
  { threshold: 0.1 }
);
revealEls.forEach(el => observer.observe(el));

/* ─── Smooth active nav highlight ─── */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  const nearBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 60;

  if (nearBottom) {
    // Force-activate the last section when at the bottom
    current = sections[sections.length - 1].id;
  } else {
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
  }

  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--primary)' : '';
  });
}, { passive: true });

/* ─── Experience Timeline Scroll Progress & Interactive Switcher ─── */
const expSection = document.getElementById('experience');
const tlFill = document.getElementById('tl-line-fill');
const tlItems = document.querySelectorAll('.timeline-item');
const tlNavBtns = document.querySelectorAll('.tl-nav-btn');

function updateTimelineScroll() {
  if (!expSection || !tlFill) return;
  const rect = expSection.getBoundingClientRect();
  const windowH = window.innerHeight;

  // Progress begins as top of experience enters viewport, completes as bottom passes midpoint
  const startOffset = windowH * 0.75;
  const totalHeight = rect.height;
  const scrolled = startOffset - rect.top;
  const progress = Math.max(0, Math.min(1, scrolled / totalHeight));

  tlFill.style.height = `${(progress * 100).toFixed(1)}%`;

  // Update reached waypoints, pop-in/pop-out state, and active milestone pill
  let activeIndex = -1;
  tlItems.forEach((item, idx) => {
    const iRect = item.getBoundingClientRect();
    const itemCenter = iRect.top + iRect.height / 2;

    // Card pops in when entering viewport focal zone and pops out as it scrolls past
    const isPopped = itemCenter > windowH * 0.16 && itemCenter < windowH * 0.84;
    item.classList.toggle('pop-active', isPopped);
    item.classList.toggle('reached', iRect.top < windowH * 0.72);

    // Active milestone tab when card is centered in viewport
    if (itemCenter > windowH * 0.22 && itemCenter < windowH * 0.75) {
      activeIndex = idx;
    }
  });

  if (activeIndex !== -1) {
    tlNavBtns.forEach((btn, idx) => {
      const isActive = idx === activeIndex;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }
}

window.addEventListener('scroll', updateTimelineScroll, { passive: true });
window.addEventListener('resize', updateTimelineScroll);
updateTimelineScroll();

// Click milestone tab to smoothly glide to that section
tlNavBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const yOffset = -90;
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

/* ─── Hire Me popup ─── */
function toggleHirePopup(e) {
  e.stopPropagation();
  document.getElementById('hire-popup').classList.toggle('open');
}

function copyEmail() {
  const email = document.getElementById('hire-email-text').textContent;
  navigator.clipboard.writeText(email).then(() => {
    const btn = document.getElementById('hire-copy-btn');
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

// Close popup when clicking anywhere outside
document.addEventListener('click', e => {
  const popup = document.getElementById('hire-popup');
  const wrap  = document.getElementById('hire-btn');
  if (!wrap.closest('.hire-wrap').contains(e.target)) {
    popup.classList.remove('open');
  }
});

/* ─── Theme toggle ─── */
const THEME_KEY  = 'portfolio-theme';
const htmlEl     = document.documentElement;
const themeOpts  = document.querySelectorAll('.theme-opt');

function applyTheme(theme) {
  // Set / remove data-theme attribute
  if (theme === 'system') {
    htmlEl.removeAttribute('data-theme');
  } else {
    htmlEl.setAttribute('data-theme', theme);
  }
  // Highlight the active button
  themeOpts.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeVal === theme);
  });
}

// Boot: restore saved preference (FOUC already prevented by inline script in <head>)
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
applyTheme(savedTheme);

// Button clicks
themeOpts.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.themeVal;
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  });
});

// If the user has chosen "System", keep the UI in sync when OS preference changes
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
  if ((localStorage.getItem(THEME_KEY) || 'dark') === 'system') {
    applyTheme('system'); // re-run so CSS media query picks up the new OS value
  }
});

/* ─── Custom cursor (fine-pointer / desktop only) ─── */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

function isCursorSupported() {
  return window.matchMedia('(pointer: fine)').matches &&
         !window.matchMedia('(pointer: coarse)').matches &&
         window.matchMedia('(hover: hover)').matches &&
         window.innerWidth > 900;
}

if (cursorDot && cursorRing) {
  let active = isCursorSupported();

  function syncCursorVisibility() {
    active = isCursorSupported();
    if (!active) {
      cursorDot.style.display = 'none';
      cursorRing.style.display = 'none';
      cursorDot.classList.add('cursor-hidden');
      cursorRing.classList.add('cursor-hidden');
    } else {
      cursorDot.style.display = '';
      cursorRing.style.display = '';
    }
  }

  // Initial check & viewport resize listener
  syncCursorVisibility();
  window.addEventListener('resize', syncCursorVisibility, { passive: true });

  // Ring lerp position (starts off-screen to avoid initial flash)
  let ringX = -200, ringY = -200;

  // Move dot instantly on mouse move
  document.addEventListener('mousemove', e => {
    if (!active) return;
    cursorDot.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    cursorDot.classList.remove('cursor-hidden');
    cursorRing.classList.remove('cursor-hidden');
  });

  // Ring follows with smooth lerp (~15% per frame = ~9 frames lag at 60 fps)
  (function animateRing() {
    if (active) {
      ringX += (mouseX - ringX) * 0.13;
      ringY += (mouseY - ringY) * 0.13;
      cursorRing.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    }
    requestAnimationFrame(animateRing);
  })();

  // Hover state on interactive elements
  const interactables = document.querySelectorAll(
    'a, button, .project-card, .deck-card, .deck-btn, .deck-dot, .stack-card, .skill-pill, .contact-card, .theme-opt, .nav-cta, .nav-logo, .timeline-card'
  );
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (!active) return;
      cursorDot.classList.add('cursor-hover');
      cursorRing.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      if (!active) return;
      cursorDot.classList.remove('cursor-hover');
      cursorRing.classList.remove('cursor-hover');
    });
  });

  // Click feedback
  document.addEventListener('mousedown', () => {
    if (active) cursorRing.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    if (active) cursorRing.classList.remove('cursor-click');
  });

  // Hide when mouse leaves viewport or window blurs
  document.addEventListener('mouseleave', () => {
    cursorDot.classList.add('cursor-hidden');
    cursorRing.classList.add('cursor-hidden');
  });
  document.addEventListener('mouseenter', () => {
    if (active) {
      cursorDot.classList.remove('cursor-hidden');
      cursorRing.classList.remove('cursor-hidden');
    }
  });
  window.addEventListener('blur', () => {
    cursorDot.classList.add('cursor-hidden');
    cursorRing.classList.add('cursor-hidden');
  });
}

/* ─── Skill card: mouse-tracked inner spotlight ─── */
document.querySelectorAll('.skill-cat').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width  * 100).toFixed(1)}%`);
    card.style.setProperty('--my', `${((e.clientY - r.top)  / r.height * 100).toFixed(1)}%`);
  });
  // Reset to centre when cursor leaves so the gradient fades cleanly
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  });
});

/* ─── Scroll-Driven Stacking Cards ─── */
function initStackingCards() {
  const container = document.getElementById('stack-container');
  const cards = Array.from(document.querySelectorAll('.project-card.stack-card'));
  const currentNumEl = document.getElementById('stack-current');
  const navBtns = Array.from(document.querySelectorAll('.stack-nav-btn'));

  if (!container || cards.length === 0) return;

  function updateStack() {
    let activeIdx = 0;

    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const style = window.getComputedStyle(card);
      const stickyTop = parseFloat(style.top) || (125 + i * 18);

      // Card is considered active/pinned when its top reaches within 8px of its sticky top
      if (rect.top <= stickyTop + 8) {
        activeIdx = i;
      }
    });

    cards.forEach((card, i) => {
      const diff = activeIdx - i;
      if (diff > 0) {
        card.classList.add('is-covered');
        const scale = Math.max(0.92, 1 - diff * 0.025);
        const brightness = Math.max(0.72, 1 - diff * 0.07);
        card.style.transform = `scale(${scale})`;
        card.style.filter = `brightness(${brightness})`;
      } else {
        card.classList.remove('is-covered');
        card.style.transform = '';
        card.style.filter = '';
      }
    });

    if (currentNumEl) {
      currentNumEl.textContent = String(activeIdx + 1);
    }

    navBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === activeIdx);
      btn.setAttribute('aria-selected', i === activeIdx ? 'true' : 'false');
    });
  }

  // Click to smoothly jump directly to any project card
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (isNaN(idx) || !cards[idx]) return;

      const targetCard = cards[idx];
      const style = window.getComputedStyle(targetCard);
      const stickyTop = parseFloat(style.top) || (125 + idx * 18);
      const cardDocTop = targetCard.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.round(cardDocTop - stickyTop + 2),
        behavior: 'smooth'
      });
    });
  });

  let ticking = false;
  function requestUpdate() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateStack();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  // Spotlight mouse effect on cards
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
  });

  // Initial calculation
  updateStack();
}

// Initialize stacking cards
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStackingCards);
} else {
  initStackingCards();
}

/* ─── Hamburger / Mobile Menu ─── */
(function () {
  const btn    = document.getElementById('hamburger-btn');
  const menu   = document.getElementById('mobile-menu');
  const links  = menu ? menu.querySelectorAll('.mobile-nav-link') : [];

  function openMenu() {
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent scroll behind drawer
  }

  function closeMenu() {
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (btn && menu) {
    btn.addEventListener('click', () => {
      btn.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close when any nav link is clicked
    links.forEach(link => link.addEventListener('click', closeMenu));

    // Close when clicking outside the menu / navbar area
    document.addEventListener('click', e => {
      if (menu.classList.contains('open') &&
          !menu.contains(e.target) &&
          !btn.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on resize back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 680) closeMenu();
    });
  }
})();
