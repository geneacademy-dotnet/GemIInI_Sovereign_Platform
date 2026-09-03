/**
 * ============================================================================
 * GENEACADEMY LIGHTWEIGHT MEDICAL NETWORK PARTICLE SYSTEM (Canvas 60fps)
 * ============================================================================
 */
(function () {
  'use strict';

  // Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId = null;
    let isVisible = true;

    const PARTICLE_COUNT = window.innerWidth < 768 ? 22 : 45;
    const MAX_DISTANCE = 120;
    const COLOR_NODE = 'rgba(2, 132, 199, 0.45)'; // Clinical Blue
    const COLOR_LINE = 'rgba(2, 132, 199, 0.12)';
    const COLOR_GOLD = 'rgba(212, 175, 55, 0.40)'; // Archival Gold accent

    function resize() {
      const parent = canvas.parentElement || document.body;
      width = parent.clientWidth || window.innerWidth;
      height = parent.clientHeight || 450;
      
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 2 + 1;
        this.isGold = Math.random() > 0.85;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isGold ? COLOR_GOLD : COLOR_NODE;
        ctx.fill();
      }
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    function render() {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DISTANCE) {
            const alpha = (1 - dist / MAX_DISTANCE) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(2, 132, 199, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    // Visibility Observer to save battery/CPU when scrolled away
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            cancelAnimationFrame(animationFrameId);
            render();
          }
        });
      }, { threshold: 0.05 });

      observer.observe(canvas);
    }

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
      if (isVisible) {
        cancelAnimationFrame(animationFrameId);
        render();
      }
    });

    resize();
    createParticles();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticleCanvas);
  } else {
    initParticleCanvas();
  }
})();
