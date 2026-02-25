document.addEventListener('DOMContentLoaded', router);

async function router()
{
  const loadSpanish = window.location.pathname.endsWith('/es');
  const jsonRoute = loadSpanish ? '../cv_data/spanish.json' : '../cv_data/english.json';
  const response = await fetch(jsonRoute);
  const resumeData = await response.json();
  fillResume(resumeData);
}

function fillResume(resumeData)
{
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
}


// shared-styles.js
const sharedStyles = new CSSStyleSheet();
sharedStyles.replaceSync(`.global-class { color: blue; padding: 10px; }`);

export default sharedStyles;

// my-component.js
import sharedStyles from './shared-styles.js';

class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [sharedStyles, componentSpecificStyles];
    // ...
  }
}

//NO interferience
//DINAMY THEMING
const themeSheet = new CSSStyleSheet();
themeSheet.replaceSync('body { --primary-color: blue; }');
document.adoptedStyleSheets = [themeSheet];

// Encapsulated Web Components: 
const sheet = new CSSStyleSheet();
sheet.replaceSync('span { color: red; }');
class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }
}
customElements.define('my-element', MyElement);

//Runtime Style Injection: A
const sheet1 = new CSSStyleSheet();
sheet1.insertRule('button { background: green; }', 0);
document.adoptedStyleSheets.push(sheet);



//1. Creating and Applying a StyleSheet
// Create the stylesheet
const sheet2 = new CSSStyleSheet();
sheet2.replaceSync('body { background: #f0f0f0; } .card { padding: 10px; }');

// Apply to the main document
document.adoptedStyleSheets = [sheet2];

// Apply to a specific Shadow Root
this.shadowRoot.adoptedStyleSheets = [sheet2];


//-----------Dynamic maniuplation
const sheet3 = new CSSStyleSheet();
document.adoptedStyleSheets = [sheet3];

// Insert rules dynamically
sheet3.insertRule('h1 { color: blue; }', 0);
sheet3.insertRule('p { font-size: 16px; }', 1);

// Update a rule
sheet3.cssRules[0].style.color = 'red';
