// ============================================
// CivicVoice Multilingual / Translator Module
// Powered by Google Translate Client Widget
// Supported: English, Hindi, Kannada, Tamil, Telugu, Malayalam, Bengali
// ============================================

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali' },
];

const LANG_STORAGE_KEY = 'civicvoice_lang';

// Cookie helpers
function setCookie(name, value, days = 30) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  const host = window.location.hostname;
  document.cookie = `${name}=${value}; ${expires}; path=/;`;
  if (host && host !== 'localhost') {
    document.cookie = `${name}=${value}; ${expires}; path=/; domain=.${host};`;
    const parts = host.split('.');
    if (parts.length > 2) {
      const parentDomain = '.' + parts.slice(-2).join('.');
      document.cookie = `${name}=${value}; ${expires}; path=/; domain=${parentDomain};`;
    }
  }
}

function deleteCookie(name) {
  const host = window.location.hostname;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${host};`;
}

/** Get current active language code */
export function getCurrentLanguage() {
  return localStorage.getItem(LANG_STORAGE_KEY) || 'en';
}

/** Get language object by code */
export function getLanguageInfo(code) {
  return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
}

/** Apply language code to Google Translate combo element */
function applyComboLanguage(langCode) {
  const combo = document.querySelector('.goog-te-combo');
  if (!combo) return false;

  for (let i = 0; i < combo.options.length; i++) {
    const opt = combo.options[i];
    if (langCode === 'en' && (opt.value === '' || opt.value === 'en')) {
      if (combo.selectedIndex !== i) {
        combo.selectedIndex = i;
        combo.dispatchEvent(new Event('change'));
      }
      return true;
    } else if (opt.value === langCode) {
      if (combo.selectedIndex !== i) {
        combo.selectedIndex = i;
        combo.dispatchEvent(new Event('change'));
      }
      return true;
    }
  }
  return false;
}

/** Set and switch application language */
export function changeLanguage(langCode) {
  const current = getCurrentLanguage();
  localStorage.setItem(LANG_STORAGE_KEY, langCode);

  if (langCode === 'en') {
    deleteCookie('googtrans');
    setCookie('googtrans', '/en/en');
    const applied = applyComboLanguage('en');
    
    // If switching from another language back to English and Google element didn't auto-restore,
    // a swift reload guarantees clean original strings
    if (current !== 'en' && !applied) {
      window.location.reload();
      return;
    }
  } else {
    setCookie('googtrans', `/en/${langCode}`);
    const applied = applyComboLanguage(langCode);
    if (!applied) {
      // If combo isn't in DOM yet, poll for it
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (applyComboLanguage(langCode) || attempts > 20) {
          clearInterval(interval);
        }
      }, 150);
    }
  }

  // Update UI dropdowns on the page
  updateAllSelectors(langCode);

  // Dispatch custom event for app components
  window.dispatchEvent(new CustomEvent('civicvoice:language-changed', {
    detail: { language: langCode, info: getLanguageInfo(langCode) }
  }));
}

/** Updates label and active markers in all rendered language pickers */
function updateAllSelectors(langCode) {
  const lang = getLanguageInfo(langCode);

  // Update button labels
  document.querySelectorAll('.lang-selector-current-label').forEach(el => {
    el.textContent = lang.nativeName;
  });

  // Update active state in dropdown menus
  document.querySelectorAll('.lang-option-item').forEach(item => {
    const itemCode = item.getAttribute('data-lang');
    if (itemCode === langCode) {
      item.classList.add('active');
      if (!item.querySelector('.lang-check-icon')) {
        const check = document.createElement('span');
        check.className = 'lang-check-icon';
        check.innerHTML = `✓`;
        item.appendChild(check);
      }
    } else {
      item.classList.remove('active');
      item.querySelector('.lang-check-icon')?.remove();
    }
  });
}

/** Re-applies active translation after an SPA page transition */
export function reapplyTranslation() {
  const lang = getCurrentLanguage();
  if (lang && lang !== 'en') {
    // Re-check and trigger combo to ensure dynamic DOM content is translated
    setTimeout(() => {
      applyComboLanguage(lang);
    }, 100);
  }
}

/** Initialize Google Translate and sync saved language */
export function initTranslator() {
  const savedLang = getCurrentLanguage();
  if (savedLang && savedLang !== 'en') {
    setCookie('googtrans', `/en/${savedLang}`);
  }

  // Poll until Google Translate combo arrives, then apply saved lang
  let attempts = 0;
  const timer = setInterval(() => {
    attempts++;
    if (applyComboLanguage(savedLang) || attempts > 30) {
      clearInterval(timer);
    }
  }, 200);

  // Close open dropdown menus on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang-selector-container')) {
      document.querySelectorAll('.lang-dropdown-menu.open').forEach(menu => {
        menu.classList.remove('open');
      });
      document.querySelectorAll('.lang-selector-btn[aria-expanded="true"]').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.lang-dropdown-menu.open').forEach(menu => {
        menu.classList.remove('open');
      });
      document.querySelectorAll('.lang-selector-btn[aria-expanded="true"]').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Listen to hash changes and route resolutions in SPA router to reapply translation
  window.addEventListener('hashchange', () => {
    reapplyTranslation();
  });
  window.addEventListener('civicvoice:route-resolved', () => {
    reapplyTranslation();
  });
}

/**
 * Returns HTML string for the Language Selector widget.
 * translate="no" and class="notranslate" ensures Google never alters this menu.
 */
export function getLanguageSelectorHTML(options = {}) {
  const currentCode = getCurrentLanguage();
  const currentLang = getLanguageInfo(currentCode);
  const isCompact = options.compact || false;
  const extraClass = options.extraClass || '';

  const optionsHTML = SUPPORTED_LANGUAGES.map(lang => {
    const isActive = lang.code === currentCode;
    return `
      <button type="button" class="lang-option-item notranslate ${isActive ? 'active' : ''}" data-lang="${lang.code}" translate="no">
        <div class="lang-option-details">
          <span class="lang-option-native">${lang.nativeName}</span>
          <span class="lang-option-sub">${lang.name}</span>
        </div>
        ${isActive ? '<span class="lang-check-icon">✓</span>' : ''}
      </button>
    `;
  }).join('');

  return `
    <div class="lang-selector-container notranslate ${extraClass}" translate="no">
      <button type="button" class="lang-selector-btn notranslate ${isCompact ? 'compact' : ''}" aria-haspopup="true" aria-expanded="false" title="Change Language / ಭಾಷೆಯನ್ನು ಬದಲಿಸಿ">
        <svg class="lang-globe-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span class="lang-selector-current-label notranslate">${currentLang.nativeName}</span>
        <svg class="lang-chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div class="lang-dropdown-menu notranslate" translate="no">
        <div class="lang-dropdown-header">
          <div class="lang-dropdown-title">Select Language</div>
          <div class="lang-dropdown-subtitle">ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ • भाषा चुनें</div>
        </div>
        <div class="lang-options-list">
          ${optionsHTML}
        </div>
        <div class="lang-dropdown-footer">
          <span class="lang-footer-brand">⚡ Multilingual CivicVoice</span>
          <span class="lang-footer-note">Google Neural Translation</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Attaches event listeners to language selectors inside a container.
 */
export function attachLanguageSelectorEvents(root = document) {
  const containers = root.querySelectorAll('.lang-selector-container');
  containers.forEach(container => {
    const btn = container.querySelector('.lang-selector-btn');
    const menu = container.querySelector('.lang-dropdown-menu');
    if (!btn || !menu) return;

    // Toggle dropdown
    btn.onclick = (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('open');

      // Close all other open dropdowns first
      document.querySelectorAll('.lang-dropdown-menu.open').forEach(m => {
        if (m !== menu) m.classList.remove('open');
      });
      document.querySelectorAll('.lang-selector-btn[aria-expanded="true"]').forEach(b => {
        if (b !== btn) b.setAttribute('aria-expanded', 'false');
      });

      if (isOpen) {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        menu.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    };

    // Option items click
    container.querySelectorAll('.lang-option-item').forEach(opt => {
      opt.onclick = (e) => {
        e.stopPropagation();
        const code = opt.getAttribute('data-lang');
        if (code) {
          changeLanguage(code);
        }
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      };
    });
  });
}
