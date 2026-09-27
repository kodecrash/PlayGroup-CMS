/**
 * STAR KIDS - CMS DYNAMIC CONTENT LOADER
 * Synchronizes Decap CMS content files with live website DOM across all pages:
 * - Home (index.html) -> content/pages/home.json
 * - About (about.html) -> content/pages/about.json
 * - Programmes (programs.html) -> content/pages/programs.json
 * - Classes (classes.html) -> content/pages/classes.json
 * - Events (events.html) -> content/pages/events.json
 * - Teachers (teachers.html) -> content/pages/teachers.json
 * - Contact (contact.html) -> content/pages/contact.json
 */

const StarKidsContent = {
  events: [],
  programs: [],
  classes: [],
  teachers: [],
  testimonials: [],
  siteSettings: null,
  currentPageData: null,

  async init() {
    try {
      await Promise.allSettled([
        this.loadSiteSettings(),
        this.loadEvents(),
        this.loadPrograms(),
        this.loadTeachers(),
        this.loadTestimonials()
      ]);

      this.applyGlobalSettings();
      await this.loadAndRenderCurrentPage();
    } catch (err) {
      console.warn('CMS content loader fallback:', err);
    }
  },

  async loadSiteSettings() {
    try {
      const res = await fetch('content/settings/site.json');
      if (res.ok) {
        this.siteSettings = await res.json();
      }
    } catch (e) {}
  },

  async loadEvents() {
    const eventFiles = [
      'annual-spring-carnival-2026.json',
      'junior-olympics-sports-day.json',
      'little-explorers-science-fair.json',
      'parent-toddler-sensory-workshop.json'
    ];
    this.events = await this.fetchJsonList('content/events/', eventFiles);
  },

  async loadPrograms() {
    const programFiles = [
      'toddler-explorers.json',
      'playgroup-sunshine.json',
      'nursery-innovators.json',
      'kindergarten-prep.json'
    ];
    this.programs = await this.fetchJsonList('content/programs/', programFiles);
    this.programs.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  async loadTeachers() {
    const teacherFiles = [
      'sarah-jenkins.json',
      'david-chen.json',
      'clara-higgins.json',
      'eleanor-vance.json'
    ];
    this.teachers = await this.fetchJsonList('content/teachers/', teacherFiles);
    this.teachers.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  async loadTestimonials() {
    const files = [
      'priya-sharma.json',
      'marcus-reynolds.json',
      'emily-chen.json'
    ];
    this.testimonials = await this.fetchJsonList('content/testimonials/', files);
    this.testimonials.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  async fetchJsonList(folder, fileNames) {
    const results = [];
    for (const file of fileNames) {
      try {
        const res = await fetch(folder + file);
        if (res.ok) {
          const data = await res.json();
          results.push(data);
        }
      } catch (e) {}
    }
    return results;
  },

  applyGlobalSettings() {
    if (!this.siteSettings) return;
    const settings = this.siteSettings;
    const topBar = settings.topBar || settings;
    const header = settings.header || {};
    const footer = settings.footer || {};

    // 1. TOP BAR PHONE
    const phoneVal = topBar.phone || settings.phone;
    if (phoneVal) {
      document.querySelectorAll('.top-info-item:nth-child(1) span, .contact-phone-text, [data-cms="phone"]').forEach(el => {
        el.textContent = phoneVal;
      });
      document.querySelectorAll('a[href^="tel:"]').forEach(el => {
        el.setAttribute('href', `tel:${phoneVal.replace(/\s+/g, '')}`);
      });
    }

    // 2. TOP BAR EMAIL
    const emailVal = topBar.email || settings.email;
    if (emailVal) {
      document.querySelectorAll('.top-info-item:nth-child(2) span, .contact-email-text, [data-cms="email"]').forEach(el => {
        el.textContent = emailVal;
      });
      document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
        el.setAttribute('href', `mailto:${emailVal}`);
      });
    }

    // 3. TOP BAR WORKING HOURS
    const hoursVal = topBar.workingHours || settings.workingHours;
    if (hoursVal) {
      document.querySelectorAll('.top-info-item:nth-child(3) span, [data-cms="hours"]').forEach(el => {
        el.textContent = hoursVal;
      });
    }

    // 4. SOCIAL MEDIA ICONS (TOP BAR & FOOTER)
    const fbUrl = topBar.facebookUrl || settings.facebookUrl;
    if (fbUrl) {
      document.querySelectorAll('a[aria-label*="Facebook" i], a[href="#social-fb"], a[href="#fb"]').forEach(el => {
        el.setAttribute('href', fbUrl);
      });
    }
    const igUrl = topBar.instagramUrl || settings.instagramUrl;
    if (igUrl) {
      document.querySelectorAll('a[aria-label*="Instagram" i], a[href="#social-ig"], a[href="#ig"]').forEach(el => {
        el.setAttribute('href', igUrl);
      });
    }
    const ytUrl = topBar.youtubeUrl || settings.youtubeUrl;
    if (ytUrl) {
      document.querySelectorAll('a[aria-label*="YouTube" i], a[href="#social-yt"], a[href="#yt"]').forEach(el => {
        el.setAttribute('href', ytUrl);
      });
    }

    // 5. BRAND LOGO PREFIX & SUFFIX (Header & Footer)
    if (header.logoPrefix || header.logoSuffix) {
      document.querySelectorAll('.brand-logo').forEach(logoEl => {
        const prefixEl = logoEl.querySelector('.brand-nursery');
        const suffixEl = logoEl.querySelector('.brand-kindergarten');
        if (prefixEl && header.logoPrefix) prefixEl.textContent = header.logoPrefix;
        if (suffixEl && header.logoSuffix) suffixEl.textContent = header.logoSuffix;
      });
    }

    // 6. HEADER CTA BUTTON
    const ctaText = header.ctaText || (settings.ctaButton && settings.ctaButton.text);
    const ctaLink = header.ctaLink || (settings.ctaButton && settings.ctaButton.link);
    const headerCta = document.getElementById('headerCtaBtn') || document.querySelector('.header-cta .btn');
    if (headerCta) {
      if (ctaText) headerCta.textContent = ctaText;
      if (ctaLink) headerCta.setAttribute('href', ctaLink);
    }

    // 7. HEADER NAVIGATION MENU LINKS
    if (header.navLinks && Array.isArray(header.navLinks) && header.navLinks.length > 0) {
      const navMenu = document.getElementById('navMenu');
      if (navMenu) {
        const currentPath = window.location.pathname.toLowerCase();
        navMenu.innerHTML = header.navLinks.map(item => {
          const itemUrl = (item.url || '').toLowerCase();
          const isActive = currentPath.endsWith(itemUrl) || 
            (itemUrl === 'index.html' && (currentPath.endsWith('/') || currentPath === '' || currentPath.endsWith('/index.html')));
          return `<a href="${item.url}" class="nav-link ${isActive ? 'active' : ''}">${item.label}</a>`;
        }).join('\n');
      }
    }

    // 8. FOOTER ABOUT TEXT
    if (footer.aboutText) {
      const footerAboutP = document.querySelector('.footer-about p');
      if (footerAboutP) footerAboutP.textContent = footer.aboutText;
    }

    // 9. FOOTER NAVIGATION COLUMN (COL 2)
    if (footer.col2Title) {
      const col2Heading = document.querySelector('.footer-col:nth-child(2) h4');
      if (col2Heading) col2Heading.textContent = footer.col2Title;
    }
    if (footer.col2Links && Array.isArray(footer.col2Links) && footer.col2Links.length > 0) {
      const col2Container = document.querySelector('.footer-col:nth-child(2) .footer-links');
      if (col2Container) {
        col2Container.innerHTML = footer.col2Links.map(l => `<a href="${l.url}">${l.label}</a>`).join('\n');
      }
    }

    // 10. FOOTER PROGRAMMES COLUMN (COL 3)
    if (footer.col3Title) {
      const col3Heading = document.querySelector('.footer-col:nth-child(3) h4');
      if (col3Heading) col3Heading.textContent = footer.col3Title;
    }
    if (footer.col3Links && Array.isArray(footer.col3Links) && footer.col3Links.length > 0) {
      const col3Container = document.querySelector('.footer-col:nth-child(3) .footer-links');
      if (col3Container) {
        col3Container.innerHTML = footer.col3Links.map(l => `<a href="${l.url}">${l.label}</a>`).join('\n');
      }
    }

    // 11. FOOTER NEWSLETTER / CONNECT COLUMN (COL 4)
    if (footer.col4Title) {
      const col4Heading = document.querySelector('.footer-col:nth-child(4) h4');
      if (col4Heading) col4Heading.textContent = footer.col4Title;
    }
    if (footer.col4Text) {
      const col4P = document.querySelector('.footer-col:nth-child(4) p');
      if (col4P) col4P.textContent = footer.col4Text;
    }

    // 12. FOOTER COPYRIGHT & SUB-CREDIT
    if (footer.copyright) {
      const copyEl = document.querySelector('.footer-bottom div:first-child');
      if (copyEl) copyEl.innerHTML = footer.copyright;
    }
    if (footer.subCredit) {
      const creditEl = document.querySelector('.footer-bottom div:last-child');
      if (creditEl) creditEl.innerHTML = footer.subCredit;
    }
  },

  getPageName() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('about')) return 'about';
    if (path.includes('program')) return 'programs';
    if (path.includes('class')) return 'classes';
    if (path.includes('event')) return 'events';
    if (path.includes('teacher')) return 'teachers';
    if (path.includes('contact')) return 'contact';
    return 'home';
  },

  async loadAndRenderCurrentPage() {
    const pageKey = this.getPageName();

    try {
      const res = await fetch(`content/pages/${pageKey}.json`);
      if (res.ok) {
        this.currentPageData = await res.json();
      }
    } catch (e) {}

    const pageData = this.currentPageData;
    if (pageData) {
      // 1. Update Title & Meta
      if (pageData.pageTitle) {
        document.title = pageData.pageTitle;
      }
      if (pageData.metaDescription) {
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', pageData.metaDescription);
      }

      // 2. Update Hero Banner
      if (pageData.hero) {
        const heroTitle = document.querySelector('.hero-title, .page-hero-title, #heroTitle');
        if (heroTitle && pageData.hero.title) heroTitle.textContent = pageData.hero.title;
        if (heroTitle && pageData.hero.headline) heroTitle.textContent = pageData.hero.headline;

        const heroSub = document.querySelector('.hero-description, .page-hero-subtitle, #heroSubtitle');
        if (heroSub && pageData.hero.subtitle) heroSub.textContent = pageData.hero.subtitle;

        const heroBadge = document.querySelector('.hero-badge, .page-hero .section-badge, #heroBadge');
        if (heroBadge && pageData.hero.badge) heroBadge.textContent = pageData.hero.badge;

        // Primary Hero Button (e.g. Learn More / Explore Programmes)
        const primaryBtn = document.getElementById('heroLearnMoreBtn') || document.querySelector('.hero-actions a:first-child');
        if (primaryBtn) {
          if (pageData.hero.primaryBtnText) primaryBtn.textContent = pageData.hero.primaryBtnText;
          if (pageData.hero.primaryBtnLink) primaryBtn.setAttribute('href', pageData.hero.primaryBtnLink);
        }

        // Secondary Hero Button (e.g. Schedule a Tour)
        const secondaryBtn = document.getElementById('heroTourBtn') || document.querySelector('.hero-actions a:nth-child(2)');
        if (secondaryBtn) {
          if (pageData.hero.secondaryBtnText) secondaryBtn.textContent = pageData.hero.secondaryBtnText;
          if (pageData.hero.secondaryBtnLink) secondaryBtn.setAttribute('href', pageData.hero.secondaryBtnLink);
        }
      }
    }

    // 3. Render Page-specific dynamic lists & components
    if (pageKey === 'home' && pageData && pageData.sections) {
      const progSec = pageData.sections.find(s => s.type === 'programs_showcase');
      if (progSec) {
        const btn = document.getElementById('programsViewAllBtn');
        if (btn) {
          if (progSec.buttonText) btn.textContent = progSec.buttonText;
          if (progSec.buttonLink) btn.setAttribute('href', progSec.buttonLink);
        }
      }
    }
    if (pageKey === 'programs' || document.getElementById('programsList')) {
      this.renderProgramsPage();
    }
    if (pageKey === 'events' || document.getElementById('eventsGrid')) {
      this.renderEventsPage();
    }
    if (pageKey === 'teachers' || document.getElementById('teachersGrid')) {
      this.renderTeachersPage();
    }

    // 4. If dynamic components container exists, render modular sections
    const compContainer = document.getElementById('pageDynamicComponents') || document.getElementById('dynamicPageContent');
    if (compContainer && pageData && pageData.sections) {
      compContainer.innerHTML = pageData.sections.map((sec, idx) => this.renderSectionBlock(sec, idx)).join('');
      this.initFaqAccordions();
    }

    // Re-initialize modal triggers
    if (typeof initModals === 'function') {
      initModals();
    }
  },

  renderProgramsPage() {
    const pageData = this.currentPageData;

    // Overview highlights
    if (pageData && pageData.overview) {
      const ov = pageData.overview;
      const ovBadge = document.querySelector('.section-badge.teal');
      if (ovBadge && ov.badge) ovBadge.textContent = ov.badge;

      const ovTitle = document.querySelector('.section-header .section-title');
      if (ovTitle && ov.title) ovTitle.textContent = ov.title;

      const ovSub = document.querySelector('.section-header .section-subtitle');
      if (ovSub && ov.subtitle) ovSub.textContent = ov.subtitle;
    }

    // Core Programs List (#programsList)
    const progList = document.querySelector('#programsList .container');
    if (!progList || !this.programs.length) return;

    progList.innerHTML = this.programs.map((p, index) => {
      const isEven = index % 2 === 1;
      const color = p.badgeColor || (index === 0 ? 'green' : (index === 1 ? 'coral' : 'purple'));
      const stageBadge = p.stageBadge || `Stage ${index + 1}: Foundational Learning`;

      const highlightsHtml = (p.highlights || []).map(h => {
        const cat = typeof h === 'string' ? h : (h.category || '');
        const det = typeof h === 'string' ? '' : (h.details || '');
        return `
          <div class="feature-item">
            <span class="feature-check" style="background: var(--${color}-light, #f0fdf4); color: var(--${color}-card, var(--${color}-main));">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span>
            <span><strong>${cat}${det ? ':' : ''}</strong> ${det}</span>
          </div>
        `;
      }).join('');

      return `
        <div class="about-grid" style="margin-bottom: 4.5rem; align-items: center;">
          <div class="about-visual" style="${isEven ? 'order: 2;' : ''}">
            <div class="about-image-wrap" style="position: relative; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-lg);">
              <img src="${p.featuredImage || 'assets/images/program-toddler.jpg'}" alt="${p.title}" loading="lazy">
              <div style="position: absolute; bottom: 1.5rem; left: 1.5rem; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); padding: 0.75rem 1.5rem; border-radius: var(--radius-pill); font-weight: 700; color: #44325a; box-shadow: var(--shadow-md); display: flex; align-items: center; gap: 0.5rem;">
                <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: var(--${color}-card, var(--${color}-main, #48bb78));"></span>
                <span>${p.classSize || '1:5 Ratio'}</span>
              </div>
            </div>
          </div>

          <div class="about-content" style="${isEven ? 'order: 1;' : ''}">
            <span class="section-badge ${color}">${stageBadge}</span>
            <h2 style="font-size: clamp(1.8rem, 3.5vw, 2.4rem); margin-top: 0.5rem; margin-bottom: 0.75rem; color: var(--purple-dark);">
              ${p.title}
            </h2>
            <div style="display: inline-block; background: var(--${color}-light, #f0fdf4); color: var(--${color}-hover, var(--${color}-main)); font-weight: 800; padding: 0.35rem 1rem; border-radius: var(--radius-pill); margin-bottom: 1.25rem; font-size: 1rem;">
              ${p.icon || '👶'} Age Range: ${p.ageRange || 'All Ages'}
            </div>
            <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.5rem;">
              ${p.summary || ''}
            </p>

            <div class="about-features" style="margin-bottom: 2rem;">
              ${highlightsHtml}
            </div>

            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <button class="btn btn-coral" data-modal-target="programInquiryModal" data-program-name="${p.title} (${p.ageRange})">
                Enroll in ${p.title}
              </button>
              <a href="contact.html" class="btn btn-outline-purple">Book Campus Tour</a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderEventsPage() {
    const grid = document.getElementById('eventsGrid');
    if (!grid || !this.events.length) return;

    grid.innerHTML = this.events.map(ev => {
      let day = '24';
      let month = 'Oct';
      if (ev.isoDate) {
        try {
          const d = new Date(ev.isoDate);
          day = d.getDate();
          month = d.toLocaleString('default', { month: 'short' });
        } catch (e) {}
      } else if (ev.date) {
        const parts = ev.date.split(' ');
        if (parts.length >= 3) {
          month = parts[1];
          day = parts[2].replace(',', '');
        }
      }

      const categorySlug = (ev.category || 'celebration').toLowerCase().replace(/[^a-z]/g, '');
      const badgeColor = ev.category === 'Sports' ? 'var(--green-card, #48bb78)' : (ev.category === 'Community' ? 'var(--coral-brand, #ff6b6b)' : 'var(--purple-brand, #6b46c1)');

      return `
        <div class="event-card" data-category="${categorySlug}">
          <div class="event-header">
            <div class="event-date-badge" style="background: ${badgeColor};">
              <div class="event-date-day">${day}</div>
              <div class="event-date-month">${month}</div>
            </div>
            <div>
              <h3 class="event-title">${ev.title}</h3>
              <div class="event-details">
                <div class="event-detail-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>${ev.time || '9:00 AM - 1:00 PM'}</span>
                </div>
                <div class="event-detail-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>${ev.venue || 'Main Campus'}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="event-body">
            <p>${ev.summary || ''}</p>
            <button class="btn btn-outline-purple" style="font-size: 0.9rem;" data-modal-target="rsvpModal"
              data-event-title="${ev.title}">
              RSVP Online
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  renderTeachersPage() {
    const grid = document.getElementById('teachersGrid');
    if (!grid || !this.teachers.length) return;

    grid.innerHTML = this.teachers.map(t => {
      const dept = t.department || 'preschool';
      return `
        <div class="teacher-card" data-category="${dept}">
          <div class="teacher-image-wrap">
            <img src="${t.photo || 'assets/images/teacher-sarah.jpg'}" alt="${t.name} - ${t.role}" loading="lazy">
          </div>
          <div class="teacher-body">
            <h3 class="teacher-name">${t.name}</h3>
            <div class="teacher-role">${t.role}</div>
            <p class="teacher-bio">${t.bio || t.quote || ''}</p>
            <div class="teacher-social">
              <button class="btn btn-outline-purple" style="font-size: 0.85rem; padding: 0.4rem 1rem;" data-modal-target="teacherBioModal" data-teacher-name="${t.name}">View Profile</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderSectionBlock(sec, idx) {
    const isEven = idx % 2 === 1;

    switch (sec.type) {
      case 'text_section':
        return `
          <section class="page-section" style="padding: 4.5rem 0; ${isEven ? 'background: var(--bg-page);' : ''}">
            <div class="container">
              <div class="about-grid" style="align-items: center; gap: 3.5rem;">
                <div class="about-visual" style="${sec.imagePosition === 'left' ? 'order: 1;' : 'order: 2;'}">
                  ${sec.image ? `
                    <div style="border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-lg);">
                      <img src="${sec.image}" alt="${sec.title}" style="width: 100%; height: auto; display: block; object-fit: cover;" loading="lazy">
                    </div>
                  ` : ''}
                </div>
                <div class="about-content" style="${sec.imagePosition === 'left' ? 'order: 2;' : 'order: 1;'}">
                  ${sec.badge ? `<span class="section-badge coral">${sec.badge}</span>` : ''}
                  <h2 style="font-size: clamp(1.8rem, 3vw, 2.3rem); color: var(--purple-dark); margin: 0.5rem 0 1rem;">${sec.title}</h2>
                  ${sec.subtitle ? `<p style="font-size: 1.1rem; font-weight: 600; color: var(--coral-main); margin-bottom: 1.25rem;">${sec.subtitle}</p>` : ''}
                  <div class="markdown-body" style="color: var(--text-muted); line-height: 1.75; font-size: 1.05rem;">
                    ${this.parseMarkdown(sec.content)}
                  </div>
                  ${sec.buttonText ? `
                    <div style="margin-top: 2rem;">
                      <a href="${sec.buttonLink || 'contact.html'}" class="btn btn-coral">${sec.buttonText}</a>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          </section>
        `;

      case 'feature_grid':
        const cards = (sec.cards || []).map(card => {
          const color = card.color || 'coral';
          return `
            <div class="service-card ${color}" style="padding: 2rem; border-radius: var(--radius-lg); color: #ffffff;">
              <div class="service-icon" style="background: rgba(255,255,255,0.25); color: #ffffff; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; font-size: 1.75rem;">
                ${card.icon || '🌟'}
              </div>
              <h3 style="color: #ffffff; margin-bottom: 0.5rem; font-size: 1.3rem;">${card.title}</h3>
              <p style="color: rgba(255,255,255,0.92); font-size: 0.95rem; line-height: 1.6;">${card.description}</p>
            </div>
          `;
        }).join('');

        return `
          <section class="page-section" style="padding: 5rem 0; ${isEven ? 'background: var(--bg-page);' : ''}">
            <div class="container">
              <div class="section-header" style="text-align: center; max-width: 680px; margin: 0 auto 3.5rem;">
                ${sec.badge ? `<span class="section-badge teal">${sec.badge}</span>` : ''}
                <h2 class="section-title" style="font-size: clamp(2rem, 3.5vw, 2.5rem); margin-top: 0.5rem; color: var(--purple-dark);">${sec.title}</h2>
                ${sec.subtitle ? `<p class="section-subtitle" style="color: var(--text-muted); font-size: 1.05rem; margin-top: 0.75rem;">${sec.subtitle}</p>` : ''}
              </div>
              <div class="services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                ${cards}
              </div>
            </div>
          </section>
        `;

      case 'facilities_section':
        const facs = (sec.facilities || []).map(f => `
          <div class="service-card purple" style="padding: 2rem; border-radius: var(--radius-lg); color: #ffffff;">
            <div style="font-size: 2.2rem; margin-bottom: 1rem;">${f.icon || '🌿'}</div>
            <h3 style="color: #ffffff; margin-bottom: 0.5rem; font-size: 1.25rem;">${f.title}</h3>
            <p style="color: rgba(255,255,255,0.92); font-size: 0.95rem; line-height: 1.6;">${f.description}</p>
          </div>
        `).join('');

        return `
          <section class="page-section" style="padding: 5rem 0; ${isEven ? 'background: var(--bg-page);' : ''}">
            <div class="container">
              <div class="section-header" style="text-align: center; max-width: 680px; margin: 0 auto 3.5rem;">
                ${sec.badge ? `<span class="section-badge green">${sec.badge}</span>` : ''}
                <h2 class="section-title" style="font-size: clamp(2rem, 3.5vw, 2.5rem); color: var(--purple-dark);">${sec.title}</h2>
                ${sec.subtitle ? `<p class="section-subtitle" style="color: var(--text-muted);">${sec.subtitle}</p>` : ''}
              </div>
              <div class="services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem;">
                ${facs}
              </div>
            </div>
          </section>
        `;

      case 'stats_section':
        const statsHtml = (sec.stats || []).map(s => `
          <div style="text-align: center; padding: 2rem 1.5rem; background: #ffffff; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border-light);">
            <div style="font-size: 2.8rem; font-weight: 800; color: var(--coral-main); margin-bottom: 0.5rem;">
              ${s.number}${s.suffix || '+'}
            </div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--purple-dark); margin-bottom: 0.25rem;">
              ${s.label}
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              ${s.subtitle || ''}
            </div>
          </div>
        `).join('');

        return `
          <section class="page-section" style="padding: 4.5rem 0; background: var(--bg-page);">
            <div class="container">
              ${sec.title ? `
                <div class="section-header text-center" style="margin-bottom: 3rem;">
                  ${sec.badge ? `<span class="section-badge yellow">${sec.badge}</span>` : ''}
                  <h2 class="section-title" style="color: var(--purple-dark);">${sec.title}</h2>
                </div>
              ` : ''}
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                ${statsHtml}
              </div>
            </div>
          </section>
        `;

      case 'testimonials_section':
        const testimonialsHtml = this.testimonials.map(t => `
          <div class="testimonial-card" style="background: #ffffff; padding: 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border-light);">
            <div style="color: var(--yellow-accent); margin-bottom: 1rem; font-size: 1.2rem;">★★★★★</div>
            <p style="color: var(--text-muted); font-style: italic; line-height: 1.7; margin-bottom: 1.5rem;">“${t.quote}”</p>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--coral-main); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700;">
                ${(t.parentName || 'P').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 style="color: var(--purple-dark); margin: 0; font-size: 1rem;">${t.parentName}</h4>
                <span style="font-size: 0.85rem; color: var(--text-muted);">${t.childNameAndAge}</span>
              </div>
            </div>
          </div>
        `).join('');

        return `
          <section class="page-section" style="padding: 5rem 0; ${isEven ? 'background: var(--bg-page);' : ''}">
            <div class="container">
              <div class="section-header text-center" style="margin-bottom: 3.5rem;">
                ${sec.badge ? `<span class="section-badge yellow">${sec.badge}</span>` : ''}
                <h2 class="section-title" style="color: var(--purple-dark);">${sec.title || 'Parent Testimonials'}</h2>
                ${sec.subtitle ? `<p class="section-subtitle" style="color: var(--text-muted);">${sec.subtitle}</p>` : ''}
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                ${testimonialsHtml}
              </div>
            </div>
          </section>
        `;

      case 'comparison_matrix':
        const rows = (sec.rows || []).map((row, rIdx) => `
          <tr style="border-bottom: 1px solid var(--border-light); ${rIdx % 2 === 1 ? 'background: var(--bg-page);' : ''}">
            <td style="padding: 1.15rem 1.25rem; font-weight: 700; color: var(--purple-dark);">${row.feature}</td>
            <td style="padding: 1.15rem 1.25rem; color: var(--text-muted);">${row.col1 || '—'}</td>
            <td style="padding: 1.15rem 1.25rem; color: var(--text-muted);">${row.col2 || '—'}</td>
            <td style="padding: 1.15rem 1.25rem; color: var(--text-muted);">${row.col3 || '—'}</td>
          </tr>
        `).join('');

        return `
          <section class="page-section" style="padding: 5rem 0; ${isEven ? 'background: var(--bg-page);' : ''}">
            <div class="container">
              <div class="section-header" style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
                ${sec.badge ? `<span class="section-badge purple">${sec.badge}</span>` : ''}
                <h2 class="section-title" style="font-size: clamp(2rem, 3.5vw, 2.5rem); color: var(--purple-dark);">${sec.title}</h2>
                ${sec.subtitle ? `<p class="section-subtitle" style="color: var(--text-muted); margin-top: 0.75rem;">${sec.subtitle}</p>` : ''}
              </div>
              <div class="comparison-matrix" style="overflow-x: auto; background: #ffffff; border-radius: var(--radius-xl); box-shadow: var(--shadow-md); border: 1px solid var(--border-light);">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                  <tbody>${rows}</tbody>
                </table>
              </div>
            </div>
          </section>
        `;

      case 'programs_showcase':
        const programsList = this.programs && this.programs.length ? this.programs : [
          {
            title: "Toddler Programme",
            subtitle: "Age Range: 1.5 to 2 Years",
            ageRange: "1.5 - 2 Years",
            badgeColor: "green",
            stageBadge: "Stage 1: Foundational Care",
            featuredImage: "assets/images/program-toddler.jpg",
            summary: "Our Toddler program is designed as a gentle bridge from home to the wider world. In a soothing, padded environment, toddlers discover sensory textures, practice early gross motor movement, and build secure emotional bonds.",
            highlights: [
              { category: "Sensory Stimulation", details: "Foam climbing, water & sand play" },
              { category: "Language Initiation", details: "Nursery rhymes, gestures & rhythm" },
              { category: "Motor Dexterity", details: "Stacking soft blocks, grasping & sorting" },
              { category: "Nurturing Care", details: "Assisted feeding & gentle routine pacing" }
            ]
          },
          {
            title: "PlayGroup Programme",
            subtitle: "Age Range: 2 to 3 Years",
            ageRange: "2 - 3 Years",
            badgeColor: "coral",
            stageBadge: "Stage 2: Social Exploration",
            featuredImage: "assets/images/program-playgroup.jpg",
            summary: "PlayGroup is the stage where communication blossoms and peer friendships take root. Children engage in vibrant creative arts, cooperative pretend-play stations, tactile modeling clay, songs, and guided toilet training independence.",
            highlights: [
              { category: "Creative Arts", details: "Finger-painting, play-dough & color mixing" },
              { category: "Social Development", details: "Turn-taking, sharing & circle conversations" },
              { category: "Active Play", details: "Parachute games, tricycle relays & soft hurdles" },
              { category: "Self-Help Skills", details: "Handwashing, shoe cubby & toilet training" }
            ]
          },
          {
            title: "Nursery Programme",
            subtitle: "Age Range: 3 to 4 Years",
            ageRange: "3 - 4 Years",
            badgeColor: "purple",
            stageBadge: "Stage 3: Early Academic & STEM",
            featuredImage: "assets/images/program-nursery.jpg",
            summary: "Our Nursery curriculum develops pre-reading phonics, numeracy logic, early scientific observation, and expressive confidence. Children thrive through interactive storytelling circles, hands-on counting labs, gardening, and dramatic theater.",
            highlights: [
              { category: "Early Phonics & Letters", details: "Sound recognition, letter tracing & rhymes" },
              { category: "Math & Logic", details: "Counting counters, geometric shapes & patterns" },
              { category: "Discovery & Nature", details: "Plant growth, weather charts & simple physics" },
              { category: "Confidence & Speech", details: "Show-and-tell, dramatic play & puppet shows" }
            ]
          }
        ];

        const programsHtml = programsList.map((p, pIdx) => {
          const isEvenP = pIdx % 2 === 1;
          const color = p.badgeColor || (pIdx === 0 ? 'green' : (pIdx === 1 ? 'coral' : 'purple'));
          const stageBadge = p.stageBadge || `Stage ${pIdx + 1}: Foundational Learning`;

          const highlightsHtml = (p.highlights || []).map(h => {
            const cat = typeof h === 'string' ? h : (h.category || '');
            const det = typeof h === 'string' ? '' : (h.details || '');
            return `
              <div class="feature-item" style="display: flex; gap: 0.75rem; align-items: flex-start; margin-bottom: 0.75rem;">
                <span class="feature-check" style="background: var(--${color}-light, #f0fdf4); color: var(--${color}-card, var(--${color}-main)); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem;">✓</span>
                <span style="font-size: 0.95rem; color: var(--text-muted);"><strong>${cat}${det ? ':' : ''}</strong> ${det}</span>
              </div>
            `;
          }).join('');

          return `
            <div class="about-grid" style="margin-bottom: 4.5rem; align-items: center; gap: 3.5rem;">
              <div class="about-visual" style="${isEvenP ? 'order: 2;' : 'order: 1;'}">
                <div class="about-image-wrap" style="position: relative; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-lg);">
                  <img src="${p.featuredImage || 'assets/images/program-toddler.jpg'}" alt="${p.title}" style="width: 100%; height: auto; display: block; object-fit: cover;" loading="lazy">
                  <div class="image-badge-overlay ${color}" style="position: absolute; top: 1.25rem; left: 1.25rem; padding: 0.5rem 1rem; border-radius: 50px; font-weight: 700; font-size: 0.85rem; color: #ffffff; background: var(--${color}-main, #ff6b6b);">
                    ${p.ageRange || 'Ages 1 to 6'}
                  </div>
                </div>
              </div>
              <div class="about-content" style="${isEvenP ? 'order: 1;' : 'order: 2;'}">
                <span class="section-badge ${color}">${stageBadge}</span>
                <h2 style="font-size: clamp(1.8rem, 3vw, 2.3rem); color: var(--purple-dark); margin: 0.5rem 0 0.75rem;">${p.title}</h2>
                <div style="display: inline-block; background: var(--${color}-light, #fff5f5); color: var(--${color}-main, #ff6b6b); font-weight: 800; padding: 0.35rem 1rem; border-radius: var(--radius-pill); margin-bottom: 1.25rem; font-size: 0.95rem;">
                  ${p.ageRange ? `👶 Age Range: ${p.ageRange}` : (p.subtitle || '')}
                </div>
                <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem; font-size: 1rem;">${p.summary || ''}</p>
                <div class="feature-list" style="margin-bottom: 2rem;">
                  ${highlightsHtml}
                </div>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                  <button class="btn btn-${color === 'green' ? 'green' : (color === 'purple' ? 'purple' : 'coral')}" data-modal-target="programInquiryModal" data-program-name="${p.title}">
                    Enroll in ${p.title}
                  </button>
                  <a href="${sec.buttonLink || 'contact.html'}" class="btn btn-outline-purple">Book Campus Tour</a>
                </div>
              </div>
            </div>
          `;
        }).join('');

        return `
          <section class="page-section" id="programsList" style="padding: 5rem 0; ${isEven ? 'background: var(--bg-page);' : ''}">
            <div class="container">
              ${sec.title ? `
                <div class="section-header text-center" style="max-width: 680px; margin: 0 auto 4rem;">
                  ${sec.badge ? `<span class="section-badge ${sec.badgeColor || 'coral'}">${sec.badge}</span>` : ''}
                  <h2 class="section-title" style="font-size: clamp(2rem, 3.5vw, 2.5rem); color: var(--purple-dark);">${sec.title}</h2>
                  ${sec.subtitle ? `<p class="section-subtitle" style="color: var(--text-muted); margin-top: 0.75rem;">${sec.subtitle}</p>` : ''}
                </div>
              ` : ''}
              <div class="programs-container">
                ${programsHtml}
              </div>
            </div>
          </section>
        `;

      case 'faq_section':
        const faqItems = (sec.items || []).map((faq) => `
          <div class="faq-item" style="background: #ffffff; border-radius: var(--radius-md); margin-bottom: 1rem; box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); overflow: hidden;">
            <button class="faq-question-btn" style="width: 100%; text-align: left; padding: 1.25rem 1.5rem; font-weight: 700; font-size: 1.1rem; color: var(--purple-dark); background: none; border: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
              <span>${faq.question}</span>
              <span class="faq-chevron" style="font-size: 1.25rem; color: var(--coral-main); transition: transform 0.2s ease;">+</span>
            </button>
            <div class="faq-answer-content" style="display: none; padding: 0 1.5rem 1.25rem; color: var(--text-muted); line-height: 1.7; border-top: 1px solid rgba(0,0,0,0.05); font-size: 1rem;">
              ${this.parseMarkdown(faq.answer)}
            </div>
          </div>
        `).join('');

        return `
          <section class="page-section" style="padding: 5rem 0; ${isEven ? 'background: var(--bg-page);' : ''}">
            <div class="container" style="max-width: 820px;">
              <div class="section-header" style="text-align: center; margin-bottom: 3rem;">
                ${sec.badge ? `<span class="section-badge teal">${sec.badge}</span>` : ''}
                <h2 class="section-title" style="font-size: clamp(1.8rem, 3.2vw, 2.3rem); color: var(--purple-dark);">${sec.title}</h2>
                ${sec.subtitle ? `<p class="section-subtitle" style="color: var(--text-muted); margin-top: 0.5rem;">${sec.subtitle}</p>` : ''}
              </div>
              <div class="faq-accordion-list">
                ${faqItems}
              </div>
            </div>
          </section>
        `;

      case 'cta_banner':
        return `
          <section class="cta-section" style="margin: 4rem 0;">
            <div class="container">
              <div class="cta-content">
                <h2 class="cta-title">${sec.title}</h2>
                <p class="cta-description">${sec.description}</p>
                <div class="cta-buttons">
                  <a href="${sec.primaryButtonLink || 'contact.html'}" class="btn btn-white">${sec.primaryButtonText || 'Get Started'}</a>
                  ${sec.secondaryButtonText ? `
                    <a href="${sec.secondaryButtonLink || 'contact.html'}" class="btn btn-outline">${sec.secondaryButtonText}</a>
                  ` : ''}
                </div>
              </div>
            </div>
          </section>
        `;

      case 'custom_html':
        return `
          <section class="page-section" style="padding: 3rem 0;">
            <div class="container">
              ${sec.title ? `<h2 style="color: var(--purple-dark); margin-bottom: 1.5rem;">${sec.title}</h2>` : ''}
              <div>${sec.html || ''}</div>
            </div>
          </section>
        `;

      default:
        return '';
    }
  },

  initFaqAccordions() {
    document.querySelectorAll('.faq-question-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const answer = item.querySelector('.faq-answer-content');
        const chevron = btn.querySelector('.faq-chevron');
        const isOpen = answer.style.display === 'block';

        if (isOpen) {
          answer.style.display = 'none';
          if (chevron) {
            chevron.textContent = '+';
            chevron.style.transform = 'rotate(0deg)';
          }
        } else {
          answer.style.display = 'block';
          if (chevron) {
            chevron.textContent = '−';
            chevron.style.transform = 'rotate(180deg)';
          }
        }
      });
    });
  },

  parseMarkdown(md) {
    if (!md) return '';
    return md
      .replace(/^### (.*$)/gim, '<h3 style="margin-top: 1.25rem; margin-bottom: 0.5rem; color: var(--purple-dark); font-size: 1.25rem;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="margin-top: 1.75rem; margin-bottom: 0.75rem; color: var(--purple-dark); font-size: 1.5rem;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--purple-dark); font-size: 1.85rem;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li style="margin-left: 1.25rem; margin-bottom: 0.35rem; color: var(--text-muted);">$1</li>')
      .split('\n\n')
      .map(p => {
        p = p.trim();
        if (!p) return '';
        if (p.startsWith('<h') || p.startsWith('<li')) return p;
        return `<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--text-muted); font-size: 1.05rem;">${p}</p>`;
      })
      .join('');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  StarKidsContent.init();
});
