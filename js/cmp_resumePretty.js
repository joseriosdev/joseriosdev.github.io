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
  }
  .profile-links {
    padding: 1rem 0;
    margin-top: 1rem;
    background: var(--dark);
    color: var(--blue);
  }
  .profile-links ul {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    list-style-type: none;
  }
  .profile-links ul li {
    cursor: pointer;
  }
  .profile-links ul li i {
    margin-right: 10px;
  }
  .profile-links ul li a {
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
    background: linear-gradient(var(--blue-alpha)), 
    url('./legacy/projects/blaiz_landing/docs/assets/img/bg-pattern.jpg') repeat center;
    flex-grow: 1;
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
            <h1 id="p-name"></h1>
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
              <section>

              </section>

              <div class="section-title-sidebar" style="margin-top: 40px;">Skills</div>
              <div class="skill-item">
                <span class="skill-name">Graphic Design</span>
                <div class="skill-bar-bg"><div class="skill-bar-fill" style="width: 90%;"></div></div>
              </div>
              <div class="skill-item">
                <span class="skill-name">Web Development</span>
                <div class="skill-bar-bg"><div class="skill-bar-fill" style="width: 80%;"></div></div>
              </div>

              <div class="section-title-sidebar" style="margin-top: 40px;">Education</div>
              <div class="exp-item">
                <div class="exp-header" style="font-size: 0.9rem;">Bachelor of Arts</div>
                <div class="exp-company">University of Design | 2012</div>
              </div>
            </aside>

          <main class="main-content">
            <section class="main-section">
              <div class="main-title">Profile</div>
              <p class="exp-desc">
                Innovative and highly motivated Creative Director with over 10 years of experience in high-level branding and digital design. Proven track record of leading creative teams to deliver award-winning campaigns.
              </p>
            </section>

            <section class="main-section">
              <div class="main-title">Experience</div>
              
              <div class="exp-item">
                <div class="exp-header">
                  <span>Senior Creative Manager</span>
                  <span>2018 - Present</span>
                </div>
                <div class="exp-company">Borcelle Studio</div>
                <p class="exp-desc">Lead the creative vision for global brands, managing a team of 15+ designers and copywriters. Oversee all phases of project development from concept to execution.</p>
              </div>

              <div class="exp-item">
                <div class="exp-header">
                  <span>Graphic Designer</span>
                  <span>2015 - 2018</span>
                </div>
                <div class="exp-company">Fauget Agency</div>
                <p class="exp-desc">Developed brand identities and marketing collateral for diverse clients in the tech and fashion industries.</p>
              </div>
            </section>

            <section class="main-section">
              <div class="main-title">References</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="exp-desc">
                  <b>Estelle Darcy</b><br>
                  Manager, Borcelle Studio<br>
                  P: +123-456-7890
                </div>
                <div class="exp-desc">
                  <b>Harper Richard</b><br>
                  Director, Fauget Agency<br>
                  P: +123-456-7890
                </div>
              </div>
            </section>
          </main>
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
    // this.renderExperience(data.work);
    // this.renderProjects(data.projects);
    // this.renderSkills(data.skills);
    // this.renderEducation(data.education);
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
    const nameElmt = this.shadowRoot.getElementById('p-name');
    const titleElmt = this.shadowRoot.getElementById('p-title');
    const locationElmt = this.shadowRoot.getElementById('p-loc');
    const emailElmt = this.shadowRoot.getElementById('p-email');
    const linkedinUser = document.createTextNode('/' + basics.profiles.linkedin.split('/').pop());
    const linkedinElmt = this.shadowRoot.getElementById('p-linkdin');
    const githubUser = document.createTextNode('/' + basics.profiles.github.split('/').pop());
    const githubElmt = this.shadowRoot.getElementById('p-github');
    
    nameElmt.textContent = basics.name;
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
    const sectionElmt = this.shadowRoot.getElementById('experience');
    sectionElmt.innerHTML = this.isSpanish
      ? '<h2 title="+4 años"><span>E</span>XPERIENCIA</h2>'
      : '<h2 title="+4 years"><span>E</span>XPERIENCE</h2>'
    ;

    jobs.forEach(job =>
    {
      const article = document.createElement('article');
      const header = document.createElement('header');
      const item1 = document.createElement('div');
      const item2 = document.createElement('div');
      const jobTitle = document.createElement('h3');
      const jobPeriod = document.createElement('p');
      const company = document.createElement('h4');
      const location = document.createElement('p');
      const ul = document.createElement('ul');

      item1.classList.add('flex-btwn');
      jobTitle.textContent = job.position;
      jobPeriod.textContent = `${job.start_date} - ${job.end_date}`;
      item1.append(jobTitle, jobPeriod);

      item2.classList.add('flex-btwn');
      company.appendChild(Object.assign(document.createElement('em'), { textContent: job.company }));
      location.appendChild(Object.assign(document.createElement('em'), { textContent: job.location }))
      item2.append(company, location);

      header.append(item1, item2);

      job.highlights.forEach(highlight => ul.appendChild(Object.assign(document.createElement('li'), { textContent: highlight })));

      article.append(header, ul);
      sectionElmt.appendChild(article);
    });
  }

  renderProjects(projects)
  {
    const sectionElmt = this.shadowRoot.getElementById('projects');
    sectionElmt.innerHTML = this.isSpanish ? '<h2><span>P</span>ROYECTOS</h2>' : '<h2><span>P</span>ROJECTS</h2>';

    projects.forEach(proj =>
    {
      const article = document.createElement('article');
      const header = document.createElement('header');
      const title = document.createElement('div');
      const projName = document.createElement('h3');
      const techStack = document.createElement('em');
      const dates = document.createElement('div');
      const ul = document.createElement('ul');

      header.classList.add('flex-btwn');
      projName.appendChild(Object.assign(document.createElement('a'), {
        textContent: proj.name,
        href: proj.url,
        target: '_blank',
        title: `Go to ${proj.name}`
      }));
      techStack.textContent = proj.tech_stack.join(', ');
      projName.classList.add('inline');
      title.append(projName, ' | ', techStack);
      dates.appendChild(Object.assign(document.createElement('p'), { textContent: `${proj.start_date} - ${proj.end_date}` }));
      header.append(title, dates);

      proj.highlights.forEach(highlight => ul.appendChild(Object.assign(document.createElement('li'), { textContent: highlight })));

      article.append(header, ul);
      sectionElmt.appendChild(article);
    });
  }

  renderSkills(skills)
  {
    const sectionElmt = this.shadowRoot.getElementById('skills');
    sectionElmt.innerHTML = this.isSpanish
      ? '<h2 title="Desarrollador FullStack"><span>H</span>ABILIDADES <span>T</span>ÉCNICAS</h2>'
      : '<h2 title="FullStack Dev"><span>T</span>ECHNICAL <span>S</span>KILLS</h2>'
    ;
    const article = document.createElement('article');

    skills.forEach(skill =>
    {
      const strong = document.createElement('strong');
      strong.textContent = skill.category + ': ';
      const p = document.createElement('p');
      p.appendChild(strong);
      p.insertAdjacentText('beforeend', skill.keywords.join(', '));

      article.appendChild(p);
    });

    sectionElmt.appendChild(article);
  }

  renderEducation(education)
  {
    const sectionElmt = this.shadowRoot.getElementById('education');
    sectionElmt.innerHTML = this.isSpanish ? '<h2><span>E</span>DUCACIÓN</h2>' : '<h2><span>E</span>DUCATION</h2>';

    education.forEach(study =>
    {
      const article = document.createElement('article');
      const header = document.createElement('header');
      const footer = document.createElement('footer');
      const h3 = document.createElement('h3');
      const h4 = document.createElement('h4');
      const location = document.createElement('p');
      const startEndDates = document.createElement('p');

      header.classList.add('flex-btwn');
      h3.textContent = study.institution;
      location.textContent = study.location;
      header.append(h3, location);

      footer.classList.add('flex-btwn');
      h4.appendChild(Object.assign(document.createElement('em'), { textContent: `${study.type} of ${study.title}` }));
      startEndDates.appendChild(Object.assign(document.createElement('em'), { textContent: `${study.start_date} - ${study.end_date}` }));
      footer.append(h4, startEndDates);

      article.append(header, footer);
      sectionElmt.appendChild(article);
    });
  }
}

customElements.define('pretty-resume', PrettyResume);
