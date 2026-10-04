/**
 * STAR KIDS - DECAP CMS PREVIEW TEMPLATES
 * Custom live rendering components registered with Decap CMS
 */

// 1. EVENT PREVIEW TEMPLATE
const EventPreview = createClass({
  render: function () {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']) || 'Untitled Event';
    const date = entry.getIn(['data', 'date']) || 'Upcoming Date';
    const time = entry.getIn(['data', 'time']) || '9:00 AM - 1:00 PM';
    const venue = entry.getIn(['data', 'venue']) || 'Star Kids Campus';
    const category = entry.getIn(['data', 'category']) || 'Community';
    const badge = entry.getIn(['data', 'badge']) || 'Featured';
    const summary = entry.getIn(['data', 'summary']) || '';
    const ageGroup = entry.getIn(['data', 'ageGroup']) || 'All Ages';
    const price = entry.getIn(['data', 'price']) || 'Free Admission';
    const image = this.props.getAsset(entry.getIn(['data', 'image']));
    const description = this.props.widgetFor('description');

    return h('div', { className: 'preview-pane-container' },
      h('span', { className: 'preview-badge coral' }, category + ' • ' + badge),
      h('div', { className: 'preview-card' },
        image ? h('img', { src: image.toString(), className: 'preview-card-img', alt: title }) : null,
        h('div', { className: 'preview-card-body' },
          h('h2', { className: 'preview-title' }, title),
          h('div', { className: 'preview-meta' },
            h('span', null, '📅 ' + date),
            h('span', null, '⏰ ' + time),
            h('span', null, '📍 ' + venue),
            h('span', null, '👶 ' + ageGroup),
            h('span', null, '🎟️ ' + price)
          ),
          h('p', { className: 'preview-desc' }, summary),
          h('div', { className: 'preview-desc' }, description),
          h('div', { style: { marginTop: '20px' } },
            h('button', { className: 'preview-btn' }, 'Register for Event')
          )
        )
      )
    );
  }
});

// 2. PROGRAM PREVIEW TEMPLATE
const ProgramPreview = createClass({
  render: function () {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']) || 'Program Name';
    const subtitle = entry.getIn(['data', 'subtitle']) || '';
    const ageRange = entry.getIn(['data', 'ageRange']) || '2 - 3 Years';
    const timing = entry.getIn(['data', 'timing']) || '8:30 AM - 12:30 PM';
    const classSize = entry.getIn(['data', 'classSize']) || '1:5 Ratio';
    const tuition = entry.getIn(['data', 'tuition']) || '$350 / Month';
    const color = entry.getIn(['data', 'badgeColor']) || 'coral';
    const icon = entry.getIn(['data', 'icon']) || '🧸';
    const summary = entry.getIn(['data', 'summary']) || '';
    const image = this.props.getAsset(entry.getIn(['data', 'featuredImage']));
    const highlights = entry.getIn(['data', 'highlights']) || [];

    return h('div', { className: 'preview-pane-container' },
      h('span', { className: 'preview-badge ' + color }, icon + ' ' + ageRange),
      h('div', { className: 'preview-card' },
        image ? h('img', { src: image.toString(), className: 'preview-card-img', alt: title }) : null,
        h('div', { className: 'preview-card-body' },
          h('h2', { className: 'preview-title' }, title),
          subtitle ? h('p', { style: { color: 'var(--coral-main)', fontWeight: '600', marginBottom: '12px' } }, subtitle) : null,
          h('div', { className: 'preview-meta' },
            h('span', null, '⏱️ ' + timing),
            h('span', null, '👥 ' + classSize),
            h('span', null, '💵 ' + tuition)
          ),
          h('p', { className: 'preview-desc' }, summary),
          highlights.size ? h('ul', { className: 'preview-list' },
            highlights.map((item, index) => h('li', { key: index }, typeof item === 'string' ? item : item.get('item')))
          ) : null,
          h('button', { className: 'preview-btn' }, 'Inquire About ' + title)
        )
      )
    );
  }
});

