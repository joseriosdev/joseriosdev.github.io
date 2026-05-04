import KEYS from './constantKeys.js';
import ApiCalls from './apiCalls.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  :host {
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  li::marker {
    color: rgba(9,9,9,.3);
  }

  .resume-container {
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: var(--paper-w);
    min-height: var(--paper-h);
    margin: 0 auto;
    padding-top: 2rem;
    background: white;
  }
  /*.resume-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('./legacy/projects/blaiz_landing/docs/assets/img/bg-pattern.jpg') repeat center;
    opacity: .1;
  }*/
  .header {
    text-align: center;
  } .header div h1#p-name {
    letter-spacing: .3rem;
    font-weight: 800;
  } .header div h1#p-name span {
    color: var(--blue);
  }

  .profile-links {
    padding: 1rem 0;
    margin-top: 1rem;
    background: var(--dark);
    color: var(--blue);
  } .profile-links ul {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    list-style-type: none;
  } .profile-links ul li {
    cursor: pointer;
  } .profile-links ul li i {
    margin-right: 10px;
  } .profile-links ul li a {
    color: whitesmoke;
    text-decoration: none;
  }

  .content-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .content {
    display: flex;
    flex-grow: 1;
    padding-left: 2rem;
  }

  .sidebar {
    min-width: 33%;
    background: linear-gradient(var(--blue)), 
    url('./legacy/projects/blaiz_landing/docs/assets/img/bg-pattern.jpg') repeat center;
    flex-grow: 1;
  }
  .section-title-sidebar {
    margin: 0 auto;
    padding: var(--paper-padding);
  }

  .main-content {
    margin: 0 auto;
    padding: var(--paper-padding);
    flex-grow: 1;
    background-color: white;
    font-size: var(--font-main-size);
    font-family: var(--font-main);
    letter-spacing: .5px;
    overflow: auto;
  }
  .main-section {
    margin-bottom: 2rem;
    font-family: Roboto, 'Segoe UI', Helvetica, Arial, sans-serif;
  }
  .main-title {
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    letter-spacing: .2rem;
    margin-bottom: .3rem;
    font-size: 1.3rem;
  }

  .profile-pic {
    margin: 0 auto;
    display: block;
    width: 180px;
    height: 240px;
    border: solid white 5px;
    border-radius: 30%;
    object-fit: cover;
    filter: grayscale(20%);
    cursor: pointer;
  }

  @media print {
    a {
      text-decoration: none;
    }
  }
