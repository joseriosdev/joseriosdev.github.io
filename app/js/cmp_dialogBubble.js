import KEYS from './constantKeys.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  :host {
    --bubble-bg: rgba(23, 12, 34, .85);
    position: relative;
    display: inline-block;
  }

  .bubble {
    position: absolute;
    bottom: -400%;
    left: 50%;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: .75rem;
    width: 18.75rem;
    padding: .75rem;
    background: var(--bubble-bg);
    border: 1px solid #444;
    border-radius: .9375rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, .3);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    visibility: hidden;
    opacity: 0;
    transform: translateX(-50%) translateY(.625rem);
    transition: all .3s ease;
  }

  .bubble::after {
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -.5rem;
    border-width: .5rem;
    border-style: solid;
    border-color: transparent transparent var(--bubble-bg) transparent;
    content: '';
  }

  .avatar {
    flex-shrink: 0;
    width: 2.8125rem;
    height: 2.8125rem;
    border: 2px solid var(--blue);
    border-radius: 50%;
    object-fit: cover;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .content {
    min-height: 2.5rem;
    font-family: 'Segoe UI', Tahoma, sans-serif;
    font-size: 9.75pt;
    line-height: 1.4;
    color: whitesmoke;
  }

  .title {
    margin-bottom: .125rem;
    font-weight: bold;
    color: var(--blue);
  }

  .nav-controls {
    display: flex;
    justify-content: space-between;
    margin-top: .5rem;
    padding-top: .3125rem;
    border-top: 1px solid #777;
  }

  button {
    padding: 0 .3125rem;
    background: none;
    border: none;
    font-size: 12pt;
    font-weight: bold;
    color: var(--blue);
    cursor: pointer;
    transition: color .2s;
  }

  button:hover { color: lightskyblue; }

  button:disabled {
    color: #555;
    cursor: not-allowed;
  }

  .counter {
    align-self: center;
    font-size: 7.5pt;
    color: #ddd;
  }

  :host(:hover) .bubble {
    visibility: visible;
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`);

class DialogBubbleTooltip extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
        this.audioClick = new Audio('./app_legacy/assets/roulette-wheel-spin-single.mp3');
        this.audioClick.load();
        this.currentIndex = 0;
        this.messages = [];
        this.isComplete = false;
        this.shadowRoot.innerHTML = `
          <slot></slot>

          <div class="bubble">
            <img class="avatar" id="avatar" alt="">
            <div class="content-wrapper">
              <span class="title" id="greeting"></span>
              <div class="content" id="msg-text"></div>

              <div class="nav-controls">
                <button id="prev">&lsaquo;</button>
                <span class="counter" id="counter"></span>
                <button id="next">&rsaquo;</button>
              </div>
            </div>
          </div>
        `;
    }

    connectedCallback()
    {
        const avatar = this.getAttribute('avatar') || 'https://i.pravatar.cc/100';
        const greeting = this.getAttribute('greeting') || 'Hello,';
        const avatarElmt = this.shadowRoot.getElementById('avatar');
        const greetingElmt = this.shadowRoot.getElementById('greeting');

        try
        {
            const rawMessages = this.getAttribute('messages');
            this.messages = rawMessages ? JSON.parse(rawMessages) : ['No messages found.'];
        }
        catch
        {
            this.messages = [this.getAttribute('message') || 'Hello!'];
        }

        avatarElmt.src = avatar;
        avatarElmt.alt = greeting;
        greetingElmt.textContent = greeting;
        this.updateUI();

        this.shadowRoot.getElementById('prev').onclick = () => this.navigate(-1);
        this.shadowRoot.getElementById('next').onclick = () => this.navigate(1);
    }

    navigate(direction)
    {
        this.audioClick.play();
        const newIndex = this.currentIndex + direction;

        if (newIndex >= 0 && newIndex < this.messages.length)
        {
            this.currentIndex = newIndex;
            this.updateUI();
        }

        if (this.currentIndex === this.messages.length - 1 && !this.isComplete)
        {
            this.isComplete = true;
            this.dispatchEvent(new CustomEvent(KEYS.EVENT_BUBBLE_COMPLETE, { bubbles: true, composed: true }));
        }
    }

    updateUI()
    {
        const textElmt = this.shadowRoot.getElementById('msg-text');
        const counterElmt = this.shadowRoot.getElementById('counter');
        const prevBtnElmt = this.shadowRoot.getElementById('prev');
        const nextBtnElmt = this.shadowRoot.getElementById('next');

        textElmt.textContent = this.messages[this.currentIndex];
        counterElmt.textContent = `${this.currentIndex + 1} / ${this.messages.length}`;
        prevBtnElmt.disabled = this.currentIndex === 0;
        nextBtnElmt.disabled = this.currentIndex === this.messages.length - 1;
    }
}

customElements.define('dialog-bubble', DialogBubbleTooltip);
