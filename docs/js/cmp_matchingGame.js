import KEYS from './constantKeys.js';

const LOGOS_PATH = '../public/images/game/';
const FLIP_BACK_DELAY_MS = 800;
const TECH_LOGOS = Object.freeze([
    { name: 'Salesforce', file: 'salesforce.png' },
    { name: 'JavaScript', file: 'javascript.png' },
    { name: 'C#', file: 'csharp.png' },
    { name: 'Git', file: 'git.png' },
    { name: 'Cursor', file: 'unity.png' },
    { name: 'REST APIs', file: 'api.jpg' },
    { name: 'React', file: 'react.png' },
    { name: 'Sass', file: 'sass.png' },
    { name: 'HTML', file: 'html.png' },
    { name: 'Claude', file: 'claude.png' },
    { name: 'Python', file: 'python.png' },
    { name: 'SQL Server', file: 'sqlserver.png' }
]);

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  dialog {
    width: min(60rem, calc(100vw - 2rem));
    max-height: calc(100vh - 2rem);
    max-height: calc(100dvh - 2rem);
    margin: auto;
    background-color: #1b1530;
    border: none;
    border-radius: .9rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, .5);
    font-family: var(--font-pretty);
    color: white;
    overflow-y: auto;
  }

  dialog[open] { animation: game-in .25s ease-out; }

  dialog::backdrop {
    background-color: rgba(10, 8, 20, .7);
    backdrop-filter: blur(3px);
  }

  @keyframes game-in {
    from {
      opacity: 0;
      transform: scale(.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .game-content { padding: 1.25rem 1.5rem 1.5rem; }

  .game-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: .75rem;
  }

  h2 {
    font-size: 14pt;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .close-btn {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    background: none;
    border: none;
    border-radius: 50%;
    font-size: 16pt;
    color: #cfc8ea;
    cursor: pointer;
  }

  .close-btn:hover { background-color: rgba(255, 255, 255, .1); }

  .stats {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: .5rem 1.25rem;
    margin-bottom: 1rem;
    font-size: 9pt;
    color: #cfc8ea;
  }

  .stats strong { color: white; }

  .restart-btn {
    margin-left: auto;
    padding: .45rem 1rem;
    background: none;
    border: 1px solid #6c5ce7;
    border-radius: 2rem;
    font-family: inherit;
    font-size: 8.5pt;
    font-weight: 600;
    color: white;
    cursor: pointer;
  }

  .restart-btn:hover { background-color: #3a2792; }

  .board-wrapper {
    position: relative;
    width: min(100%, calc((100vh - 11rem) * 1.5));
    width: min(100%, calc((100dvh - 11rem) * 1.5));
    margin: 0 auto;
  }

  .board {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: clamp(.35rem, 1.2vw, .75rem);
  }

  .card {
    aspect-ratio: 1;
    background: none;
    border: none;
    border-radius: .6rem;
    cursor: pointer;
    perspective: 40rem;
  }

  .card:disabled { cursor: default; }

  .card:focus-visible {
    outline: 2px solid #ffd54f;
    outline-offset: 2px;
  }

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform .45s ease;
  }

  .card.is-flipped .card-inner { transform: rotateY(180deg); }

  .card-back,
  .card-face {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: .6rem;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .card-back {
    background: linear-gradient(135deg, #3a2792, #6c5ce7);
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, .15);
    font-family: Consolas, 'Courier New', monospace;
    font-size: clamp(9pt, 2.4vw, 16pt);
    font-weight: 700;
    color: rgba(255, 255, 255, .85);
  }

  .card:hover:not(:disabled) .card-back { filter: brightness(1.15); }

  .card-face {
    padding: 12%;
    background-color: white;
    transform: rotateY(180deg);
  }

  .card-face img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
  }

  .card.is-matched .card-face {
    box-shadow: inset 0 0 0 3px #4caf50;
    animation: card-match .4s ease;
  }

  @keyframes card-match {
    50% {
      transform: rotateY(180deg) scale(1.08);
    }
  }

  .win-panel {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: .75rem;
    padding: 1.5rem;
    background-color: rgba(27, 21, 48, .92);
    border-radius: .6rem;
    font-size: 10pt;
    text-align: center;
  }

  .win-title {
    font-size: 20pt;
    font-weight: 800;
  }

  .play-again-btn {
    padding: .7rem 1.5rem;
    background-color: #ffd54f;
    border: none;
    border-radius: 2rem;
    font-family: inherit;
    font-size: 10pt;
    font-weight: 700;
    color: #1b1530;
    cursor: pointer;
  }

  @media (orientation: portrait) and (max-width: 48rem) {
    .game-content { padding: 1rem; }

    .board-wrapper {
      width: min(100%, calc((100vh - 13rem) * 2 / 3));
      width: min(100%, calc((100dvh - 13rem) * 2 / 3));
    }

    .board { grid-template-columns: repeat(4, 1fr); }
  }

  @media (prefers-reduced-motion: reduce) {
    dialog[open],
    .card.is-matched .card-face { animation: none; }

    .card-inner { transition: none; }
  }

  [hidden] { display: none; }
`);

const shuffle = items =>
{
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index--)
    {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
};

const formatTime = milliseconds =>
{
    const totalSeconds = Math.floor(milliseconds / 1000);
    return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
};

class MatchingGame extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
        this.isSpanish = false;
        this.isLocked = false;
        this.flippedCards = [];
        this.moves = 0;
        this.matchedPairs = 0;
        this.startTime = null;
        this.timerId = null;
        this.audioClick = new Audio('../public/audio/btn-click.mp3');
        this.audioClick.load();
        this.shadowRoot.innerHTML = `
          <dialog id="game-dialog" aria-labelledby="game-title">
            <div class="game-content">
              <header class="game-header">
                <h2 id="game-title"></h2>
                <button class="close-btn" id="close-btn">&times;</button>
              </header>

              <div class="stats">
                <p><span id="moves-label"></span> <strong id="moves">0</strong></p>
                <p><span id="pairs-label"></span> <strong id="pairs"></strong></p>
                <p><span id="time-label"></span> <strong id="time">0:00</strong></p>
                <button class="restart-btn" id="restart-btn"></button>
              </div>

              <div class="board-wrapper">
                <div class="board" id="board"></div>
                <div class="win-panel" id="win-panel" role="status" hidden>
                  <p class="win-title" id="win-title"></p>
                  <p id="win-text"></p>
                  <button class="play-again-btn" id="play-again-btn"></button>
                </div>
              </div>
            </div>
          </dialog>
        `;
    }

    connectedCallback()
    {
        const dialogElmt = this.shadowRoot.getElementById('game-dialog');
        const closeBtnElmt = this.shadowRoot.getElementById('close-btn');
        this.isSpanish = this.getAttribute('game-lang') === KEYS.LANG_SPANISH;

        this.shadowRoot.getElementById('game-title').textContent = this.pickLang('Tech stack pairs', 'Pares del tech stack');
        this.shadowRoot.getElementById('moves-label').textContent = this.pickLang('Moves:', 'Movimientos:');
        this.shadowRoot.getElementById('pairs-label').textContent = this.pickLang('Pairs:', 'Pares:');
        this.shadowRoot.getElementById('time-label').textContent = this.pickLang('Time:', 'Tiempo:');
        this.shadowRoot.getElementById('restart-btn').textContent = this.pickLang('Restart', 'Reiniciar');
        this.shadowRoot.getElementById('win-title').textContent = this.pickLang('You win!', '¡Ganaste!');
        this.shadowRoot.getElementById('play-again-btn').textContent = this.pickLang('Play again', 'Jugar de nuevo');
        closeBtnElmt.setAttribute('aria-label', this.pickLang('Close', 'Cerrar'));

        closeBtnElmt.onclick = () => this.close();
        this.shadowRoot.getElementById('restart-btn').onclick = () => this.startNewGame();
        this.shadowRoot.getElementById('play-again-btn').onclick = () => this.startNewGame();
        dialogElmt.onclick = event =>
        {
            if (event.target === dialogElmt) this.close();
        };
    }

    disconnectedCallback()
    {
        this.stopTimer();
    }

    pickLang(englishText, spanishText)
    {
        return this.isSpanish ? spanishText : englishText;
    }

    open()
    {
        const isFinished = this.matchedPairs === TECH_LOGOS.length;
        const hasBoard = this.shadowRoot.getElementById('board').children.length > 0;

        this.shadowRoot.getElementById('game-dialog').showModal();
        if (!hasBoard || isFinished) this.startNewGame();
    }

    close()
    {
        this.shadowRoot.getElementById('game-dialog').close();
    }

    startNewGame()
    {
        const deck = shuffle([...TECH_LOGOS, ...TECH_LOGOS]);

        this.stopTimer();
        this.isLocked = false;
        this.flippedCards = [];
        this.moves = 0;
        this.matchedPairs = 0;
        this.startTime = null;

        this.shadowRoot.getElementById('board').replaceChildren(...deck.map((logo, index) => this.createCardElmt(logo, index)));
        this.shadowRoot.getElementById('time').textContent = formatTime(0);
        this.shadowRoot.getElementById('win-panel').hidden = true;
        this.updateStats();
    }

    createCardElmt(logo, index)
    {
        const cardElmt = document.createElement('button');
        const innerElmt = document.createElement('div');
        const backElmt = document.createElement('div');
        const faceElmt = document.createElement('div');
        const imageElmt = document.createElement('img');

        cardElmt.className = 'card';
        cardElmt.dataset.name = logo.name;
        cardElmt.dataset.hiddenLabel = this.pickLang(`Card ${index + 1}`, `Carta ${index + 1}`);
        cardElmt.setAttribute('aria-label', cardElmt.dataset.hiddenLabel);
        innerElmt.className = 'card-inner';
        backElmt.className = 'card-back';
        backElmt.textContent = '</>';
        faceElmt.className = 'card-face';
        imageElmt.src = `${LOGOS_PATH}${logo.file}`;
        imageElmt.alt = logo.name;
        imageElmt.draggable = false;

        faceElmt.append(imageElmt);
        innerElmt.append(backElmt, faceElmt);
        cardElmt.append(innerElmt);
        cardElmt.onclick = () => this.flipCard(cardElmt);
        return cardElmt;
    }

    flipCard(cardElmt)
    {
        if (this.isLocked || cardElmt.classList.contains('is-flipped')) return;
        if (!this.startTime) this.startTimer();

        this.audioClick.currentTime = 0;
        this.audioClick.play();
        cardElmt.classList.add('is-flipped');
        cardElmt.setAttribute('aria-label', cardElmt.dataset.name);
        this.flippedCards.push(cardElmt);

        if (this.flippedCards.length < 2) return;

        const [firstCardElmt, secondCardElmt] = this.flippedCards;
        this.flippedCards = [];
        this.moves++;

        if (firstCardElmt.dataset.name === secondCardElmt.dataset.name)
        {
            [firstCardElmt, secondCardElmt].forEach(matchedCardElmt =>
            {
                matchedCardElmt.classList.add('is-matched');
                matchedCardElmt.disabled = true;
            });
            this.matchedPairs++;
            this.updateStats();

            if (this.matchedPairs === TECH_LOGOS.length) this.finishGame();
            return;
        }

        this.updateStats();
        this.isLocked = true;
        setTimeout(() =>
        {
            [firstCardElmt, secondCardElmt].forEach(missedCardElmt =>
            {
                missedCardElmt.classList.remove('is-flipped');
                missedCardElmt.setAttribute('aria-label', missedCardElmt.dataset.hiddenLabel);
            });
            this.isLocked = false;
        }, FLIP_BACK_DELAY_MS);
    }

    updateStats()
    {
        this.shadowRoot.getElementById('moves').textContent = this.moves;
        this.shadowRoot.getElementById('pairs').textContent = `${this.matchedPairs} / ${TECH_LOGOS.length}`;
    }

    startTimer()
    {
        this.startTime = Date.now();
        this.timerId = setInterval(() =>
        {
            this.shadowRoot.getElementById('time').textContent = formatTime(Date.now() - this.startTime);
        }, 1000);
    }

    stopTimer()
    {
        clearInterval(this.timerId);
        this.timerId = null;
    }

    finishGame()
    {
        const totalTime = formatTime(Date.now() - this.startTime);
        const winPanelElmt = this.shadowRoot.getElementById('win-panel');

        this.stopTimer();
        this.shadowRoot.getElementById('time').textContent = totalTime;
        this.shadowRoot.getElementById('win-text').textContent = this.pickLang(
            `You matched all ${TECH_LOGOS.length} pairs in ${this.moves} moves and ${totalTime}.`,
            `Encontraste los ${TECH_LOGOS.length} pares en ${this.moves} movimientos y ${totalTime}.`
        );
        winPanelElmt.hidden = false;
        this.shadowRoot.getElementById('play-again-btn').focus();
    }
}

customElements.define('matching-game', MatchingGame);