`);

class PrettyResume extends HTMLElement
{
  constructor()
  {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [sheet];
    this.isSanish = false;
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
      <div class="resume-container">
        <header class="header">
          <!-- <div class="profile-img"></div>  -->
          <div>
            <h1 id="p-name"><span></span></h1>
            <p id="p-title"></p>
          </div>
        </header>
        <div class="content-container">
          <nav class="profile-links">
            <ul>
              <li><i class="fa fa-envelope"></i><a href="#" target="_blank" id="p-email"></a></li>
              <li><i class="fa fa-github"></i><a href="#" target="_blank" id="p-github"></a></li>
              <li><i class="fa fa-linkedin-square"></i><a href="#" target="_blank" id="p-linkdin"></a></li>
              <li><i class="fa fa-map-pin"></i><a href="#" target="_blank" id="p-loc"></a></li>
            </ul>
          </nav>
        
          <div class="content">
            <aside class="sidebar">
              <section class="section-title-sidebar" id="p-skills"></section>
              <section id="p-img">
                <figure><img class="profile-pic" src="../media/profile_pic.jpg"></figure>
              </section>
              <section class="section-title-sidebar" id="p-edu"></section>
            </aside>
          
            <main class="main-content">
              <section class="main-section" id="p-about"></section>
              <section class="main-section" id="p-exp"></section>
            </main>
          </div>
        </div>
      </div>
    `;
  }
  
  connectedCallback()
  {
    this.isSpanish = this.getAttribute('resume-lang') === KEYS.LANG_SPANISH;
    const jsonFileName = this.isSpanish ? 'spanish': 'english';
    fetch(`../resume_data/${jsonFileName}.json`)
      .then(response => response.json())
      .then(data => this.render(data))
      .catch(e => alert('Failed loading resume data. Error: ' + e));
  }

  render(data)
  {
    this.renderHeader(data.basics);
    this.renderAbout(data.basics.summary);
    this.renderExperience(data.work);
    this.renderSkills(data);
    this.renderEducation(data.education);
  }

  async formatGreeting()
  {
    const { city, timezone, country } = await ApiCalls.getLocation();
    
    const hour = new Intl.DateTimeFormat(this.isSpanish ? KEYS.LANG_SPANISH : KEYS.LANG_DEFAULT,
    {
      hour: 'numeric',
      hour12: false,
      timeZone: timezone
    }).format(new Date());

    let timeOfDay;
    if (hour >= 5 && hour < 12) {
      timeOfDay = this.isSpanish ? 'Buenos días' : 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      timeOfDay = this.isSpanish ? 'Buenas tardes' : 'Good afternoon';
    } else {
      timeOfDay = this.isSpanish ? 'Buenas noches' : 'Good evening';
    }

    const weatherData = await ApiCalls.getWeather(city, country);
    const celsiusTemp = weatherData.main.feels_like;
    const freezingLim = 1;
    const coldLim = 12;
    const coolLim = 23;
    const warnLim = 31;
    let tempFeel = null;
    console.log('city: ' + city, ', country: ' + country, ', temperature: ' + celsiusTemp);

    if(celsiusTemp < freezingLim) {
      tempFeel = this.isSpanish ? 'helado' : 'freezing';
    } else if (celsiusTemp < coldLim) {
      tempFeel = this.isSpanish ? 'frío' : 'cold';
    } else if (celsiusTemp < coolLim) {
      tempFeel = this.isSpanish ? 'fresco' : 'cool';
    } else if (celsiusTemp < warnLim) {
      tempFeel = this.isSpanish ? 'cálido' : 'warm';
    } else {
      tempFeel = this.isSpanish ? 'caliente' : 'hot';
    }

    if (this.isSpanish) {
      return `${timeOfDay}. Espero que todo vaya bien en ${city}, se ve que está ${tempFeel} por allá.`;
    }
    return `${timeOfDay}. Hope everything goes well in ${city}, looks ${tempFeel} there.`;
  }

  async renderHeader(basics)
  {
    basics.name = basics.first_name + ' ' + basics.last_name;
    const initMsg = await this.formatGreeting();
    const bubbleMessages = this.isSpanish
      ? [initMsg,'Este sitio fue hecho con Web Components y eventualmente tendrá un juego secreto.','Sabías que un hombre dijo: "Yo Soy la Vida"? mucha gente le creyó, fue un mentiroso? loco? o decía la Verdad?']
      : [initMsg,'This site was coded with Web Components and will have a hiddin game at some point.','Did you know that a man said: "I am the life"? and many people beleived Him, was he a liar? mad man? or was he saying the Truth?'];
    const greeting = this.isSpanish ? '¡Hola!' : 'Hey There,';
    const title = this.isSpanish ? 'Haz click aquí' : 'Click Me';
    
    const nameElmt = this.shadowRoot.getElementById('p-name');
    const titleElmt = this.shadowRoot.getElementById('p-title');
    const locationElmt = this.shadowRoot.getElementById('p-loc');
    const emailElmt = this.shadowRoot.getElementById('p-email');
    const linkedinUser = document.createTextNode('/' + basics.profiles.linkedin.split('/').pop());
    const linkedinElmt = this.shadowRoot.getElementById('p-linkdin');
    const githubUser = document.createTextNode('/' + basics.profiles.github.split('/').pop());
    const githubElmt = this.shadowRoot.getElementById('p-github');
    
    nameElmt.prepend(basics.first_name.toUpperCase() + '  ');
    nameElmt.querySelector('span').textContent = basics.last_name.toUpperCase();
    

    // if (nameElmt)
    // {
    //   nameElmt.innerHTML = `
    //     <dialog-bubble
    //       title="${title}"
    //       greeting="${greeting}"
    //       avatar="../media/profile_pic.jpg"
    //       messages='${JSON.stringify(bubbleMessages)}'>
    //       <h1></h1>
    //     </dialog-bubble>
    //   `;
    //   const h1Elmt = nameElmt.querySelector('h1');
    //   h1Elmt.prepend(basics.first_name.toUpperCase() + '  ');
    //   h1Elmt.querySelector('span').textContent = basics.last_name.toUpperCase();
    // }

    titleElmt.textContent = basics.title;
    locationElmt.textContent = `${basics.location.city}, ${basics.location.country_code}`;
    locationElmt.title = this.isSpanish ? `¿Dónde queda ${basics.location.city}?` : `Where's ${basics.location.city} located?`;
    locationElmt.href = `https://www.google.com/maps/place/${basics.location.city},+${basics.location.country_code}`;

    emailElmt.textContent = basics.email;
    emailElmt.href = 'mailto:' + basics.email;
    emailElmt.title = this.isSpanish ? `Enviar email a ${basics.name}` : `Send email to ${basics.name}`;

    linkedinElmt.href = basics.profiles.linkedin;
    linkedinElmt.appendChild(linkedinUser);
    linkedinElmt.title = this.isSpanish ? `Abrir LinkedIn de ${basics.name}` : `Open ${basics.name}'s LinkedIn`;

    githubElmt.href = basics.profiles.github;
    githubElmt.appendChild(githubUser);
    githubElmt.title = this.isSpanish ? `Abrir GitHub de ${basics.name}` : `Open ${basics.name}'s GitHub`;
  }

  renderExperience(jobs)
  {
    const highlightsLim = 3;
    const sectionElmt = this.shadowRoot.getElementById('p-exp');
    sectionElmt.style.marginBottom = '2rem';
    sectionElmt.innerHTML = this.isSpanish
      ? '<h3 class="main-title" title="+4 años">EXPERIENCIA LABORAL</h3>'
      : '<h3 class="main-title" title="+4 years">WORK EXPERIENCE</h3>'
    ;

    jobs.forEach(job =>
    {
      const article = document.createElement('article');
      const header = document.createElement('header');
      const item1 = document.createElement('div');
      const item2 = document.createElement('div');
      const jobTitle = document.createElement('h3');
      const jobPeriod = document.createElement('p');
      const companyLoc = document.createElement('p');
      const location = document.createElement('p');
      const ul = document.createElement('ul');

      jobTitle.textContent = job.position;
      jobTitle.style.fontWeight = 500;
      jobPeriod.textContent = `${job.start_date} - ${job.end_date}`;
      item1.append(jobTitle, jobPeriod);

      companyLoc.appendChild(Object.assign(document.createElement('em'), { textContent: job.company + ', ' + job.location }));
      item2.append(companyLoc);

      header.style.marginBottom = '.8rem';
      header.append(item1, item2);

      job.highlights.forEach(highlight => ul.appendChild(Object.assign(document.createElement('li'), { textContent: highlight })));
      ul.style.marginLeft = '1rem';

      article.append(header, ul);
      sectionElmt.appendChild(article);
    });
  }

  renderAbout(summary)
  {
    const sectionElmt = this.shadowRoot.getElementById('p-about');
    sectionElmt.innerHTML = this.isSpanish ? '<h3 class="main-title">ACERCA DE MI</h2>' : '<h3 class="main-title">ABOUT ME</h2>';
    const article = document.createElement('article');
    article.textContent = summary;
    sectionElmt.appendChild(article);
  }

  renderSkills(data)
  {
    const skills = data.skills;
    const sectionElmt = this.shadowRoot.getElementById('p-skills');
    sectionElmt.innerHTML = this.isSpanish
      ? '<h2 title="Desarrollador FullStack">HABILIDADES</h2>'
      : '<h2 title="FullStack Dev">SKILLS</h2>'
    ;
    const article = document.createElement('article');

    // I want to show less skills in this version and the soft skills
    const skillsArr = [];
    const skillsLim = 2;
    for (let i = 0; i < skills.length; i++)
    {
      const skill = skills[i];

      if (i >= skillsLim && !skills.is_soft_skill) continue;
      
      const strong = document.createElement('strong');
      const p = document.createElement('p');
      const br = document.createElement('br');
      
      strong.textContent = skill.category;
      p.append(strong, br);
      p.style.marginBottom = '.3rem';
      p.insertAdjacentText('beforeend', skill.keywords.join(', '));

      article.appendChild(p);
    }

    const strong = document.createElement('strong');
    const p = document.createElement('p');
    const br = document.createElement('br');
    
    strong.textContent = this.isSpanish ? 'Idiomas' : 'Spoken Languages';
    p.style.whiteSpace = 'pre-wrap';
    p.append(strong, br);
    p.style.marginBottom = '.3rem';
    let langs = '';
    for (let i = 0; i < data.basics.spoken_languages.length; i++)
    {
      const lang = data.basics.spoken_languages[i];
      langs += `${lang.language}, ${lang.level.toLowerCase()}${i === data.basics.spoken_languages.length - 1 ? '' : '\n'}`;
    }
    p.insertAdjacentText('beforeend', langs);

    article.appendChild(p);
    
    sectionElmt.appendChild(article);
  }

  renderEducation(education)
  {
    const sectionElmt = this.shadowRoot.getElementById('p-edu');
    sectionElmt.innerHTML = this.isSpanish ? '<h2>EDUCACIÓN</h2>' : '<h2>EDUCATION</h2>';

    const study = education[0];
    const institution = document.createElement('p');
    const title = document.createElement('p');
    const startEndDates = document.createElement('p');

    title.textContent = `${study.type} ${this.isSpanish ? 'en' : 'of'} ${study.title}`.toUpperCase();
    institution.textContent = study.institution + ', ' + study.location;
    startEndDates.appendChild(Object.assign(document.createElement('em'), { textContent: `${study.start_date} - ${study.end_date}` }));

    sectionElmt.append(title, startEndDates, institution);
  }

  renderProfilePic()
  {

  }
}

customElements.define('pretty-resume', PrettyResume);
