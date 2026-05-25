import { queryAll } from './dom.js';

const DEFAULT_ROUTE = 'home';

const routes = {
  '/': 'home',
  '/register': 'register',
  '/dashboard': 'dashboard',
  '/about': 'about'
};

function getRouteFromPath(pathname) {
  return routes[pathname] || DEFAULT_ROUTE;
}

function setActiveNav(routeName) {
  queryAll('[data-route]').forEach((link) => {
    link.classList.toggle('active', link.dataset.route === routeName);
  });
}

function showRoute(routeName) {
  queryAll('[data-page]').forEach((section) => {
    section.hidden = section.dataset.page !== routeName;
  });

  setActiveNav(routeName);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.dispatchEvent(new CustomEvent('route:changed', { detail: { routeName } }));
}

export function navigateTo(pathname) {
  const routeName = getRouteFromPath(pathname);
  history.pushState({}, '', pathname);
  showRoute(routeName);
}

export function initializeRouter() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-link]');

    if (!link) {
      return;
    }

    const url = new URL(link.href);

    if (url.origin !== window.location.origin) {
      return;
    }

    event.preventDefault();
    navigateTo(url.pathname);
  });

  window.addEventListener('popstate', () => {
    showRoute(getRouteFromPath(window.location.pathname));
  });

  showRoute(getRouteFromPath(window.location.pathname));
}
