/* Shared utilities */

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}
window.showToast = showToast;

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    const isZhPage = document.documentElement.lang && document.documentElement.lang.startsWith('zh');
    showToast(isZhPage ? '已复制到剪贴板' : 'Copied to clipboard');
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    const isZhPage = document.documentElement.lang && document.documentElement.lang.startsWith('zh');
    showToast(isZhPage ? '已复制到剪贴板' : 'Copied to clipboard');
  }
}
window.copyText = copyText;

// Desktop nav: collapse overflow links into "More" dropdown
(function() {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll('a'));
  const langBtn = nav.querySelector('.lang-switch');
  if (links.length <= 8) return; // Short enough, skip

  const primaryPaths = ['ppt', 'article', 'video', 'prd', 'resume'];
  const moreLinks = [];

  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    const isPolicy = href.includes('about') || href.includes('contact') || href.includes('privacy');
    const isHome = href === '/' || href === '/en/';
    const isPrimary = primaryPaths.some(p => href.includes(p)) || isPolicy || isHome;
    if (!isPrimary) {
      moreLinks.push(link);
    }
  });

  if (moreLinks.length === 0) return;

  const isZh = document.documentElement.lang && document.documentElement.lang.startsWith('zh');
  const moreDiv = document.createElement('div');
  moreDiv.className = 'nav-more';
  const moreBtn = document.createElement('button');
  moreBtn.type = 'button';
  moreBtn.className = 'nav-more-btn';
  moreBtn.textContent = isZh ? '更多 ▼' : 'More ▼';
  const dropdown = document.createElement('div');
  dropdown.className = 'nav-more-dropdown';

  // Move overflow links into dropdown
  moreLinks.forEach(link => dropdown.appendChild(link));

  moreDiv.appendChild(moreBtn);
  moreDiv.appendChild(dropdown);
  nav.appendChild(moreDiv);
  if (langBtn) nav.appendChild(langBtn);

  moreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    moreDiv.classList.toggle('open');
  });
  document.addEventListener('click', () => {
    moreDiv.classList.remove('open');
  });
})();

// Mobile nav
(function() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;

  function openMenu() {
    nav.style.display = 'flex';
    nav.style.position = 'absolute';
    nav.style.top = '64px';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.background = '#fff';
    nav.style.flexDirection = 'column';
    nav.style.padding = '16px';
    nav.style.borderBottom = '1px solid var(--border)';
    nav.style.boxShadow = 'var(--shadow)';
    nav.style.zIndex = '99';
    nav.style.maxHeight = 'calc(100vh - 64px)';
    nav.style.overflowY = 'auto';
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    nav.style.display = 'none';
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (nav.style.display === 'flex') {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Auto-close when clicking a link or button inside nav
  nav.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', closeMenu);
  });

  // Auto-close when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      closeMenu();
    }
  });
})();

// FAQ toggle
(function() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (q && a) {
      a.style.display = 'none';
      q.addEventListener('click', () => {
        const open = a.style.display === 'block';
        a.style.display = open ? 'none' : 'block';
        item.toggleAttribute('open', !open);
      });
    }
  });
})();
