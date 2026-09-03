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

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const spacing = 50;
  const cols = Math.ceil(canvas.width  / spacing) + 1;
  const rows = Math.ceil(canvas.height / spacing) + 1;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = c * spacing;
      const y = r * spacing;
      const dist = Math.hypot(x - mouseX, y - mouseY);
      const maxDist = 200;
      const alpha = dist < maxDist ? 0.08 + 0.25 * (1 - dist / maxDist) : 0.04;
      ctx.fillStyle = `rgba(0,212,170,${alpha})`;
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
  '#about, #skills, #projects, #contact, .project-card, .skill-cat, .stack-card, .contact-card'
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
