// i18n.js
// Handles language switching and content updates

// Default to Indonesian (id) or detected language if valid
const validLangs = ['tr', 'en', 'id'];
let currentLang = localStorage.getItem('lang') || 'id';
if (!validLangs.includes(currentLang)) currentLang = 'id';

function setLanguage(lang) {
    if (!validLangs.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateContent();
    updateActiveLangButton();
}

function updateContent() {
    const t = translations[currentLang];
    if (!t) return;

    // Helper to resolve dot notation, e.g., "nav.home"
    const resolve = (path, obj) => {
        return path.split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : null;
        }, obj);
    };

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = resolve(key, t);
        if (text) {
            // If element is an input or textarea with placeholder
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.innerText = text;
            }
        }
    });

    // Specific dynamic updates if needed (e.g. document title)
    // We can add data-i18n-title to body or html usually, but here manually:
    // We might want to update titles for pages slightly different structure.
    // For now rely on data-i18n on <title> if possible, or manual:
    // document.title = t.pageTitle || document.title;
}

function updateActiveLangButton() {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function initLanguage() {
    // Inject language switcher into header if it exists
    const headerContainer = document.querySelector('.site-header .container');
    if (headerContainer) {
        const switcher = document.createElement('div');
        switcher.className = 'lang-switcher';
        switcher.innerHTML = `
      <button class="lang-btn" data-lang="tr" onclick="setLanguage('tr')">🇹🇷</button>
      <button class="lang-btn" data-lang="id" onclick="setLanguage('id')">🇮🇩</button>
      <button class="lang-btn" data-lang="en" onclick="setLanguage('en')">🇬🇧</button>
    `;
        // Insert before nav
        const nav = headerContainer.querySelector('nav');
        if (nav) {
            headerContainer.insertBefore(switcher, nav);
        } else {
            headerContainer.appendChild(switcher);
        }
    }

    updateContent();
    updateActiveLangButton();
    window.updateTranslations = updateContent;
}

document.addEventListener('DOMContentLoaded', () => {
    initLanguage();

    // Load Global Effects
    const snowScript = document.createElement('script');
    snowScript.src = 'snow.js';
    document.body.appendChild(snowScript);

    const wishScript = document.createElement('script');
    wishScript.src = 'wishing_star.js';
    document.body.appendChild(wishScript);
});

