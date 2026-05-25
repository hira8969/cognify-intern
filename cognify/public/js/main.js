(function () {
  const navbar = document.querySelector('[data-app-navbar]');
  const sectionLinks = document.querySelectorAll('[data-section-link]');

  const setNavbarState = () => {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);
  };

  const setActiveSection = () => {
    if (!sectionLinks.length || !window.location.pathname.match(/^\/$/)) return;

    const sections = Array.from(sectionLinks)
      .map((link) => document.querySelector(link.getAttribute('href').replace('/', '')))
      .filter(Boolean);

    const current = sections.reduce((active, section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 150 ? section.id : active;
    }, sections[0] ? sections[0].id : '');

    sectionLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `/#${current}`);
    });
  };

  document.querySelectorAll('a[href^="/#"], a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      const hash = href.includes('#') ? href.slice(href.indexOf('#')) : href;
      const target = document.querySelector(hash);

      if (!target || window.location.pathname !== '/') return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const expandedMenu = document.querySelector('.navbar-collapse.show');
      if (expandedMenu && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(expandedMenu).hide();
      }
    });
  });

  document.querySelectorAll('.btn-ripple').forEach((button) => {
    button.addEventListener('click', (event) => {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');

      ripple.className = 'ripple';
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(ripple);

      window.setTimeout(() => ripple.remove(), 650);
    });
  });

  window.addEventListener('scroll', () => {
    setNavbarState();
    setActiveSection();
  }, { passive: true });

  setNavbarState();
  setActiveSection();
}());
