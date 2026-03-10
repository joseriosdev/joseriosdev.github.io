import KEYS from './constantKeys.js';

window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', router);

function router()
{
	const params = new URLSearchParams(window.location.search);
	let langValue = params.get(KEYS.URL_LANG);
  const body = document.querySelector('body');
  const resume = document.createElement('simple-resume');
  const menuBtn = document.createElement('fab-menu');
  let lang = '';

	if(langValue)
  {
		langValue = langValue.toLowerCase();
    lang = langValue === KEYS.LANG_SPANISH ? KEYS.LANG_SPANISH : KEYS.LANG_DEFAULT;
    resume.setAttribute('resume-lang', lang);
	}
  else
  {
    lang = 'en';
    resume.setAttribute('resume-lang', lang);
    menuBtn.setAttribute('menu-lang', lang);
  }
  
  menuBtn.setMenuLanguage(lang);
  localStorage.setItem(KEYS.CURRENT_LANG, lang);
  body.append(resume, menuBtn);
}
/**
 * 
 * 
 * IDEA
 * to have a game with a secret message "The King is Coming"
 */
  /*
  1- create each component, define those by file
  2- get 

  https://ipapi.co/

  curl https://ipapi.co/8.8.8.8/json/
  {
"ip" : "8.8.8.8"
"city" : "Mountain View"
"region" : "California"
"region_code" : "CA"
"country_code" : "US"
"country_code_iso3" : "USA"
"country_name" : "United States"
"country_capital" : "Washington"
"country_tld" : ".us"
"continent_code" : "NA"
"in_eu" : false
"postal" : "94035"
"latitude" : 37.386
"longitude" : -122.0838
"timezone" : "America/Los_Angeles"
"utc_offset" : "-0800"
"country_calling_code" : "+1"
"currency" : "USD"
"currency_name" : "Dollar"
"languages" : "en-US,es-US,haw"
"asn" : "AS15169"
"org" : "Google LLC"
}
  */
