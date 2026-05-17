/* ===== LOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initAnimations();
  }, 2200);
});

/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

/* ===== MATRIX CANVAS ===== */
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrixChars = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF<>{}()[];';
const fontSize = 13;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);

function drawMatrix() {
  ctx.fillStyle = 'rgba(5,8,16,0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00d4ff';
  ctx.font = fontSize + 'px JetBrains Mono';
  drops.forEach((y, i) => {
    const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    ctx.fillText(char, i * fontSize, y * fontSize);
    if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(drawMatrix, 50);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== HERO CODE TYPING ===== */
const codeSnippets = `@SpringBootApplication
public class PortfolioApp {

  @Autowired
  private DeveloperService dev;

  public static void main(String[] args) {
    SpringApplication.run(
      PortfolioApp.class, args
    );
  }

  // Clean Code | SOLID Principles
  // Spring Boot | REST | Microservices
  // MySQL | JDBC | JUnit | Mockito
  // Git | HTML5 | CSS3 | JavaScript
}`;

function typeCode() {
  const el = document.getElementById('codeTyped');
  if (!el) return;
  el.textContent = '';
  let i = 0;
  const colors = {
    '@': '#7b61ff',
    'public': '#7b61ff',
    'class': '#7b61ff',
    'void': '#7b61ff',
    'new': '#7b61ff',
    'private': '#7b61ff',
    'static': '#7b61ff',
    'String': '#00ff88',
  };
  function type() {
    if (i < codeSnippets.length) {
      el.textContent += codeSnippets[i];
      i++;
      setTimeout(type, 28);
    }
  }
  setTimeout(type, 2500);
}
typeCode();

/* ===== COUNTER ANIMATION ===== */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    let count = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count;
      if (count >= target) clearInterval(timer);
    }, 40);
  });
}

/* ===== SKILL TABS ===== */
document.querySelectorAll('.skill-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-tab');
    document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('tab-' + target);
    panel.classList.add('active');
    // Animate skill bars
    panel.querySelectorAll('.skill-fill').forEach(bar => {
      const w = bar.getAttribute('data-width');
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = w + '%'; }, 100);
    });
  });
});

/* ===== SCROLL REVEAL ===== */
function initAnimations() {
  // Add reveal class to elements
  const revealTargets = document.querySelectorAll(
    '.about-grid, .skill-card, .project-card, .fit-card, .contact-wrap, .section-header, .cognizant-banner'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
          // Trigger skill bars if skills section
          if (entry.target.classList.contains('skills-panel') || entry.target.closest('#skills')) {
            document.querySelectorAll('.skills-panel.active .skill-fill').forEach(bar => {
              bar.style.width = bar.getAttribute('data-width') + '%';
            });
          }
          // Trigger counters when hero stats visible
          if (entry.target.classList.contains('hero-stats')) {
            animateCounters();
          }
        }, i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => observer.observe(el));

  // Separately observe stats
  const stats = document.querySelector('.hero-stats');
  if (stats) {
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) animateCounters();
    }, { threshold: 0.5 }).observe(stats);
  }

  // Animate initial skill bars
  setTimeout(() => {
    document.querySelectorAll('.skills-panel.active .skill-fill').forEach(bar => {
      bar.style.width = bar.getAttribute('data-width') + '%';
    });
  }, 500);
}

/* ===== SMOOTH NAV SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active-link');
  });
});

/* ===== CONTACT FORM ===== */
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('.form-btn span');
  btn.textContent = 'Sending...';
  setTimeout(() => {
    this.reset();
    btn.textContent = 'Send Message';
    document.getElementById('form-success').classList.add('show');
    setTimeout(() => document.getElementById('form-success').classList.remove('show'), 4000);
  }, 1500);
});

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinksList = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinksList.style.display = navLinksList.style.display === 'flex' ? 'none' : 'flex';
  navLinksList.style.flexDirection = 'column';
  navLinksList.style.position = 'fixed';
  navLinksList.style.top = '72px';
  navLinksList.style.left = '0';
  navLinksList.style.right = '0';
  navLinksList.style.background = 'rgba(5,8,16,0.98)';
  navLinksList.style.padding = '24px';
  navLinksList.style.borderBottom = '1px solid var(--border)';
});

/* ===== PARALLAX HERO GLOW ===== */
document.addEventListener('mousemove', e => {
  const glow = document.querySelector('.about-glow');
  if (!glow) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  glow.style.transform = `translate(${x}px, ${y}px)`;
});