import confetti from 'canvas-confetti';

export const triggerUnwrapConfetti = () => {
  // Multi-angle explosion of royal blue, powder blue, white, and soft pastel colors
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Sparkling blue stars & circles
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#2563EB', '#60A5FA', '#9ACEE5', '#FFFFFF', '#FFCCD8'],
    shapes: ['star', 'circle'],
    scalar: 1.2,
  });

  fire(0.2, {
    spread: 60,
    colors: ['#9ACEE5', '#68B3D6', '#E1EFF7', '#3B82F6', '#FF99B3'],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#2563EB', '#4299C2', '#C2ECCB', '#FFE5EC'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#1D2E49', '#F0F7FB', '#FFCCD8'],
    shapes: ['circle'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#60A5FA', '#9ACEE5'],
  });
};

export const triggerCelebrationSideCannons = () => {
  const end = Date.now() + 1.8 * 1000;
  const colors = ['#2563EB', '#60A5FA', '#9ACEE5', '#FFCCD8', '#C2ECCB'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.75 },
      colors: colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.75 },
      colors: colors,
      zIndex: 9999,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

export const triggerHeartConfetti = (originX = 0.5, originY = 0.5) => {
  confetti({
    particleCount: 35,
    spread: 60,
    origin: { x: originX, y: originY },
    colors: ['#FF6B8B', '#FF8E9E', '#60A5FA', '#93C5FD', '#FFFFFF'],
    shapes: ['circle', 'star'],
    scalar: 1,
    zIndex: 9999,
  });
};
