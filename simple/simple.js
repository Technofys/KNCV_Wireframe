/* Simple wireframe: shared header & footer (KNCV TB Plus Brand Aligned) */
(function () {
  const page = document.body.dataset.page;
  const links = [['home', 'Home'], ['about', 'About'], ['courses', 'Courses'], ['resources', 'Resources'], ['community', 'Community of Practice'], ['contact', 'Contact']];
  const active = page === 'course-detail' ? 'courses' : (['toolkits', 'webinars', 'publications'].includes(page) ? 'resources' : page);
  document.body.insertAdjacentHTML('afterbegin', `
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header><div class="wrap">
    <a href="home.html" class="logo"><img src="../KNCV_TB_PLUS_ZW.png" alt="KNCV TB Plus"><span>Knowledge Exchange</span></a>
    <nav aria-label="Primary">${links.map(l => {
      const isCur = l[0] === active;
      return `<a href="${l[0]}.html" class="${isCur ? 'active' : ''}" ${isCur ? 'aria-current="page"' : ''}>${l[1]}</a>`;
    }).join('')}</nav>
  </div></header>`);
  document.body.insertAdjacentHTML('beforeend', `
  <footer><div class="wrap">
    <div class="cols">
      <div><div class="logo" style="margin-bottom:10px"><img src="../KNCV_TB_PLUS_W.png" alt="KNCV TB Plus"></div><p class="small" style="color:#E0E0DC">KNCV: Together we can end TB.</p></div>
      <div><h3>Learn</h3><div class="txt s"></div><div class="txt s"></div></div>
      <div><h3>Explore</h3><div class="txt s"></div><div class="txt s"></div></div>
      <div><h3>Contact</h3><p class="small" style="color:#E0E0DC">Tel: +31 (0)70 416 7222<br>kncvtbc.org/en<br>info@kncvtbc.org</p></div>
    </div>
    <div class="copy">© KNCV Tuberculosefonds (KNCV TB Plus) · Maanweg 174, 2516 AB Den Haag, The Netherlands · <a href="../home.html" style="text-decoration:underline">Switch to Full Brand View</a></div>
  </div></footer>`);
})();
