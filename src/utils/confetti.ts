import confetti from 'canvas-confetti';

export const triggerUnwrapConfetti = () => {
  // Multi-angle explosion of gold, powder blue, and soft pastel colors
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

  // Golden stars & circles
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#F5D061', '#E5A62E', '#9ACEE5', '#FFFFFF', '#FFCCD8'],
    shapes: ['star', 'circle'],
    scalar: 1.2,
  });

  fire(0.2, {
    spread: 60,
    colors: ['#9ACEE5', '#68B3D6', '#FAF3E0', '#FDD585', '#FF99B3'],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#FBC052', '#4299C2', '#C2ECCB', '#FFE5EC'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#E5A62E', '#F0F7FB', '#FFCCD8'],
    shapes: ['circle'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#F5D061', '#9ACEE5'],
  });
};

export const triggerCelebrationSideCannons = () => {
  const end = Date.now() + 1.8 * 1000;
  const colors = ['#F5D061', '#9ACEE5', '#FFCCD8', '#C2ECCB', '#E5A62E'];

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
    colors: ['#FF6B8B', '#FF8E9E', '#FFB3C6', '#F5D061'],
    shapes: ['circle', 'star'],
    scalar: 1,
    zIndex: 9999,
  });
};