// 3. TEACHER PREVIEW TEMPLATE
const TeacherPreview = createClass({
  render: function () {
    const entry = this.props.entry;
    const name = entry.getIn(['data', 'name']) || 'Teacher Name';
    const role = entry.getIn(['data', 'role']) || 'Lead Educator';
    const department = entry.getIn(['data', 'department']) || 'preschool';
    const experience = entry.getIn(['data', 'experience']) || '';
    const qualification = entry.getIn(['data', 'qualification']) || '';
    const quote = entry.getIn(['data', 'quote']) || '';
    const photo = this.props.getAsset(entry.getIn(['data', 'photo']));
    const specialties = entry.getIn(['data', 'specialties']) || [];

    return h('div', { className: 'preview-pane-container' },
      h('span', { className: 'preview-badge purple' }, department.toUpperCase()),
      h('div', { className: 'preview-card', style: { maxWidth: '450px' } },
        photo ? h('img', { src: photo.toString(), className: 'preview-card-img', style: { height: '280px' }, alt: name }) : null,
        h('div', { className: 'preview-card-body' },
          h('h2', { className: 'preview-title' }, name),
          h('p', { style: { color: 'var(--coral-main)', fontWeight: '600', marginBottom: '6px' } }, role),
          h('div', { className: 'preview-meta' },
            experience ? h('span', null, '🎓 ' + experience) : null,
            qualification ? h('span', null, '📜 ' + qualification) : null
          ),
          quote ? h('blockquote', { style: { fontStyle: 'italic', color: 'var(--purple-dark)', borderLeft: '3px solid var(--coral-main)', paddingLeft: '12px', margin: '14px 0' } }, '“' + quote + '”') : null,
          specialties.size ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' } },
            specialties.map((item, index) => h('span', { key: index, className: 'preview-badge teal', style: { fontSize: '0.75rem', marginBottom: '0' } }, typeof item === 'string' ? item : item.get('item')))
          ) : null
        )
      )
    );
  }
});

// 4. TESTIMONIAL PREVIEW TEMPLATE
const TestimonialPreview = createClass({
  render: function () {
    const entry = this.props.entry;
    const parentName = entry.getIn(['data', 'parentName']) || 'Parent Name';
    const childNameAndAge = entry.getIn(['data', 'childNameAndAge']) || 'Parent of Student';
    const rating = entry.getIn(['data', 'rating']) || 5;
    const quote = entry.getIn(['data', 'quote']) || '';
    const avatar = this.props.getAsset(entry.getIn(['data', 'avatar']));

    const stars = '⭐'.repeat(Math.min(Math.max(rating, 1), 5));

    return h('div', { className: 'preview-pane-container' },
      h('div', { className: 'preview-card', style: { maxWidth: '500px', padding: '24px' } },
        h('div', { style: { fontSize: '1.2rem', marginBottom: '10px' } }, stars),
        h('p', { className: 'preview-desc', style: { fontStyle: 'italic', fontSize: '1.05rem' } }, '“' + quote + '”'),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', marginTop: '16px' } },
          avatar ? h('img', { src: avatar.toString(), style: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }, alt: parentName }) : null,
          h('div', null,
            h('h4', { style: { margin: '0', color: 'var(--purple-dark)', fontWeight: '700' } }, parentName),
            h('span', { style: { fontSize: '0.85rem', color: 'var(--text-muted)' } }, childNameAndAge)
          )
        )
      )
    );
  }
});

