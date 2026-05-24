(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuToggle = document.getElementById('menuToggle');
  const closeMenu = document.getElementById('closeMenu');

  /* Navbar scroll */
  function onScroll() {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  function openMobileMenu() {
    mobileMenu?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.closeMobileMenu = closeMobileMenu;
  menuToggle?.addEventListener('click', openMobileMenu);
  closeMenu?.addEventListener('click', closeMobileMenu);

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        closeMobileMenu();
        const offset = navbar ? navbar.offsetHeight : 80;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth',
        });
      }
    });
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* Counter animation */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (c) {
      counterObserver.observe(c);
    });
  }

  /* Testimonials slider */
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const dotsContainer = document.getElementById('testimonialDots');

  if (track) {
    const slides = track.querySelectorAll('.testimonial-card');
    let current = 0;
    let autoplayTimer;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      dotsContainer?.querySelectorAll('.testimonials__dot').forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.addEventListener('click', function () {
        goTo(i);
        resetAutoplay();
      });
      dotsContainer?.appendChild(dot);
    });

    prevBtn?.addEventListener('click', function () {
      goTo(current - 1);
      resetAutoplay();
    });

    nextBtn?.addEventListener('click', function () {
      goTo(current + 1);
      resetAutoplay();
    });

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(function () {
        goTo(current + 1);
      }, 5500);
    }

    resetAutoplay();

    /* Touch swipe */
    let touchStartX = 0;
    track.addEventListener(
      'touchstart',
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    track.addEventListener(
      'touchend',
      function (e) {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
          goTo(diff > 0 ? current + 1 : current - 1);
          resetAutoplay();
        }
      },
      { passive: true }
    );
  }

  /* Contact form */
  window.handleForm = function (e) {
    e.preventDefault();
    const form = document.getElementById('quoteForm');
    const success = document.getElementById('formSuccess');
    if (form) form.classList.add('hidden');
    if (success) success.classList.remove('hidden');
  };
})();
