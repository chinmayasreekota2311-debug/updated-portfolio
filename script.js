/* =============================================
   KOTA CHINMAYA SREE — PORTFOLIO JS v2
   Advanced: GSAP · ScrollTrigger · VanillaTilt
   =============================================*/

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/* ---- PAGE LOADER ---- */
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  
  // Fade out loader
  gsap.to(loader, {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    onComplete: () => {
      loader.classList.add('hidden');
      // Trigger Hero Entrance Animations after loader disappears
      playHeroEntrance();
    }
  });
});

/* ---- MOUSE GLOW FOLLOWER ---- */
const mouseGlow = document.getElementById('mouseGlow');
document.addEventListener('mousemove', (e) => {
  // Use GSAP to animate mouse glow position smoothly (lag effect)
  gsap.to(mouseGlow, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.6,
    ease: 'power2.out'
  });
});

/* ---- PARTICLE / DNA HELIX CANVAS ---- */
(function() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;
  const PARTICLE_COUNT = 60;
  const DNA_POINTS = 25;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function random(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = random(0, W);
      this.y = random(0, H);
      this.size = random(1, 2.5);
      this.speedX = random(-0.3, 0.3);
      this.speedY = random(-0.4, -0.1);
      this.opacity = random(0.15, 0.5);
      this.color = `rgba(${Math.random() > 0.5 ? '16,185,129' : '13,148,136'}, ${this.opacity})`;
      this.life = 0;
      this.maxLife = random(200, 450);
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      if (this.life > this.maxLife || this.y < -10 || this.x < -10 || this.x > W + 10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * (1 - this.life / this.maxLife);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // DNA Helix structure
  const dnaPoints = [];
  for (let i = 0; i < DNA_POINTS; i++) {
    dnaPoints.push({ t: (i / DNA_POINTS) * Math.PI * 4, speed: 0.003 + Math.random() * 0.002 });
  }

  function drawDNA(time) {
    const cx = W * 0.88;
    const cy = H * 0.5;
    const amp = 50;
    const spacing = H * 0.65 / DNA_POINTS;

    ctx.save();
    ctx.globalAlpha = 0.08;

    for (let i = 0; i < DNA_POINTS - 1; i++) {
      const t = (i / DNA_POINTS) * Math.PI * 4 + time * 0.4;
      const y1 = cy - H * 0.3 + i * spacing;
      const y2 = y1 + spacing;

      const x1a = cx + Math.sin(t) * amp;
      const x1b = cx - Math.sin(t) * amp;
      const x2a = cx + Math.sin(t + 0.4) * amp;
      const x2b = cx - Math.sin(t + 0.4) * amp;

      // Strand A
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x1a, y1);
      ctx.lineTo(x2a, y2);
      ctx.stroke();

      // Strand B
      ctx.strokeStyle = '#0d9488';
      ctx.beginPath();
      ctx.moveTo(x1b, y1);
      ctx.lineTo(x2b, y2);
      ctx.stroke();

      // Cross-links (rungs)
      if (i % 2 === 0) {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1a, y1);
        ctx.lineTo(x1b, y1);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 130) * 0.08;
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  let time = 0;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    time += 0.008;
    drawDNA(time);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    if (animId) cancelAnimationFrame(animId);
    animate();
  }

  window.addEventListener('resize', () => { resize(); });
  init();
})();


/* ---- HERO ENTRANCE ANIMATIONS (GSAP) ---- */
function playHeroEntrance() {
  const tl = gsap.timeline();

  tl.fromTo('#navbar', 
    { y: -72, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
  );

  tl.fromTo('#heroBadge',
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
    '-=0.4'
  );

  tl.fromTo('#heroName .name-kota',
    { x: -50, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
    '-=0.3'
  );

  tl.fromTo('#heroName .name-chinmaya',
    { x: 50, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
    '-=0.8'
  );

  tl.fromTo(['#heroTyping', '#heroSubtitle', '#heroDesig'],
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
    '-=0.4'
  );

  tl.fromTo('#heroCta .magnetic-btn',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.2)' },
    '-=0.3'
  );

  tl.fromTo('#heroSocials .social-icon',
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' },
    '-=0.4'
  );

  tl.fromTo('#heroStats .stat-card',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
    '-=0.3'
  );

  tl.fromTo('.hero-scroll-indicator',
    { opacity: 0 },
    { opacity: 1, duration: 0.8, ease: 'power2.out' },
    '-=0.2'
  );
}


/* ---- GSAP SCROLLTRIGGER REVEALS ---- */
document.querySelectorAll('.gs-reveal').forEach((el) => {
  gsap.fromTo(el,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    }
  );
});

// Staggered Timeline reveals
gsap.fromTo('.timeline-item',
  { opacity: 0, x: -30 },
  {
    opacity: 1,
    x: 0,
    duration: 0.7,
    stagger: 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.timeline',
      start: 'top 80%',
    }
  }
);

