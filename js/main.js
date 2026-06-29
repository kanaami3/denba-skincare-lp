// DENBA Skincare - Main shared JS
// Language support (extended from translations.js)
window.DENBA = window.DENBA || {};

function applyLanguage(lang) {
  if (!window.DENBA_I18N || !window.DENBA_I18N[lang]) return;
  
  const t = window.DENBA_I18N[lang];
  document.documentElement.lang = lang;

  // Apply to elements with data-i18n (text / inline HTML)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  // Apply to elements with data-i18n-html (rich HTML content)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  // Apply to input/textarea placeholders with data-i18n-ph
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (t[key] !== undefined) {
      el.setAttribute('placeholder', t[key]);
    }
  });

  // Update active lang buttons (prefer data-lang, fall back to label text)
  const labelMap = { ja: ['jp', 'ja', '日本'], en: ['en'], zh: ['zh', '中文'] };
  document.querySelectorAll('.lang-btn').forEach(btn => {
    let on;
    if (btn.dataset.lang) {
      on = (btn.dataset.lang === lang);
    } else {
      const txt = btn.textContent.trim().toLowerCase();
      on = (labelMap[lang] || [lang]).some(s => txt.includes(s.toLowerCase()));
    }
    btn.classList.toggle('active', on);
  });

  localStorage.setItem('denba_lang', lang);
}

// Cart (demo, works across pages via localStorage)
function addToCart(productName, price) {
  let cart = JSON.parse(localStorage.getItem('denba_cart') || '[]');
  cart.push({name: productName, price: price, time: Date.now()});
  localStorage.setItem('denba_cart', JSON.stringify(cart));
  
  const cartEl = document.getElementById('cart');
  if (cartEl) {
    cartEl.classList.add('show');
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = cart.length;
  } else {
    // Fallback for other pages
    alert(`${productName} をカートに追加しました（デモ）`);
  }
}

function initCart() {
  const cart = JSON.parse(localStorage.getItem('denba_cart') || '[]');
  const cartEl = document.getElementById('cart');
  if (cartEl && cart.length > 0) {
    cartEl.classList.add('show');
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = cart.length;
  }
}

// Auto init language
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('denba_lang') || 'ja';
  if (window.DENBA_I18N) {
    applyLanguage(savedLang);
  }
  initCart();
  
  // Smooth mobile menu close on link click (if exists)
  document.querySelectorAll('.mob-menu a').forEach(a => {
    a.addEventListener('click', () => {
      const menu = document.getElementById('mobMenu');
      if (menu) menu.classList.remove('open');
    });
  });
});

// Global helper
window.addToCart = addToCart;
window.switchLang = (lang) => {
  if (window.DENBA_I18N) applyLanguage(lang);
};