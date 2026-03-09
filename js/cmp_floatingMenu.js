
import KEYS from './constantKeys.js';

class FloatingMenu extends HTMLElement
{
  constructor()
  {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
  }

  connectedCallback()
  {
    this.render();
  }

  toggleMenu()
  {
    this.isOpen = !this.isOpen;
    const menu = this.shadowRoot.querySelector('.menu-items');
    const mainBtn = this.shadowRoot.querySelector('.main-btn');
    
    if (this.isOpen)
    {
      menu.classList.add('open');
      mainBtn.classList.add('active');
    } else
    {
      menu.classList.remove('open');
      mainBtn.classList.remove('active');
    }
  }

  toggleLanguage()
  {
    const currentUrl = new URL(window.location.href);
    const newLang = localStorage.getItem(KEYS.CURRENT_LANG) === 'es' ? 'en' : 'es'
    currentUrl.searchParams.set(KEYS.URL_LANG, newLang);
    window.location.assign(currentUrl.href);
    localStorage.setItem(KEYS.CURRENT_LANG, newLang);
  }

  render()
  {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          bottom: 30px;
          right: 30px;
          font-family: 'Segoe UI', Roboto, sans-serif;
          z-index: 9999;
        }

        /* Container for vertical buttons */
        .menu-container {
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          gap: 15px;
        }

        /* Main Toggle Button */
        .main-btn {
          width: 60px;
          height: 60px;
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

        .main-btn.active {
          transform: rotate(45deg);
          background: #b00020;
        }

        /* The sub-buttons container */
        .menu-items {
          display: flex;
          flex-direction: column-reverse;
          gap: 12px;
          visibility: hidden;
          pointer-events: none;
        }

        .menu-items.open {
          visibility: visible;
          pointer-events: auto;
        }

        /* Individual sub-buttons */
        .sub-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: azure;
          border: 1px solid #aaa;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
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
      </style>

      <div class="menu-container">
        <button class="main-btn" id="toggle">
          <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        </button>

        <div class="menu-items">
          <button class="sub-btn" data-label="Save as PDF" id="save-pdf-btn">📁</button>
          <button class="sub-btn" data-label="Spanish" id="lang-change-btn">🇪🇸</button>
          <!--<button class="sub-btn" data-label="Pretty">✨</button>-->
          <!--<button class="sub-btn" data-label="Contact Me">⌯⌲</button>-->
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('toggle').onclick = () => this.toggleMenu();
    this.shadowRoot.getElementById('save-pdf-btn').onclick = () => window.print();
    this.shadowRoot.getElementById('lang-change-btn').onclick = () => this.toggleLanguage();
    
  }
}

customElements.define('fab-menu', FloatingMenu);
