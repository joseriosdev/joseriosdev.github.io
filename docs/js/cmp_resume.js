import KEYS from './constantKeys.js';
import ApiCalls from './apiCalls.js';
import GreetingBubble from './greetingBubble.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  main {
    max-width: var(--paper-w);
    height: var(--paper-h);
    margin: 0 auto;
    padding: var(--paper-padding);
    background-color: white;
    font-size: var(--font-main-size);
    font-family: var(--font-main);
    letter-spacing: .5px;
    overflow: auto;
  }

  #main-header {
    margin-bottom: var(--standard-margin);
    text-align: center;
  }

  section { margin-bottom: var(--standard-margin); }
  article { margin: 0 0 var(--standard-margin) var(--standard-margin); }

  h1 {
    font-family: var(--font-title);
    font-size: calc(var(--font-main-size) * 2);
  }

  h2 {
    margin-bottom: calc(var(--standard-margin) * .3);
    border-bottom: 1px solid gray;
    font-family: var(--font-title);
    font-size: calc(var(--font-main-size) - 2pt);
    font-weight: 500;
    letter-spacing: 1pt;
  }

  h2 span { font-size: calc(var(--font-main-size) + 2pt); }
  h3 { font-size: calc(var(--font-main-size) + 1pt); }
  h4 { font-weight: 400; }
  ul { margin-left: calc(var(--standard-margin) * 2); }
  li { text-indent: calc(var(--standard-margin) * -.5); }
  a { color: black; }

  .flex-btwn {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .inline { display: inline; }

  @media print {
    a {
      text-decoration: none;
    }
  }
`);

const createTextElmt = (tagName, text) => Object.assign(document.createElement(tagName), { textContent: text });

class SimpleResume extends HTMLElement
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
            <section id="main-header">
              <div id="name"></div>

              <p id="title"></p>
              <p>
                <span id="location"></span> |
                <a href="#" target="_blank" rel="noopener noreferrer" id="email"></a> |
                <a href="#" target="_blank" rel="noopener noreferrer" id="linkedin"></a> |
                <a href="#" target="_blank" rel="noopener noreferrer" id="github"></a>
              </p>
            </section>

            <section id="experience"></section>
            <section id="projects"></section>
            <section id="skills"></section>
            <section id="education"></section>
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

    render(data)
    {
        this.renderHeader(data.basics);
        this.renderExperience(data.work);
        this.renderProjects(data.projects);
        this.renderSkills(data.skills);
        this.renderEducation(data.education);
    }

    async renderHeader(basics)
    {
        const nameElmt = this.shadowRoot.getElementById('name');
        const nameHeadingElmt = createTextElmt('h1', basics.name);
        const titleElmt = this.shadowRoot.getElementById('title');
        const locationElmt = this.shadowRoot.getElementById('location');
        const emailElmt = this.shadowRoot.getElementById('email');
        const linkedinElmt = this.shadowRoot.getElementById('linkedin');
        const githubElmt = this.shadowRoot.getElementById('github');

        nameElmt.append(nameHeadingElmt);
        titleElmt.textContent = basics.title;
        locationElmt.textContent = `${basics.location.city}, ${basics.location.country_code}`;

        emailElmt.textContent = basics.email;
        emailElmt.href = `mailto:${basics.email}`;
        emailElmt.title = this.isSpanish ? `Enviar email a ${basics.name}` : `Send email to ${basics.name}`;

        linkedinElmt.textContent = basics.profiles.linkedin.replace('https://www.', '');
        linkedinElmt.href = basics.profiles.linkedin;
        linkedinElmt.title = this.isSpanish ? `Abrir LinkedIn de ${basics.name}` : `Open ${basics.name}'s LinkedIn`;

        githubElmt.textContent = basics.profiles.github.replace('https://', '');
        githubElmt.href = basics.profiles.github;
        githubElmt.title = this.isSpanish ? `Abrir GitHub de ${basics.name}` : `Open ${basics.name}'s GitHub`;

        const bubbleElmt = await GreetingBubble.create(this.isSpanish);
        nameHeadingElmt.replaceWith(bubbleElmt);
        bubbleElmt.append(nameHeadingElmt);
    }

    renderExperience(jobs)
    {
        const sectionElmt = this.shadowRoot.getElementById('experience');
        sectionElmt.innerHTML = this.isSpanish
            ? '<h2 title="5+ años"><span>E</span>XPERIENCIA</h2>'
            : '<h2 title="5+ years"><span>E</span>XPERIENCE</h2>';

        jobs.forEach(job =>
        {
            const articleElmt = document.createElement('article');
            const headerElmt = document.createElement('header');
            const positionRowElmt = document.createElement('div');
            const companyRowElmt = document.createElement('div');
            const companyElmt = document.createElement('h4');
            const locationElmt = document.createElement('p');
            const highlightsElmt = document.createElement('ul');

            positionRowElmt.classList.add('flex-btwn');
            positionRowElmt.append(
                createTextElmt('h3', job.position),
                createTextElmt('p', `${job.start_date} - ${job.end_date}`)
            );

            companyRowElmt.classList.add('flex-btwn');
            companyElmt.append(createTextElmt('em', job.company));
            locationElmt.append(createTextElmt('em', job.location));
            companyRowElmt.append(companyElmt, locationElmt);

            headerElmt.append(positionRowElmt, companyRowElmt);
            highlightsElmt.append(...job.highlights.map(highlight => createTextElmt('li', highlight)));
            articleElmt.append(headerElmt, highlightsElmt);
            sectionElmt.append(articleElmt);
        });
    }

    renderProjects(projects)
    {
        const sectionElmt = this.shadowRoot.getElementById('projects');
        sectionElmt.innerHTML = this.isSpanish ? '<h2><span>P</span>ROYECTOS</h2>' : '<h2><span>P</span>ROJECTS</h2>';

        projects.forEach(proj =>
        {
            const articleElmt = document.createElement('article');
            const headerElmt = document.createElement('header');
            const titleElmt = document.createElement('div');
            const projNameElmt = document.createElement('h3');
            const datesElmt = document.createElement('div');
            const highlightsElmt = document.createElement('ul');

            headerElmt.classList.add('flex-btwn');
            projNameElmt.classList.add('inline');
            projNameElmt.append(Object.assign(document.createElement('a'), {
                textContent: proj.name,
                href: proj.url,
                target: '_blank',
                rel: 'noopener noreferrer',
                title: this.isSpanish ? `Ir a ${proj.name}` : `Go to ${proj.name}`
            }));
            titleElmt.append(projNameElmt, ' | ', createTextElmt('em', proj.tech_stack.join(', ')));
            datesElmt.append(createTextElmt('p', `${proj.start_date} - ${proj.end_date}`));
            headerElmt.append(titleElmt, datesElmt);

            highlightsElmt.append(...proj.highlights.map(highlight => createTextElmt('li', highlight)));
            articleElmt.append(headerElmt, highlightsElmt);
            sectionElmt.append(articleElmt);
        });
    }

    renderSkills(skills)
    {
        const sectionElmt = this.shadowRoot.getElementById('skills');
        const articleElmt = document.createElement('article');
        sectionElmt.innerHTML = this.isSpanish
            ? '<h2 title="Desarrollador FullStack"><span>H</span>ABILIDADES <span>T</span>ÉCNICAS</h2>'
            : '<h2 title="FullStack Dev"><span>T</span>ECHNICAL <span>S</span>KILLS</h2>';

        skills.forEach(skill =>
        {
            const skillElmt = document.createElement('p');
            skillElmt.append(createTextElmt('strong', `${skill.category}: `), skill.keywords.join(', '));
            articleElmt.append(skillElmt);
        });

        sectionElmt.append(articleElmt);
    }

    renderEducation(education)
    {
        const sectionElmt = this.shadowRoot.getElementById('education');
        const ofWord = this.isSpanish ? 'de' : 'of';
        sectionElmt.innerHTML = this.isSpanish ? '<h2><span>E</span>DUCACIÓN</h2>' : '<h2><span>E</span>DUCATION</h2>';

        education.forEach(study =>
        {
            const articleElmt = document.createElement('article');
            const headerElmt = document.createElement('header');
            const footerElmt = document.createElement('footer');
            const degreeElmt = document.createElement('h4');
            const datesElmt = document.createElement('p');

            headerElmt.classList.add('flex-btwn');
            headerElmt.append(createTextElmt('h3', study.institution), createTextElmt('p', study.location));

            footerElmt.classList.add('flex-btwn');
            degreeElmt.append(createTextElmt('em', `${study.type} ${ofWord} ${study.title}`));
            datesElmt.append(createTextElmt('em', `${study.start_date} - ${study.end_date}`));
            footerElmt.append(degreeElmt, datesElmt);

            articleElmt.append(headerElmt, footerElmt);
            sectionElmt.append(articleElmt);
        });
    }
}

customElements.define('simple-resume', SimpleResume);