// 5. DYNAMIC PAGE BUILDER PREVIEW TEMPLATE
const PagePreview = createClass({
  render: function () {
    const entry = this.props.entry;

    // Check if this is the Global Header & Footer file
    if (entry.getIn(['data', 'topBar']) || entry.getIn(['data', 'header']) || entry.getIn(['data', 'footer'])) {
      const topBar = entry.getIn(['data', 'topBar']);
      const header = entry.getIn(['data', 'header']);
      const footer = entry.getIn(['data', 'footer']);

      const phone = (topBar && topBar.get('phone')) || '+91 9799032872';
      const email = (topBar && topBar.get('email')) || 'hello@starkids.edu';
      const hours = (topBar && topBar.get('workingHours')) || 'Mon - Fri: 7:30 AM - 6:00 PM';
      const prefix = (header && header.get('logoPrefix')) || 'Star';
      const suffix = (header && header.get('logoSuffix')) || 'Kids';
      const ctaText = (header && header.get('ctaText')) || 'Contact Us';
      const navLinks = (header && header.get('navLinks')) || [];
      const footerAbout = (footer && footer.get('aboutText')) || '';
      const col2Title = (footer && footer.get('col2Title')) || 'Navigation';
      const col3Title = (footer && footer.get('col3Title')) || 'Our Programmes';
      const col4Title = (footer && footer.get('col4Title')) || 'Stay Connected';
      const copyright = (footer && footer.get('copyright')) || '© 2026 Star Kids. All rights reserved.';
      const subCredit = (footer && footer.get('subCredit')) || 'Made with ❤️ for young learners & families.';

      return h('div', { className: 'preview-pane-container', style: { padding: '16px', maxWidth: '100%' } },
        h('div', { style: { marginBottom: '14px', background: '#eef2ff', border: '1px solid #c7d2fe', padding: '12px 16px', borderRadius: '8px', color: '#3730a3', fontWeight: '600', fontSize: '0.85rem' } },
          '🌐 Global Site Header & Footer Live Preview (Changes apply across all website pages)'
        ),

        // 1. Top Utility Bar Preview
        h('div', { style: { background: '#2f2142', color: '#ffffff', padding: '10px 18px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', flexWrap: 'wrap', gap: '8px' } },
          h('div', { style: { display: 'flex', gap: '14px', flexWrap: 'wrap' } },
            h('span', null, '📞 ' + phone),
            h('span', null, '✉️ ' + email),
            h('span', null, '⏰ ' + hours)
          ),
          h('div', { style: { display: 'flex', gap: '10px' } },
            h('span', null, 'Facebook'),
            h('span', null, 'Instagram'),
            h('span', null, 'YouTube')
          )
        ),

        // 2. Main Navigation Bar Preview
        h('div', { style: { background: '#ffffff', padding: '14px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', flexWrap: 'wrap', gap: '12px' } },
          h('div', { style: { fontSize: '1.4rem', fontWeight: '800' } },
            h('span', { style: { color: '#ff6b6b' } }, prefix + ' '),
            h('span', { style: { color: '#44325a' } }, suffix)
          ),
          h('div', { style: { display: 'flex', gap: '14px', fontSize: '0.85rem', fontWeight: '600', color: '#44325a', flexWrap: 'wrap' } },
            navLinks.size ? navLinks.map((l, i) => h('span', { key: i }, l.get('label'))) : h('span', null, 'Home • About • Programmes • Classes • Events • Contact')
          ),
          h('button', { style: { background: '#ff6b6b', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' } }, ctaText)
        ),

        // Middle Placeholder
        h('div', { style: { background: '#f8fafc', padding: '36px 20px', textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.9rem' } },
          '📄 Page Content Area (Rendered uniquely on each static page)'
        ),

        // 3. Global Footer Preview
        h('div', { style: { background: '#251b35', color: '#ffffff', padding: '24px 18px', borderRadius: '0 0 8px 8px' } },
          h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '18px', marginBottom: '20px' } },
            h('div', null,
              h('div', { style: { fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' } },
                h('span', { style: { color: '#ff9e80' } }, prefix + ' '),
                h('span', { style: { color: '#ffffff' } }, suffix)
              ),
              h('p', { style: { fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4' } }, footerAbout)
            ),
            h('div', null,
              h('h4', { style: { color: '#ffffff', fontSize: '0.85rem', margin: '0 0 8px' } }, col2Title),
              h('div', { style: { fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', gap: '4px' } },
                'Quick links list'
              )
            ),
            h('div', null,
              h('h4', { style: { color: '#ffffff', fontSize: '0.85rem', margin: '0 0 8px' } }, col3Title),
              h('div', { style: { fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', gap: '4px' } },
                'Programs list'
              )
            ),
            h('div', null,
              h('h4', { style: { color: '#ffffff', fontSize: '0.85rem', margin: '0 0 8px' } }, col4Title),
              h('div', { style: { fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' } },
                'Newsletter signup box'
              )
            )
          ),
          h('div', { style: { borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', flexWrap: 'wrap', gap: '6px' } },
            h('div', null, copyright),
            h('div', null, subCredit)
          )
        )
      );
    }

    const pageTitle = entry.getIn(['data', 'pageTitle']) || 'Untitled Page';
    const heroTitle = entry.getIn(['data', 'hero', 'title']) || pageTitle;
    const heroSub = entry.getIn(['data', 'hero', 'subtitle']) || '';
    const heroBadge = entry.getIn(['data', 'hero', 'badge']) || 'Star Kids';
    const sections = entry.getIn(['data', 'sections']) || [];

    return h('div', { className: 'preview-pane-container', style: { padding: '0', maxWidth: '100%' } },
      // Hero Banner Preview
      h('div', { style: { background: 'linear-gradient(135deg, #44325a 0%, #2f2142 100%)', color: '#ffffff', padding: '36px 20px', textAlign: 'center', borderRadius: '12px 12px 0 0' } },
        h('span', { className: 'preview-badge coral', style: { display: 'inline-block', marginBottom: '8px' } }, heroBadge),
        h('h1', { style: { color: '#ffffff', margin: '6px 0', fontSize: '1.7rem' } }, heroTitle),
        heroSub ? h('p', { style: { color: 'rgba(255,255,255,0.85)', margin: '4px 0 10px', fontSize: '0.95rem' } }, heroSub) : null
      ),

      // Sections Preview
      h('div', { style: { padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '20px' } },
        sections.size ? sections.map((sec, index) => {
          const type = sec.get('type') || 'text_section';
          const title = sec.get('title') || 'Section Title';
          const badge = sec.get('badge') || '';
          const subtitle = sec.get('subtitle') || '';

          if (type === 'text_section') {
            const content = sec.get('content') || '';
            const btn = sec.get('buttonText');
            return h('div', { key: index, className: 'preview-card', style: { padding: '20px' } },
              badge ? h('span', { className: 'preview-badge teal' }, badge) : null,
              h('h3', { style: { margin: '8px 0', color: 'var(--purple-dark)' } }, title),
              subtitle ? h('p', { style: { color: 'var(--coral-main)', fontWeight: '600', marginBottom: '8px' } }, subtitle) : null,
              h('p', { className: 'preview-desc' }, content),
              btn ? h('button', { className: 'preview-btn', style: { marginTop: '12px' } }, btn) : null
            );
          }

          if (type === 'feature_grid') {
            const cards = sec.get('cards') || [];
            return h('div', { key: index, className: 'preview-card', style: { padding: '20px' } },
              badge ? h('span', { className: 'preview-badge teal' }, badge) : null,
              h('h3', { style: { margin: '8px 0', color: 'var(--purple-dark)' } }, title),
              subtitle ? h('p', { style: { color: 'var(--text-muted)', marginBottom: '12px' } }, subtitle) : null,
              h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '12px' } },
                cards.map((c, cIdx) => h('div', { key: cIdx, style: { background: 'var(--bg-page)', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                  h('div', { style: { fontSize: '1.4rem', marginBottom: '6px' } }, c.get('icon') || '🌟'),
                  h('h4', { style: { margin: '0 0 4px', fontSize: '0.95rem', color: 'var(--purple-dark)' } }, c.get('title')),
                  h('p', { style: { margin: '0', fontSize: '0.8rem', color: 'var(--text-muted)' } }, c.get('description'))
                ))
              )
            );
          }

          if (type === 'facilities_section') {
            const facilities = sec.get('facilities') || [];
            return h('div', { key: index, className: 'preview-card', style: { padding: '20px' } },
              badge ? h('span', { className: 'preview-badge green' }, badge) : null,
              h('h3', { style: { margin: '8px 0', color: 'var(--purple-dark)' } }, title),
              subtitle ? h('p', { style: { color: 'var(--text-muted)', marginBottom: '12px' } }, subtitle) : null,
              h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '12px' } },
                facilities.map((f, fIdx) => h('div', { key: fIdx, style: { background: 'var(--bg-page)', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                  h('div', { style: { fontSize: '1.4rem', marginBottom: '6px' } }, f.get('icon') || '🌿'),
                  h('h4', { style: { margin: '0 0 4px', fontSize: '0.95rem', color: 'var(--purple-dark)' } }, f.get('title')),
                  h('p', { style: { margin: '0', fontSize: '0.8rem', color: 'var(--text-muted)' } }, f.get('description'))
                ))
              )
            );
          }

          if (type === 'stats_section') {
            const stats = sec.get('stats') || [];
            return h('div', { key: index, className: 'preview-card', style: { padding: '20px' } },
              badge ? h('span', { className: 'preview-badge purple' }, badge) : null,
              h('h3', { style: { margin: '8px 0', color: 'var(--purple-dark)' } }, title),
              h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px', marginTop: '12px' } },
                stats.map((s, sIdx) => h('div', { key: sIdx, style: { textAlign: 'center', background: 'var(--bg-page)', padding: '12px', borderRadius: '8px' } },
                  h('div', { style: { fontSize: '1.4rem', fontWeight: '800', color: 'var(--coral-main)' } }, (s.get('number') || '0') + (s.get('suffix') || '+')),
                  h('div', { style: { fontSize: '0.85rem', fontWeight: '700', color: 'var(--purple-dark)' } }, s.get('label')),
                  h('div', { style: { fontSize: '0.75rem', color: 'var(--text-muted)' } }, s.get('subtitle'))
                ))
              )
            );
          }

          if (type === 'programs_showcase') {
            const progs = sec.get('programs') || [];
            return h('div', { key: index, className: 'preview-card', style: { padding: '20px', borderLeft: '4px solid var(--green-card)' } },
              badge ? h('span', { className: 'preview-badge green' }, badge) : null,
              h('h3', { style: { margin: '8px 0', color: 'var(--purple-dark)' } }, title),
              subtitle ? h('p', { style: { color: 'var(--text-muted)', margin: '0 0 14px' } }, subtitle) : null,
              progs.size ? h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '12px' } },
                progs.map((p, pIdx) => {
                  const pColor = p.get('badgeColor') || 'green';
                  return h('div', { key: pIdx, style: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' } },
                    h('span', { className: 'preview-badge ' + pColor, style: { fontSize: '0.75rem', marginBottom: '6px' } }, p.get('stageBadge') || 'Stage'),
                    h('h4', { style: { margin: '4px 0', color: 'var(--purple-dark)' } }, (p.get('icon') || '👶') + ' ' + (p.get('title') || 'Programme')),
                    h('div', { style: { fontSize: '0.8rem', color: 'var(--coral-main)', fontWeight: '600', marginBottom: '6px' } }, 'Age: ' + (p.get('ageRange') || '1.5 - 4 Yrs')),
                    h('p', { style: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 8px', lineHeight: '1.4' } }, p.get('summary') || ''),
                    h('div', { style: { fontSize: '0.75rem', color: '#64748b' } },
                      h('div', null, '⏱️ ' + (p.get('timing') || '')),
                      h('div', null, '👥 ' + (p.get('classSize') || '')),
                      h('div', null, '💵 ' + (p.get('tuition') || ''))
                    )
                  );
                })
              ) : h('div', { style: { background: 'var(--bg-page)', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--purple-dark)', fontWeight: '600' } },
                '🧸 Live Programs Showcase (Toddler, PlayGroup, Nursery stages automatically rendered)'
              )
            );
          }

          if (type === 'testimonials_section') {
            return h('div', { key: index, className: 'preview-card', style: { padding: '20px', borderLeft: '4px solid var(--yellow-accent)' } },
              badge ? h('span', { className: 'preview-badge yellow' }, badge) : null,
              h('h3', { style: { margin: '8px 0', color: 'var(--purple-dark)' } }, title),
              h('div', { style: { background: 'var(--bg-page)', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--purple-dark)', fontWeight: '600' } },
                '💬 Live Testimonials Showcase (Parent reviews automatically embedded)'
              )
            );
          }

          if (type === 'comparison_matrix') {
            const rows = sec.get('rows') || [];
            return h('div', { key: index, className: 'preview-card', style: { padding: '20px' } },
              badge ? h('span', { className: 'preview-badge purple' }, badge) : null,
              h('h3', { style: { margin: '8px 0', color: 'var(--purple-dark)' } }, title),
              h('div', { style: { overflowX: 'auto', marginTop: '12px' } },
                h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' } },
                  h('tbody', null,
                    rows.map((r, rIdx) => h('tr', { key: rIdx, style: { borderBottom: '1px solid #e2e8f0' } },
                      h('td', { style: { padding: '8px', fontWeight: '700' } }, r.get('feature')),
                      h('td', { style: { padding: '8px' } }, r.get('col1')),
                      h('td', { style: { padding: '8px' } }, r.get('col2')),
                      h('td', { style: { padding: '8px' } }, r.get('col3'))
                    ))
                  )
                )
              )
            );
          }

          if (type === 'faq_section') {
            const items = sec.get('items') || [];
            return h('div', { key: index, className: 'preview-card', style: { padding: '20px' } },
              badge ? h('span', { className: 'preview-badge teal' }, badge) : null,
              h('h3', { style: { margin: '8px 0', color: 'var(--purple-dark)' } }, title),
              h('ul', { style: { listStyle: 'none', padding: '0', marginTop: '12px' } },
                items.map((f, fIdx) => h('li', { key: fIdx, style: { marginBottom: '10px', padding: '8px 12px', background: 'var(--bg-page)', borderRadius: '6px' } },
                  h('strong', { style: { display: 'block', color: 'var(--purple-dark)', fontSize: '0.9rem' } }, 'Q: ' + f.get('question')),
                  h('span', { style: { fontSize: '0.85rem', color: 'var(--text-muted)' } }, f.get('answer'))
                ))
              )
            );
          }

          if (type === 'cta_banner') {
            return h('div', { key: index, style: { background: 'linear-gradient(135deg, #ff6b6b 0%, #fa5252 100%)', color: '#ffffff', padding: '20px', borderRadius: '12px', textAlign: 'center' } },
              h('h3', { style: { color: '#ffffff', margin: '0 0 8px' } }, title),
              h('p', { style: { color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', margin: '0 0 14px' } }, sec.get('description')),
              h('button', { style: { background: '#ffffff', color: '#ff6b6b', border: 'none', padding: '8px 18px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer' } }, sec.get('primaryButtonText') || 'Call to Action')
            );
          }

          return h('div', { key: index, className: 'preview-card', style: { padding: '16px' } },
            h('h4', null, 'Section: ' + type)
          );
        }) : h('div', { style: { textAlign: 'center', padding: '24px', color: 'var(--text-muted)' } }, 'Click "Add Page Components / Sections" below to add components.')
      )
    );
  }
});

// Register Preview Templates with CMS
if (window.CMS) {
  CMS.registerPreviewStyle('admin.css');
  CMS.registerPreviewTemplate('pages', PagePreview);
  CMS.registerPreviewTemplate('global_settings', PagePreview);
}

