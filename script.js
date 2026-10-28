(() => {
  function initPresentation() {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const dotsHost = document.getElementById('dots');
    const counter = document.getElementById('counter');
    const progress = document.getElementById('progress');
    const sectionLabel = document.getElementById('section-label');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');

    if (!slides.length || !dotsHost || !prev || !next) return;

    let current = Math.max(0, slides.findIndex(s => s.classList.contains('active')));
    if (current < 0) current = 0;

    dotsHost.innerHTML = '';
    slides.forEach((slide, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot-btn';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);
      dot.addEventListener('click', () => showSlide(i));
      dotsHost.appendChild(dot);
    });
    const dots = Array.from(dotsHost.querySelectorAll('button'));

    function showSlide(index) {
      current = Math.max(0, Math.min(slides.length - 1, index));
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === current);
        slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
        if (i === current) dot.setAttribute('aria-current', 'step');
        else dot.removeAttribute('aria-current');
      });
      if (counter) counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      if (progress) progress.style.width = `${((current + 1) / slides.length) * 100}%`;
      if (sectionLabel) sectionLabel.textContent = slides[current].dataset.section || '';
      prev.disabled = current === 0;
      next.disabled = current === slides.length - 1;
      document.title = `${String(current + 1).padStart(2, '0')} — ${slides[current].dataset.section || 'Презентация'}`;
      // Keep the active slide in view on small screens.
      slides[current].scrollTop = 0;
    }

    prev.addEventListener('click', () => showSlide(current - 1));
    next.addEventListener('click', () => showSlide(current + 1));

    document.addEventListener('keydown', event => {
      if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        showSlide(current + 1);
      } else if (['ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        showSlide(current - 1);
      } else if (event.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
        } else {
          document.exitFullscreen?.();
        }
      } else if (event.key === 'Home') {
        showSlide(0);
      } else if (event.key === 'End') {
        showSlide(slides.length - 1);
      }
    });

    let touchStartX = 0;
    document.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    document.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 65) showSlide(current + (delta < 0 ? 1 : -1));
    }, { passive: true });

    showSlide(current);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPresentation, { once: true });
  } else {
    initPresentation();
  }
})();