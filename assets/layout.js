/* KNCV TB Plus: Knowledge Exchange shared layout & interactive UI
   Injects the official KNCV TB Plus header, footer, and accessible modal across all pages. */
(function () {
  const page = document.body.dataset.page || '';
  if (!document.body.classList.contains('show-notes')) {
    document.body.classList.add('hide-notes');
  }

  const nav = [
    ['home', 'home.html', 'Home'],
    ['about', 'about.html', 'About'],
    ['courses', 'courses.html', 'Courses'],
    ['resources', 'resources.html', 'Resources'],
    ['community', 'community.html', 'Community of Practice'],
    ['contact', 'contact.html', 'Contact'],
  ];
  const navActive = page === 'course-detail' ? 'courses' : page;

  const skipLink = `<a href="#main-content" class="skip-link">Skip to main content</a>`;

  const header = `
  <header class="site-header annot" data-note="Global header · official KNCV TB Plus red/black logo">
    <div class="container">
      <a href="home.html" class="logo" id="logo-link">
        <img src="KNCV_TB_PLUS_ZW.png" alt="KNCV TB Plus" class="kncv-logo-img" />
        <span class="logo-divider" aria-hidden="true"></span>
        <span class="logo-title">Knowledge Exchange<small>Global TB Learning &amp; Practice</small></span>
      </a>
      <nav class="main-nav" id="main-nav" aria-label="Primary">
        ${nav.map(n => {
          if (n[0] === 'resources') {
            const isAct = ['resources', 'webinars', 'publications', 'toolkits'].includes(page);
            return `
            <div class="nav-item-dropdown">
              <a id="nav-resources" class="${isAct ? 'active' : ''}" href="resources.html" aria-haspopup="true" aria-expanded="false" style="display:inline-flex;align-items:center;gap:5px" ${isAct ? 'aria-current="page"' : ''}>
                Resources <span style="font-size:10px;opacity:.8" aria-hidden="true">▾</span>
              </a>
              <div class="nav-dropdown-menu" id="resources-submenu" aria-label="Resources submenu">
                <a href="toolkits.html" class="${page === 'toolkits' ? 'active' : ''}">Toolkits</a>
                <a href="webinars.html" class="${page === 'webinars' ? 'active' : ''}">Webinars</a>
                <a href="publications.html" class="${page === 'publications' ? 'active' : ''}">Publications</a>
              </div>
            </div>`;
          }
          const isCurrent = n[0] === navActive;
          return `<a id="nav-${n[0]}" class="${isCurrent ? 'active' : ''}" href="${n[1]}" ${isCurrent ? 'aria-current="page"' : ''}>${n[2]}</a>`;
        }).join('')}
      </nav>
      <div class="header-actions">
        <button type="button" class="icon-btn menu-btn" id="menu-btn" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="main-nav">☰</button>
      </div>
    </div>
  </header>`;

  const footer = `
  <footer class="site-footer annot" data-note="Global footer · official KNCV TB Plus red/white logo">
    <div class="container">
      <div class="cols">
        <div class="footer-brand-col">
          <a href="home.html" class="logo footer-logo" aria-label="KNCV TB Plus Home">
            <img src="KNCV_TB_PLUS_W.png" alt="KNCV TB Plus" class="kncv-logo-img-footer" />
          </a>
          <p class="footer-tagline">KNCV: Together we can end TB.</p>
          <p class="small footer-desc">To save lives and end human suffering through the promotion of health and the global elimination of tuberculosis and other related diseases.</p>
          <div class="footer-contact-block">
            <p class="small"><strong>How to contact us?</strong></p>
            <p class="small">Tel: <a href="tel:+31704167222">+31 (0)70 416 7222</a></p>
            <p class="small">Web: <a href="https://www.kncvtbc.org/en" target="_blank" rel="noopener">kncvtbc.org/en</a></p>
            <p class="small">KNCV Tuberculosefonds · Maanweg 174, 2516 AB Den Haag, The Netherlands</p>
            <p class="small">Email: <a href="mailto:info@kncvtbc.org">info@kncvtbc.org</a> · <a href="https://www.kncvtbc.org" target="_blank" rel="noopener">www.kncvtbc.org</a></p>
          </div>
          <div class="footer-socials" aria-label="KNCV Social Media Accounts">
            <a href="https://twitter.com/KNCVTBC" target="_blank" rel="noopener" aria-label="Twitter @KNCVTBC" title="Twitter: KNCVTBC">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <span>KNCVTBC</span>
            </a>
            <a href="https://www.linkedin.com/company/kncv-tuberculosis-foundation" target="_blank" rel="noopener" aria-label="LinkedIn kncv-tuberculosis-foundation" title="LinkedIn: kncv-tuberculosis-foundation">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
              <span>LinkedIn</span>
            </a>
            <a href="https://www.facebook.com/KNCVtbc" target="_blank" rel="noopener" aria-label="Facebook KNCV" title="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
              <span>Facebook</span>
            </a>
            <a href="https://www.instagram.com/kncvtbc/" target="_blank" rel="noopener" aria-label="Instagram KNCV" title="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>
        <div><h3>Learn</h3><ul><li><a href="courses.html">All courses</a></li><li><a href="courses.html">Categories</a></li><li><a href="#lms">Learner dashboard ↗</a></li></ul></div>
        <div><h3>Resources</h3><ul><li><a href="resources.html">Resource Hubs</a></li><li><a href="toolkits.html">Toolkits</a></li><li><a href="webinars.html">Webinars</a></li><li><a href="publications.html">Publications</a></li></ul></div>
        <div><h3>Community &amp; About</h3><ul><li><a href="community.html">Community of Practice</a></li><li><a href="about.html">About KNCV</a></li><li><a href="about.html#faculty">Faculty</a></li><li><a href="about.html#partners">Partners</a></li></ul></div>
        <div><h3>Support</h3><ul><li><a href="contact.html">Contact</a></li><li><a href="contact.html#faq">FAQ</a></li><li><a href="contact.html#support">Technical support</a></li><li><a href="https://www.kncvtbc.org/en" target="_blank" rel="noopener">kncvtbc.org/en ↗</a></li></ul></div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 KNCV TB Plus (KNCV Tuberculosis Foundation) · Knowledge Exchange · <a href="https://www.kncvtbc.org/en" target="_blank" rel="noopener" style="text-decoration:underline">kncvtbc.org/en</a></span>
        <span><a href="contact.html#privacy">Privacy notice</a> · <a href="contact.html#privacy">Cookie settings</a> · <a href="index.html">Sitemap</a></span>
      </div>
    </div>
  </footer>
  <div id="a11y-status" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></div>
  <div class="kncv-modal-backdrop" id="kncv-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="kncv-modal-title" aria-describedby="kncv-modal-desc" aria-hidden="true">
    <div class="kncv-modal" role="document">
      <div class="kncv-modal-header">
        <div>
          <span class="eyebrow" id="kncv-modal-eyebrow" style="margin-bottom:4px">KNCV TB Plus · Knowledge Exchange</span>
          <h3 id="kncv-modal-title">KNCV Learning Management System</h3>
        </div>
        <button type="button" class="kncv-modal-close" id="kncv-modal-close" aria-label="Close dialog">✕</button>
      </div>
      <div class="kncv-modal-body">
        <p id="kncv-modal-desc">This link connects to the KNCV Learning Management System (learn.kncvtbc.org) for learner sign-in, course enrolment, and Community of Practice forums.</p>
        <div id="kncv-modal-media-badge" style="display:none;margin-top:14px;padding:8px 12px;background:var(--fill);border-left:3px solid var(--kncv-red);font-size:12.5px;color:var(--ink-2);font-weight:700" aria-label="Media accessibility features"></div>
      </div>
      <div class="kncv-modal-actions">
        <button type="button" class="btn btn-secondary btn-sm" id="kncv-modal-cancel">Close</button>
        <a class="btn btn-primary btn-sm" id="kncv-modal-primary" href="courses.html">Continue</a>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('afterbegin', skipLink + header);
  document.body.insertAdjacentHTML('beforeend', footer);

  // Mobile Menu Toggle & Keyboard Dismissal
  const menuBtn = document.getElementById('menu-btn');
  const mainNav = document.getElementById('main-nav');
  function closeMobileNav() {
    if (!menuBtn || !mainNav) return;
    mainNav.classList.remove('nav-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = '☰';
  }
  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('nav-open');
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuBtn.textContent = isOpen ? '✕' : '☰';
      if (isOpen) {
        // Shift focus to the first navigation link inside the opened menu
        setTimeout(() => {
          const firstLink = mainNav.querySelector('a');
          if (firstLink) firstLink.focus();
        }, 50);
      }
    });
    mainNav.addEventListener('click', e => {
      if (e.target.closest('a')) closeMobileNav();
    });
  }

  // Resources Dropdown Keyboard Navigation (W3C APG Menu Pattern)
  const navResources = document.getElementById('nav-resources');
  const resourcesMenu = document.getElementById('resources-submenu');
  if (navResources && resourcesMenu) {
    const menuLinks = Array.from(resourcesMenu.querySelectorAll('a'));
    function openResourcesMenu() {
      navResources.setAttribute('aria-expanded', 'true');
      resourcesMenu.classList.add('is-open');
    }
    function closeResourcesMenu() {
      navResources.setAttribute('aria-expanded', 'false');
      resourcesMenu.classList.remove('is-open');
    }
    navResources.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openResourcesMenu();
        setTimeout(() => {
          if (menuLinks[0]) menuLinks[0].focus();
        }, 50);
      }
    });
    resourcesMenu.addEventListener('keydown', e => {
      const idx = menuLinks.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (idx + 1) % menuLinks.length;
        menuLinks[next].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (idx - 1 + menuLinks.length) % menuLinks.length;
        menuLinks[prev].focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeResourcesMenu();
        navResources.focus();
      }
    });
    document.addEventListener('click', e => {
      if (!navResources.contains(e.target) && !resourcesMenu.contains(e.target)) {
        closeResourcesMenu();
      }
    });
    document.addEventListener('focusin', e => {
      if (!navResources.contains(e.target) && !resourcesMenu.contains(e.target)) {
        closeResourcesMenu();
      }
    });
  }

  // Accessible KNCV Modal Controller
  const modalBackdrop = document.getElementById('kncv-modal-backdrop');
  const modalTitle = document.getElementById('kncv-modal-title');
  const modalDesc = document.getElementById('kncv-modal-desc');
  const modalEyebrow = document.getElementById('kncv-modal-eyebrow');
  const modalClose = document.getElementById('kncv-modal-close');
  const modalCancel = document.getElementById('kncv-modal-cancel');
  const modalPrimary = document.getElementById('kncv-modal-primary');
  const modalMediaBadge = document.getElementById('kncv-modal-media-badge');
  let lastFocusedTrigger = null;

  function openKncvModal(options) {
    if (!modalBackdrop) return;
    lastFocusedTrigger = document.activeElement;
    modalEyebrow.textContent = options.eyebrow || 'KNCV TB Plus · Knowledge Exchange';
    modalTitle.textContent = options.title || 'KNCV Knowledge Exchange';
    modalDesc.textContent = options.desc || '';
    if (modalMediaBadge) {
      if (options.mediaBadge) {
        modalMediaBadge.textContent = options.mediaBadge;
        modalMediaBadge.style.display = 'block';
      } else {
        modalMediaBadge.style.display = 'none';
      }
    }
    if (options.primaryText) {
      modalPrimary.textContent = options.primaryText;
      modalPrimary.href = options.primaryHref || '#';
      modalPrimary.style.display = 'inline-flex';
    } else {
      modalPrimary.style.display = 'none';
    }
    modalBackdrop.classList.add('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    modalClose.focus();
  }

  function closeKncvModal() {
    if (!modalBackdrop || !modalBackdrop.classList.contains('is-open')) return;
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeKncvModal);
  if (modalCancel) modalCancel.addEventListener('click', closeKncvModal);
  if (modalPrimary) {
    modalPrimary.addEventListener('click', e => {
      if (modalPrimary.getAttribute('href') === '#') {
        e.preventDefault();
        closeKncvModal();
      }
    });
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', e => {
      if (e.target === modalBackdrop) closeKncvModal();
    });
  }

  // Global Keyboard Shortcuts (Escape to close modal/mobile nav, Tab trap in modal, "A" to toggle section annotations)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (modalBackdrop && modalBackdrop.classList.contains('is-open')) {
        closeKncvModal();
        return;
      }
      if (mainNav && mainNav.classList.contains('nav-open')) {
        closeMobileNav();
        if (menuBtn) menuBtn.focus();
        return;
      }
    }
    if (e.key === 'Tab' && modalBackdrop && modalBackdrop.classList.contains('is-open')) {
      const focusable = Array.from(modalBackdrop.querySelectorAll('button, a[href]')).filter(el => el.style.display !== 'none');
      if (focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      return;
    }
    if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      document.body.classList.toggle('hide-notes');
    }
  });

  // LMS links -> Accessible KNCV Modal (no native alert)
  document.querySelectorAll('a[href="#lms"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      openKncvModal({
        eyebrow: 'External Learning Platform · learn.kncvtbc.org',
        title: 'Continue to the KNCV Learning Management System',
        desc: 'This action connects you to the KNCV Learning Management System (learn.kncvtbc.org) for single sign-on learner registration, course enrolment, verified certificates, and Community of Practice workspaces.',
        primaryText: 'Proceed to LMS Sign-In ↗',
        primaryHref: '#'
      });
    });
  });

  // Resource / Video / Story / Registration preview modal triggers
  document.querySelectorAll('.js-resource-modal, #play-trailer-btn').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const title = el.dataset.modalTitle || el.textContent.trim();
      const desc = el.dataset.modalDesc || 'Access this KNCV TB Plus clinical resource or recording directly through the Knowledge Exchange repository.';
      const lower = title.toLowerCase();
      const isRegistration = lower.includes('registration') || lower.includes('rsvp');
      const isVideo = !isRegistration && (lower.includes('trailer') || lower.includes('recording') || lower.includes('webinar archive'));
      const isStory = !isRegistration && !isVideo && (lower.includes('field story') || lower.includes('practitioner insight') || lower.includes('implementation note') || lower.includes('case report'));
      openKncvModal({
        eyebrow: isRegistration
          ? 'KNCV TB Plus · Event & Webinar Registration'
          : (isVideo ? 'KNCV Media Player · HD Stream & Captions' : (isStory ? 'Community of Practice · Voices from the Field' : 'KNCV TB Plus · Open-Access Resource')),
        title: title,
        desc: desc,
        mediaBadge: isVideo ? 'Closed Captions: English, French, Spanish (WebVTT) · Synchronized Transcript & Audio Description Available' : '',
        primaryText: isRegistration
          ? 'Confirm Registration →'
          : (isVideo ? 'Launch Stream' : (isStory ? 'Discuss in Community Forum ↗' : 'Confirm Download ↓')),
        primaryHref: '#'
      });
    });
  });

  // Generic chips & tabs active state handler + W3C APG Roving Tabindex & Arrow-Key Navigation
  document.querySelectorAll('.chips, .tabs').forEach(group => {
    const isTablist = group.getAttribute('role') === 'tablist';
    const buttons = Array.from(group.querySelectorAll('button'));
    buttons.forEach(btn => {
      const isActive = btn.classList.contains('active') || btn.getAttribute('aria-selected') === 'true' || btn.getAttribute('aria-pressed') === 'true';
      if (isTablist && btn.getAttribute('role') === 'tab') {
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.setAttribute('tabindex', isActive ? '0' : '-1');
      } else if (!btn.hasAttribute('aria-selected')) {
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      }
    });

    group.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      group.querySelectorAll('button').forEach(x => {
        x.classList.remove('active');
        if (x.hasAttribute('aria-selected')) {
          x.setAttribute('aria-selected', 'false');
          x.setAttribute('tabindex', '-1');
        }
        if (x.hasAttribute('aria-pressed')) x.setAttribute('aria-pressed', 'false');
      });
      b.classList.add('active');
      if (b.hasAttribute('aria-selected')) {
        b.setAttribute('aria-selected', 'true');
        b.setAttribute('tabindex', '0');
      }
      if (b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', 'true');
    });

    if (isTablist) {
      group.addEventListener('keydown', e => {
        const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
        const idx = tabs.indexOf(document.activeElement);
        if (idx === -1) return;
        let nextIdx = -1;
        if (e.key === 'ArrowRight') nextIdx = (idx + 1) % tabs.length;
        if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') nextIdx = 0;
        if (e.key === 'End') nextIdx = tabs.length - 1;
        if (nextIdx !== -1) {
          e.preventDefault();
          tabs[nextIdx].focus();
          tabs[nextIdx].click();
        }
      });
    }
  });

  // Home Page: W3C APG Tabs & Dynamic Course Reordering (#home-course-tabs)
  const homeTabs = document.getElementById('home-course-tabs');
  const homeGrid = document.getElementById('home-courses-grid');
  if (homeTabs && homeGrid) {
    const tabBtns = Array.from(homeTabs.querySelectorAll('[role="tab"]'));
    function activateHomeTab(btn) {
      const tabKey = btn.dataset.tab || 'featured';
      tabBtns.forEach(t => {
        const active = t === btn;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.setAttribute('tabindex', active ? '0' : '-1');
      });
      homeGrid.setAttribute('aria-labelledby', btn.id);

      const cards = Array.from(homeGrid.querySelectorAll('.card'));
      const orderAttr = tabKey === 'popular' ? 'popularOrder' : (tabKey === 'new' ? 'newOrder' : 'featuredOrder');
      const badgeAttr = tabKey === 'popular' ? 'badgePopular' : (tabKey === 'new' ? 'badgeNew' : 'badgeFeatured');

      cards.sort((a, b) => (parseInt(a.dataset[orderAttr], 10) || 99) - (parseInt(b.dataset[orderAttr], 10) || 99));
      cards.forEach((card, idx) => {
        const badge = card.querySelector('.js-course-badge');
        if (badge && card.dataset[badgeAttr]) {
          badge.textContent = card.dataset[badgeAttr];
          badge.classList.toggle('solid', idx === 0);
        }
        homeGrid.appendChild(card);
      });
    }

    homeTabs.addEventListener('click', e => {
      const btn = e.target.closest('[role="tab"]');
      if (btn) activateHomeTab(btn);
    });
  }

  // About Page: Venn Diagram & Pillar Card Synchronization + Faculty Filter + Marquee Pause
  const vennGroups = document.querySelectorAll('.venn-group');
  const pillarItems = document.querySelectorAll('.pillar-item');
  if (vennGroups.length && pillarItems.length) {
    function highlightSynergy(pillarId, circleId) {
      vennGroups.forEach(g => g.classList.toggle('is-active', g.id === circleId || g.dataset.target === pillarId));
      pillarItems.forEach(p => p.classList.toggle('is-active', p.id === pillarId || p.dataset.circle === circleId));
    }
    function clearSynergy() {
      vennGroups.forEach(g => g.classList.remove('is-active'));
      pillarItems.forEach(p => p.classList.remove('is-active'));
    }
    vennGroups.forEach(g => {
      g.addEventListener('mouseenter', () => highlightSynergy(g.dataset.target, g.id));
      g.addEventListener('focus', () => highlightSynergy(g.dataset.target, g.id));
      g.addEventListener('mouseleave', clearSynergy);
      g.addEventListener('blur', clearSynergy);
    });
    pillarItems.forEach(p => {
      p.addEventListener('mouseenter', () => highlightSynergy(p.id, p.dataset.circle));
      p.addEventListener('focus', () => highlightSynergy(p.id, p.dataset.circle));
      p.addEventListener('mouseleave', clearSynergy);
      p.addEventListener('blur', clearSynergy);
    });
  }

  const facultyChips = document.getElementById('faculty-chips');
  const facultyGrid = document.getElementById('faculty-grid');
  if (facultyChips && facultyGrid) {
    facultyChips.addEventListener('click', e => {
      const btn = e.target.closest('[data-faculty-filter]');
      if (!btn) return;
      const role = btn.dataset.facultyFilter;
      facultyGrid.querySelectorAll('.team-card').forEach(card => {
        const roles = (card.dataset.facultyRole || '').split(/\s+/);
        card.style.display = (role === 'all' || roles.includes(role)) ? '' : 'none';
      });
    });
  }

  const marqueeToggle = document.getElementById('marquee-toggle');
  const marqueeWrap = document.getElementById('partners-marquee');
  if (marqueeToggle && marqueeWrap) {
    marqueeToggle.addEventListener('click', () => {
      const paused = marqueeWrap.classList.toggle('is-paused');
      marqueeToggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
      marqueeToggle.textContent = paused ? 'Resume scroll' : 'Pause scroll';
      marqueeToggle.removeAttribute('aria-label');
    });
  }

  // Courses Page: Live Filtering, Sorting, Clear All & Grid/List View Toggle
  const coursesGrid = document.getElementById('courses-catalog-grid');
  if (coursesGrid) {
    const searchInput = document.getElementById('course-search');
    const sortSelect = document.getElementById('course-sort');
    const langSelect = document.getElementById('filter-language');
    const clearBtn = document.getElementById('clear-filters');
    const applyBtn = document.getElementById('apply-filters');
    const catChips = document.getElementById('course-category-chips');
    const filtersPanel = document.getElementById('course-filters-panel');
    const resultsCount = document.getElementById('course-results-count');
    const viewToggle = document.getElementById('course-view-toggle');
    const allCards = Array.from(coursesGrid.querySelectorAll('.card'));

    function filterAndSortCourses() {
      const q = (searchInput ? searchInput.value : '').trim().toLowerCase();
      const activeCatBtn = catChips ? catChips.querySelector('.chip.active') : null;
      const activeCat = activeCatBtn ? (activeCatBtn.dataset.cat || 'all') : 'all';
      const lang = langSelect ? langSelect.value : 'all';

      const checkedLevels = filtersPanel ? Array.from(filtersPanel.querySelectorAll('input[name="level"]:checked')).map(i => i.value) : [];
      const checkedDurations = filtersPanel ? Array.from(filtersPanel.querySelectorAll('input[name="duration"]:checked')).map(i => i.value) : [];
      const checkedFormats = filtersPanel ? Array.from(filtersPanel.querySelectorAll('input[name="format"]:checked')).map(i => i.value) : [];
      const checkedOthers = filtersPanel ? Array.from(filtersPanel.querySelectorAll('input[name="other"]:checked')).map(i => i.value) : [];

      let visibleCount = 0;
      allCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const matchQuery = !q || text.includes(q);
        const matchCat = activeCat === 'all' || card.dataset.category === activeCat;
        const matchLevel = !checkedLevels.length || checkedLevels.includes(card.dataset.level);
        const matchDuration = !checkedDurations.length || checkedDurations.includes(card.dataset.duration);
        const matchFormat = !checkedFormats.length || checkedFormats.includes(card.dataset.format);
        const cardLangs = (card.dataset.lang || '').split(',');
        const matchLang = lang === 'all' || cardLangs.includes(lang);
        const matchCert = !checkedOthers.includes('cert') || card.dataset.cert === 'true';
        const matchFree = !checkedOthers.includes('free') || card.dataset.free === 'true';

        const show = matchQuery && matchCat && matchLevel && matchDuration && matchFormat && matchLang && matchCert && matchFree;
        card.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });

      const sortBy = sortSelect ? sortSelect.value : 'popular';
      const sorted = [...allCards].sort((a, b) => {
        if (sortBy === 'az') {
          return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
        }
        if (sortBy === 'duration') {
          return (parseFloat(a.dataset.hours) || 0) - (parseFloat(b.dataset.hours) || 0);
        }
        if (sortBy === 'newest') {
          return (parseInt(a.dataset.newest, 10) || 99) - (parseInt(b.dataset.newest, 10) || 99);
        }
        return (parseFloat(b.dataset.popular) || 0) - (parseFloat(a.dataset.popular) || 0);
      });
      sorted.forEach(c => coursesGrid.appendChild(c));

      if (resultsCount) {
        if (visibleCount === allCards.length && activeCat === 'all' && !q && !checkedLevels.length && !checkedDurations.length && !checkedFormats.length && !checkedOthers.length && lang === 'all') {
          resultsCount.textContent = 'Showing 1-9 of 42 courses';
        } else {
          resultsCount.textContent = `Showing ${visibleCount} of 42 courses`;
        }
      }
    }

    if (searchInput) searchInput.addEventListener('input', filterAndSortCourses);
    if (sortSelect) sortSelect.addEventListener('change', filterAndSortCourses);
    if (langSelect) langSelect.addEventListener('change', filterAndSortCourses);
    if (catChips) catChips.addEventListener('click', filterAndSortCourses);
    if (filtersPanel) filtersPanel.addEventListener('change', filterAndSortCourses);
    if (applyBtn) applyBtn.addEventListener('click', filterAndSortCourses);
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (langSelect) langSelect.value = 'all';
        if (sortSelect) sortSelect.value = 'popular';
        if (filtersPanel) {
          filtersPanel.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
        }
        if (catChips) {
          catChips.querySelectorAll('.chip').forEach(c => {
            c.classList.remove('active');
            c.setAttribute('aria-pressed', 'false');
          });
          const allChip = document.getElementById('cat-all');
          if (allChip) {
            allChip.classList.add('active');
            allChip.setAttribute('aria-pressed', 'true');
          }
        }
        filterAndSortCourses();
      });
    }
    if (viewToggle) {
      viewToggle.addEventListener('click', e => {
        const btn = e.target.closest('button[data-view]');
        if (!btn) return;
        coursesGrid.classList.toggle('list-view', btn.dataset.view === 'list');
      });
    }
  }

  // Course Detail Page: Save for later toggle (#save-course)
  const saveCourseBtn = document.getElementById('save-course');
  if (saveCourseBtn) {
    saveCourseBtn.addEventListener('click', e => {
      e.preventDefault();
      const saved = saveCourseBtn.getAttribute('aria-pressed') !== 'true';
      saveCourseBtn.setAttribute('aria-pressed', saved ? 'true' : 'false');
      saveCourseBtn.textContent = saved ? 'Saved to learning list' : 'Save for later';
    });
  }

  // Webinars Page: Filter Tabs (#webinar-tabs)
  const webinarTabs = document.getElementById('webinar-tabs');
  if (webinarTabs) {
    const archiveGrid = document.getElementById('webinar-archive-grid');
    const archiveHeading = document.getElementById('webinar-archive-heading');
    const archivePagination = document.getElementById('webinar-archive-pagination');
    const featuredSplit = document.getElementById('webinar-featured-split');

    webinarTabs.addEventListener('click', e => {
      const btn = e.target.closest('[data-webinar-filter]');
      if (!btn) return;
      const filter = btn.dataset.webinarFilter;
      document.querySelectorAll('[data-webinar-item]').forEach(item => {
        const types = (item.dataset.webinarItem || '').split(/\s+/);
        item.style.display = (filter === 'all' || types.includes(filter)) ? '' : 'none';
      });
      if (featuredSplit) {
        const firstCard = featuredSplit.firstElementChild;
        featuredSplit.style.gridTemplateColumns = (firstCard && firstCard.style.display === 'none') ? '1fr' : '';
      }
      if (archiveGrid) {
        const hasVisibleArchive = Array.from(archiveGrid.querySelectorAll('[data-webinar-item]')).some(el => el.style.display !== 'none');
        if (archiveHeading) archiveHeading.style.display = hasVisibleArchive ? '' : 'none';
        if (archivePagination) archivePagination.style.display = hasVisibleArchive ? '' : 'none';
      }
    });
  }

  // Publications Page: Category Chips, Keyword Search & Sort
  const pubList = document.getElementById('publications-list');
  if (pubList) {
    const pubSearch = document.getElementById('pub-search');
    const pubSort = document.getElementById('pub-sort');
    const pubChips = document.getElementById('pub-category-chips');
    const pubRows = Array.from(pubList.querySelectorAll('.res-row'));

    function updatePublications() {
      const q = (pubSearch ? pubSearch.value : '').trim().toLowerCase();
      const activeChip = pubChips ? pubChips.querySelector('.chip.active') : null;
      const cat = activeChip ? (activeChip.dataset.pubCat || 'all') : 'all';

      pubRows.forEach(row => {
        const matchCat = cat === 'all' || row.dataset.pubCat === cat;
        const matchQuery = !q || row.textContent.toLowerCase().includes(q);
        row.style.display = (matchCat && matchQuery) ? '' : 'none';
      });

      const sortVal = pubSort ? pubSort.value : 'newest';
      const sorted = [...pubRows].sort((a, b) => {
        if (sortVal === 'downloads') {
          return (parseInt(b.dataset.downloads, 10) || 0) - (parseInt(a.dataset.downloads, 10) || 0);
        }
        if (sortVal === 'topic') {
          return (a.dataset.topic || '').localeCompare(b.dataset.topic || '');
        }
        return (b.dataset.date || '').localeCompare(a.dataset.date || '');
      });
      sorted.forEach(r => pubList.appendChild(r));
    }

    if (pubSearch) pubSearch.addEventListener('input', updatePublications);
    if (pubSort) pubSort.addEventListener('change', updatePublications);
    if (pubChips) pubChips.addEventListener('click', updatePublications);
  }

  // Community Page: Thematic Group Tabs & Event Type Select Filter
  const groupTabs = document.getElementById('community-group-tabs');
  const groupsGrid = document.getElementById('community-groups-grid');
  if (groupTabs && groupsGrid) {
    groupTabs.addEventListener('click', e => {
      const btn = e.target.closest('[data-group-filter]');
      if (!btn) return;
      const filter = btn.dataset.groupFilter;
      groupsGrid.querySelectorAll('[data-group-cat]').forEach(card => {
        const cats = (card.dataset.groupCat || '').split(/\s+/);
        card.style.display = (filter === 'all' || cats.includes(filter)) ? '' : 'none';
      });
    });
  }

  const eventFilter = document.getElementById('event-type-filter');
  const eventsGrid = document.getElementById('community-events-grid');
  if (eventFilter && eventsGrid) {
    eventFilter.addEventListener('change', () => {
      const val = eventFilter.value;
      eventsGrid.querySelectorAll('[data-event-type]').forEach(card => {
        card.style.display = (val === 'all' || card.dataset.eventType === val) ? '' : 'none';
      });
    });
  }

  // Contact Page: Accessible Form Submission Handler (#contact-enquiry-form)
  const contactForm = document.getElementById('contact-enquiry-form');
  const contactStatus = document.getElementById('contact-form-status');
  if (contactForm && contactStatus) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const msgInput = document.getElementById('contact-msg');
      const nameErr = document.getElementById('contact-name-error');
      const emailErr = document.getElementById('contact-email-error');
      const msgErr = document.getElementById('contact-msg-error');

      let firstInvalid = null;
      let errorCount = 0;

      // Validate name
      if (nameInput) {
        if (!nameInput.value.trim()) {
          nameInput.setAttribute('aria-invalid', 'true');
          nameInput.setAttribute('aria-describedby', 'contact-name-error');
          if (nameErr) nameErr.textContent = 'Please enter your full name.';
          if (!firstInvalid) firstInvalid = nameInput;
          errorCount++;
        } else {
          nameInput.removeAttribute('aria-invalid');
          if (nameErr) nameErr.textContent = '';
        }
      }

      // Validate email
      if (emailInput) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
          emailInput.setAttribute('aria-invalid', 'true');
          emailInput.setAttribute('aria-describedby', 'contact-email-error');
          if (emailErr) emailErr.textContent = 'Please enter your email address.';
          if (!firstInvalid) firstInvalid = emailInput;
          errorCount++;
        } else if (!emailPattern.test(emailInput.value.trim())) {
          emailInput.setAttribute('aria-invalid', 'true');
          emailInput.setAttribute('aria-describedby', 'contact-email-error');
          if (emailErr) emailErr.textContent = 'Please enter a valid email address (e.g. name@organisation.org).';
          if (!firstInvalid) firstInvalid = emailInput;
          errorCount++;
        } else {
          emailInput.removeAttribute('aria-invalid');
          if (emailErr) emailErr.textContent = '';
        }
      }

      // Validate message
      if (msgInput) {
        if (!msgInput.value.trim()) {
          msgInput.setAttribute('aria-invalid', 'true');
          msgInput.setAttribute('aria-describedby', 'contact-msg-error');
          if (msgErr) msgErr.textContent = 'Please enter your enquiry or message.';
          if (!firstInvalid) firstInvalid = msgInput;
          errorCount++;
        } else {
          msgInput.removeAttribute('aria-invalid');
          if (msgErr) msgErr.textContent = '';
        }
      }

      if (errorCount > 0) {
        contactStatus.className = 'form-status is-error is-visible';
        contactStatus.setAttribute('role', 'alert');
        contactStatus.textContent = `There ${errorCount === 1 ? 'is 1 error' : `are ${errorCount} errors`} in your form submission. Please review the highlighted fields above.`;
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const nameVal = nameInput ? nameInput.value.trim() : 'Colleague';
      const topicVal = (document.getElementById('contact-topic') || {}).value || 'General enquiry';
      contactStatus.className = 'form-status is-success is-visible';
      contactStatus.setAttribute('role', 'status');
      contactStatus.textContent = `Thank you, ${nameVal}. Your enquiry regarding "${topicVal}" has been received by the KNCV TB Plus team in The Hague. We will respond within 2 business days.`;
      contactForm.reset();
      [nameInput, emailInput, msgInput].forEach(inp => {
        if (inp) inp.removeAttribute('aria-invalid');
      });
      [nameErr, emailErr, msgErr].forEach(err => {
        if (err) err.textContent = '';
      });
    });
  }

  // Reveal on scroll
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Editorial Benefits Section Staggered Reveal (Runs Once on Viewport Entry)
  const benefitsAnimItems = document.querySelectorAll('.benefits-anim');
  if (benefitsAnimItems.length) {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      benefitsAnimItems.forEach(el => el.classList.add('is-visible'));
    } else {
      const benefitsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });
      benefitsAnimItems.forEach(el => benefitsObserver.observe(el));
    }
  }

  // Number Counter Animation (Supports Integer & Decimal Targets like 97.2%)
  function initCounters() {
    const statsCounters = document.querySelectorAll('.stat-number');
    if (!statsCounters.length) return;

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const b = entry.target;
        observer.unobserve(b);

        const rawText = b.textContent.trim();
        const target = b.dataset.target ? parseFloat(b.dataset.target) : parseFloat(rawText.replace(/[^0-9.]/g, ''));
        if (isNaN(target)) return;

        const decimals = b.dataset.decimals !== undefined
          ? parseInt(b.dataset.decimals, 10)
          : ((b.dataset.target && b.dataset.target.includes('.')) ? b.dataset.target.split('.')[1].length : 0);

        const prefix = b.dataset.prefix || '';
        let suffix = b.dataset.suffix;
        if (suffix === undefined) {
          const match = rawText.match(/[^0-9.,\s]+$/);
          suffix = match ? match[0] : '';
        }
        const useComma = b.dataset.format === 'comma' || rawText.includes(',');
        const start = b.dataset.start ? parseFloat(b.dataset.start) : 0;
        const duration = 1400;

        let startTime = null;

        function formatVal(val) {
          if (decimals > 0) {
            return val.toFixed(decimals);
          }
          const intVal = Math.floor(val);
          return useComma ? intVal.toLocaleString('en-US') : String(intVal);
        }

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);

          const ease = 1 - Math.pow(1 - progress, 4);
          const current = start + (target - start) * ease;

          b.textContent = prefix + formatVal(current) + suffix;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            b.textContent = prefix + formatVal(target) + suffix;
            b.classList.add('counted');
          }
        }

        requestAnimationFrame(step);
      });
    }, { threshold: 0.15 });

    statsCounters.forEach(el => counterObserver.observe(el));
  }

  initCounters();
})();
