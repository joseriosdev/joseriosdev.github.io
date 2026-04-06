import KEYS from './constantKeys.js';

window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', router);

function router()
{
	const params = new URLSearchParams(window.location.search);
	let langValue = params.get(KEYS.URL_LANG);
  const body = document.querySelector('body');
  const resume = document.createElement('simple-resume');
  const resumePretty = document.createElement('pretty-resume');
  const menuBtn = document.createElement('fab-menu');
  let lang = '';

	if(langValue)
  {
		langValue = langValue.toLowerCase();
    lang = langValue === KEYS.LANG_SPANISH ? KEYS.LANG_SPANISH : KEYS.LANG_DEFAULT;
    resume.setAttribute('resume-lang', lang);
    resumePretty.setAttribute('resume-lang', lang);
	}
  else
  {
    lang = 'en';
    resume.setAttribute('resume-lang', lang);
    resumePretty.setAttribute('resume-lang', lang);
    menuBtn.setAttribute('menu-lang', lang);
  }
  
  menuBtn.setMenuLanguage(lang);
  localStorage.setItem(KEYS.CURRENT_LANG, lang);
  body.append(resumePretty, resume, menuBtn);
}
