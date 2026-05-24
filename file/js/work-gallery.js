(function () {
  'use strict';

  var lightbox = document.getElementById('workLightbox');
  var imgEl = document.getElementById('workLightboxImg');
  var titleEl = document.getElementById('workLightboxTitle');
  var counterEl = document.getElementById('workLightboxCounter');
  var closeBtn = document.getElementById('workLightboxClose');
  var prevBtn = document.getElementById('workLightboxPrev');
  var nextBtn = document.getElementById('workLightboxNext');

  if (!lightbox || !imgEl) {
    return;
  }

  var slides = [];
  var currentIndex = 0;
  var isOpen = false;
  var touchStartX = 0;

  document.querySelectorAll('.work-masonry__item').forEach(function (item) {
    var img = item.querySelector('img');
    var titleNode = item.querySelector('.work-masonry__overlay h3');
    if (!img) return;

    slides.push({
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || '',
      title: titleNode ? titleNode.textContent.trim() : img.getAttribute('alt') || 'Portfolio'
    });
  });

  if (!slides.length) {
    return;
  }

  function renderSlide() {
    var slide = slides[currentIndex];
    imgEl.src = slide.src;
    imgEl.alt = slide.alt;
    if (titleEl) {
      titleEl.textContent = slide.title;
    }
    if (counterEl) {
      counterEl.textContent = (currentIndex + 1) + ' / ' + slides.length;
    }
  }

  function openLightbox(index) {
    currentIndex = index;
    renderSlide();
    var opening = lightbox.hidden || !lightbox.classList.contains('is-open');
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () {
      lightbox.classList.add('is-open');
    });
    document.body.classList.add('work-lightbox-open');
    if (opening && !isOpen) {
      history.pushState({ workLightbox: true }, '');
      isOpen = true;
    }
  }

  function closeLightbox(fromPopstate) {
    var wasOpen = isOpen;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('work-lightbox-open');
    window.setTimeout(function () {
      if (!lightbox.classList.contains('is-open')) {
        lightbox.hidden = true;
        imgEl.removeAttribute('src');
      }
    }, 260);
    isOpen = false;
    if (wasOpen && !fromPopstate) {
      history.back();
    }
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    renderSlide();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % slides.length;
    renderSlide();
  }

  document.querySelectorAll('.work-masonry__item').forEach(function (item, index) {
    var title = slides[index] ? slides[index].title : 'Portfolio';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', 'View ' + title + ' fullscreen');

    item.addEventListener('click', function () {
      openLightbox(index);
    });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeBtn.addEventListener('click', function () {
    closeLightbox(false);
  });

  prevBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    showPrev();
  });

  nextBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    showNext();
  });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      closeLightbox(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      closeLightbox(false);
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    } else if (e.key === 'ArrowRight') {
      showNext();
    }
  });

  window.addEventListener('popstate', function () {
    if (lightbox.classList.contains('is-open') || !lightbox.hidden) {
      closeLightbox(true);
    }
  });

  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    var diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) < 50) return;
    if (diff > 0) {
      showPrev();
    } else {
      showNext();
    }
  }, { passive: true });
})();
