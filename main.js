/* ═══════════════════════════════════════════
   TONY STARK PORTFOLIO – MAIN.JS
═══════════════════════════════════════════ */

// ── Dark / Light Mode ────────────────────────────────────────────────────────
const htmlEl       = document.documentElement;
const themeToggle  = document.getElementById('themeToggle');
const THEME_KEY    = 'ts-portfolio-theme';

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

// Initialise: honour saved preference, then system preference
(function initTheme() {
  const saved  = localStorage.getItem(THEME_KEY);
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || system);
})();

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// Also respond to OS-level changes (only when no saved preference)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem(THEME_KEY)) applyTheme(e.matches ? 'dark' : 'light');
});

// ── Navbar scroll effect ──────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Active nav link on scroll ─────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  },
  { rootMargin: '-45% 0px -45% 0px' }
);
sections.forEach((s) => navObserver.observe(s));

// ── Hamburger menu ────────────────────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', closeMobileMenu);
});

// Close when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('#navbar')) closeMobileMenu();
});

// ── Scroll-reveal animation ───────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ── Animated skill bars ───────────────────────────────────────────────────────
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((bar) => {
          bar.style.width = bar.dataset.width + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll('.skill-group').forEach((g) => skillObserver.observe(g));

// ── Lightbox ──────────────────────────────────────────────────────────────────
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

// Certificates
document.querySelectorAll('.cert-card').forEach((card) => {
  card.querySelector('.cert-view-btn').addEventListener('click', () => {
    const img = card.querySelector('.cert-preview img');
    openLightbox(img.src, img.alt);
  });
});

// Portfolio projects
document.querySelectorAll('.portfolio-card').forEach((card) => {
  card.querySelector('.port-view-btn').addEventListener('click', () => {
    const img = card.querySelector('.portfolio-preview img');
    openLightbox(img.src, img.alt);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// ── Portfolio filter ──────────────────────────────────────────────────────────
const filterBtns    = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    portfolioCards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      // Re-run reveal for newly shown cards
      if (match) {
        requestAnimationFrame(() => card.classList.add('visible'));
      }
    });
  });
});

// ── Contact form ──────────────────────────────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const successMsg = document.getElementById('form-success');
  successMsg.hidden = false;
  e.target.reset();
  successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => { successMsg.hidden = true; }, 6000);
}

// ── Number counter animation in hero stats ────────────────────────────────────
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsSection = document.querySelector('.hero-stats');
let countersStarted = false;

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounter(document.querySelectorAll('.stat-num')[0], 50, '+');
        animateCounter(document.querySelectorAll('.stat-num')[1], 5, '');
        animateCounter(document.querySelectorAll('.stat-num')[2], 12, '+');
        animateCounter(document.querySelectorAll('.stat-num')[3], 3, '');
      }
    });
  },
  { threshold: 0.5 }
);
if (statsSection) counterObserver.observe(statsSection);

// ── Scroll progress bar ───────────────────────────────────────────────────────
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (total > 0) scrollProgress.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });

// ── Cursor glow ───────────────────────────────────────────────────────────────
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow && !window.matchMedia('(pointer: coarse)').matches) {
  cursorGlow.style.display = 'block';
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  }, { passive: true });
}

// ── Typewriter effect ─────────────────────────────────────────────────────────
const typedRoles = [
  'CEO & Chief Innovation Officer',
  'Lead Inventor & Engineer',
  'Clean Energy Pioneer',
  'Visionary Tech Leader',
  'Philanthropist & Futurist',
];
let tRoleIdx = 0, tCharIdx = 0, tDeleting = false;
const typedEl = document.getElementById('typed-role');
function typeWriter() {
  if (!typedEl) return;
  const cur = typedRoles[tRoleIdx];
  typedEl.textContent = tDeleting ? cur.substring(0, tCharIdx - 1) : cur.substring(0, tCharIdx + 1);
  if (tDeleting) tCharIdx--; else tCharIdx++;
  let delay = tDeleting ? 38 : 78;
  if (!tDeleting && tCharIdx === cur.length) { delay = 2200; tDeleting = true; }
  else if (tDeleting && tCharIdx === 0)      { tDeleting = false; tRoleIdx = (tRoleIdx + 1) % typedRoles.length; delay = 420; }
  setTimeout(typeWriter, delay);
}
setTimeout(typeWriter, 600);

