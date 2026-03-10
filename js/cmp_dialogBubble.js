class DialogBubbleTooltip extends HTMLElement
{
  constructor()
  {
    super();
    this.attachShadow({ mode: 'open' });
    // Internal state
    this.currentIndex = 0;
    this.messages = [];
  }

  connectedCallback()
  {
    const avatar = this.getAttribute('avatar') || 'https://i.pravatar.cc/100';
    const title = this.getAttribute('title') || 'Assistant';
    
    try
    {
      const rawMessages = this.getAttribute('messages');
      this.messages = rawMessages ? JSON.parse(rawMessages) : ["No messages found."];
    } 
    catch (e)
    {
      this.messages = [this.getAttribute('message') || 'Hello!'];
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: relative;
          display: inline-block;
          --bubble-bg: rgba(23, 12, 34, 0.85);
        }

        .bubble {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          bottom: -400%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          width: 350px;
          background: var(--bubble-bg);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          border-radius: 15px;
          padding: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
          z-index: 3;
          border: 1px solid #444;
        }

        .bubble::after {
          content: '';
          position: absolute;
          bottom: 100%;
          left: 50%;
          margin-left: -8px;
          border-width: 8px;
          border-style: solid;
          border-color: transparent transparent var(--bubble-bg) transparent;
        }

        .avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--blue);
          flex-shrink: 0;
        }

        .content-wrapper {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .content {
          font-family: 'Segoe UI', Tahoma, sans-serif;
          font-size: 13px;
          color: whitesmoke;
          line-height: 1.4;
          min-height: 40px;
        }

        .title {
          font-weight: bold;
          color: var(--blue);
          margin-bottom: 2px;
        }

        /* Nav Arrows */
        .nav-controls {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          border-top: 1px solid #777;
          padding-top: 5px;
        }

        button {
          background: none;
          border: none;
          color: var(--blue);
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
          padding: 0 5px;
          transition: color 0.2s;
        }

        button:hover { color: lightskyblue; }
        button:disabled { color: #555; cursor: not-allowed; }

        .counter {
          color: #ddd;
          font-size: 10px;
          align-self: center;
        }

        :host(:hover) .bubble {
          visibility: visible;
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      </style>

      <slot></slot>

      <div class="bubble">
        <img src="${avatar}" class="avatar" alt="${title}">
        <div class="content-wrapper">
          <span class="title">${title}</span>
          <div class="content" id="msg-text">${this.messages[this.currentIndex]}</div>
          
          <div class="nav-controls">
            <button id="prev" ${this.currentIndex === 0 ? 'disabled' : ''}>&lsaquo;</button>
            <span class="counter" id="counter">1 / ${this.messages.length}</span>
            <button id="next" ${this.currentIndex === this.messages.length - 1 ? 'disabled' : ''}>&rsaquo;</button>
          </div>
        </div>
      </div>
    `;

    // Add Event Listeners
    this.shadowRoot.getElementById('prev').addEventListener('click', () => this.navigate(-1));
    this.shadowRoot.getElementById('next').addEventListener('click', () => this.navigate(1));
  }

  navigate(direction)
  {
    const newIndex = this.currentIndex + direction;
    
    if (newIndex >= 0 && newIndex < this.messages.length)
    {
      this.currentIndex = newIndex;
      this.updateUI();
    }
  }

  updateUI()
  {
    const textEl = this.shadowRoot.getElementById('msg-text');
    const counterEl = this.shadowRoot.getElementById('counter');
    const prevBtn = this.shadowRoot.getElementById('prev');
    const nextBtn = this.shadowRoot.getElementById('next');

    textEl.textContent = this.messages[this.currentIndex];
    counterEl.textContent = `${this.currentIndex + 1} / ${this.messages.length}`;

    // Update button states
    prevBtn.disabled = this.currentIndex === 0;
    nextBtn.disabled = this.currentIndex === this.messages.length - 1;
  }
}

customElements.define('dialog-bubble', DialogBubbleTooltip);
