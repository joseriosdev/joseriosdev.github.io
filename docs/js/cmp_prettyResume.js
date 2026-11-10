import KEYS from './constantKeys.js';
import ApiCalls from './apiCalls.js';
import GreetingBubble from './greetingBubble.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  :host {
    --pretty-accent: #d9a688;
    --pretty-sidebar-bg: #e2b49b;
    --pretty-bar-bg: #151515;
    --pretty-ink: #1f1f1f;
    display: block;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  :host([theme="mono"]) {
    --pretty-accent: #7d7d7d;
    --pretty-sidebar-bg: #d6d6d6;
    --pretty-bar-bg: #111;
  }

  :host([theme="blue"]) {
    --pretty-accent: #4f86cc;
    --pretty-sidebar-bg: #b3cbe9;
    --pretty-bar-bg: #1c2b45;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  main {
    display: flex;
    flex-direction: column;
    max-width: var(--paper-w);
    min-height: var(--paper-h);
    margin: 0 auto;
    background-color: white;
    box-shadow: 0 0 24px rgba(0, 0, 0, .35);
    font-family: var(--font-pretty);
    font-size: 8.5pt;
    line-height: 1.5;
    color: var(--pretty-ink);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .pretty-header {
    padding: 2.5rem 2rem 1.5rem;
    text-align: center;
  }

  h1 {
    font-size: 27pt;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: 4px;
    text-transform: uppercase;
  }

  .last-name { color: var(--pretty-accent); }

  .job-title {
    margin-top: .4rem;
    font-size: 12pt;
    letter-spacing: 1px;
  }

  .contact-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: .3rem 1.25rem;
    padding: .55rem 1.5rem;
    background-color: var(--pretty-bar-bg);
    font-size: 7.5pt;
    color: white;
    list-style: none;
  }

  .contact-bar .fa {
    margin-right: .45rem;
    color: var(--pretty-accent);
  }

  .pretty-body {
    display: grid;
    flex-grow: 1;
    grid-template-columns: 34% 1fr;
    padding-left: 1.5rem;
  }

  .sidebar {
    padding: 1.75rem 1.25rem;
    background-color: var(--pretty-sidebar-bg);
    background-image: repeating-linear-gradient(90deg, rgba(255, 255, 255, .14) 0 1px, transparent 1px 4px);
  }

  .content { padding: 1.75rem 1.75rem 1.75rem 1.6rem; }

  section + section { margin-top: 1.5rem; }

  h2 {
    margin-bottom: .6rem;
    font-size: 11pt;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  h3 {
    font-size: 9.5pt;
    font-weight: 600;
    letter-spacing: .5px;
    text-transform: uppercase;
  }

  article { break-inside: avoid; }
  article + article { margin-top: 1.1rem; }

  .dates { font-size: 7.5pt; }

  .company {
    margin-bottom: .35rem;
    font-size: 9.5pt;
  }

  .tech-stack {
    margin-bottom: .35rem;
    font-style: italic;
  }

  .about { text-align: justify; }

  ul { padding-left: 1.1rem; }
  li + li { margin-top: .15rem; }

  .sidebar ul {
    padding-left: 0;
    list-style: none;
  }

  .sidebar h3 {
    font-size: 8.5pt;
    font-weight: 500;
    line-height: 1.35;
  }

  .photo-frame {
    display: flex;
    justify-content: center;
    margin: 1.75rem 0;
  }

  .photo-btn {
    padding: 0;
    background: none;
    border: none;
    line-height: 0;
    cursor: pointer;
  }

  .photo-btn:focus-visible {
    border-radius: 3.75rem;
    outline: 2px solid var(--pretty-bar-bg);
    outline-offset: 3px;
  }

  .photo {
    width: 7.5rem;
    height: 10.5rem;
    border: 5px solid white;
    border-radius: 3.75rem;
    object-fit: cover;
    transition: filter .3s ease;
  }

  .photo.is-grayscale { filter: grayscale(1); }

  .skill {
    padding-bottom: .4rem;
    border-bottom: 1px solid currentColor;
  }

  .skill + .skill,
  .language + .language { margin-top: .7rem; }

  .skill h3 {
    font-weight: 600;
    letter-spacing: 0;
    text-transform: none;
  }

  .skill-keywords {
    font-size: 7.5pt;
    line-height: 1.4;
  }

  .language-row {
    display: flex;
    justify-content: space-between;
  }

  .language-level { font-size: 7.5pt; }

  .level-track {
    position: relative;
    height: 1px;
    margin-top: .5rem;
    background-color: currentColor;
  }

  .level-knob {
    position: absolute;
    top: 50%;
    left: var(--level);
    width: .5rem;
    height: .5rem;
    background-color: currentColor;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  /* Phones cannot hold the 34% sidebar: it squeezes the photo, the skills, and the language rows. */
  @media screen and (max-width: 48rem) {
    main { font-size: 10pt; }

    .pretty-body {
      grid-template-columns: 1fr;
      padding-left: 0;
    }

    .sidebar,
    .content { padding: 1.5rem 1.25rem; }

    .language-row {
      flex-wrap: wrap;
      gap: 0 .75rem;
    }

    .language-level { font-size: 8.5pt; }

    .skill-keywords { font-size: 8.5pt; }
  }

  @media print {
    main {
      min-height: calc(var(--paper-h) - 1mm);
      box-shadow: none;
    }
  }
`);

const createTextElmt = (tagName, text, className = '') =>
{
    const elmt = document.createElement(tagName);
    elmt.textContent = text;
    if (className) elmt.className = className;
    return elmt;
};

class PrettyResume extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
        this.isSpanish = false;
        this.shadowRoot.innerHTML = `
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
          <main>
            <header class="pretty-header">
              <h1><span id="first-name"></span> <span class="last-name" id="last-name"></span></h1>
              <p class="job-title" id="job-title"></p>
            </header>

            <ul class="contact-bar">
              <li><i class="fa fa-envelope" aria-hidden="true"></i><a href="#" id="email"></a></li>
              <li><i class="fa fa-map-marker" aria-hidden="true"></i><span id="location"></span></li>
              <li><i class="fa fa-linkedin" aria-hidden="true"></i><a href="#" target="_blank" rel="noopener noreferrer" id="linkedin"></a></li>
              <li><i class="fa fa-github" aria-hidden="true"></i><a href="#" target="_blank" rel="noopener noreferrer" id="github"></a></li>
            </ul>

            <div class="pretty-body">
              <aside class="sidebar">
                <section id="education"></section>
                <div class="photo-frame">
                  <button class="photo-btn" id="photo-btn">
                    <img class="photo" id="photo" alt="">
                  </button>
                </div>
                <section id="skills"></section>
                <section id="languages"></section>
              </aside>

              <div class="content">
                <section id="about"></section>
                <section id="experience"></section>
                <section id="projects"></section>
              </div>
            </div>
          </main>
        `;
    }

    async connectedCallback()
    {
        this.isSpanish = this.getAttribute('resume-lang') === KEYS.LANG_SPANISH;

        try
        {
            const data = await ApiCalls.getResumeData(this.isSpanish);
            this.render(data);
        }
        catch (error)
        {
            alert(`Failed loading resume data. Error: ${error}`);
        }
    }

    pickLang(englishText, spanishText)
    {
        return this.isSpanish ? spanishText : englishText;
    }

    render(data)
    {
        this.renderHeader(data.basics);
        this.renderNameBubble();
        this.renderAbout(data.basics.summary);
        this.renderExperience(data.work);
        this.renderProjects(data.projects);
        this.renderEducation(data.education);
        this.renderSkills(data.skills);
        this.renderLanguages(data.basics.spoken_languages);
    }

    renderHeader(basics)
    {
        const [firstName, ...lastNames] = basics.name.split(' ');
        const emailElmt = this.shadowRoot.getElementById('email');
        const linkedinElmt = this.shadowRoot.getElementById('linkedin');
        const githubElmt = this.shadowRoot.getElementById('github');
        const photoElmt = this.shadowRoot.getElementById('photo');
        const photoBtnElmt = this.shadowRoot.getElementById('photo-btn');

        this.shadowRoot.getElementById('first-name').textContent = firstName;
        this.shadowRoot.getElementById('last-name').textContent = lastNames.join(' ');
        this.shadowRoot.getElementById('job-title').textContent = basics.title;
        this.shadowRoot.getElementById('location').textContent = `${basics.location.city}, ${basics.location.country_code}`;

        emailElmt.textContent = basics.email;
        emailElmt.href = `mailto:${basics.email}`;
        linkedinElmt.textContent = basics.profiles.linkedin.replace('https://www.', '');
        linkedinElmt.href = basics.profiles.linkedin;
        githubElmt.textContent = basics.profiles.github.replace('https://', '');
        githubElmt.href = basics.profiles.github;

        photoElmt.src = './public/images/profile_pic.jpg';
        photoElmt.alt = basics.name;

        photoBtnElmt.title = this.pickLang('Click for black and white', 'Haz clic para blanco y negro');
        photoBtnElmt.setAttribute('aria-label', photoBtnElmt.title);
        photoBtnElmt.onclick = () => this.togglePhotoColor();
    }

    togglePhotoColor()
    {
        const photoElmt = this.shadowRoot.getElementById('photo');
        const photoBtnElmt = this.shadowRoot.getElementById('photo-btn');
        const isGrayscale = photoElmt.classList.toggle('is-grayscale');

        photoBtnElmt.title = isGrayscale
            ? this.pickLang('Click for color', 'Haz clic para color')
            : this.pickLang('Click for black and white', 'Haz clic para blanco y negro');
        photoBtnElmt.setAttribute('aria-label', photoBtnElmt.title);
    }

    async renderNameBubble()
    {
        const headingElmt = this.shadowRoot.querySelector('.pretty-header h1');
        const bubbleElmt = await GreetingBubble.create(this.isSpanish);

        headingElmt.replaceWith(bubbleElmt);
        bubbleElmt.append(headingElmt);
    }

    renderAbout(summary)
    {
        this.shadowRoot.getElementById('about').append(
            createTextElmt('h2', this.pickLang('About me', 'Sobre mí')),
            createTextElmt('p', summary, 'about')
        );
    }

    renderExperience(jobs)
    {
        const sectionElmt = this.shadowRoot.getElementById('experience');
        sectionElmt.append(createTextElmt('h2', this.pickLang('Work experience', 'Experiencia laboral')));

        jobs.forEach(job =>
        {
            const articleElmt = document.createElement('article');
            articleElmt.append(
                createTextElmt('h3', job.position),
                createTextElmt('p', `${job.start_date} - ${job.end_date}`, 'dates'),
                createTextElmt('p', `${job.company}, ${job.location}`, 'company'),
                this.createHighlightsElmt(job.highlights)
            );
            sectionElmt.append(articleElmt);
        });
    }

    renderProjects(projects)
    {
        const sectionElmt = this.shadowRoot.getElementById('projects');
        sectionElmt.append(createTextElmt('h2', this.pickLang('Projects', 'Proyectos')));

        projects.forEach(proj =>
        {
            const articleElmt = document.createElement('article');
            const projNameElmt = document.createElement('h3');

            projNameElmt.append(Object.assign(document.createElement('a'), {
                textContent: proj.name,
                href: proj.url,
                target: '_blank',
                rel: 'noopener noreferrer'
            }));
            articleElmt.append(
                projNameElmt,
                createTextElmt('p', `${proj.start_date} - ${proj.end_date}`, 'dates'),
                createTextElmt('p', proj.tech_stack.join(' · '), 'tech-stack'),
                this.createHighlightsElmt(proj.highlights)
            );
            sectionElmt.append(articleElmt);
        });
    }

    renderEducation(education)
    {
        const sectionElmt = this.shadowRoot.getElementById('education');
        const ofWord = this.pickLang('of', 'de');
        sectionElmt.append(createTextElmt('h2', this.pickLang('Education', 'Educación')));

        education.forEach(study =>
        {
            const articleElmt = document.createElement('article');
            articleElmt.append(
                createTextElmt('h3', `${study.type} ${ofWord} ${study.title}`),
                createTextElmt('p', `${study.start_date} - ${study.end_date}`, 'dates'),
                createTextElmt('p', study.institution)
            );
            sectionElmt.append(articleElmt);
        });
    }

    renderSkills(skills)
    {
        const sectionElmt = this.shadowRoot.getElementById('skills');
        const listElmt = document.createElement('ul');

        skills.forEach(skill =>
        {
            const itemElmt = createTextElmt('li', '', 'skill');
            itemElmt.append(createTextElmt('h3', skill.category), createTextElmt('p', skill.keywords.join(', '), 'skill-keywords'));
            listElmt.append(itemElmt);
        });

        sectionElmt.append(createTextElmt('h2', this.pickLang('Skills', 'Habilidades')), listElmt);
    }

    renderLanguages(languages)
    {
        const sectionElmt = this.shadowRoot.getElementById('languages');
        const listElmt = document.createElement('ul');

        languages.forEach(spoken =>
        {
            const itemElmt = createTextElmt('li', '', 'language');
            const rowElmt = createTextElmt('p', '', 'language-row');
            rowElmt.append(createTextElmt('strong', spoken.language), createTextElmt('span', spoken.level, 'language-level'));
            itemElmt.append(rowElmt);

            if (Number.isFinite(spoken.proficiency))
            {
                const trackElmt = createTextElmt('div', '', 'level-track');
                const knobElmt = createTextElmt('span', '', 'level-knob');
                knobElmt.style.setProperty('--level', `${spoken.proficiency}%`);
                trackElmt.append(knobElmt);
                itemElmt.append(trackElmt);
            }

            listElmt.append(itemElmt);
        });

        sectionElmt.append(createTextElmt('h2', this.pickLang('Languages', 'Idiomas')), listElmt);
    }

    createHighlightsElmt(highlights)
    {
        const listElmt = document.createElement('ul');
        listElmt.append(...highlights.map(highlight => createTextElmt('li', highlight)));
        return listElmt;
    }
}

customElements.define('pretty-resume', PrettyResume);
