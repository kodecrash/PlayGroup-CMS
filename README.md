# Star Kids - Nursery & Kindergarten Platform

A modern, full-featured website and content management system powered by [Decap CMS](https://decapcms.org/).

---

## 🚀 Quick Start (Local Development)

```bash
# Install dependencies (first time only)
npm install

# Start both local Decap CMS proxy and live website
npm start
```
*(or `npm run dev`)*

- 🌐 **Live Website**: `http://localhost:3000/`
- 🖥️ **CMS Admin Dashboard**: `http://localhost:3000/admin/`

---

## 📂 Project Structure (Unified & Clean)

```
PlayGroup-CMS/
├── admin/                  # Decap CMS Admin Dashboard & Previews
│   ├── config.yml          # CMS Collections & Field Definitions
│   ├── index.html          # Admin UI Entrypoint
│   ├── preview.js          # Custom Live Previews
│   └── admin.css           # Admin Theme Styles
├── assets/                 # Images, Icons & Media
│   └── images/             # Uploads and page photography
├── content/                # Decap CMS Structured JSON Data
│   ├── events/             # Event items (Carnival, Science Fair, etc.)
│   ├── programs/           # Stage items (Toddler, PlayGroup, Nursery, Kindergarten)
│   ├── classes/            # Activity module items
│   ├── teachers/           # Faculty member items
│   ├── testimonials/       # Parent review items
│   ├── faqs/               # FAQ items
│   ├── gallery/            # Photo gallery items
│   ├── pages/              # End-to-end page layouts (programs.json)
│   └── settings/           # Global site and about configurations
├── css/                    # Website stylesheets (style.css)
├── js/                     # Website scripts & dynamic content loader
│   ├── content-loader.js   # Client-side dynamic CMS synchronization
│   └── main.js             # Navigation, countdown, modals & animations
├── index.html              # Home page
├── about.html              # About Us page
├── programs.html           # Programmes page (Managed end-to-end in CMS)
├── classes.html            # Classes & Curriculum page
├── events.html             # Events page
├── teachers.html           # Teachers & Faculty page
├── contact.html            # Contact & Admissions page
└── package.json            # Dev scripts & proxy tooling
```

---

## ☁️ Deployment (Netlify / Vercel / GitHub Pages)

Because everything is at the repository root:
- **Netlify / Vercel / GitHub Pages**: Simply set **Publish Directory** to `.` (root).
- No build command required for static hosting!
