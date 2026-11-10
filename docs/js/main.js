import KEYS from './constantKeys.js';

window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', router);

function router()
{
    const params = new URLSearchParams(window.location.search);
    const langParam = (params.get(KEYS.URL_LANG) || '').toLowerCase();
    const viewParam = (params.get(KEYS.URL_VIEW) || '').toLowerCase();
    const savedTheme = localStorage.getItem(KEYS.CURRENT_THEME);
    const lang = langParam === KEYS.LANG_SPANISH ? KEYS.LANG_SPANISH : KEYS.LANG_DEFAULT;
    const view = viewParam === KEYS.VIEW_PRETTY ? KEYS.VIEW_PRETTY : KEYS.VIEW_ATS;
    const theme = KEYS.THEMES.includes(savedTheme) ? savedTheme : KEYS.THEME_DEFAULT;
    const bodyElmt = document.querySelector('body');
    const resumeElmt = document.createElement(view === KEYS.VIEW_PRETTY ? 'pretty-resume' : 'simple-resume');
    const menuBtnElmt = document.createElement('fab-menu');
    const dailyVerseElmt = document.createElement('daily-verse');
    const gameElmt = document.createElement('matching-game');

    document.querySelectorAll('simple-resume, pretty-resume, fab-menu, daily-verse, matching-game').forEach(elmt => elmt.remove());
    document.documentElement.lang = lang;
    resumeElmt.setAttribute('resume-lang', lang);
    resumeElmt.setAttribute('theme', theme);
    menuBtnElmt.setAttribute('menu-lang', lang);
    menuBtnElmt.setAttribute('menu-view', view);
    menuBtnElmt.setMenuView(view);
    menuBtnElmt.setMenuLanguage(lang);
    menuBtnElmt.addEventListener(KEYS.EVENT_THEME_CHANGE, event => resumeElmt.setAttribute('theme', event.detail.theme));
    menuBtnElmt.addEventListener(KEYS.EVENT_DAILY_VERSE_OPEN, () => dailyVerseElmt.open());
    menuBtnElmt.addEventListener(KEYS.EVENT_GAME_OPEN, () => gameElmt.open());
    resumeElmt.addEventListener(KEYS.EVENT_BUBBLE_COMPLETE, () => menuBtnElmt.completeSecretStep(KEYS.SECRET_MESSAGES_SEEN));
    dailyVerseElmt.setAttribute('verse-lang', lang);
    gameElmt.setAttribute('game-lang', lang);
    localStorage.setItem(KEYS.CURRENT_LANG, lang);
    localStorage.setItem(KEYS.CURRENT_THEME, theme);
    bodyElmt.append(resumeElmt, menuBtnElmt, dailyVerseElmt, gameElmt);
}
