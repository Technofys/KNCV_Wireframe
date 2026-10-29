/* KNCV Knowledge Exchange — wireframe shared layout
   Injects the site header and footer so every page stays consistent. */
(function () {
  const page = document.body.dataset.page || '';
  const nav = [
    ['home', 'home.html', 'Home'],
    ['about', 'about.html', 'About'],
    ['courses', 'courses.html', 'Courses'],
    ['resources', 'resources.html', 'Resources'],
    ['community', 'community.html', 'Community of Practice'],
    ['contact', 'contact.html', 'Contact'],
  ];
  const navActive = page === 'course-detail' ? 'courses' : page;

  const header = page === 'sitemap' ? '' : `
  <header class="site-header annot" data-note="Global header · sticky nav">
    <div class="container">
      <a href="home.html" class="logo" id="logo-link">
        <svg class="logo-mark-svg" width="34" height="34" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="38" height="38" rx="10" fill="#1D4ED8" />
          <path d="M19 7V31" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
          <path d="M13 14H25" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
          <path d="M10 21H28" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
        </svg>
        <span>KNCV<small>Knowledge Exchange</small></span>
      </a>
      <nav class="main-nav" aria-label="Primary">
        ${nav.map(n => {
          if (n[0] === 'resources') {
            const isAct = ['resources', 'webinars', 'publications', 'toolkits'].includes(page);
            return `
            <div class="nav-item-dropdown">
              <a id="nav-resources" class="${isAct ? 'active' : ''}" href="resources.html" style="display:inline-flex;align-items:center;gap:5px">
                Resources <span style="font-size:10px;opacity:.7">▾</span>
              </a>
              <div class="nav-dropdown-menu">
                <a href="toolkits.html">Tool kits</a>
                <a href="webinars.html">Webinars</a>
                <a href="publications.html">Publications</a>
              </div>
            </div>`;
          }
          return `<a id="nav-${n[0]}" class="${n[0] === navActive ? 'active' : ''}" href="${n[1]}">${n[2]}</a>`;
        }).join('')}
      </nav>
      <div class="header-actions">
        <button class="icon-btn menu-btn" id="menu-btn" aria-label="Menu">☰</button>
      </div>
    </div>
  </header>`;

  const footer = `
  <footer class="site-footer annot" data-note="Global footer">
    <div class="container">
      <div class="cols">
        <div>
          <a href="home.html" class="logo">
            <svg class="logo-mark-svg" width="34" height="34" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="38" height="38" rx="10" fill="#2563EB" />
              <path d="M19 7V31" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
              <path d="M13 14H25" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
              <path d="M10 21H28" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
            </svg>
            <span>KNCV<small style="color:#8a919c">Knowledge Exchange</small></span>
          </a>
          <p class="small" style="margin-top:16px;max-width:280px">Practical TB training, knowledge hubs, and peer-to-peer exchange for healthcare professionals worldwide.</p>
        </div>
        <div><h4>Learn</h4><ul><li><a href="courses.html">All courses</a></li><li><a href="courses.html">Categories</a></li><li><a href="#lms">Learner dashboard ↗</a></li></ul></div>
        <div><h4>Resources</h4><ul><li><a href="resources.html">Resource Hubs</a></li><li><a href="webinars.html">Webinars</a></li><li><a href="publications.html">Publications</a></li></ul></div>
        <div><h4>Community &amp; About</h4><ul><li><a href="community.html">Community of Practice</a></li><li><a href="about.html">About KNCV</a></li><li><a href="about.html#faculty">Faculty</a></li><li><a href="about.html#partners">Partners</a></li></ul></div>
        <div><h4>Support</h4><ul><li><a href="contact.html">Contact</a></li><li><a href="contact.html#faq">FAQ</a></li><li><a href="contact.html#support">Technical support</a></li></ul></div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 KNCV Tuberculosis Foundation · Knowledge Exchange</span>
        <span><a href="contact.html#privacy">Privacy notice</a> · <a href="#">Cookie settings</a> · <a href="#">Accessibility</a></span>
      </div>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer);

  // Annotation toggle — press "A" to show/hide section labels
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() !== 'a' || e.target.closest('input, textarea, select')) return;
    document.body.classList.toggle('hide-notes');
  });

  // Simple interactivity for chips & tabs
  document.querySelectorAll('.chips, .tabs').forEach(group => {
    group.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      group.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    });
  });

  // LMS links
  document.querySelectorAll('a[href="#lms"]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    alert('Wireframe note: this links out to the LMS (e.g. learn.kncv.org) for sign-in / enrolment.');
  }));

  // Reveal on scroll
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
