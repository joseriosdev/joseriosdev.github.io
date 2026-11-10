import KEYS from './constantKeys.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  :host {
    --menu-btn-size: 2.8125rem;
    --menu-btns-gap: .625rem;
    --menu-btn-size-diff: .625rem;
    position: fixed;
    right: 1.875rem;
    bottom: 1.875rem;
    z-index: 2;
    font-family: 'Segoe UI', Roboto, sans-serif;
  }

  .menu-container {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    gap: var(--menu-btns-gap);
  }

  .menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(var(--menu-btn-size) + var(--menu-btn-size-diff));
    height: calc(var(--menu-btn-size) + var(--menu-btn-size-diff));
    background: #3a2792;
    border: none;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, .3);
    color: white;
    cursor: pointer;
    transition: transform .3s cubic-bezier(.175, .885, .32, 1.275), background .3s;
  }

  .menu-btn.active {
    background: #b00020;
    transform: rotate(45deg);
  }

  .menu-items {
    display: flex;
    flex-direction: column-reverse;
    gap: var(--menu-btns-gap);
    visibility: hidden;
    pointer-events: none;
  }

  .menu-items.open {
    visibility: visible;
    pointer-events: auto;
  }

  .sub-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--menu-btn-size);
    height: var(--menu-btn-size);
    background: azure;
    border: 1px solid #aaa;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
    cursor: pointer;
    opacity: 0;
    transform: translateY(1.875rem);
    transition: all .3s cubic-bezier(.4, 0, .2, 1);
  }

  .sub-btn:hover {
    background: white;
    box-shadow: 0 3px 9px rgba(255, 255, 255, .5);
  }

  .daily-verse-btn {
    right: calc(var(--menu-btn-size) + var(--menu-btns-gap));
    bottom: calc((var(--menu-btns-gap) + var(--menu-btn-size)) * -4 - var(--menu-btn-size-diff) * .5);
    transform: translateX(1.875rem);
  }

  .game-btn {
    right: calc((var(--menu-btn-size) + var(--menu-btns-gap)) * 2);
    bottom: calc((var(--menu-btns-gap) + var(--menu-btn-size)) * -5 - var(--menu-btn-size-diff) * .5);
    transform: translateX(1.875rem);
  }

  .sub-btn::before {
    position: absolute;
    right: 4.0625rem;
    padding: .3125rem .625rem;
    background: #333;
    border-radius: .25rem;
    font-size: 9pt;
    white-space: nowrap;
    color: white;
    content: attr(data-label);
    opacity: 0;
    pointer-events: none;
    transition: opacity .2s;
  }

  .daily-verse-btn::before,
  .game-btn::before {
    right: auto;
    bottom: calc(100% + .5rem);
  }

  .sub-btn:hover::before { opacity: 1; }
  .move-x-btn-tooltip::before { right: 6.875rem; }

  .menu-items.open .sub-btn {
    opacity: 1;
    transform: translateY(0);
  }

  .menu-items.open .sub-btn:nth-child(1) { transition-delay: .05s; }
  .menu-items.open .sub-btn:nth-child(2) { transition-delay: .1s; }
  .menu-items.open .sub-btn:nth-child(3) { transition-delay: .15s; }
  .menu-items.open .sub-btn:nth-child(4) { transition-delay: .2s; }
  .menu-items.open .sub-btn:nth-child(5) { transition-delay: .25s; }
  .menu-items.open .sub-btn:nth-child(6) { transition-delay: .3s; }

  .sub-btn[hidden] { display: none; }

  .theme-btn:not([hidden]) ~ .daily-verse-btn {
    bottom: calc((var(--menu-btns-gap) + var(--menu-btn-size)) * -5 - var(--menu-btn-size-diff) * .5);
  }

  .theme-btn:not([hidden]) ~ .game-btn {
    bottom: calc((var(--menu-btns-gap) + var(--menu-btn-size)) * -6 - var(--menu-btn-size-diff) * .5);
  }

  .menu-btn.has-news { animation: menu-pulse 1.6s ease-in-out infinite; }

  @keyframes menu-pulse {
    0%,
    100% {
      box-shadow: 0 4px 12px rgba(0, 0, 0, .3), 0 0 0 0 rgba(255, 213, 79, .8);
    }
    50% {
      box-shadow: 0 4px 12px rgba(0, 0, 0, .3), 0 0 0 .6rem rgba(255, 213, 79, 0);
    }
  }

  svg {
    width: 1.75rem;
    height: 1.75rem;
    fill: currentColor;
  }

  .unable-btn::after {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    border-radius: 50%;
    content: '';
  }
