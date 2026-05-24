(function () {
  'use strict';

  var modalEl = document.getElementById('workGalleryModal');
  var carouselEl = document.getElementById('workGalleryCarousel');
  var innerEl = document.getElementById('workCarouselInner');
  var indicatorsEl = document.getElementById('workCarouselIndicators');
  var titleEl = document.getElementById('workGalleryTitle');
  var captionEl = document.getElementById('workGalleryCaption');

  if (!modalEl || !carouselEl || !innerEl || typeof bootstrap === 'undefined') {
    return;
  }

  var items = document.querySelectorAll('.work-masonry__item');
  if (!items.length) {
    return;
  }

  items.forEach(function (item, index) {
    var img = item.querySelector('img');
    var titleNode = item.querySelector('.work-masonry__overlay h3');
    var title = titleNode ? titleNode.textContent.trim() : (img ? img.alt : 'Portfolio');
    var src = img ? img.getAttribute('src') : '';
    var alt = img ? img.getAttribute('alt') : title;

    var slide = document.createElement('div');
    slide.className = 'carousel-item' + (index === 0 ? ' active' : '');
    slide.setAttribute('data-title', title);

    var slideImg = document.createElement('img');
    slideImg.className = 'd-block w-100 work-gallery-modal__img';
    slideImg.src = src;
    slideImg.alt = alt;

    slide.appendChild(slideImg);
    innerEl.appendChild(slide);

    if (indicatorsEl) {
      var indicator = document.createElement('button');
      indicator.type = 'button';
      indicator.setAttribute('data-bs-target', '#workGalleryCarousel');
      indicator.setAttribute('data-bs-slide-to', String(index));
      indicator.setAttribute('aria-label', 'Slide ' + (index + 1));
      if (index === 0) {
        indicator.className = 'active';
        indicator.setAttribute('aria-current', 'true');
      }
      indicatorsEl.appendChild(indicator);
    }

    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', 'View ' + title + ' in gallery');

    function updateCaption(activeIndex, slideTitle) {
      if (titleEl) {
        titleEl.textContent = slideTitle + ' (' + (activeIndex + 1) + ' / ' + items.length + ')';
      }
      if (captionEl) {
        captionEl.textContent = slideTitle;
      }
    }

    function openAtIndex() {
      var carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
        interval: false,
        wrap: true,
        touch: true
      });
      carousel.to(index);
      updateCaption(index, title);
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }

    item.addEventListener('click', openAtIndex);
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openAtIndex();
      }
    });
  });

  carouselEl.addEventListener('slid.bs.carousel', function () {
    var active = innerEl.querySelector('.carousel-item.active');
    if (!active) return;
    var slideTitle = active.getAttribute('data-title') || 'Portfolio';
    var idx = Array.prototype.indexOf.call(innerEl.children, active);
    if (titleEl) {
      titleEl.textContent = slideTitle + ' (' + (idx + 1) + ' / ' + items.length + ')';
    }
    if (captionEl) {
      captionEl.textContent = slideTitle;
    }
  });
})();
