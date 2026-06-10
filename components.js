// ============================================================
// DJ SIX – Shared Components (Nav, Footer, Particles)
// ============================================================

// ── Navbar HTML ──────────────────────────────────────────────
function renderNavbar(activePage = '') {
  const pages = [
    { href: '../index.html',            label: 'Home' },
    { href: '../pages/about.html',      label: 'About' },
    { href: '../pages/mixtapes.html',   label: 'Mixtapes' },
    { href: '../pages/videos.html',     label: 'Videos' },
    { href: '../pages/events.html',     label: 'Events' },
    { href: '../pages/gallery.html',    label: 'Gallery' },
    { href: '../pages/testimonials.html', label: 'Testimonials' },
    { href: '../pages/booking.html',    label: 'Booking' },
    { href: '../pages/contact.html',    label: 'Contact' },
  ];
  const links = pages.map(p =>
    `<a href="${p.href}" class="${activePage === p.label ? 'active' : ''}">${p.label}</a>`
  ).join('');
  return `
<nav class="navbar" id="navbar">
  <div class="nav-container">
    <a href="../index.html" class="nav-logo">DJ SIX</a>
    <div class="nav-links" id="nav-links">
      ${links}
      <a href="../pages/booking.html" class="btn btn-primary btn-sm">Book Now</a>
    </div>
    <div class="nav-actions">
      <button class="theme-btn" id="theme-toggle" onclick="toggleTheme()" title="Toggle theme">☀️</button>
      <div class="hamburger" id="hamburger">
        <span></span><span></span><span></span>
      </div>
    </div>
  </div>
</nav>`;
}

// ── Footer HTML ──────────────────────────────────────────────
function renderFooter() {
  return `
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="nav-logo" style="font-size:1.8rem">DJ SIX</div>
        <p>International professional DJ delivering world-class entertainment experiences across Africa and beyond. From intimate weddings to massive festivals.</p>
        <div class="footer-social">
          <a href="#" class="social-btn" aria-label="Instagram">📸</a>
          <a href="#" class="social-btn" aria-label="Twitter">🐦</a>
          <a href="#" class="social-btn" aria-label="YouTube">▶</a>
          <a href="#" class="social-btn" aria-label="Facebook">📘</a>
          <a href="#" class="social-btn" aria-label="TikTok">🎵</a>
        </div>
      </div>
      <div>
        <div class="footer-heading">Navigate</div>
        <div class="footer-links">
          <a href="../index.html">Home</a>
          <a href="../pages/about.html">About DJ SIX</a>
          <a href="../pages/mixtapes.html">Mixtapes</a>
          <a href="../pages/videos.html">Videos</a>
          <a href="../pages/events.html">Events</a>
        </div>
      </div>
      <div>
        <div class="footer-heading">More</div>
        <div class="footer-links">
          <a href="../pages/gallery.html">Gallery</a>
          <a href="../pages/testimonials.html">Testimonials</a>
          <a href="../pages/booking.html">Booking</a>
          <a href="../pages/contact.html">Contact</a>
          <a href="../pages/admin-login.html">Admin</a>
        </div>
      </div>
      <div>
        <div class="footer-heading">Contact</div>
        <div class="footer-links">
          <a href="tel:+234000000000">📞 +234 000 000 0000</a>
          <a href="https://wa.me/234000000000">💬 WhatsApp</a>
          <a href="mailto:booking@djsix.com">✉️ booking@djsix.com</a>
          <a href="#">📍 Lagos, Nigeria</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} DJ SIX. All rights reserved.</p>
      <p>Designed with ❤️ for the world's best DJ</p>
    </div>
  </div>
</footer>
<!-- Back to Top -->
<button id="back-to-top" aria-label="Back to top">
  <svg viewBox="0 0 24 24"><path d="M12 4l-8 8h5v8h6v-8h5z"/></svg>
</button>
<!-- WhatsApp Float -->
<a href="https://wa.me/234000000000" class="whatsapp-float" target="_blank" rel="noopener" aria-label="WhatsApp">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
</a>`;
}

// ── Loader HTML ──────────────────────────────────────────────
function renderLoader() {
  return `
<div id="loader">
  <div class="loader-logo">DJ SIX</div>
  <div class="loader-bar-track"><div class="loader-bar"></div></div>
</div>`;
}

// ── Particles ────────────────────────────────────────────────
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speed = Math.random() * 0.5 + 0.1;
      this.angle = Math.random() * Math.PI * 2;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.color = ['#00D4FF','#8A2BE2','#FF1493','#FFD700'][Math.floor(Math.random()*4)];
    }
    update() {
      this.y -= this.speed;
      this.x += Math.sin(this.angle + Date.now()*0.001) * 0.3;
      if (this.y < -10) this.reset(), this.y = canvas.height + 10;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  for (let i = 0; i < 80; i++) particles.push(new Particle());
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

// ── Nav scroll & hamburger ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }
});