`);

class FloatingMenu extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
        this.isOpen = false;
        this.audioClick = new Audio('./public/audio/btn-click.mp3');
        this.audioClick.load();
        this.shadowRoot.innerHTML = `
          <div class="menu-container">
            <button class="menu-btn">
              <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            </button>

            <div class="menu-items">
              <button class="sub-btn"
                data-label=""
                id="save-pdf-btn"
                label-lang-es="Guardar como PDF"
                label-lang-en="Save as PDF">💾</button>
              <button class="sub-btn"
                data-label=""
                id="lang-change-btn"
                label-lang-es="Inglés"
                label-lang-en="Spanish"
                content-lang-es="🇬🇧"
                content-lang-en="🇪🇸"></button>
              <button class="sub-btn"
                data-label=""
                id="view-change-btn"></button>
              <button class="sub-btn theme-btn"
                data-label=""
                id="theme-change-btn"
                label-lang-es="Cambiar colores"
                label-lang-en="Change colors"
                hidden>🎨</button>
              <button class="sub-btn daily-verse-btn"
                data-label=""
                id="daily-verse-btn"
                label-lang-es="Versículo del día"
                label-lang-en="Daily verse">📜</button>
              <button class="sub-btn game-btn"
                data-label=""
                id="game-btn"
                label-lang-es="¡Jugar!"
                label-lang-en="Play!"
                hidden>🎮</button>
            </div>
          </div>
        `;
    }

    connectedCallback()
    {
        this.shadowRoot.querySelector('.menu-btn').onclick = () => this.toggleMenu();
        this.shadowRoot.getElementById('save-pdf-btn').onclick = () => this.savePdf();
        this.shadowRoot.getElementById('lang-change-btn').onclick = () => this.toggleLanguage();
        this.shadowRoot.getElementById('view-change-btn').onclick = () => this.toggleView();
        this.shadowRoot.getElementById('theme-change-btn').onclick = () => this.toggleTheme();
        this.shadowRoot.getElementById('daily-verse-btn').onclick = () => this.openDailyVerse();
        this.shadowRoot.getElementById('game-btn').onclick = () => this.openGame();
        this.updateGameButton();
    }

    openDailyVerse()
    {
        this.audioClick.play();
        this.completeSecretStep(KEYS.SECRET_VERSE_SEEN);
        this.dispatchEvent(new CustomEvent(KEYS.EVENT_DAILY_VERSE_OPEN));
    }

    openGame()
    {
        this.audioClick.play();
        this.dispatchEvent(new CustomEvent(KEYS.EVENT_GAME_OPEN));
    }

    completeSecretStep(stepKey)
    {
        const wasUnlocked = this.isGameUnlocked();
        localStorage.setItem(stepKey, 'true');

        if (!wasUnlocked && this.isGameUnlocked())
        {
            this.shadowRoot.querySelector('.menu-btn').classList.add('has-news');
        }
        this.updateGameButton();
    }

    isGameUnlocked()
    {
        return localStorage.getItem(KEYS.SECRET_VERSE_SEEN) === 'true'
            && localStorage.getItem(KEYS.SECRET_MESSAGES_SEEN) === 'true';
    }

    updateGameButton()
    {
        this.shadowRoot.getElementById('game-btn').hidden = !this.isGameUnlocked();
    }

    savePdf()
    {
        this.audioClick.play();
        window.print();
    }

    toggleMenu()
    {
        const mainBtnElmt = this.shadowRoot.querySelector('.menu-btn');
        this.isOpen = !this.isOpen;
        this.shadowRoot.querySelector('.menu-items').classList.toggle('open', this.isOpen);
        mainBtnElmt.classList.toggle('active', this.isOpen);
        mainBtnElmt.classList.remove('has-news');
        this.audioClick.play();
    }

    toggleLanguage()
    {
        this.audioClick.play();
        setTimeout(() =>
        {
            const currentUrl = new URL(window.location.href);
            const newLang = localStorage.getItem(KEYS.CURRENT_LANG) === KEYS.LANG_SPANISH ? KEYS.LANG_DEFAULT : KEYS.LANG_SPANISH;
            currentUrl.searchParams.set(KEYS.URL_LANG, newLang);
            window.location.replace(currentUrl.href);
            localStorage.setItem(KEYS.CURRENT_LANG, newLang);
            this.setMenuLanguage(newLang);
        }, 50);
    }

    toggleView()
    {
        this.audioClick.play();
        setTimeout(() =>
        {
            const currentUrl = new URL(window.location.href);
            const newView = this.getAttribute('menu-view') === KEYS.VIEW_PRETTY ? KEYS.VIEW_ATS : KEYS.VIEW_PRETTY;
            currentUrl.searchParams.set(KEYS.URL_VIEW, newView);
            window.location.replace(currentUrl.href);
        }, 50);
    }

    toggleTheme()
    {
        this.audioClick.play();
        const currentIndex = KEYS.THEMES.indexOf(localStorage.getItem(KEYS.CURRENT_THEME));
        const newTheme = KEYS.THEMES[(currentIndex + 1) % KEYS.THEMES.length];
        localStorage.setItem(KEYS.CURRENT_THEME, newTheme);
        this.dispatchEvent(new CustomEvent(KEYS.EVENT_THEME_CHANGE, { detail: { theme: newTheme } }));
    }

    setMenuView(view)
    {
        const isPretty = view === KEYS.VIEW_PRETTY;
        const viewBtnElmt = this.shadowRoot.getElementById('view-change-btn');

        viewBtnElmt.setAttribute('label-lang-es', isPretty ? 'Versión ATS' : 'Versión estilizada');
        viewBtnElmt.setAttribute('label-lang-en', isPretty ? 'ATS version' : 'Pretty version');
        viewBtnElmt.textContent = isPretty ? '📄' : '✨';
        this.shadowRoot.getElementById('theme-change-btn').hidden = !isPretty;
    }

    setMenuLanguage(lang)
    {
        const menuLang = lang === KEYS.LANG_SPANISH ? KEYS.LANG_SPANISH : KEYS.LANG_DEFAULT;

        this.shadowRoot.querySelectorAll('.sub-btn').forEach(btnElmt =>
        {
            const label = btnElmt.getAttribute(`label-lang-${menuLang}`);
            const content = btnElmt.getAttribute(`content-lang-${menuLang}`);
            btnElmt.setAttribute('data-label', label);

            if (content) btnElmt.textContent = content;
        });
    }
}

customElements.define('fab-menu', FloatingMenu);
