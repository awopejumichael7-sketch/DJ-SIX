// ============================================================
// DJ SIX – Firebase Configuration & Shared Utilities
// ============================================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (!firebase.apps?.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const storage = firebase.storage();

// ============================================================
// Admin Auth Helpers
// ============================================================
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Admin123#";

function adminLogin(username, password) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem("adminLoggedIn", "true");
    window.location.href = "../pages/admin-dashboard.html";
  } else {
    showToast("Invalid username or password", "error");
  }
}

function adminLogout() {
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "admin-login.html";
}

function requireAdmin() {
  if (!localStorage.getItem("adminLoggedIn")) {
    window.location.href = "admin-login.html";
  }
}

// ============================================================
// Toast Notification
// ============================================================
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = `
      position:fixed;top:20px;right:20px;z-index:99999;
      display:flex;flex-direction:column;gap:10px;`;
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  toast.style.cssText = `
    padding:14px 22px;border-radius:12px;font-weight:600;font-size:14px;
    color:#fff;backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.2);
    box-shadow:0 8px 32px rgba(0,0,0,0.4);animation:slideInRight 0.3s ease;
    background:${type==="error"?"rgba(255,50,50,0.85)":type==="warning"?"rgba(255,165,0,0.85)":"rgba(0,212,255,0.85)"};
  `;
  container.appendChild(toast);
  setTimeout(() => { toast.style.animation = "slideOutRight 0.3s ease"; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ============================================================
// Dark / Light Mode
// ============================================================
function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.innerHTML = saved === "dark" ? "☀️" : "🌙";
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.innerHTML = next === "dark" ? "☀️" : "🌙";
}

// ============================================================
// Visitor Counter
// ============================================================
async function trackVisitor() {
  try {
    const ref = db.collection("analytics").doc("visitors");
    await ref.set({ count: firebase.firestore.FieldValue.increment(1) }, { merge: true });
  } catch (e) { /* silent */ }
}

// ============================================================
// Animated Counters
// ============================================================
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString();
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.count));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ============================================================
// Scroll Animations
// ============================================================
function initScrollAnimations() {
  const els = document.querySelectorAll("[data-aos]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("aos-animate");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
}

// ============================================================
// Back To Top
// ============================================================
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.style.opacity = window.scrollY > 400 ? "1" : "0";
    btn.style.pointerEvents = window.scrollY > 400 ? "auto" : "none";
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// ============================================================
// Loading Screen
// ============================================================
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 500);
    }, 800);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initScrollAnimations();
  initCounters();
  initBackToTop();
  hideLoader();
  trackVisitor();
});
