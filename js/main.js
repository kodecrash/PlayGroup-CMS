/**
 * NURSERY KINDERGARTEN - CORE JAVASCRIPT
 * Interactive navigation, tabs/filters, countdown, modals, and toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initStatsCounter();
  initFilters();
  initCountdown();
  initModals();
  initAccordion();
  initForms();
  initGalleryCarousel();
});

/* --------------------------------------------------------------------------
   1. NAVIGATION & MOBILE MENU
   -------------------------------------------------------------------------- */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const siteHeader = document.querySelector('.site-header');

  // Mobile drawer toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active navigation link highlighting based on current page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Sticky header elevate on scroll
  window.addEventListener('scroll', () => {
    if (siteHeader) {
      if (window.scrollY > 20) {
        siteHeader.style.boxShadow = '0 8px 24px rgba(68, 50, 90, 0.1)';
      } else {
        siteHeader.style.boxShadow = '0 4px 20px rgba(68, 50, 90, 0.05)';
      }
    }
  });
}

/* --------------------------------------------------------------------------
   2. STATS COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        animateValue(el, 0, target, 1800, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => observer.observe(stat));
}

function animateValue(obj, start, end, duration, suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = easeOutQuart(progress);
    obj.innerHTML = Math.floor(easeProgress * (end - start) + start) + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.innerHTML = end + suffix;
    }
  };
  window.requestAnimationFrame(step);
}

function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

/* --------------------------------------------------------------------------
   3. CATEGORY / DEPARTMENT FILTERS
   -------------------------------------------------------------------------- */
function initFilters() {
  const filterTabs = document.querySelectorAll('.filter-tabs');
  filterTabs.forEach(tabContainer => {
    const buttons = tabContainer.querySelectorAll('.filter-btn');
    const targetGrid = document.querySelector(tabContainer.getAttribute('data-target-grid'));
    if (!targetGrid) return;

    const items = targetGrid.querySelectorAll('[data-category]');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        items.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category.includes(filter)) {
            item.style.display = '';
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. EVENT COUNTDOWN TIMER
   -------------------------------------------------------------------------- */
function initCountdown() {
  const countdownEl = document.getElementById('eventCountdown');
  if (!countdownEl) return;

  // Target event date: 14 days in the future
  const targetDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minsEl = document.getElementById('countMins');
  const secsEl = document.getElementById('countSecs');

  function update() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minsEl) minsEl.innerText = '00';
      if (secsEl) secsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minsEl) minsEl.innerText = String(mins).padStart(2, '0');
    if (secsEl) secsEl.innerText = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   5. MODALS (RSVP, TOUR BOOKING, TEACHER BIO)
   -------------------------------------------------------------------------- */
function initModals() {
  // Modal open triggers
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-modal-target');
      const eventTitle = btn.getAttribute('data-event-title');
      const teacherName = btn.getAttribute('data-teacher-name');
      const programName = btn.getAttribute('data-program-name');

      const modal = document.getElementById(targetId);
      if (modal) {
        if (eventTitle) {
          const titleField = modal.querySelector('.modal-event-name');
          if (titleField) titleField.innerText = eventTitle;
        }
        if (teacherName) {
          const nameField = modal.querySelector('.modal-teacher-name');
          if (nameField) nameField.innerText = teacherName;
        }
        if (programName) {
          const progField = modal.querySelector('.modal-program-name');
          if (progField) progField.innerText = programName;
          const select = modal.querySelector('#modalProgramSelect');
          if (select) {
            if (programName.toLowerCase().includes('toddler')) select.value = 'Toddler';
            else if (programName.toLowerCase().includes('playgroup')) select.value = 'PlayGroup';
            else if (programName.toLowerCase().includes('nursery')) select.value = 'Nursery';
          }
        }
        openModal(modal);
      }
    });
  });

  // Modal close triggers
  const closeBtns = document.querySelectorAll('.modal-close, [data-modal-close]');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal);
    });
  });

  // Close on outside click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) closeModal(activeModal);
    }
  });
}

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* --------------------------------------------------------------------------
   6. ACCORDION (FAQ)
   -------------------------------------------------------------------------- */
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const currentItem = header.parentElement;
      const isActive = currentItem.classList.contains('active');

      // Close all accordion items
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        currentItem.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. FORM HANDLING & TOAST ALERTS
   -------------------------------------------------------------------------- */
function initForms() {
  // Generic form submission handler
  const forms = document.querySelectorAll('form[data-ajax-form]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple validation check
      const requiredInputs = form.querySelectorAll('[required]');
      let isValid = true;

      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#eb6d4e';
        } else {
          input.style.borderColor = '';
        }
      });

      if (!isValid) {
        showToast('Please fill in all required fields.', 'info');
        return;
      }

      // Success
      const formType = form.getAttribute('data-form-type') || 'inquiry';
      let message = 'Thank you! Your inquiry has been submitted. We will contact you soon.';

      if (formType === 'rsvp') {
        message = 'Registration Confirmed! We look forward to seeing your family at the event.';
        const modal = form.closest('.modal-overlay');
        if (modal) closeModal(modal);
      } else if (formType === 'newsletter') {
        message = 'Thank you for subscribing to our Kindergarten newsletter!';
      } else if (formType === 'tour') {
        message = 'Campus Tour Requested! Our admissions coordinator will reach out shortly.';
      }

      showToast(message, 'success');
      form.reset();
    });
  });
}

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      ${type === 'success' 
        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>' 
        : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'}
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 50);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

