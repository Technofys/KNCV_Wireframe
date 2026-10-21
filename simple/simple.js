/* Simple wireframe — shared header & footer */
(function () {
  const page = document.body.dataset.page;
  const links = [['home', 'Home'], ['about', 'About'], ['courses', 'Courses'], ['resources', 'Resources'], ['contact', 'Contact']];
  const active = page === 'course-detail' ? 'courses' : page;
  document.body.insertAdjacentHTML('afterbegin', `
  <header><div class="wrap">
    <a href="home.html" class="logo">KNCV LOGO</a>
    <nav>${links.map(l => `<a href="${l[0]}.html" class="${l[0] === active ? 'active' : ''}">${l[1]}</a>`).join('')}</nav>
  </div></header>`);
  document.body.insertAdjacentHTML('beforeend', `
  <footer><div class="wrap">
    <div class="cols">
      <div><div class="logo">KNCV LOGO</div><div class="txt m"></div><div class="txt s"></div></div>
      <div><h3>Learn</h3><div class="txt s"></div><div class="txt s"></div></div>
      <div><h3>Explore</h3><div class="txt s"></div><div class="txt s"></div></div>
      <div><h3>Support</h3><div class="txt s"></div><div class="txt s"></div></div>
    </div>
    <div class="copy">© KNCV Knowledge Exchange · Privacy notice · Social links</div>
  </div></footer>`);
})();
