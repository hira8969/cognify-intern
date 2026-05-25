const DEFAULT_ROUTE = 'home';

export function createRouter() {
  const views = Array.from(document.querySelectorAll('[data-route-view]'));
  const links = Array.from(document.querySelectorAll('[data-route-link]'));

  const getRoute = () => window.location.hash.replace('#/', '') || DEFAULT_ROUTE;

  const navigate = (route) => {
    window.location.hash = `/${route}`;
  };

  const render = () => {
    const requestedRoute = getRoute();
    const route = views.some((view) => view.dataset.routeView === requestedRoute) ? requestedRoute : DEFAULT_ROUTE;

    views.forEach((view) => {
      view.classList.toggle('is-active', view.dataset.routeView === route);
    });

    links.forEach((link) => {
      link.classList.toggle('active', link.dataset.routeLink === route);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const init = () => {
    if (!window.location.hash) {
      history.replaceState(null, '', '#/home');
    }

    window.addEventListener('hashchange', render);
    render();
  };

  return {
    init,
    navigate
  };
}
