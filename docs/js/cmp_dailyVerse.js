import KEYS from './constantKeys.js';
import ApiCalls from './apiCalls.js';

const BIBLE_GATEWAY_URL = 'https://www.biblegateway.com/passage/';
const SPANISH_VERSION = 'NTV';
const SPANISH_BOOK_NAMES = Object.freeze({
    'Genesis': 'Génesis', 'Exodus': 'Éxodo', 'Leviticus': 'Levítico', 'Numbers': 'Números',
    'Deuteronomy': 'Deuteronomio', 'Joshua': 'Josué', 'Judges': 'Jueces', 'Ruth': 'Rut',
    '1 Samuel': '1 Samuel', '2 Samuel': '2 Samuel', '1 Kings': '1 Reyes', '2 Kings': '2 Reyes',
    '1 Chronicles': '1 Crónicas', '2 Chronicles': '2 Crónicas', 'Ezra': 'Esdras', 'Nehemiah': 'Nehemías',
    'Esther': 'Ester', 'Job': 'Job', 'Psalm': 'Salmos', 'Psalms': 'Salmos', 'Proverbs': 'Proverbios',
    'Ecclesiastes': 'Eclesiastés', 'Song of Solomon': 'Cantares', 'Song of Songs': 'Cantares',
    'Isaiah': 'Isaías', 'Jeremiah': 'Jeremías', 'Lamentations': 'Lamentaciones', 'Ezekiel': 'Ezequiel',
    'Daniel': 'Daniel', 'Hosea': 'Oseas', 'Joel': 'Joel', 'Amos': 'Amós', 'Obadiah': 'Abdías',
    'Jonah': 'Jonás', 'Micah': 'Miqueas', 'Nahum': 'Nahúm', 'Habakkuk': 'Habacuc', 'Zephaniah': 'Sofonías',
    'Haggai': 'Hageo', 'Zechariah': 'Zacarías', 'Malachi': 'Malaquías',
    'Matthew': 'Mateo', 'Mark': 'Marcos', 'Luke': 'Lucas', 'John': 'Juan', 'Acts': 'Hechos',
    'Romans': 'Romanos', '1 Corinthians': '1 Corintios', '2 Corinthians': '2 Corintios',
    'Galatians': 'Gálatas', 'Ephesians': 'Efesios', 'Philippians': 'Filipenses', 'Colossians': 'Colosenses',
    '1 Thessalonians': '1 Tesalonicenses', '2 Thessalonians': '2 Tesalonicenses',
    '1 Timothy': '1 Timoteo', '2 Timothy': '2 Timoteo', 'Titus': 'Tito', 'Philemon': 'Filemón',
    'Hebrews': 'Hebreos', 'James': 'Santiago', '1 Peter': '1 Pedro', '2 Peter': '2 Pedro',
    '1 John': '1 Juan', '2 John': '2 Juan', '3 John': '3 Juan', 'Jude': 'Judas', 'Revelation': 'Apocalipsis'
});

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  dialog {
    width: min(34rem, calc(100vw - 2rem));
    max-height: calc(100vh - 2rem);
    max-height: calc(100dvh - 2rem);
    margin: auto;
    padding: 2.25rem 2rem 2rem;
    background-color: #fffdf9;
    border: none;
    border-radius: .9rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, .45);
    font-family: var(--font-pretty);
    color: #1f1f1f;
    overflow-y: auto;
  }

  dialog[open] { animation: verse-in .25s ease-out; }

  dialog::backdrop {
    background-color: rgba(10, 8, 20, .6);
    backdrop-filter: blur(3px);
  }

  @keyframes verse-in {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .close-btn {
    position: absolute;
    top: .75rem;
    right: .75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    background: none;
    border: none;
    border-radius: 50%;
    font-size: 16pt;
    color: #555;
    cursor: pointer;
  }

  .close-btn:hover { background-color: #f0ebe4; }

  .eyebrow {
    margin-bottom: 1rem;
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #9a6f55;
  }

  .verse-text {
    font-family: var(--font-main);
    font-size: 16pt;
    font-style: italic;
    line-height: 1.45;
  }

  .verse-note,
  .status {
    font-size: 10pt;
    line-height: 1.5;
  }

  .status { color: #666; }

  .verse-reference {
    margin-top: 1rem;
    font-size: 10pt;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .read-btn {
    display: inline-block;
    margin-top: 1.5rem;
    padding: .7rem 1.4rem;
    background-color: #3a2792;
    border-radius: 2rem;
    font-size: 9pt;
    font-weight: 600;
    color: white;
    text-decoration: none;
  }

  .read-btn:hover { background-color: #2c1d70; }

  @media (max-width: 30rem) {
    dialog {
      width: 100%;
      max-width: none;
      max-height: 85vh;
      max-height: 85dvh;
      margin: auto 0 0;
      padding: 2rem 1.25rem 1.5rem;
      border-radius: .9rem .9rem 0 0;
    }

    .verse-text { font-size: 13pt; }

    .read-btn {
      display: block;
      text-align: center;
    }
  }

  [hidden] { display: none; }
`);

const toSpanishReference = reference =>
{
    const match = reference.match(/^(.+?)\s+(\d+(?::[\d,–-]+)?)$/);
    if (!match) return reference;

    const [, book, chapterAndVerses] = match;
    return `${SPANISH_BOOK_NAMES[book] || book} ${chapterAndVerses}`;
};

const buildBibleGatewayUrl = (reference, version) =>
{
    const url = new URL(BIBLE_GATEWAY_URL);
    url.searchParams.set('search', reference);
    url.searchParams.set('version', version);
    return url.href;
};

class DailyVerse extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
        this.isSpanish = false;
        this.verse = null;
        this.shadowRoot.innerHTML = `
          <dialog id="verse-dialog" aria-labelledby="verse-title">
            <button class="close-btn" id="close-btn">&times;</button>
            <p class="eyebrow" id="verse-title"></p>
            <p class="status" id="status" hidden></p>
            <blockquote class="verse-text" id="verse-text" hidden></blockquote>
            <p class="verse-note" id="verse-note" hidden></p>
            <p class="verse-reference" id="verse-reference" hidden></p>
            <a class="read-btn" id="read-link" href="#" target="_blank" rel="noopener noreferrer" hidden></a>
          </dialog>
        `;
    }

    connectedCallback()
    {
        const dialogElmt = this.shadowRoot.getElementById('verse-dialog');
        const closeBtnElmt = this.shadowRoot.getElementById('close-btn');
        this.isSpanish = this.getAttribute('verse-lang') === KEYS.LANG_SPANISH;

        this.shadowRoot.getElementById('verse-title').textContent = this.pickLang('Verse of the day', 'Versículo del día');
        closeBtnElmt.setAttribute('aria-label', this.pickLang('Close', 'Cerrar'));
        closeBtnElmt.onclick = () => this.close();
        dialogElmt.onclick = event =>
        {
            if (event.target === dialogElmt) this.close();
        };
    }

    pickLang(englishText, spanishText)
    {
        return this.isSpanish ? spanishText : englishText;
    }

    async open()
    {
        this.shadowRoot.getElementById('verse-dialog').showModal();
        if (this.verse) return;

        this.showStatus(this.pickLang('Loading today’s verse...', 'Cargando el versículo de hoy...'));

        try
        {
            this.verse = await ApiCalls.getDailyVerse();
            this.renderVerse();
        }
        catch
        {
            this.showStatus(this.pickLang('Today’s verse could not be loaded. Please try again later.', 'No se pudo cargar el versículo de hoy. Inténtalo más tarde.'));
        }
    }

    close()
    {
        this.shadowRoot.getElementById('verse-dialog').close();
    }

    showStatus(message)
    {
        const statusElmt = this.shadowRoot.getElementById('status');
        statusElmt.textContent = message;
        statusElmt.hidden = false;
    }

    renderVerse()
    {
        const { text, reference, version } = this.verse;
        const textElmt = this.shadowRoot.getElementById('verse-text');
        const noteElmt = this.shadowRoot.getElementById('verse-note');
        const referenceElmt = this.shadowRoot.getElementById('verse-reference');
        const readLinkElmt = this.shadowRoot.getElementById('read-link');

        this.shadowRoot.getElementById('status').hidden = true;
        referenceElmt.hidden = false;
        readLinkElmt.hidden = false;

        if (this.isSpanish)
        {
            const spanishReference = toSpanishReference(reference);
            noteElmt.textContent = 'Lee el versículo de hoy en la Nueva Traducción Viviente.';
            noteElmt.hidden = false;
            referenceElmt.textContent = `${spanishReference} (${SPANISH_VERSION})`;
            readLinkElmt.textContent = `Leer en ${SPANISH_VERSION}`;
            readLinkElmt.href = buildBibleGatewayUrl(spanishReference, SPANISH_VERSION);
        }
        else
        {
            textElmt.textContent = `“${text}”`;
            textElmt.hidden = false;
            referenceElmt.textContent = `${reference} (${version})`;
            readLinkElmt.textContent = 'Read on Bible Gateway';
            readLinkElmt.href = buildBibleGatewayUrl(reference, version);
        }
    }
}

customElements.define('daily-verse', DailyVerse);
