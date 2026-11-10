# Architecture

Technical reference for the resume site of [joseriosdev](https://github.com/joseriosdev). It describes everything needed to understand, maintain, or rebuild the site from scratch.

## 1. What the site is

A static, single-page resume (CV) with two visual versions of the same data:

| Version | Purpose | Custom element |
|---|---|---|
| **ATS** (default) | Plain, single-column layout that Applicant Tracking Systems parse reliably. Full content. | `<simple-resume>` |
| **Pretty** | Designed two-column layout with a colored sidebar, photo, and 3 color themes. Same data, presented visually. | `<pretty-resume>` |

Both versions are available in **English and Spanish** and can be **saved as PDF** (US Letter) through the browser print dialog. A floating action menu switches language, version, and color theme, and opens a **Daily Bible Verse** modal.

A hidden **Matching Pairs game** (12 tech-stack logos, 6×4 grid) unlocks once the visitor has opened the daily verse and read every message in the name's greeting bubble (section 8.6). Until then the menu shows a grayed-out `?` mystery button that hints at the game instead of opening it.

## 2. Tech stack and constraints

- **HTML, CSS, and vanilla JavaScript only.** ES modules loaded directly by the browser.
- **No build step, no bundler, no npm packages, no frameworks.** Every UI piece is a native Web Component (`class extends HTMLElement`) with Shadow DOM.
- **No backend and no database.** Resume content lives in two JSON files.
- External resources loaded from CDNs: Google Fonts (Crimson Pro, Montserrat) and Font Awesome 4.7 (icons in the pretty version).
- External APIs: `ipapi.co` (visitor location) and OpenWeatherMap (temperature) for the ATS greeting; OurManna for the daily verse. Bible Gateway is only linked to, never fetched.

Coding conventions are mandatory and live in [`.cursor/rules/coding-standards.mdc`](.cursor/rules/coding-standards.mdc). Agent boundaries live in [`AGENTS.md`](AGENTS.md).

## 3. Directory structure

```
/
├── AGENTS.md                      Agent rules and project context
├── ARCHITECTURE.md                This file
├── README.md                      Public description and feature checklist
├── .cursorignore                  Hides docs/app_legacy/ from AI indexing
├── .cursor/
│   ├── rules/coding-standards.mdc JavaScript, CSS, and HTML standards
│   └── skills/resumes-lang-validation/
│       ├── SKILL.md               "translate" skill: syncs spanish.json from english.json
│       └── scripts/compare-keys.ps1  Structure check between both JSON files
└── docs/                          The published site (GitHub Pages source folder)
    ├── index.html                 The only page of the app (entry point)
    ├── main.css                   Global styles and design tokens
    ├── js/
    │   ├── main.js                Router: reads URL, mounts elements
    │   ├── constantKeys.js        Shared string keys (KEYS)
    │   ├── apiCalls.js            All HTTP calls (ApiCalls)
    │   ├── greetingBubble.js      Builds the <dialog-bubble> both resumes put on the name
    │   ├── cmp_resume.js          <simple-resume>  ATS version
    │   ├── cmp_prettyResume.js    <pretty-resume>  pretty version
    │   ├── cmp_floatingMenu.js    <fab-menu>       floating action menu
    │   ├── cmp_dialogBubble.js    <dialog-bubble>  hover tooltip with messages
    │   ├── cmp_dailyVerse.js      <daily-verse>    daily Bible verse modal
    │   └── cmp_matchingGame.js    <matching-game>  hidden matching pairs game
    ├── data/
    │   ├── english.json           Resume content, source of truth
    │   └── spanish.json           Spanish translation, same structure
    ├── public/
    │   ├── audio/
    │   │   ├── btn-click.mp3      Menu click sound
    │   │   ├── done-sound.mp3     Game unlocked, and each pair found
    │   │   ├── card-flip.wav      Card flip in the game
    │   │   └── tada.wav           Game won (played at 50% volume)
    │   └── images/
    │       ├── me.ico             Favicon
    │       ├── profile_pic.jpg    Profile photo (dialog bubble avatar and pretty version photo)
    │       └── game/              12 tech logos for the matching game (unity.png is the Cursor logo)
    └── app_legacy/                Older portfolio site; independent, not part of this architecture
```

## 4. Running locally

The site must be served over HTTP with **`docs/` as the site root** (ES modules and `fetch` do not work from `file://`). All runtime paths are relative to `docs/index.html` (`./data/`, `./public/`).

Any static server works, for example `npx serve docs` or `python -m http.server -d docs` from the repo root, then open:

| URL | Result |
|---|---|
| `/` | ATS version, English |
| `/?lang=es` | ATS version, Spanish |
| `/?view=pretty` | Pretty version, English |
| `/?view=pretty&lang=es` | Pretty version, Spanish |

Production is GitHub Pages at `https://joseriosdev.github.io/`, published from the `/docs` folder (repo Settings → Pages → Branch `main`, folder `/docs`). Social preview images in `index.html` assume `docs/` is the site root (`https://joseriosdev.github.io/public/images/profile_pic.jpg`), and the legacy site lives at `https://joseriosdev.github.io/app_legacy/`.

## 5. Boot sequence and routing

1. The browser loads `docs/index.html`. `<body>` contains only module scripts: `main.js`, `cmp_floatingMenu.js`, `cmp_dialogBubble.js`, `cmp_resume.js`, `cmp_prettyResume.js`, `cmp_dailyVerse.js`, `cmp_matchingGame.js`.
2. Each `cmp_*.js` module registers its custom element with `customElements.define`.
3. Module scripts are deferred, so all elements are defined before `DOMContentLoaded`. On that event (and on `popstate`), `main.js` runs `router()`.
4. `router()`:
   - Reads `lang` and `view` from the query string and the theme from `localStorage`, validating each against `KEYS` (invalid values fall back to the defaults).
   - Removes any previously mounted `simple-resume`, `pretty-resume`, `fab-menu`, `daily-verse`, or `matching-game` (prevents duplicates on `popstate`).
   - Sets `<html lang>` to the active language.
   - Creates `<simple-resume>` or `<pretty-resume>` depending on `view`, with attributes `resume-lang` and `theme`.
   - Creates `<fab-menu>` with `menu-lang` and `menu-view`, calls `setMenuView(view)` then `setMenuLanguage(lang)`.
   - Wires the menu's `theme-change` event to set the `theme` attribute on the resume element, its `daily-verse-open` event to `<daily-verse>.open()`, and its `game-open` event to `<matching-game>.open()`.
   - Wires the resume's `bubble-messages-complete` event (bubbled and composed out of `<dialog-bubble>`) to `menuBtnElmt.completeSecretStep(KEYS.SECRET_MESSAGES_SEEN)`.
   - Creates `<daily-verse>` with `verse-lang` and `<matching-game>` with `game-lang`.
   - Saves the language and theme to `localStorage`, then appends the resume, the menu, the verse modal, and the game modal to `<body>`.

### URL parameters

| Param | Values | Default | Effect |
|---|---|---|---|
| `lang` | `en`, `es` | `en` | Resume and menu language, `<html lang>` |
| `view` | `ats`, `pretty` | `ats` | Which resume element is mounted |

Language and version switches rewrite the URL with `window.location.replace` (full reload, no history entry), preserving other parameters.

### localStorage keys

| Key (`KEYS.*`) | Stored value | Written by |
|---|---|---|
| `current_lang` (`CURRENT_LANG`) | `en` / `es` | `router()`, `fab-menu` language toggle |
| `current_theme` (`CURRENT_THEME`) | `classic` / `mono` / `blue` | `router()`, `fab-menu` theme toggle |
| `secret_verse_seen` (`SECRET_VERSE_SEEN`) | `true` | `fab-menu` when the daily verse button is clicked |
| `secret_messages_seen` (`SECRET_MESSAGES_SEEN`) | `true` | `fab-menu`, after the greeting bubble reaches its last message |

The theme and the two secret steps persist across visits; the language always comes from the URL.

## 6. Shared modules

### `constantKeys.js`

`export default Object.freeze({...})`, imported as `KEYS`. Never hardcode these strings.

| Key | Value |
|---|---|
| `CURRENT_LANG`, `CURRENT_THEME` | `'current_lang'`, `'current_theme'` (localStorage) |
| `URL_LANG`, `URL_VIEW` | `'lang'`, `'view'` (query params) |
| `LANG_DEFAULT`, `LANG_SPANISH` | `'en'`, `'es'` |
| `VIEW_ATS`, `VIEW_PRETTY` | `'ats'`, `'pretty'` |
| `THEME_DEFAULT`, `THEMES` | `'classic'`, `['classic', 'mono', 'blue']` (cycle order) |
| `EVENT_THEME_CHANGE` | `'theme-change'` (custom event name) |
| `EVENT_DAILY_VERSE_OPEN` | `'daily-verse-open'` (custom event name) |
| `SECRET_VERSE_SEEN`, `SECRET_MESSAGES_SEEN` | `'secret_verse_seen'`, `'secret_messages_seen'` (localStorage) |
| `EVENT_BUBBLE_COMPLETE` | `'bubble-messages-complete'` (custom event name, `bubbles` + `composed`) |
| `EVENT_GAME_OPEN` | `'game-open'` (custom event name) |

### `apiCalls.js`

`export default class ApiCalls` with `static async` methods. Components never call `fetch` for external APIs directly.

| Method | Request | Returns |
|---|---|---|
| `getResumeData(isSpanish)` | `GET ./data/spanish.json` or `./data/english.json` | Parsed resume JSON; throws on non-2xx |
| `getDailyVerse()` | `GET https://beta.ourmanna.com/api/v1/get?format=json&order=daily` | `verse.details`: `{ text, reference, version, verseurl }` (e.g. `"Ephesians 2:19"`, `"NIV"`); throws on non-2xx |
| `getLocation()` | `GET https://ipapi.co/json/` | `{ city, country, timezone, ... }` |
| `getWeather(city, country)` | `GET https://api.openweathermap.org/data/2.5/weather?q={city},{country}&appid=...` | Weather JSON with `main.feels_like` converted from Kelvin to Celsius |

### `greetingBubble.js`

`export default class GreetingBubble` with `static` methods, shared by both resume versions so the easter-egg messages exist only once.

| Method | Returns |
|---|---|
| `create(isSpanish)` | A configured `<dialog-bubble>` element (`title`, `greeting`, `avatar`, `messages`), not yet in the DOM and with nothing slotted into it |
| `buildMessages(isSpanish)` | The three bubble messages: the computed greeting, the Web Components note, and the question about the man who said "I am the life" |
| `formatGreeting(isSpanish)` | Greeting line built from `ApiCalls.getLocation()` and `ApiCalls.getWeather()`. **Catches its own failures** and falls back to "Hello there! Thanks for stopping by.", so a dead API can never block a header |
| `pickTimeOfDay(isSpanish, timezone)` | Time of day from the visitor's local hour: 5–11 morning, 12–17 afternoon, otherwise evening |
| `pickTempFeel(isSpanish, celsiusTemp)` | Feels-like word: `< 1` freezing, `< 12` cold, `< 23` cool, `< 31` warm, otherwise hot |

Both resumes render the name immediately as a plain `<h1>` and only wrap it in the bubble once `create()` resolves, so the header never waits on the network.

## 7. Data model (`docs/data/*.json`)

`english.json` is the source of truth; `spanish.json` must have the exact same keys, order, and array lengths (enforced by the `translate` skill, see section 12).

```jsonc
{
  "lang": "en",                         // "es" in spanish.json
  "basics": {
    "name": "Jose Rios",                // pretty version splits it: first word dark, rest in accent color
    "title": "Staff Engineer",
    "email": "...",
    "phone": "+57 ???",                 // not rendered
    "summary": "...",                   // pretty version: "About me"
    "location": { "city": "Barranquilla", "country_code": "CO" },
    "profiles": { "github": "https://...", "linkedin": "https://..." },
    "spoken_languages": [
      { "language": "English", "level": "Proficient", "proficiency": 85, "flag": "🇬🇧" }
      // proficiency: 0-100, position of the slider knob in the pretty version
    ]
  },
  "skills":    [ { "category": "Languages", "keywords": ["C#", "..."] } ],
  "work":      [ { "company", "position", "location", "start_date", "end_date", "summary", "highlights": [] } ],
  "projects":  [ { "name", "description", "url", "start_date", "end_date", "summary", "highlights": [], "tech_stack": [] } ],
  "education": [ { "institution", "title", "type", "location", "start_date", "end_date", "summary" } ]
}
```

Dates are display strings, not ISO dates (`"Nov. 3rd 2021"`, `"Present"`). Fields such as `summary` in `work`, `projects`, and `education`, `description`, `phone`, and `flag` exist in the data but are not rendered by either version.

### Field usage per version

| Data | ATS (`simple-resume`) | Pretty (`pretty-resume`) |
|---|---|---|
| `basics.name` | `<h1>` inside a `<dialog-bubble>` | `<h1>` split in two colors |
| `basics.title`, location, email, LinkedIn, GitHub | Header line | Header + dark contact bar with icons |
| `basics.summary` | not rendered | "About me" |
| `basics.spoken_languages` | not rendered | "Languages" with slider bars (`proficiency`) |
| `work[]` position, dates, company, location, highlights | "Experience" | "Work experience" |
| `projects[]` name + url, tech_stack, dates, highlights | "Projects" | "Projects" |
| `skills[]` category + keywords | "Technical skills" | Sidebar "Skills" |
| `education[]` type, title, institution, dates, location | "Education" | Sidebar "Education" (no location) |

## 8. Components

All components follow the same lifecycle: `constructor` attaches an open shadow root, adopts a module-level `CSSStyleSheet`, sets state, and writes a static HTML shell; `connectedCallback` reads attributes, loads data, and binds events. Anything coming from JSON or APIs is inserted with `createElement` + `textContent`, never interpolated into HTML strings.

### 8.1 `<simple-resume>` (ATS version), `cmp_resume.js`

- **Attributes:** `resume-lang` (`en` / `es`). Ignores `theme`.
- **Shell:** `<main>` with `<section id="main-header">` (`#name`, `#title`, `#location`, `#email`, `#linkedin`, `#github`) and empty sections `#experience`, `#projects`, `#skills`, `#education`.
- **Layout:** one column, white sheet of `--paper-w` × `--paper-h` with `--paper-padding`, Crimson Pro body text, Georgia headings. Section titles are uppercase `<h2>` with a bottom border; the first letter of each word is larger (`<h2><span>E</span>XPERIENCE</h2>`). Entry rows use `.flex-btwn` (title left, dates right).
- **Greeting bubble:** `renderHeader` appends the name as a plain `<h1>`, fills the rest of the header, then awaits `GreetingBubble.create()` (section 6) and swaps the `<h1>` into the returned `<dialog-bubble>` with `replaceWith`. The header text is therefore never blocked by the location and weather APIs; only the bubble arrives late.
- **Print:** links lose underline. The floating menu is hidden by `main.css`.

### 8.2 `<pretty-resume>` (pretty version), `cmp_prettyResume.js`

- **Attributes:** `resume-lang` (`en` / `es`), `theme` (`classic` / `mono` / `blue`). Changing `theme` restyles instantly through `:host([theme="..."])` selectors; no re-render.
- **Layout** (US Letter sheet, Montserrat):

```
┌───────────────────────────────────────────────┐
│              JOSE  RIOS  (accent)             │  .pretty-header: 27pt, weight 800, uppercase, letter-spaced
│                 Staff Engineer                │
├───────────────────────────────────────────────┤
│ ✉ email   ⌖ city, CC   in linkedin   gh github│  .contact-bar: dark band, white text, accent icons
├──┬──────────────┬─────────────────────────────┤
│  │ EDUCATION    │ ABOUT ME                    │
│  │ type of title│ basics.summary (justified)  │
│  │ dates        │                             │
│  │ institution  │ WORK EXPERIENCE             │
│  │   ╭──────╮   │ POSITION                    │
│  │   │photo │   │ dates                       │
│  │   ╰──────╯   │ Company, Location           │
│  │ SKILLS       │ • highlights                │
│  │ category     │                             │
│  │ keywords ─── │ PROJECTS                    │
│  │ LANGUAGES    │ NAME (link)                 │
│  │ English ──●─ │ dates · tech stack · bullets│
└──┴──────────────┴─────────────────────────────┘
   ↑ 1.5rem white inset; sidebar = 34% width, accent background with vertical pinstripes
```

- **Greeting bubble:** `renderNameBubble()` wraps the header `<h1>` in the same `<dialog-bubble>` as the ATS version (section 6), so the secret messages and the `bubble-messages-complete` step work in both views. It runs unawaited from `render()` and captures the `<h1>` before awaiting, so the header paints immediately.
- **Sidebar:** `background-color: var(--pretty-sidebar-bg)` plus a `repeating-linear-gradient` of 1px translucent white lines every 4px (pinstripe texture). Photo is `profile_pic.jpg`, `7.5rem × 10.5rem`, fully rounded ends (stadium shape), 5px white border.
- **Photo color toggle:** the photo ships in full color and sits inside a transparent `.photo-btn` button (so it is keyboard reachable). Clicking it toggles `.is-grayscale` (`filter: grayscale(1)`, `.3s` transition) and rewrites the button's `title` / `aria-label` between "Click for black and white" and "Click for color" (`pickLang`). The state is per page load and is not stored.
- **Language sliders:** a 1px track with a round knob positioned at `left: var(--level)`, where `--level` is set per item from `proficiency` (`style.setProperty('--level', '85%')`). If `proficiency` is missing, only the name and level are shown.
- **Themes** (component tokens on `:host`):

| Theme | `--pretty-sidebar-bg` | `--pretty-accent` (last name, icons) | `--pretty-bar-bg` |
|---|---|---|---|
| `classic` (default, matches the reference design) | `#e2b49b` peach | `#d9a688` | `#151515` |
| `mono` (black and white) | `#d6d6d6` | `#7d7d7d` | `#111` |
| `blue` | `#b3cbe9` | `#4f86cc` | `#1c2b45` |

  Text color is `--pretty-ink: #1f1f1f` for all themes.
- **Labels:** section titles come from `pickLang(english, spanish)`: About me / Sobre mí, Work experience / Experiencia laboral, Projects / Proyectos, Education / Educación, Skills / Habilidades, Languages / Idiomas. Education uses "of" / "de" between `type` and `title`.
- **Responsive:** `@media screen and (max-width: 48rem)` drops `.pretty-body` to a single column (`grid-template-columns: 1fr`, no left padding), so the sidebar becomes full width instead of a 34% strip that cut off the photo and crushed the skill and language rows. The same block raises the body text to `10pt`, raises `.skill-keywords` and `.language-level` to `8.5pt`, and lets `.language-row` wrap. It is scoped to `screen` so the paper layout is untouched when printing (Letter is ~51rem wide and would otherwise match).
- **Print / PDF:** `print-color-adjust: exact` on `:host` (inherited) forces backgrounds, the pinstripes, and the dark bar to print even when the browser's "Background graphics" option is off. In print the sheet loses its drop shadow and uses `min-height: calc(var(--paper-h) - 1mm)` to avoid a blank second page; `article { break-inside: avoid }` keeps entries whole if content overflows.
- **Icons:** Font Awesome 4.7 (`fa-envelope`, `fa-map-marker`, `fa-linkedin`, `fa-github`). The stylesheet is linked both in `index.html` (registers the `@font-face`, which does not work inside Shadow DOM) and inside the shadow root (provides the `.fa` classes).

### 8.3 `<fab-menu>` (floating action menu), `cmp_floatingMenu.js`

- **Attributes:** `menu-lang`, `menu-view`.
- **Public methods** (called by `main.js` before mounting): `setMenuView(view)`, `setMenuLanguage(lang)`.
- **Look:** fixed bottom-right (`1.875rem` from edges). A round purple main button with a house icon rotates 45° and turns red when open; sub-buttons slide up with staggered delays. Each sub-button shows a tooltip from its `data-label` (via `::before`). Every click plays `docs/public/audio/btn-click.mp3`.
- **Buttons** (stacked bottom to top):

| Button | id | Action |
|---|---|---|
| 💾 Save as PDF | `save-pdf-btn` | `window.print()` |
| 🇪🇸 / 🇬🇧 language | `lang-change-btn` | Flips `lang` in the URL and reloads |
| ✨ Pretty version / 📄 ATS version | `view-change-btn` | Flips `view` in the URL and reloads |
| 🎨 Change colors | `theme-change-btn` | Pretty view only (`hidden` in ATS). Cycles `KEYS.THEMES`, saves to `localStorage`, dispatches `theme-change` with `detail.theme` |
| 📜 Daily verse | `daily-verse-btn` | Marks `SECRET_VERSE_SEEN`, dispatches `daily-verse-open`; placed to the left of the main button |
| ❓ Mystery / 🎮 Play! | `game-btn` | Grayed-out `?` (`.unable-btn`) until the game is unlocked, where it only shows a hint; once unlocked it becomes 🎮 and dispatches `game-open`. Placed to the left of the daily verse button |

- **Public methods for the easter egg:** `completeSecretStep(stepKey)` saves `'true'` under the key and refreshes the game button; `isGameUnlocked()` is true when both `SECRET_VERSE_SEEN` and `SECRET_MESSAGES_SEEN` are `'true'`; `updateGameButton()` swaps the game button between its mystery and unlocked look (also run in `connectedCallback`, so the button stays unlocked on later visits). On the step that unlocks the game, `done-sound.mp3` plays and the main button gets a `has-news` class (yellow pulsing ring) that is removed the next time the menu is toggled.
- **Mystery hints:** clicking the locked `?` shows `.hint-bubble`, a dark bubble above the button stack (`role="status"`, auto-hidden after `HINT_VISIBLE_MS` = 8 s, and on the next menu toggle or on unlock). The first click says the site has a secret game and to explore it; every later click gives the full route (the name's messages plus the daily verse button). Both texts come from `pickLang()`, and `this.isSpanish` is set from `menu-lang` and kept in sync by `setMenuLanguage`.
- **Bilingual labels:** each button carries `label-lang-es` / `label-lang-en` (and `content-lang-*` for the flag button). `setMenuLanguage` copies the right one into `data-label`. `setMenuView` rewrites the view button's labels and emoji and toggles the theme button.
- **Positioning detail:** the daily verse button is pulled down next to the main button with `bottom: calc((gap + size) * -N - diff * .5)`, where `N` is its slot index: 4 in the ATS view, 5 when the theme button is visible (`.theme-btn:not([hidden]) ~ .daily-verse-btn`). The game button uses the same formula one slot further (5 / 6) with `right: calc((size + gap) * 2)`. Both left-side buttons show their tooltip above instead of to the left.
- **Print:** hidden (`fab-menu { display: none }` in `main.css`).

### 8.4 `<dialog-bubble>`, `cmp_dialogBubble.js`

- **Attributes:** `avatar` (image URL), `greeting` (bubble title), `messages` (JSON array of strings), `title` (native tooltip). Slot: the element it decorates (the `<h1>` name). Both resume versions build it through `GreetingBubble.create()` (section 6); the attributes must be set before it enters the DOM, since `connectedCallback` reads `messages` only once.
- **Behavior:** on host hover, a dark translucent bubble with a top arrow fades in below the slotted content, showing the avatar, the greeting, the current message, ‹ › navigation buttons, and an `n / total` counter. Navigation plays a roulette sound (`docs/app_legacy/assets/roulette-wheel-spin-single.mp3`).
- **Completion event:** the first time the counter reaches the last message, it dispatches `bubble-messages-complete` with `bubbles: true, composed: true` so it crosses the resume's shadow boundary. Both versions mount the bubble, so the secret step can be completed in either one.

### 8.5 `<daily-verse>` (daily Bible verse modal), `cmp_dailyVerse.js`

- **Attributes:** `verse-lang` (`en` / `es`).
- **Public methods:** `open()` (called by `main.js` when the menu dispatches `daily-verse-open`), `close()`.
- **Shell:** a native `<dialog>` opened with `showModal()`, so it gets the top layer, a `::backdrop`, focus handling, and closing with Esc. It also closes with the × button or a click on the backdrop. Contents: eyebrow title ("Verse of the day" / "Versículo del día"), status line, verse text, note, reference, and a pill-shaped link button.
- **Data flow:** the first `open()` shows a loading status and calls `ApiCalls.getDailyVerse()`. The result is cached on the instance (`this.verse`) for the rest of the page session; on failure an error status is shown and the next `open()` retries.
- **English:** shows the API text in quotes (Crimson Pro italic), `reference (version)`, and "Read on Bible Gateway", linking to the passage in the API's version.
- **Spanish:** the Spanish text is **not** shown. Bible Gateway sends no CORS headers, so a static site cannot read its pages, and NTV text is copyrighted. Instead:
  - `toSpanishReference()` splits the API reference into book and `chapter:verses` (regex `^(.+?)\s+(\d+(?::[\d,–-]+)?)$`) and translates the book with `SPANISH_BOOK_NAMES` (66 books, plus "Psalm" / "Song of Songs" variants; unknown books stay in English). "Ephesians 2:19" becomes "Efesios 2:19".
  - Shows a short note, `Efesios 2:19 (NTV)`, and a "Leer en NTV" button.
  - `buildBibleGatewayUrl(reference, version)` builds `https://www.biblegateway.com/passage/?search=Efesios+2%3A19&version=NTV` with `URLSearchParams` (spaces as `+`, like Python's `quote_plus`).
- **Responsive:** centered card `min(34rem, 100vw - 2rem)` wide with a slide-up fade-in. At `max-width: 30rem` it becomes a bottom sheet: full width, rounded top corners, max 85% of the viewport height, full-width button.
- **Print:** hidden (`daily-verse { display: none }` in `main.css`).

### 8.6 `<matching-game>` (hidden matching pairs game), `cmp_matchingGame.js`

- **Unlock flow:** clicking 📜 sets `SECRET_VERSE_SEEN`; reaching the last greeting-bubble message sets `SECRET_MESSAGES_SEEN` (section 8.4). Order does not matter. When both are set, `<fab-menu>` turns the `?` mystery button into 🎮, plays `done-sound.mp3`, and pulses the main button once.
- **Attributes:** `game-lang` (`en` / `es`).
- **Public methods:** `open()` (called on `game-open`; builds a new board on the first open or when the previous game was won, otherwise resumes), `close()`.
- **Shell:** native `<dialog>` with `showModal()` (Esc, × button, or backdrop click close it). Padding lives on an inner `.game-content` so only true backdrop clicks close it. Contents: title ("Tech stack pairs" / "Pares del tech stack"), stats row (moves, pairs `x / 12`, timer, Restart button), the board, and a win panel overlay.
- **Deck:** `TECH_LOGOS` holds 12 `{ name, file }` entries loaded from `./public/images/game/`: Salesforce, JavaScript, C#, Git, Cursor (`unity.png`), REST APIs (`api.jpg`), React, Sass, HTML, Claude, Python, SQL Server. Each is duplicated and the 24 cards are shuffled with Fisher-Yates.
- **Cards:** `<button>` elements with a 3D flip (`perspective`, `preserve-3d`, `backface-visibility`). Back: purple gradient with `</>`; face: white tile with the logo. `aria-label` is "Card n" while hidden and the tech name once revealed.
- **Rules:** the timer starts on the first flip. Two flipped cards count as one move. A match gets a green ring and both buttons are disabled; a miss locks the board for 800 ms, then flips both back. After 12 pairs the timer stops and the win panel shows moves and time, with "Play again" focused.
- **Sounds** (all played through `playSound(audioElmt)`, which rewinds before playing): `card-flip.wav` on every flip, `done-sound.mp3` on each pair found, and `tada.wav` at `volume = .5` when the last pair completes the board. The final pair plays only the win sound, so it is not layered over the pair sound.
- **Flip sound detuning:** the flip is the most repeated sound, so it plays at `volume = .75` and `playFlipSound()` gives it a random `playbackRate` between `FLIP_RATE_MIN` (.85) and `FLIP_RATE_MAX` (1.2) on every card. This needs `preservesPitch = false` (plus the `webkit` alias for older Safari), otherwise the browser holds the pitch and only the speed would change.
- **Responsive:** 6 columns × 4 rows by default; 4 × 6 on portrait screens up to `48rem`. The board width is capped by viewport height (`min(100%, (100dvh - 11rem) * 1.5)`, or `* 2 / 3` in portrait) so all 24 square cards fit without scrolling. Gaps and the `</>` size use `clamp()`. `prefers-reduced-motion` disables the flip and match animations.
- **Print:** hidden (`matching-game { display: none }` in `main.css`).

## 9. Styling

- **Global (`docs/main.css`):** CSS reset, page background (dark vertical gradient), print rules (`@page { size: letter portrait; margin: 0 }`, hide `fab-menu`), and design tokens:

| Token | Value | Used by |
|---|---|---|
| `--paper-w` / `--paper-h` | `215.9mm` / `279.4mm` (US Letter) | Both resumes |
| `--paper-padding` | `1cm` | ATS |
| `--font-main` / `--font-main-size` | Crimson Pro stack / `12pt` | ATS |
| `--font-title` | `Georgia, serif` | ATS headings |
| `--font-pretty` | `'Montserrat', 'Segoe UI', Arial, sans-serif` | Pretty |
| `--standard-margin` | `.8rem` | ATS spacing |
| `--blue` | `#499fff` | Dialog bubble |

- **Print dialog:** `@page { size: letter portrait; margin: 0 }` is the only influence the site has over the browser's print UI. The **Headers and footers** checkbox (page title, URL, date, page numbers) is a per-browser user preference with no CSS or JS hook, so it cannot be unchecked from the page or from `window.print()`. Zero margins leave Chromium no band to draw them in, and every browser remembers the visitor's choice after the first print, so the README tells the reader to uncheck it once.
- **Components** own their styles in a module-level `new CSSStyleSheet()` adopted by the shadow root. Component-only tokens are declared on `:host` with a component prefix (`--pretty-*`, `--menu-*`, `--bubble-bg`).
- **Units:** `mm` for paper, `pt` for font sizes, `rem` for spacing and sizes, `px` only for hairlines, borders, and letter-spacing.

## 10. Internationalization

- Only English (`en`) and Spanish (`es`).
- Resume content comes from the matching JSON file. UI strings (section titles, menu labels, greeting messages) are inline ternaries in the components (`this.isSpanish ? ... : ...` or `pickLang`).
- The active language is stored on the component (`this.isSpanish`), in `localStorage` (`current_lang`), and in `<html lang>`.

## 11. ATS rules (ATS version)

- All resume text is real DOM text in reading order: no text in images, pseudo-elements, or icon-only elements.
- Semantic structure: one `<main>`, a `<section>` per block, `<article>` per entry, headings `h1` (name) → `h2` (sections) → `h3` (entries) → `h4` (details), highlights in `<ul>`.
- Social and preview metadata in `<head>`: description, Open Graph, Twitter card, and `schema.org/Person` JSON-LD kept consistent with `docs/data/english.json`.

## 12. AI agent tooling

- **`.cursor/rules/coding-standards.mdc`:** applied automatically to `docs/**/*.js|css|html`.
- **`translate` skill (`.cursor/skills/resumes-lang-validation/`):** when the user says "translate", the agent runs `scripts/compare-keys.ps1`, fixes `spanish.json` to mirror `english.json`'s structure, re-translates changed text (keeping technical terms in English and verbatim fields untouched), and reports typos found in the English source.

## 13. Rebuild guide

To recreate the site from nothing, in this order:

1. Create the directory structure from section 3 and the two JSON files with the schema from section 7.
2. Write `main.css` with the tokens and print rules from section 9.
3. Write `constantKeys.js`, `apiCalls.js`, and `greetingBubble.js` (section 6).
4. Build `<dialog-bubble>`, then `<simple-resume>` (sections 8.4, 8.1). Verify `/` and `/?lang=es` (served from `docs/`).
5. Build `<pretty-resume>` with the layout, themes, photo toggle, responsive block, and print rules from section 8.2. Verify `?view=pretty` on desktop and at phone width.
6. Build `<daily-verse>` (section 8.5) and `<matching-game>` (section 8.6).
7. Build `<fab-menu>` (section 8.3) and `main.js` (section 5). Verify every menu button, theme persistence after reload, the verse modal on desktop and phone widths, the game unlock (clear `localStorage`, click the `?` twice for both hints, open the verse, read all bubble messages, 🎮 appears) and the board in landscape and portrait, and print preview (Letter, margins none) in both versions and both languages.
8. Fill `<head>` in `index.html` (meta, Open Graph, Twitter, fonts, Font Awesome, JSON-LD) and load all modules in `<body>`.

## 14. Known limitations

- The greeting line in the name bubble depends on two third-party APIs; if either fails the bubble falls back to a generic greeting, and the rest of the header is unaffected.
- The OpenWeatherMap API key is embedded in client code (unavoidable on a static site).
- The print dialog's "Headers and footers" option cannot be turned off from the page (section 9); the visitor has to uncheck it once per browser.
- The pretty version targets one page; long content flows onto a second page without the sidebar background continuing.
- Font Awesome is loaded globally only because the pretty version needs its `@font-face` in the document.
- The Spanish daily verse shows only the reference and a Bible Gateway link, not the NTV text (no CORS on Bible Gateway, copyrighted translation). Showing it would need a server-side proxy or a licensed Bible API.
- The daily verse depends on the free OurManna beta API; if it is down, the modal shows an error message.
