/* ==============================
   PRELOADER
============================== */
(function () {
  const preloader = document.getElementById('preloader');
  const bar = document.querySelector('.pre-bar');
  const status = document.getElementById('preStatus');
  const messages = [
    'Booting system...',
    'Loading Spring context...',
    'Connecting to MySQL...',
    'Starting application...',
    'Ready.'
  ];
  let progress = 0;
  let msgIdx = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 8;
    if (progress > 100) progress = 100;
    bar.style.width = progress + '%';

    const newMsgIdx = Math.min(Math.floor(progress / 25), messages.length - 1);
    if (newMsgIdx !== msgIdx) {
      msgIdx = newMsgIdx;
      status.textContent = messages[msgIdx];
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('out');
        document.body.style.overflow = '';
        initPage();
      }, 400);
    }
  }, 120);

  document.body.style.overflow = 'hidden';
})();

/* ==============================
   CURSOR
============================== */
const dot = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .proj-card, .stack-group, .cl-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/* ==============================
   HEADER SCROLL
============================== */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ==============================
   MOBILE MENU
============================== */
const burger = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');
burger.addEventListener('click', () => {
  mobMenu.classList.toggle('open');
});
document.querySelectorAll('.mm-link').forEach(l => {
  l.addEventListener('click', () => mobMenu.classList.remove('open'));
});

/* ==============================
   TERMINAL TYPER
============================== */
const code = `@RestController
@RequestMapping("/api/products")
public class ProductService {

    @Autowired
    private ProductRepository repo;

    @GetMapping
    public List<Product> getAll() {
        return repo.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(
        @RequestBody Product p) {
        return repo.save(p);
    }

    @DeleteMapping("/{id}")
    public void delete(
        @PathVariable Long id) {
        repo.deleteById(id);
    }
}`;

function typeCode(el, str, cursor, delay = 2700) {
  let i = 0;
  el.textContent = '';

  // Syntax highlight tokens
  const tokens = {
    keywords: /\b(public|class|private|void|new|return|import|static|List|Long)\b/g,
    annotations: /@\w+/g,
    strings: /"[^"]*"/g,
    types: /\b(Product|ProductRepository|HttpStatus|ResponseStatus)\b/g,
  };

  function colorize(line) {
    line = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    line = line.replace(/@\w+/g, m => `<span style="color:#a78bfa">${m}</span>`);
    line = line.replace(/"[^"]*"/g, m => `<span style="color:#6ee7b7">${m}</span>`);
    line = line.replace(/\b(public|class|private|void|return|static|new)\b/g, m => `<span style="color:#f472b6">${m}</span>`);
    line = line.replace(/\b(List|Long|Product|ProductRepository|HttpStatus|ResponseStatus)\b/g, m => `<span style="color:#fb923c">${m}</span>`);
    return line;
  }

  const lines = str.split('\n');
  let lineIdx = 0, charIdx = 0;
  let rendered = [];

  setTimeout(function type() {
    if (lineIdx >= lines.length) {
      cursor.style.display = 'none';
      return;
    }
    const line = lines[lineIdx];
    if (charIdx < line.length) {
      if (!rendered[lineIdx]) rendered[lineIdx] = '';
      rendered[lineIdx] += line[charIdx];
      charIdx++;
    } else {
      lineIdx++;
      charIdx = 0;
    }
    el.innerHTML = rendered.map(l => colorize(l)).join('\n');
    setTimeout(type, charIdx === 0 ? 8 : 22);
  }, delay);
}

function initPage() {
  const termCode = document.getElementById('termCode');
  const termCursor = document.getElementById('termCursor');
  if (termCode) typeCode(termCode, code, termCursor);

  // Scroll reveals
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 120);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObs.observe(el));

  // Skill bars
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.si-fill').forEach(bar => {
          bar.classList.add('animated');
        });
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.stack-group').forEach(g => skillObs.observe(g));

  // Contact form
  const form = document.getElementById('cForm');
  const cfBtn = document.getElementById('cfBtn');
  const cfBtnText = document.getElementById('cfBtnText');
  const cfSuccess = document.getElementById('cfSuccess');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      cfBtnText.textContent = 'Sending...';
      cfBtn.disabled = true;
      setTimeout(() => {
        cfBtnText.textContent = 'Send Message';
        cfBtn.disabled = false;
        form.reset();
        cfSuccess.classList.add('show');
        setTimeout(() => cfSuccess.classList.remove('show'), 5000);
      }, 1800);
    });
  }

  // Smooth scrolling for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Active nav link highlight
  const sections = document.querySelectorAll('section[id], #hero');
  const navLinks = document.querySelectorAll('.nl');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach(l => {
      l.style.color = l.getAttribute('href') === '#' + current ? 'var(--text)' : '';
    });
  }, { passive: true });
}