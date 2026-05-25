export function initAnimations() {
  initRevealAnimations();
  initRippleEffect();
  initTypingEffect();
}

export function refreshRevealAnimations() {
  document.querySelectorAll('.reveal-up:not(.is-visible)').forEach((item) => {
    item.classList.add('is-visible');
  });
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll('.reveal-up');

  if (!('IntersectionObserver' in window)) {
    refreshRevealAnimations();
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
}

function initRippleEffect() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.btn-ripple');
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');

    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);

    window.setTimeout(() => ripple.remove(), 650);
  });
}

function initTypingEffect() {
  const heading = document.querySelector('.hero-copy h1');
  if (!heading) return;

  const originalText = heading.textContent.trim();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return;

  heading.textContent = '';

  [...originalText].forEach((character, index) => {
    window.setTimeout(() => {
      heading.textContent += character;
    }, index * 22);
  });
}
