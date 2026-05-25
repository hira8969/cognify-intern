import { query, queryAll } from './dom.js';

let revealObserver;

export function initializeRevealAnimations() {
  if (revealObserver) {
    revealObserver.disconnect();
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  queryAll('.reveal').forEach((element) => revealObserver.observe(element));
}

export function initializeRippleEffects() {
  document.addEventListener('click', (event) => {
    const rippleTarget = event.target.closest('.ripple');

    if (!rippleTarget) {
      return;
    }

    const circle = document.createElement('span');
    const diameter = Math.max(rippleTarget.clientWidth, rippleTarget.clientHeight);
    const radius = diameter / 2;
    const rect = rippleTarget.getBoundingClientRect();

    circle.className = 'ripple-circle';
    circle.style.width = `${diameter}px`;
    circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;

    rippleTarget.append(circle);
    window.setTimeout(() => circle.remove(), 650);
  });
}

export function animateCounters(root = document) {
  queryAll('.counter', root).forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    const duration = 800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = String(Math.round(target * progress));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  });
}

export function initializeTypingAnimation() {
  const heading = query('#typingHeading');

  if (!heading || heading.dataset.hasTyped === 'true') {
    return;
  }

  const text = heading.dataset.text || '';
  let index = 0;
  heading.classList.add('typing-caret');
  heading.dataset.hasTyped = 'true';

  function typeNextCharacter() {
    heading.textContent = text.slice(0, index);
    index += 1;

    if (index <= text.length) {
      window.setTimeout(typeNextCharacter, 42);
    } else {
      window.setTimeout(() => heading.classList.remove('typing-caret'), 900);
    }
  }

  typeNextCharacter();
}