// ── Dot particle canvas ───────────────────────────────────────────────────────
const dotCanvas = document.getElementById('dot-canvas');
if (dotCanvas) {
  const ctx = dotCanvas.getContext('2d');
  let dots = [], dotAnim = true;
  const N = 55;
  function resizeDot() {
    const hero = document.getElementById('hero');
    dotCanvas.width  = hero ? hero.offsetWidth  : window.innerWidth;
    dotCanvas.height = hero ? hero.offsetHeight : window.innerHeight;
  }
  function makeDots() {
    dots = Array.from({ length: N }, () => ({
      x: Math.random() * dotCanvas.width,
      y: Math.random() * dotCanvas.height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - .5) * .42,
      vy: (Math.random() - .5) * .42,
    }));
  }
  function drawDot() {
    if (dotAnim) {
      ctx.clearRect(0, 0, dotCanvas.width, dotCanvas.height);
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      const c = dark ? 'rgba(148,163,184,' : 'rgba(71,85,105,';
      dots.forEach(d => {
        d.x = (d.x + d.vx + dotCanvas.width)  % dotCanvas.width;
        d.y = (d.y + d.vy + dotCanvas.height) % dotCanvas.height;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = c + '.65)'; ctx.fill();
      });
      dots.forEach((a, i) => dots.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 110) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = c + (0.18 * (1 - dist / 110)) + ')';
          ctx.lineWidth = .6; ctx.stroke();
        }
      }));
    }
    requestAnimationFrame(drawDot);
  }
  // Pause when hero is off-screen (performance)
  const heroVisObs = new IntersectionObserver(e => { dotAnim = e[0].isIntersecting; });
  heroVisObs.observe(document.getElementById('hero'));
  requestAnimationFrame(() => { resizeDot(); makeDots(); drawDot(); });
  window.addEventListener('resize', () => { resizeDot(); makeDots(); }, { passive: true });
}