/* --------------------------------------------------------------------------
   8. PHOTO GALLERY CAROUSEL & LIGHTBOX
   -------------------------------------------------------------------------- */
function initGalleryCarousel() {
  const viewport = document.getElementById('galleryCarouselViewport');
  const track = document.getElementById('galleryCarouselTrack');
  const prevBtn = document.getElementById('galleryPrevBtn');
  const nextBtn = document.getElementById('galleryNextBtn');
  const dotsContainer = document.getElementById('galleryDots');
  const cards = document.querySelectorAll('.gallery-card');

  if (!viewport || !cards.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  let isDragging = false;
  let startX = 0;
  let scrollLeftStart = 0;
  let dragMoved = false;

  // 1. Create Pagination Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `gallery-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to photo slide ${idx + 1}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        scrollToIndex(idx);
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = dotsContainer ? dotsContainer.querySelectorAll('.gallery-dot') : [];

  function updateActiveDot(index) {
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
    currentIndex = index;
  }

  function getCardStepWidth() {
    if (!cards.length) return 380;
    const card = cards[0];
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 28;
    return card.offsetWidth + gap;
  }

  function scrollToIndex(index) {
    const stepWidth = getCardStepWidth();
    const maxIndex = cards.length - 1;
    const targetIndex = Math.max(0, Math.min(index, maxIndex));
    
    viewport.scrollTo({
      left: targetIndex * stepWidth,
      behavior: 'smooth'
    });
    updateActiveDot(targetIndex);
  }

  // 2. Next & Prev Button Handlers
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const stepWidth = getCardStepWidth();
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      if (viewport.scrollLeft >= maxScroll - 20) {
        viewport.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        viewport.scrollBy({ left: stepWidth, behavior: 'smooth' });
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const stepWidth = getCardStepWidth();
      if (viewport.scrollLeft <= 20) {
        viewport.scrollTo({ left: viewport.scrollWidth, behavior: 'smooth' });
      } else {
        viewport.scrollBy({ left: -stepWidth, behavior: 'smooth' });
      }
    });
  }

  // 3. Scroll Event to Synchronize Dots
  let scrollTimeout;
  viewport.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const stepWidth = getCardStepWidth();
      const currentScroll = viewport.scrollLeft;
      const index = Math.round(currentScroll / stepWidth);
      if (index >= 0 && index < cards.length) {
        updateActiveDot(index);
      }
    }, 50);
  }, { passive: true });

  // 4. Mouse Drag to Scroll (Desktop)
  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragMoved = false;
    viewport.classList.add('is-dragging');
    startX = e.pageX - viewport.offsetLeft;
    scrollLeftStart = viewport.scrollLeft;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > 6) {
      dragMoved = true;
    }
    viewport.scrollLeft = scrollLeftStart - walk;
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      viewport.classList.remove('is-dragging');
    }
  });

  // 5. Autoplay Rotation with Hover Pause
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      const stepWidth = getCardStepWidth();
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      if (viewport.scrollLeft >= maxScroll - 20) {
        viewport.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        viewport.scrollBy({ left: stepWidth, behavior: 'smooth' });
      }
    }, 4500);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  startAutoplay();

  // Pause on hover / touch
  viewport.addEventListener('mouseenter', stopAutoplay);
  viewport.addEventListener('mouseleave', startAutoplay);
  viewport.addEventListener('touchstart', stopAutoplay, { passive: true });
  viewport.addEventListener('touchend', () => {
    setTimeout(startAutoplay, 3000);
  });

  // 6. Lightbox Modal Integration
  const lightboxModal = document.getElementById('galleryLightboxModal');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxTag = document.getElementById('lightboxTag');
  const lightboxDate = document.getElementById('lightboxDate');
  const lightboxDesc = document.getElementById('lightboxDesc');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (dragMoved) return; // Prevent click if dragging

      const img = card.getAttribute('data-img');
      const title = card.getAttribute('data-title');
      const tag = card.getAttribute('data-tag');
      const date = card.getAttribute('data-date');
      const desc = card.getAttribute('data-desc');

      if (lightboxImage) lightboxImage.src = img;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxTag) lightboxTag.textContent = tag;
      if (lightboxDate) lightboxDate.textContent = `📅 ${date}`;
      if (lightboxDesc) lightboxDesc.textContent = desc;

      if (lightboxModal) {
        openModal(lightboxModal);
      }
    });
  });

  if (lightboxCloseBtn && lightboxModal) {
    lightboxCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal(lightboxModal);
    });
  }
}

