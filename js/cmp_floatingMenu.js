
import KEYS from './constantKeys.js';

class FloatingMenu extends HTMLElement
{
  constructor()
  {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
    this.audioClick = new Audio('../media/btn-click.mp3');
    this.audioClick.load();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          bottom: 30px;
          right: 30px;
          font-family: 'Segoe UI', Roboto, sans-serif;
          z-index: 2;
          --btn-size: 45px;
          --btns-gap: 10px;
          --btn-size-diff: 10px;
        }

        /* Container for vertical buttons */
        .menu-container {
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          gap: var(--btns-gap);
        }

        /* Main Toggle Button */
        .menu-btn {
          width: calc(var(--btn-size) + var(--btn-size-diff));
          height: calc(var(--btn-size) + var(--btn-size-diff));
          border-radius: 50%;
          background: #3a2792;
          color: white;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s;
        }

        .menu-btn.active {
          transform: rotate(45deg);
          background: #b00020;
        }

        /* The sub-buttons container */
        .menu-items {
          display: flex;
          flex-direction: column-reverse;
          gap: var(--btns-gap);
          visibility: hidden;
          pointer-events: none;
        }

        .menu-items.open {
          visibility: visible;
          pointer-events: auto;
        }

        /* Individual sub-buttons */
        .sub-btn {
          width: var(--btn-size);
          height: var(--btn-size);
          border-radius: 50%;
          background: azure;
          border: 1px solid #aaa;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .sub-btn:hover {
          background: white;
          box-shadow: 0 3px 9px rgba(255, 255, 255, 0.5);
        }

        .daily-verse-btn { 
          right: calc(var(--btn-size) + var(--btns-gap));
          bottom: calc(calc(calc(var(--btns-gap) + var(--btn-size)) * -4) - calc(var(--btn-size-diff) * 0.5));
          transform: translateX(30px);
        }
        
        .game-btn {
          right: calc(var(--btn-size) + var(--btns-gap));
          bottom: calc(calc(calc(var(--btns-gap) + var(--btn-size)) * -4) - calc(var(--btn-size-diff) * 0.5));
          transform: translateX(30px) translateY(30px);
        }

        /* Label Tooltip */
        .sub-btn::before {
          content: attr(data-label);
          position: absolute;
          right: 65px;
          background: #333;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .sub-btn:hover::before {
          opacity: 1;
        }
        .move-x-btn-tooltip::before { right: 110px }

        /* Staggered Animation Logic */
        .menu-items.open .sub-btn {
          opacity: 1;
          transform: translateY(0);
        }

        .menu-items.open .sub-btn:nth-child(1) { transition-delay: 0.05s; }
        .menu-items.open .sub-btn:nth-child(2) { transition-delay: 0.1s; }
        .menu-items.open .sub-btn:nth-child(3) { transition-delay: 0.15s; }
        .menu-items.open .sub-btn:nth-child(4) { transition-delay: 0.2s; }

        svg { width: 28px; height: 28px; fill: currentColor; }

        .unable-btn::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(0, 0, 0, .5);
        }
      </style>

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
          <button class="sub-btn unable-btn"
            data-label=""
            label-lang-es="Pronto"
            label-lang-en="Coming soon">✨</button>
          <button class="sub-btn daily-verse-btn unable-btn"
            data-label=""
            label-lang-es="Pronto"
            label-lang-en="Coming soon">📜</button>
          <!--<button class="sub-btn game-btn"
            data-label=""
            label-lang-es="¡Jugar!"
            label-lang-en="Play!">🎮</button>
            Estilizada, Pretty, Verso Diario, Daily Verse-->
        </div>
      </div>
    `;
  }

  connectedCallback()
  {
    this.shadowRoot.querySelector('.menu-btn').onclick = () => this.toggleMenu();
    this.shadowRoot.getElementById('save-pdf-btn').onclick = () => this.savePdf();
    this.shadowRoot.getElementById('lang-change-btn').onclick = () => this.toggleLanguage();
  }

  savePdf()
  {
    this.audioClick.play();
    window.print();
  }

  toggleMenu()
  {
    this.isOpen = !this.isOpen;
    const menu = this.shadowRoot.querySelector('.menu-items');
    const mainBtn = this.shadowRoot.querySelector('.menu-btn');
    
    if(this.isOpen)
    {
      menu.classList.add('open');
      mainBtn.classList.add('active');
    }
    else
    {
      menu.classList.remove('open');
      mainBtn.classList.remove('active');
    }
    this.audioClick.play();
  }

  toggleLanguage()
  {
    this.audioClick.play();
    setTimeout(() =>
    {
      // Resume language
      const currentUrl = new URL(window.location.href);
      const newLang = localStorage.getItem(KEYS.CURRENT_LANG) === KEYS.LANG_SPANISH ? KEYS.LANG_DEFAULT : KEYS.LANG_SPANISH
      currentUrl.searchParams.set(KEYS.URL_LANG, newLang);
      window.location.replace(currentUrl.href);
      localStorage.setItem(KEYS.CURRENT_LANG, newLang);
      
      // Menu language
      const opposiveLang = { en: KEYS.LANG_SPANISH, es: KEYS.LANG_DEFAULT };
      const langToSet = opposiveLang[this.getAttribute('menu-lang')];
      this.setMenuLanguage(langToSet);
    }, 50);
  }

  setMenuLanguage(lang)
  {
    if (lang !== KEYS.LANG_SPANISH && lang !== KEYS.LANG_DEFAULT) lang = KEYS.LANG_DEFAULT;

    const subBtns = this.shadowRoot.querySelectorAll('.sub-btn');
    subBtns.forEach(btn =>
    {
      const label = btn.getAttribute('label-lang-' + lang);
      const content = btn.getAttribute('content-lang-' + lang);
      btn.setAttribute('data-label', label);

      if(content) btn.textContent = content;
    });
  }
}

customElements.define('fab-menu', FloatingMenu);
