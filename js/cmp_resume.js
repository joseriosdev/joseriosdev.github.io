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

  section { margin-bottom: var(--standard-margin) }
  article { margin: 0 0 var(--standard-margin) var(--standard-margin) }

  h1 {
    font-family: Georgia, serif;
    font-size: calc(var(--font-main-size) * 2);
  }
  h2 {
    margin-bottom: calc(var(--standard-margin) * 0.3);
    border-bottom: 1px solid gray;
    font-family: Georgia, serif;
    font-size: calc(var(--font-main-size) - 2pt);
    font-weight: 500;
    letter-spacing: 1pt;
  }
  h2 span { font-size: calc(var(--font-main-size) + 2pt) }
  h3 { font-size: calc(var(--font-main-size) + 1pt) }
  h4 { font-weight: 400 }
  a { color: black }
  ul { margin-left: calc(var(--standard-margin) * 2) }
  li { text-indent: calc(var(--standard-margin) * -0.5) }

  .flex-btwn {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .loading-error {
    padding: var(--standard-margin);
    margin: var(--standard-margin);
    background: white;
  }
  .inline { display: inline }
`);

class SimpleResume extends HTMLElement
{
  constructor()
  {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [sheet];
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
      <main>
        <section id="main-header">
        <dialog-bubble
          title="Hey," 
          avatar="../img/profile_pic.jpg" 
          messages='["First message here", "Second helpful tip", "Last piece of info"]'>
          <h1 id="name"></h1>
        </dialog-bubble>
          
          <p id="title"></p>
          <p>
            <span id="location"></span> | 
            <a href="#" target="_blank" title="send email to " id="email"></a> | 
            <a href="#" target="_blank" id="linkedin"><i class="fa fa-linkedin-square"></i></a> | 
            <a href="#" target="_blank" id="github"><i class="fa fa-github"></i></a>
          </p>
        </section>

        <section id="experience"></section>
        <section id="projects"></section>
        <section id="skills"></section>
        <section id="education"></section>
      </main>
    `;
  }

  connectedCallback()
  {
    const jsonFileName = this.getAttribute('resume-lang') === 'es' ? 'spanish': 'english';
    fetch(`../resume_data/${jsonFileName}.json`)
      .then(response => response.json())
      .then(data => this.render(data))
      .catch(error => this.shadowRoot.innerHTML = `<p class="loading-error">Error loading resume data.<br/>Error: ${error}</p>`);
  }

  render(data)
  {
    const isSpanish = data.lang === 'es';
    this.renderHeader(data.basics);
    this.renderExperience(data.work, isSpanish);
    this.renderProjects(data.projects, isSpanish);
    this.renderSkills(data.skills, isSpanish);
    this.renderEducation(data.education, isSpanish);
  }

  renderHeader(basics)
  {
    this.shadowRoot.getElementById('name').textContent = basics.name;
    this.shadowRoot.getElementById('title').textContent = basics.title;
    this.shadowRoot.getElementById('location').textContent = `${basics.location.city}, ${basics.location.country}`;
    const emailElmt = this.shadowRoot.getElementById('email');
    emailElmt.textContent = basics.email;
    emailElmt.href = 'mailto:' + basics.email;
    emailElmt.title += basics.name;

    const linkedinUser = document.createTextNode('/' + basics.profiles.linkedin.split('/').pop());
    const linkedinElmt = this.shadowRoot.getElementById('linkedin');
    linkedinElmt.href = basics.profiles.linkedin;
    linkedinElmt.appendChild(linkedinUser);
    linkedinElmt.title = `Open ${basics.name}'s LinkedIn`;

    const githubUser = document.createTextNode('/' + basics.profiles.github.split('/').pop());
    const githubElmt = this.shadowRoot.getElementById('github');
    githubElmt.href = basics.profiles.github;
    githubElmt.appendChild(githubUser);
    githubElmt.title = `Open ${basics.name}'s GitHub`;
  }

  renderExperience(jobs, isSpanish)
  {
    const sectionElmt = this.shadowRoot.getElementById('experience');
    sectionElmt.innerHTML = isSpanish ? '<h2><span>E</span>XPERIENCIA</h2>' : '<h2><span>E</span>XPERIENCE</h2>';

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
      const techStack = document.createElement('em');
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

  renderProjects(projects, isSpanish)
  {
    const sectionElmt = this.shadowRoot.getElementById('projects');
    sectionElmt.innerHTML = isSpanish ? '<h2><span>P</span>ROYECTOS</h2>' : '<h2><span>P</span>ROJECTS</h2>';

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

  renderSkills(skills, isSpanish)
  {
    const sectionElmt = this.shadowRoot.getElementById('skills');
    sectionElmt.innerHTML = isSpanish ? '<h2><span>H</span>ABILIDADES <span>T</span>ÉCNICAS</h2>' : '<h2><span>T</span>ECHNICAL <span>S</span>KILLS</h2>';
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

  renderEducation(education, isSpanish)
  {
    const sectionElmt = this.shadowRoot.getElementById('education');
    sectionElmt.innerHTML = isSpanish ? '<h2><span>E</span>DUCACIÓN</h2>' : '<h2><span>E</span>DUCATION</h2>';

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

customElements.define('simple-resume', SimpleResume);
