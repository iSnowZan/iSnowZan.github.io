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
  '#about, #skills, #projects, #contact, .project-card, .skill-cat, .stack-card, .contact-card, .principle-item'
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

/* ─── Custom cursor (fine-pointer / non-touch only) ─── */
if (window.matchMedia('(pointer: fine)').matches) {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  // Ring lerp position (starts off-screen to avoid flash)
  let ringX = -200, ringY = -200;

  // Move dot instantly on every mouse move (reuse global mouseX/mouseY for ring target)
  document.addEventListener('mousemove', e => {
    dot.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    dot.classList.remove('cursor-hidden');
    ring.classList.remove('cursor-hidden');
  });

  // Ring follows with smooth lerp (~15% per frame = ~9 frames lag at 60 fps)
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.13;
    ringY += (mouseY - ringY) * 0.13;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    requestAnimationFrame(animateRing);
  })();

  // Hover state on interactive elements
  const interactables = document.querySelectorAll(
    'a, button, .project-card, .stack-card, .skill-pill, .contact-card, .theme-opt, .nav-cta, .nav-logo'
  );
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('cursor-hover');  ring.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('cursor-hover'); ring.classList.remove('cursor-hover'); });
  });

  // Click feedback
  document.addEventListener('mousedown', () => ring.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => ring.classList.remove('cursor-click'));

  // Hide when mouse leaves viewport
  document.addEventListener('mouseleave', () => { dot.classList.add('cursor-hidden');  ring.classList.add('cursor-hidden'); });
  document.addEventListener('mouseenter', () => { dot.classList.remove('cursor-hidden'); ring.classList.remove('cursor-hidden'); });
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
