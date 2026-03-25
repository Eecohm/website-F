# EECOHM Website — Rebuild Inside SMS Frontend

Build the full EECOHM School of Excellence institutional website as the public-facing home page of the existing SMS React/Vite frontend. All content comes from [website_rebuild_master.md](file:///home/bisham/Code/SMS/FE/website_rebuild_master.md).

## User Review Required

> [!IMPORTANT]
> The project currently does **not** have `react-icons` or `@emailjs/browser` installed. The plan installs both. `lucide-react` is already present and will be used alongside `react-icons` where needed. If you prefer not to add new packages, we can use only lucide-react icons (the contact form EmailJS will still need `@emailjs/browser`).

> [!NOTE]
> The existing [Home.jsx](file:///home/bisham/Code/SMS/FE/src/pages/Website/Home/Home.jsx) currently shows a "School Management System" placeholder hero. This will be fully replaced with the EECOHM institutional content. The existing section files (Hero, About, Courses, etc.) are empty placeholders — all will be filled in.

---

## Proposed Changes

### 1. Package Installation

Run: `npm install react-icons @emailjs/browser`

---

### 2. CSS — Brand Variables

#### [MODIFY] [variables.css](file:///home/bisham/Code/SMS/FE/src/styles/globalcss/variables.css)

Add landing page brand color tokens and Outfit font import to the existing `:root` block.

#### [MODIFY] [globals.css](file:///home/bisham/Code/SMS/FE/src/styles/globals.css)

Add `@import` for Outfit Google Font (used only for website sections via scoped CSS).

---

### 3. Static Data Files

#### [NEW] `src/pages/Website/data/coursesData.js`
All 7 courses with name, duration, description, keyFeatures, photo, icon paths.

#### [NEW] `src/pages/Website/data/facilitiesData.js`
12 facilities with name, description, image path.

#### [NEW] `src/pages/Website/data/teamData.js`
8 team members with name, role, bio, quote, image, social links.

#### [NEW] `src/pages/Website/data/testimonialsData.js`
4 testimonials with name, role, stars, image, review text.

---

### 4. Shared Website Components (under `src/components/website/`)

#### [NEW] `Navbar/Navbar.jsx` + `Navbar.module.css`
Fixed navbar, logo, nav links, scroll-aware blur, mobile hamburger drawer.

#### [NEW] `Footer/Footer.jsx` + `Footer.module.css`
Contact info columns, social links, copyright.

#### [NEW] `SocialFloatingButtons/SocialButtons.jsx` + `.module.css`
Fixed floating WhatsApp + Messenger buttons on left edge.

---

### 5. Home Page Sections (under `src/pages/Website/Home/sections/`)

#### [MODIFY] `Hero/Hero.jsx` + `[NEW] Hero.module.css`
Full-viewport hero: `Home.jpg` background, gradient overlay, animated heading/tagline/description, Login+Signup CTA buttons.

#### [MODIFY] `Courses/Courses.jsx` + `[NEW] Courses.module.css`
Horizontally scrollable card row. Each card: icon, photo, name, duration, description, expandable key features list.

#### [NEW] `Courses/CourseCard.jsx` + `CourseCard.module.css`

#### [NEW] `Facilities/Facilities.jsx` + `Facilities.module.css`
12-item card grid with facility images, names, descriptions.

#### [NEW] `Team/Team.jsx` + `Team.module.css`
Horizontal scrollable team member cards with name, role, bio, quote, social links.

#### [MODIFY] `About/About.jsx` + `[NEW] About.module.css`
Three-paragraph history text + interactive 9-square photo mosaic with quote reveals + round main image.

#### [NEW] `Moto/Moto.jsx` + `Moto.module.css`
Three animated motto cards: LEARN / GROW / INNOVATE with icons, toggled on click.

#### [MODIFY] `Testimonials/Testimonials.jsx` + `[NEW] Testimonials.module.css`
Single-card slider with left/right arrows, star rating, reviewer info.

#### [MODIFY] `Contact/Contact.jsx` + `[NEW] Contact.module.css`
Contact cards (phone, email, location) + EmailJS contact form + social media links.

#### [MODIFY] `Gallery/Gallery.jsx` + `[NEW] Gallery.module.css`
Photo grid using `IMG_*.JPG` school photography.

---

### 6. Home Page Container

#### [MODIFY] [Home.jsx](file:///home/bisham/Code/SMS/FE/src/pages/Website/Home/Home.jsx)
Replace placeholder with full page layout: Navbar, all sections with anchor IDs (`#hero`, `#programs`, `#school`, `#about-us`, `#testimonials`, `#contact-us`), Footer, SocialFloatingButtons.

#### [MODIFY] [Home.module.css](file:///home/bisham/Code/SMS/FE/src/pages/Website/Home/Home.module.css)
Minimal wrapper styles only.

---

### 7. Routing

#### [MODIFY] [PublicRoutes.jsx](file:///home/bisham/Code/SMS/FE/src/router/routes/PublicRoutes.jsx)
The `/` route already points to `Home` — no change needed. May add a `/*` wildcard for Under Construction fallback.

---

## Verification Plan

### Dev Server Test
```bash
cd /home/bisham/Code/SMS/FE
npm run dev
```
Then open `http://localhost:5173` in the browser subagent to visually inspect:
- All sections render correctly
- Navbar scrolls and collapses on mobile
- Anchor links scroll to correct sections
- Course cards expand/collapse
- Testimonial slider works
- Contact form renders (EmailJS sends on submit)
- Floating social buttons appear

### Responsive Test
Resize browser to 480px and 768px widths and check layout.

### No Automated Tests
This project has no test suite — verification is purely visual/browser-based.