// Staggered Skills tags reveal
document.querySelectorAll('.skill-category').forEach((cat) => {
  gsap.fromTo(cat.querySelectorAll('.skill-tag'),
    { opacity: 0, scale: 0.8, y: 15 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: cat,
        start: 'top 85%',
      }
    }
  );
});


/* ---- MAGNETIC BUTTONS ---- */
document.querySelectorAll('.magnetic-btn').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Pull button towards cursor
    gsap.to(btn, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Pull inner text/icon slightly more for layered 3D feel
    const inner = btn.querySelector('span');
    if (inner) {
      gsap.to(inner, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  });

  btn.addEventListener('mouseleave', () => {
    // Return to original position
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)'
    });

    const inner = btn.querySelector('span');
    if (inner) {
      gsap.to(inner, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    }
  });
});


/* ---- NAVBAR ACTIVE STATE & SCROLL ---- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  const backToTop = document.getElementById('backToTop');
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
});
navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksContainer.classList.remove('open');
  });
});

// Back to top click
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ---- SUBTITLE SLIDE ANIMATION ---- */
(function() {
  const subtitle = document.getElementById('heroSubtitle');
  if (!subtitle) return;

  // Subtle sliding motion for the subtitle line
  gsap.fromTo(subtitle,
    { x: -30, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 1.1 }
  );

  gsap.to(subtitle, {
    x: 10,
    duration: 3.8,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    delay: 2.1
  });
})();


/* ---- STATS COUNTER ANIMATION ---- */
(function() {
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimal) || 0;
        const duration = 1800;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const value = target * ease;
          el.textContent = value.toFixed(decimals);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target.toFixed(decimals);
        }
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));
})();


/* ---- PROJECT MODALS ---- */
function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Fade in modal content
  gsap.fromTo(modal.querySelector('.modal-box'),
    { opacity: 0, y: 50, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
  );
}

function closeModalDirect(id) {
  const modal = document.getElementById(id);
  gsap.to(modal.querySelector('.modal-box'), {
    opacity: 0,
    y: 30,
    scale: 0.95,
    duration: 0.25,
    ease: 'power2.in',
    onComplete: () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

function closeModal(event, id) {
  if (event.target === event.currentTarget) {
    closeModalDirect(id);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(modal => {
      closeModalDirect(modal.getAttribute('id'));
    });
  }
});


/* ---- CONTACT FORM ---- */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('formSubmitBtn');
  const success = document.getElementById('formSuccess');

  // Submit animation
  btn.innerHTML = '<span><i class="fas fa-spinner fa-spin"></i> Sending...</span>';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<span><i class="fas fa-paper-plane"></i> Send Message</span>';
    btn.disabled = false;
    success.style.display = 'flex';
    gsap.fromTo(success, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' });
    e.target.reset();
    setTimeout(() => {
      gsap.to(success, { opacity: 0, duration: 0.4, onComplete: () => success.style.display = 'none' });
    }, 5000);
  }, 1800);
}


/* ---- SMOOTH ANCHOR NAVIGATION ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ---- PROJECT CARD HOVER GLOW ---- */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const glow = card.querySelector('.project-glow');
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(16,185,129,0.15) 0%, transparent 60%)`;
    }
  });
  card.addEventListener('mouseleave', () => {
    const glow = card.querySelector('.project-glow');
    if (glow) {
      glow.style.background = `radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 60%)`;
    }
  });
});


/* ---- ORBIT ANIMATION (JS-driven) ---- */
(function() {
  const orbitDots = document.querySelectorAll('.orbit-dot');
  const orbitWrapper = document.querySelector('.avatar-orbit');
  if (!orbitDots.length || !orbitWrapper) return;
  let angle = 0;
  const radius = 120;
  const numDots = orbitDots.length;
  function animateOrbit() {
    angle += 0.4;
    orbitDots.forEach((dot, i) => {
      const baseAngle = (i * (360 / numDots) + angle) * Math.PI / 180;
      const cx = Math.cos(baseAngle) * radius;
      const cy = Math.sin(baseAngle) * radius;
      dot.style.transform = `translate(calc(-50% + ${cx}px), calc(-50% + ${cy}px))`;
    });
    requestAnimationFrame(animateOrbit);
  }
  animateOrbit();
})();


/* ---- CERT CARD FLIP ON CLICK ---- */
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});


/* ---- INITIALIZE VANILLA TILT ---- */
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
}