// ── Magnetic buttons ──────────────────────────────────────────────────────────
if (!window.matchMedia('(pointer: coarse)').matches) {
  document.querySelectorAll('.mag-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.28;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// ── 3D Card tilt ──────────────────────────────────────────────────────────────
if (!window.matchMedia('(pointer: coarse)').matches) {
  document.querySelectorAll('.cert-card, .portfolio-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - (r.top  + r.height / 2)) / r.height) * 12;
      const ry = (((r.left   + r.width  / 2) - e.clientX) / r.width)  * 12;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ── Testimonials carousel ─────────────────────────────────────────────────────
const testTrack = document.getElementById('testimonialTrack');
const testDots  = document.getElementById('testDots');
const testPrev  = document.getElementById('testPrev');
const testNext  = document.getElementById('testNext');
if (testTrack) {
  const slides = testTrack.querySelectorAll('.testimonial-card');
  let idx = 0, autoTimer;
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'test-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', () => goSlide(i));
    testDots.appendChild(d);
  });
  function goSlide(n) {
    idx = (n + slides.length) % slides.length;
    testTrack.style.transform = `translateX(-${idx * 100}%)`;
    testDots.querySelectorAll('.test-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    clearInterval(autoTimer); autoTimer = setInterval(() => goSlide(idx + 1), 5200);
  }
  testPrev.addEventListener('click', () => goSlide(idx - 1));
  testNext.addEventListener('click', () => goSlide(idx + 1));
  let sx = 0;
  testTrack.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  testTrack.addEventListener('touchend',   e => { if (Math.abs(sx - e.changedTouches[0].clientX) > 48) goSlide(idx + (sx > e.changedTouches[0].clientX ? 1 : -1)); });
  autoTimer = setInterval(() => goSlide(idx + 1), 5200);
}

// ── Case study modal ──────────────────────────────────────────────────────────
const caseModal      = document.getElementById('caseModal');
const caseModalClose = document.getElementById('caseModalClose');
const caseData = [
  { title: 'Executive Analytics Dashboard', tags: ['Data Visualisation', 'Business Intelligence'], img: 'Sample portfolio - Dashboard.webp',
    desc: 'Real-time BI dashboard aggregating KPIs from all Stark Industries divisions with drill-down charts and predictive forecasting.',
    problem: 'Executives spent 3+ hours daily manually compiling reports from 12 disconnected data sources with no single source of truth.',
    solution: 'Built a unified data pipeline with a React + D3.js front-end delivering live KPI feeds, predictive analytics, and one-click executive summaries.',
    result: 'Cut decision-making time by 40%, improved forecast accuracy to 94%, saved ~$1.2M annually in analyst overhead.' },
  { title: 'Energy Monitoring Dashboard', tags: ['IoT Integration', 'Clean Energy'], img: 'Sample portfolio - Dashboard2.webp',
    desc: 'IoT-connected platform tracking real-time energy output across 14 arc reactor installations worldwide with anomaly detection.',
    problem: 'Lack of unified visibility across distributed reactor sites caused delayed maintenance responses and costly unplanned downtime.',
    solution: 'Deployed MQTT-based IoT data collection with anomaly-detection ML models feeding a live monitoring dashboard with automated alerts.',
    result: 'Achieved 99.7% uptime, cut maintenance response from 4 hours to 18 minutes, avoided $3M+ in annual downtime costs.' },
  { title: 'JARVIS Mobile Companion App', tags: ['Mobile App', 'AI Assistant'], img: 'Sample portfolio - Mobile App.webp',
    desc: 'AI-powered mobile app extending JARVIS to smartphones with voice control, threat analysis, and AES-256 encrypted comms.',
    problem: 'Field teams needed real-time JARVIS access without being physically present in the Stark Tower command centre.',
    solution: 'Developed a React Native app with on-device speech recognition, secure API tunnelling, and end-to-end encrypted communications.',
    result: 'Rated 4.9/5 by 200,000+ enterprise users. Reduced incident response time by 65% for remote operational teams.' },
  { title: 'Stark Task Management Suite', tags: ['Productivity', 'Team Collaboration'], img: 'Sample portfolio - Task Management.webp',
    desc: 'Enterprise project management platform coordinating multi-disciplinary R&D teams across 8 time zones.',
    problem: 'Global R&D teams were losing 6+ hours weekly to misaligned sprint planning and fragmented status updates.',
    solution: 'Built a SCRUM/Gantt hybrid with timezone-aware scheduling, auto-status digests, and ERP/CRM integrations.',
    result: 'Improved delivery speed by 38%, reduced missed deadlines by 72%, adopted by 2,400 Stark Industries engineers.' },
  { title: 'Stark Industries Partner Portal', tags: ['Web Application', 'Partner Management'], img: 'Sample portfolio - Webapp.webp',
    desc: 'Secure B2B platform enabling 300+ global supply-chain partners to manage contracts, proposals, and documentation.',
    problem: 'Procurement teams managed 300+ partner relationships via email, causing delays, errors, and compliance gaps.',
    solution: 'Architected a multi-tenant portal with role-based access, DocuSign integration, and automated milestone tracking.',
    result: 'Onboarded 300 partners in Q1, cut procurement time by 55%, reduced compliance errors to near zero.' },
];
document.querySelectorAll('.portfolio-card').forEach((card, i) => {
  if (!caseData[i]) return;
  const btn = document.createElement('button');
  btn.className = 'case-study-btn'; btn.textContent = '📋 Case Study';
  btn.addEventListener('click', () => openCase(i));
  card.querySelector('.portfolio-info').appendChild(btn);
});
function openCase(i) {
  const d = caseData[i]; if (!d) return;
  document.getElementById('caseModalTitle').textContent    = d.title;
  document.getElementById('caseModalDesc').textContent     = d.desc;
  document.getElementById('caseModalProblem').textContent  = d.problem;
  document.getElementById('caseModalSolution').textContent = d.solution;
  document.getElementById('caseModalResult').textContent   = d.result;
  document.getElementById('caseModalImg').src = d.img;
  document.getElementById('caseModalImg').alt = d.title;
  document.getElementById('caseModalTags').innerHTML = d.tags.map(t => `<span>${t}</span>`).join('');
  caseModal.classList.add('open'); document.body.style.overflow = 'hidden';
}
function closeCase() { caseModal.classList.remove('open'); document.body.style.overflow = ''; }
if (caseModalClose) {
  caseModalClose.addEventListener('click', closeCase);
  caseModal.addEventListener('click', e => { if (e.target === caseModal) closeCase(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && caseModal.classList.contains('open')) closeCase(); });
}

// ── Language switcher EN / ES ─────────────────────────────────────────────────
const langBtn = document.getElementById('langBtn');
let curLang = 'en';
const T = {
  en: {
    'nav-about':'About','nav-experience':'Experience','nav-education':'Education',
    'nav-skills':'Skills','nav-certificates':'Certs','nav-portfolio':'Portfolio',
    'nav-testimonials':'Reviews','nav-blog':'Articles','nav-contact':'Contact',
    'hero-greeting':"Hello, I'm",
    'hero-tagline':'Innovative leader with 20+ years driving high-tech transformation, clean-energy breakthroughs, and world-class engineering teams.',
    'cta-work':'View My Work','cta-contact':'Get In Touch',
    'avail-text':'Available for new opportunities','download-cv':'Download CV',
  },
  es: {
    'nav-about':'Sobre Mí','nav-experience':'Experiencia','nav-education':'Educación',
    'nav-skills':'Habilidades','nav-certificates':'Certs','nav-portfolio':'Portafolio',
    'nav-testimonials':'Opiniones','nav-blog':'Artículos','nav-contact':'Contacto',
    'hero-greeting':'Hola, soy',
    'hero-tagline':'Líder innovador con más de 20 años impulsando la transformación tecnológica y avances en energía limpia a nivel mundial.',
    'cta-work':'Ver Mi Trabajo','cta-contact':'Contáctame',
    'avail-text':'Disponible para nuevas oportunidades','download-cv':'Descargar CV',
  },
};
if (langBtn) {
  langBtn.addEventListener('click', () => {
    curLang = curLang === 'en' ? 'es' : 'en';
    document.querySelectorAll('[data-lang]').forEach(el => {
      const v = T[curLang][el.getAttribute('data-lang')];
      if (v) el.textContent = v;
    });
    langBtn.textContent = curLang === 'en' ? '🌐 ES' : '🌐 EN';
  });
}

// ── Staggered pill animations ─────────────────────────────────────────────────
const pillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.pill').forEach((p, i) =>
      setTimeout(() => { p.style.opacity = '1'; p.style.transform = 'translateY(0) scale(1)'; }, i * 55)
    );
    entry.target.classList.add('animated');
    pillObs.unobserve(entry.target);
  });
}, { threshold: 0.2 });
document.querySelectorAll('.pill-grid').forEach(g => pillObs.observe(g));

// ── Back to Top ───────────────────────────────────────────────────────────────
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 320);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
