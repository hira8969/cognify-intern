const sceneCanvas = document.getElementById('studentScene');
const tiltCard = document.querySelector('[data-tilt-card]');

function initTiltCard() {
  if (!tiltCard) return;

  const depthItems = tiltCard.querySelectorAll('[data-depth]');

  depthItems.forEach((item) => {
    item.style.setProperty('--z-depth', `${item.dataset.depth}px`);
  });

  tiltCard.addEventListener('pointermove', (event) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    tiltCard.style.transform = `rotateX(${y * -7}deg) rotateY(${x * 8}deg)`;
  });

  tiltCard.addEventListener('pointerleave', () => {
    tiltCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

function initStudentScene() {
  if (!sceneCanvas) return;

  const context = sceneCanvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer = { x: 0, y: 0 };
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const nodes = Array.from({ length: 34 }, (_, index) => {
    const angle = (index / 34) * Math.PI * 2;
    const band = index % 3;
    const radius = 145 + band * 48;

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle * 1.7) * 72 + (band - 1) * 38,
      z: Math.sin(angle) * radius,
      size: 4 + (index % 5),
      color: index % 4 === 0 ? '#7dd3fc' : index % 4 === 1 ? '#5eead4' : index % 4 === 2 ? '#a78bfa' : '#fbbf24'
    };
  });

  function resize() {
    const rect = sceneCanvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    width = rect.width;
    height = rect.height;
    sceneCanvas.width = Math.round(width * ratio);
    sceneCanvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function rotatePoint(point, time) {
    const rotationY = time * 0.00022 + pointer.x * 0.45;
    const rotationX = 0.45 + pointer.y * 0.25;
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const x = point.x * cosY - point.z * sinY;
    const z = point.x * sinY + point.z * cosY;
    const y = point.y * cosX - z * sinX;
    const depth = point.y * sinX + z * cosX;
    const scale = 520 / (520 + depth);

    return {
      x: width / 2 + x * scale,
      y: height / 2 + y * scale - 10,
      z: depth,
      scale
    };
  }

  function drawCore(time) {
    const pulse = Math.sin(time * 0.003) * 8;
    const gradient = context.createRadialGradient(width / 2, height / 2, 16, width / 2, height / 2, 150 + pulse);

    gradient.addColorStop(0, 'rgba(125, 211, 252, 0.92)');
    gradient.addColorStop(0.42, 'rgba(37, 99, 235, 0.36)');
    gradient.addColorStop(1, 'rgba(20, 184, 166, 0)');

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(width / 2, height / 2 - 8, 150 + pulse, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = 'rgba(255,255,255,0.22)';
    context.lineWidth = 1;
    for (let ring = 0; ring < 3; ring += 1) {
      context.beginPath();
      context.ellipse(width / 2, height / 2 - 8, 92 + ring * 52, 28 + ring * 15, time * 0.00045 + ring, 0, Math.PI * 2);
      context.stroke();
    }
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);
    drawCore(time);

    const projected = nodes.map((node) => ({ ...node, projected: rotatePoint(node, time) }));

    projected.forEach((node, index) => {
      for (let next = index + 1; next < projected.length; next += 1) {
        if ((next + index) % 5 !== 0) continue;

        const a = node.projected;
        const b = projected[next].projected;
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance > 210) continue;

        context.strokeStyle = `rgba(125, 211, 252, ${Math.max(0.04, 0.2 - distance / 1000)})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }
    });

    projected
      .sort((a, b) => b.projected.z - a.projected.z)
      .forEach((node) => {
        const { x, y, scale } = node.projected;
        const radius = node.size * scale;

        context.shadowColor = node.color;
        context.shadowBlur = 16;
        context.fillStyle = node.color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      });

    if (!prefersReducedMotion) {
      animationFrame = requestAnimationFrame(draw);
    }
  }

  sceneCanvas.addEventListener('pointermove', (event) => {
    const rect = sceneCanvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
    pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
  });

  window.addEventListener('resize', resize);
  resize();
  animationFrame = requestAnimationFrame(draw);

  window.addEventListener('beforeunload', () => cancelAnimationFrame(animationFrame));
}

initTiltCard();
initStudentScene();
