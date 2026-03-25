# EECOHM Website — Rebuild Master Document

> **Purpose:** Complete structured extraction of all content, design tokens, components, routes, assets, and architecture from the existing EECOHM School of Excellence website codebase. Another AI can use this document to rebuild the website perfectly from scratch.

---

## Table of Contents

1. [Full Content Extraction](#1-full-content-extraction)
2. [Full Navigation Architecture](#2-full-navigation-architecture)
3. [Full Design System Extraction](#3-full-design-system-extraction)
4. [Component Inventory](#4-component-inventory)
5. [Asset Inventory](#5-asset-inventory)
6. [Data Source Mapping](#6-data-source-mapping)
7. [SEO Extraction](#7-seo-extraction)
8. [Rebuild Instructions](#8-rebuild-instructions)

---

## 1. Full Content Extraction

### 1.1 Browser Tab / Page Title

- **Title:** `Eecohm Foundation`

---

### 1.2 Navbar

**Logo:** `src/assets/logo.svg`

**Navigation Links:**

| Label | Anchor |
|---|---|
| Home | `/#hero` |
| Program | `#programs` |
| School | `#school` |
| About | `#about-us` |
| Testimonials | `#testimonials` |
| Contact | `#contact-us` (button styled in red, rounded) |

**Behavior:**
- Fixed navbar, transparent on mount
- On desktop (≥1025px): blurred cream background (`rgba(255,250,230,0.97)`) when scrolled within hero section
- On mobile (≤768px): collapses to hamburger icon; slides in from right as drawer; backdrop blur overlay
- Close button (✕) appears when mobile menu is open

---

### 1.3 Hero Section

**Heading (h1):** `EECOHM SCHOOL OF EXCELLENCE`

**Subheading (h4):** `LEARN . GROW . INNOVATE`

**Description Paragraph:**
> EECOHM School of Excellence is a top-tier educational establishment that provides comprehensive education from Pre-school till High School Diploma. Our dynamic environment fosters intellectual, artistic, and physical growth in students, with an emphasis on academic excellence and skill-based education.

**CTA Buttons:**

| Button Label | Route | Style |
|---|---|---|
| Log In | `/login` | Outline, yellow border and text |
| Sign Up | `/signup` | Solid white background, black text |

**Hero Background:**
- Image: `src/assets/Images/Home.jpg`
- Overlay: `linear-gradient(rgba(226,190,190,0.5), rgba(156,28,28,0.9))`
- Full viewport height (`100vh`)

---

### 1.4 Programs / Courses Section

**Section Heading (h2):** `OUR COURSES`

**Section Background:** `linear-gradient(#fffbe6, #ffd580)` (cream to warm gold)

**Layout:** Horizontally scrollable card row

---

#### Course 1: +2 with Advance Diploma in Computer Science

- **Duration:** 2 years
- **Description:** This program equips future software developers, network administrators, and IT professionals with essential practical and theoretical skills.
- **Key Features:**
  - Aspiring to build a strong foundation in computer science and IT-related fields.
  - Dual Certification NEB + Advanced Diploma in Computer Science.
  - Industry Relevant Curriculum which covers all the industry standard technologies.
  - Web Hands-on Learning through practical sessions, projects, and internships.
  - Career Oriented Approach which prepares students for higher education and IT careers.
  - Includes networking, programming with different languages (C++, Python, SQL).
- **Photo:** `src/assets/Images/cs.png`
- **Icon:** `src/assets/Icons/adcs-icon.svg`

---

#### Course 2: +2 with Advance Diploma in Hotel Management

- **Duration:** 2 years
- **Description:** This specialized program helps students enhance their career prospects in the dynamic industry of hospitality with internationally recognized credentials.
- **Key Features:**
  - Dual certification, combining: NEB, Certification UK-Accredited Diploma.
  - Practical training and internship opportunities in reputed hotels.
  - Job opportunities in Nepal and internationally.
  - Industry relevant skills to excel in global hospitality industry.
- **Photo:** `src/assets/Images/program_2.png`
- **Icon:** `src/assets/Icons/adhm-icon.svg`

---

#### Course 3: Diploma in Hotel Management (DHM)

- **Duration:** 1 year
- **Description:** A great starting point for a rewarding career in one of the largest and most dynamic industries in the world ensuring students gain international-standard hospitality skills.
- **Key Features:**
  - Industry Focused Curriculum with practical training
  - Internship placement in top hotels and restaurants
  - Experienced Faculty with real-world industry expertise.
  - Opportunities for Certification and skill development workshops.
- **Photo:** `src/assets/Images/adhm.jpg`
- **Icon:** `src/assets/Icons/dhm-icon.svg`

---

#### Course 4: +2 with Business Studies

- **Duration:** 2 years
- **Description:** This program equips students with foundational business knowledge and critical thinking skills essential for modern commerce.
- **Key Features:**
  - Business fundamentals are taught through real-world case studies and projects.
  - Finance basics include budgeting, investment analysis, and financial planning skills.
  - Marketing strategies cover digital marketing, branding, and consumer behavior analysis.
  - Entrepreneurship encourages innovative thinking and business startup development.
- **Photo:** `src/assets/Images/program_3.png`
- **Icon:** `src/assets/Icons/bs-icon.svg`

---

#### Course 5: +2 with Hotel Management

- **Duration:** 2 years
- **Description:** This course introduces students to the hospitality industry with a focus on practical skills.
- **Key Features:**
  - Business fundamentals provide a strong base for managing hospitality enterprises effectively.
  - Finance basics teach cost management, revenue tracking, and budgeting for hotels.
  - Marketing strategies include promoting tourism and enhancing guest experience techniques.
  - Entrepreneurship fosters skills to launch and operate successful hospitality ventures.
- **Photo:** `src/assets/Images/hmimgs.png`
- **Icon:** `src/assets/Icons/hm-icon.svg`

---

#### Course 6: +2 with Computer Science

- **Duration:** 2 years
- **Description:** This program blends computer science with business education for a comprehensive learning experience.
- **Key Features:**
  - Business fundamentals help students understand IT project management and operations.
  - Finance basics cover budgeting for tech projects and resource allocation strategies.
  - Marketing strategies teach promoting software products and digital services effectively.
  - Entrepreneurship develops skills to create innovative tech startups and solutions.
- **Photo:** `src/assets/Images/css.png`
- **Icon:** `src/assets/Icons/cs-icon.svg`

---

#### Course 7: Pre-School to Secondary

- **Duration:** 10 years
- **Description:** This program offers a complete educational journey from pre-school to secondary levels.
- **Key Features:**
  - Holistic education integrates academics with emotional and social development skills.
  - Skill development focuses on critical thinking, creativity, and practical abilities.
  - Academic foundation ensures strong proficiency in core subjects like math and science.
  - Extracurriculars encourage participation in sports, arts, and leadership activities.
- **Photo:** `src/assets/Images/preschool.png`
- **Icon:** `src/assets/Icons/school-icon.svg`

---

### 1.5 School Section — Facilities (TeamLeads Grid)

**Section Heading (h2):** `Explore what our school has to offer`

**Subheading (p):** `Paving path for a great future with bright vision`

**Facilities List (12 items):**

| Name | Description |
|---|---|
| AI and Robotics Innovation Lab | The AI and Robotics Innovation Lab fosters hands-on learning in artificial intelligence, robotics, and automation, empowering students to develop real-world technological solutions. With state-of-the-art equipment and expert guidance, students can build and test their own robotic models and AI systems. This lab encourages problem-solving, creativity, and innovation, preparing students for future careers in tech-driven industries. |
| Advanced Computer Laboratory | Equipped with high-performance computers and the latest software, the computer lab provides students with a cutting-edge digital learning experience. It offers hands-on training in programming, multimedia, and graphic design, helping students develop essential technical skills. This lab serves as a foundation for digital literacy and career readiness in the ever-evolving tech industry. |
| STEM Research and Development Center | The STEM Research and Development Center is a hub for innovation, allowing students to work on real-world technology projects. From mechanical engineering to software development, this space provides tools and resources to nurture young inventors. It encourages critical thinking, teamwork, and experimentation, fostering the next generation of scientists and engineers. |
| Auditorium Hall for Events and Seminars | The auditorium is a grand venue for hosting academic seminars, guest lectures, and cultural performances. Designed with modern acoustics and seating arrangements, it provides a comfortable space for large gatherings. This hall serves as a platform for students to showcase their talents, engage in intellectual discussions, and participate in various school events. |
| Agro Farming Learning Center | The Agro Farming Learning Center introduces students to sustainable agriculture and modern farming techniques. Through hands-on activities, students learn about crop cultivation, soil management, and eco-friendly practices. This center promotes environmental awareness and practical skills, preparing students for careers in agriculture and food sciences. |
| Library and Resource Center | The library is a treasure trove of knowledge, offering a vast collection of books, journals, and digital resources. It provides a quiet and conducive environment for study and research. Students can access reference materials, participate in reading programs, and develop a lifelong love for learning. |
| Sports and Fitness Complex | The Sports and Fitness Complex features modern facilities for various indoor and outdoor sports. Students can participate in athletics, team games, and fitness activities, promoting physical health and teamwork. The complex encourages a balanced lifestyle and helps students develop discipline and sportsmanship. |
| Art and Creativity Studio | The Art and Creativity Studio is a vibrant space for artistic expression, offering resources for painting, sculpture, and design. Students can explore their creative talents, participate in workshops, and showcase their artwork. This studio fosters imagination, self-expression, and cultural appreciation. |
| Science Laboratory | The Science Laboratory provides hands-on experience in physics, chemistry, and biology. Equipped with modern instruments, it allows students to conduct experiments, analyze data, and develop scientific thinking. The lab supports inquiry-based learning and prepares students for advanced studies in science. |
| Music and Performing Arts Room | The Music and Performing Arts Room is designed for musical training, drama, and dance. Students can learn instruments, participate in choir, and perform on stage. This space nurtures artistic talents and builds confidence through public performance. |
| Cafeteria and Dining Hall | The Cafeteria and Dining Hall offers nutritious meals in a welcoming environment. It serves as a social hub where students can relax, interact, and enjoy healthy food. The hall promotes good eating habits and provides a space for community building. |
| Medical and Wellness Center | The Medical and Wellness Center provides healthcare services, counseling, and wellness programs. It ensures the physical and mental well-being of students, offering support and guidance. The center promotes a healthy school environment and helps students thrive academically and personally. |

**Facility Images:** `src/assets/F/1.png` through `src/assets/F/13.png` (mapped: F/10, F/12, F/3, F/9, F/13, F/5, F/6, F/8, F/1, F/4, F/11, F/7`)

---

### 1.6 School Section — Team (Meet Our Team)

**Section Heading (h2):** `Meet Our Team`

**Section Subheading (p):** `A group of passionate individuals driving innovation.`

**Team Members (8):**

---

#### AALOK KARKI
- **Role:** Chief Executive Officer
- **Bio:** A visionary CEO driving innovation and growth.
- **Quote:** "Leadership is about inspiring others to achieve greatness."
- **Image:** `src/assets/Images/aalok.jpg`
- **Facebook:** https://www.facebook.com/aalok.karkinepali
- **Phone:** 9852646392
- **Email:** eecohm.ceo@gmail.com

---

#### BIBEK NEPAL
- **Role:** Operational Executive
- **Bio:** A strategic Operational Executive ensuring efficiency and excellence.
- **Quote:** "Efficiency is doing things right; effectiveness is doing the right things."
- **Image:** `src/assets/Images/bibek.jpg`
- **Facebook:** https://www.facebook.com/bibek.nepal.779
- **Phone:** 9861760481
- **Email:** eecohm.coordinator@gmail.com

---

#### SUMAN SHRESTHA
- **Role:** Finance Executive
- **Bio:** A strategic Finance Executive ensuring financial stability and growth.
- **Quote:** A strategic Finance Executive ensuring financial stability and growth.
- **Image:** `src/assets/Images/sumans.png`
- **Facebook:** https://www.facebook.com/redfuzz
- **Phone:** 9817932424
- **Email:** eecohm.finance@gmail.com

---

#### SUMAN UPRETY
- **Role:** Marketing Executive
- **Bio:** A dynamic Marketing Executive driving brand awareness and engagement.
- **Quote:** "Marketing is telling the world you're a rock star."
- **Image:** `src/assets/Images/sumanu.png`
- **Facebook:** https://www.facebook.com/suman.narine
- **Phone:** 9818489385
- **Email:** upretysuman9@gmail.com

---

#### PRAMILA BAJGAIN
- **Role:** Academic Executive
- **Bio:** A dedicated Academic Executive fostering excellence in education.
- **Quote:** "Empowering young minds driven for the stars, driven by passion and purpose."
- **Image:** `src/assets/Images/pramila.png`
- **Facebook:** https://www.facebook.com/pramila.bajgain
- **Phone:** 9842656772
- **Email:** pramilab283@gmail.com

---

#### NIRMAL KHANAL
- **Role:** Operational Coordinator
- **Bio:** An efficient Operational Coordinator streamlining processes for success.
- **Quote:** "Coordination is the key to seamless success."
- **Image:** `src/assets/Images/nirmal.png`
- **Facebook:** https://facebook.com/reechakhawas
- **Phone:** 9829726461
- **Email:** eecohm@gmail.com

---

#### JANARDAN DAHAL
- **Role:** Operating Officer
- **Bio:** A proactive Operation Officer optimizing workflows.
- **Quote:** "Good project management turns vision into reality."
- **Image:** `src/assets/Images/janardhan.png`
- **Facebook:** https://facebook.com/janardhansharma
- **Phone:** 9815908872
- **Email:** janardhan.sharma@example.com

---

#### PRITAM KOIRALA
- **Role:** Finance Officer
- **Bio:** A meticulous Finance Officer managing budgets and financial health.
- **Quote:** "Success is the sum of small efforts, repeated day in and day out."
- **Image:** `src/assets/Images/pritam.png`
- **Facebook:** https://www.facebook.com/pritam0110
- **Phone:** 9801430110
- **Email:** pritamkoirala@gmail.com

---

### 1.7 About Us Section

**Section Heading (h2):** `About Us`

**Paragraph 1:**
> In 2015, Eastern Empire College Of Hotel Management was born with a bold vision to redefine education in the hotel and hospitality industry. What started as a single program, the Diploma in Hotel Management (DHM), quickly gained momentum, attracting ambitious students eager to build their careers in hospitality. With a strong foundation in practical learning and academic excellence, the institution soon expanded, introducing +2 level programs, including the Advanced Diploma in Hotel Management (ADHM), Advanced Diploma in Computer Science (ADCS), and Business Studies. As demand for quality education across multiple disciplines increased, EECOHM recognized the need to evolve.

**Paragraph 2:**
> By 2025, EECOHM took its biggest leap yet, transforming into EECOHM School of Excellence. No longer just a college, it became a comprehensive institution, offering programs from Pre-Group (PG) levels to Advanced Diplomas, ensuring students could begin their educational journey from the ground up and emerge as professionals ready to take on the world.

**Paragraph 3:**
> This evolution within 10 years marked as a benchmark that cemented EECOHM's place as a leader in academic excellence, skill development, and industry readiness. From its humble beginnings to a School of Excellence, EECOHM remains committed to shaping the future of education and empowering the next generation of professionals.

**About Us Interactive Photo Grid:**
- Main round image: `src/assets/Images/program_3.png`
- 9 square boxes using images: `src/assets/pngs/1.png` through `src/assets/pngs/9.png`
- Each box reveals a motivational quote on click:
  1. "Innovation drives us forward."
  2. "Creativity is our foundation."
  3. "Teamwork makes the dream work."
  4. "Excellence in every detail."
  5. "Passion fuels our mission."
  6. "Together, we build the future."
  7. "Every step counts."
  8. "Dream big, act bold."
  9. "Inspire, create, succeed."
- Square box background color: `#79222a`

---

### 1.8 Moto / Animated Cards Section

**Three interactive motto cards:**

| Card | Icon | Title |
|---|---|---|
| 1 | FaBook | LEARN |
| 2 | FaLeaf | GROW |
| 3 | FaLightbulb | INNOVATE |

Each card animates/highlights on click (toggle state).

---

### 1.9 Testimonials Section

**Layout:** Single card slider with left/right navigation arrows

---

#### Testimonial 1 — Pranil Chauhan
- **Role:** CEO @ Next Gen Learners
- **Stars:** 5
- **Image:** `src/assets/Images/CHOUHAN.png`
- **Review:** "As a faculty member at EECOHM College, I am committed to bridging the gap between theoretical learning and real-world business applications. Through practical classes, I equip students with essential soft skills and provide hands-on entrepreneurial experiences that prepare them for the dynamic world of business. My goal is to nurture future leaders by fostering critical thinking, creativity, and a problem-solving mindset. At EECOHM, we don't just teach business—we create opportunities for students to experience it firsthand."

---

#### Testimonial 2 — Arpan Khatiwada
- **Role:** Co-owner at BEES International Education Services
- **Stars:** 4
- **Image:** `src/assets/Images/arpanksharma.png`
- **Review:** "Having dedicated four years to teaching English at EECOHM School of Excellence, I can confidently say that it is a truly rewarding environment for both educators and students. The supportive management fosters open communication, ensuring that any concerns are promptly addressed, while the competitive remuneration reflects their commitment to valuing staff. This positive atmosphere directly enhances my teaching experience, allowing me to bring enthusiasm and energy into the classroom. When a teacher is fulfilled, that joy radiates to the students, sparking their curiosity and fostering a genuine love for learning. EECOHM is a place where excellence in education thrives—for teachers and students alike."

---

#### Testimonial 3 — Sadikshya Khadka
- **Role:** Executive Vice President (EVP) at Bahradashi Jaycees
- **Stars:** 5
- **Image:** `src/assets/Images/sadikshya.png`
- **Review:** "A School where excellence is not just taught but lived, preparing students to lead and inspire. Keep learning, keep growing, and keep inspiring, your potential is limitless!"

---

#### Testimonial 4 — Sandhya Mukhiya
- **Role:** Front Office, HM (former Student)
- **Stars:** 5
- **Image:** `src/assets/Images/sandhya.png`
- **Review:** "Studying at EECOHM College has been a truly rewarding experience, and I am incredibly grateful for the opportunity. The Advanced Diploma in Hospitality Management (ADHM) program offered a perfect balance of theory and hands-on learning, which laid a strong foundation for my career. I am deeply thankful for the continuous support and guidance from my teachers and mentors, who motivated me and helped me stay focused on my goals. My internship at Hotel Kingsbury allowed me to apply what I learned, and I'm honored to have been offered a full-time position in the Front Office Department. The transition from intern to employee has been both exciting and fulfilling, and I am grateful for the chance to continue growing and refining my skills in the hospitality industry."

---

### 1.10 Contact Us Section

**Section Heading (h1):** `Contact Us`

**Section Subheading (p):** `We'd love to hear from you!`

**Contact Cards:**

| Icon | Title | Detail | Link |
|---|---|---|---|
| 📞 | Phone | 023-536392 | `tel:023546392` |
| ✉️ | Email | eecohm@gmail.com | `mailto:eecohm@gmail.com` |
| 🗺️ | Location | Birtamod Jhapa, Nepal | Google Maps: EECOHM College link |

**Google Maps URL:**
`https://www.google.com/maps/place/EECOHM+College/@26.643542,87.9692917,17z/...`

**Contact Form Fields:**
- Name (required, text)
- Email (required, email)
- Message (required, textarea)
- Submit Button: `Send Message`
- Success message: `Thank you! We've sent you a confirmation email and we'll get back to you soon.`
- Error message: `Please enter a valid email address.` / `Failed to send your message: [error]`

**EmailJS Configuration:**
- Service: `service_qwyckzi`
- Notification template: `template_4d0m0c6` → sends to `eecohmplustwo@gmail.com`
- Auto-reply template: `template_7rl59tg` → sends to submitter
- Public Key: `E7PBW2JJQEYniKIBZ`

---

### 1.11 Social Media (Footer area)

**"Follow Us" header with links:**

| Platform | URL |
|---|---|
| Twitter | https://twitter.com/example _(placeholder)_ |
| Facebook | https://www.facebook.com/eecohmschoolofexcellence |
| Instagram | https://www.instagram.com/eecohm_college?igsh=NzRmMWpyM2JpaW42 |
| LinkedIn | https://www.linkedin.com/company/106791483/admin/dashboard/ |

---

### 1.12 Footer

**Copyright text:** `© 2025 All Rights Reserved EECOHM`

---

### 1.13 Floating Social Buttons (Fixed, Left Side)

| Button | Icon | Action |
|---|---|---|
| Facebook Messenger | FaFacebookMessenger | Opens https://m.me/yourfacebookpageid _(placeholder)_ |
| WhatsApp | FaWhatsapp | Opens WhatsApp chat with `+977 985-2646392`, pre-filled message: "Hello! I'd like to chat with you." |

---

### 1.14 Under Construction Page

**Heading (h1):** `🚧 Site Under Construction 🚧`

**Message (p):** `We're working hard to bring you an amazing experience! Please check back soon.`

**Displayed for:** All unmatched routes (`/*`)

---

## 2. Full Navigation Architecture

```
Root (/)
├── Home (/)                          [Public]
│   ├── #hero          → Hero Section
│   ├── #programs      → Our Courses
│   ├── #school        → School Facilities + Meet Our Team
│   ├── #about-us      → About Us
│   ├── [no section]   → Animated Cards (LEARN/GROW/INNOVATE)
│   ├── #testimonials  → Testimonials
│   └── #contact-us    → Contact Us + Footer
│
├── /login                            [Public]
├── /register                         [Public]
├── /signup                           [Public]
├── /college-portfolio                [Public]
├── /*                                [Public → UnderConstruction fallback]
│
└── /dashboard/*                      [Private — requires token]
    ├── /                             → Dashboard (requires token only)
    ├── /reports                      → Reports (requires token + verified)
    ├── /students                     → Student Table (requires token + verified)
    ├── /admin/*                      → Admin Routes (requires token + verified)
    ├── /profile/*                    → Profile Routes (requires token + verified)
    ├── /academic/*                   → Academic Routes (requires token + verified)
    ├── /accounts/*                   → Accounts (requires token + verified)
    ├── /tasks/*                      → Tasks (requires token + verified)
    ├── /inventory/*                  → Inventory (requires token + verified)
    ├── /teachers/*                   → Teachers (requires token + verified)
    └── /users/*                      → User Routes (requires token only)
        ├── /info/*   → User Info sub-routes
        └── /detail/* → User Detail sub-routes
```

**Auth Guard Logic:**
- `RequireToken`: redirects to `/login` if no token
- `RequireAuth`: redirects to `/login` if no token; redirects to `/dashboard` if not verified
- Loading state shows: `loading......`

---

## 3. Full Design System Extraction

### 3.1 Color System

#### Global CSS Variables (`src/index.css`)

| Token | Value | Usage |
|---|---|---|
| `--dashboard-gradient` | `linear-gradient(135deg, #0f1527 0%, #202443 50%, #2c4464 100%)` | Body background (dashboard) |
| `--background-dark` | `#0f1527` | Dark background base |
| `--glass-bg` | `rgba(31, 41, 55, 0.7)` | Glassmorphism card background |
| `--glass-border` | `rgba(255, 255, 255, 0.1)` | Glassmorphism border |
| `--glass-highlight` | `rgba(255, 255, 255, 0.05)` | Glassmorphism highlight |
| `--primary-blue` | `#3b82f6` | Primary action blue |
| `--primary-blue-hover` | `#2563eb` | Primary blue hover |
| `--success-green` | `#10b981` | Success state |
| `--success-green-hover` | `#059669` | Success hover |
| `--text-primary` | `#f3f4f6` | Primary text |
| `--text-secondary` | `#d1d5db` | Secondary text |
| `--text-muted` | `#9ca3af` | Muted/disabled text |

#### Landing Page Colors (derived from module CSS)

| Token / Usage | Value | Context |
|---|---|---|
| Brand primary red | `#a50000` | Navbar button bg, close btn bg |
| Brand dark red | `#500606` | Navbar link color, hamburger icon |
| Brand hover red | `#8b0a0a` | Link hover |
| Hero overlay gradient | `rgba(226,190,190,0.5) → rgba(156,28,28,0.9)` | Hero section overlay |
| Accent yellow | `rgb(238, 255, 0)` / `yellow` | Hero tagline, Login button border |
| Programs bg gradient | `#fffbe6 → #ffd580` | Programs section background |
| About Us box bg | `#79222a` | Square photo box background |
| Navbar blur bg | `rgba(255, 250, 230, 0.97)` | Navbar blur when scrolled in hero |
| White | `#ffffff` / `rgb(250,250,250)` | Hero text, logo |

---

### 3.2 Typography

**Global Font Family:**
- Primary: `"Outfit"`, sans-serif (loaded from Google Fonts: `https://fonts.googleapis.com/css2?family=Outfit:wght@100..900`)
- Fallback: sans-serif
- Navbar secondary: `Arial, Helvetica, sans-serif` (for `.nav`)

**Font Sizes:**

| Element | Size |
|---|---|
| Hero h1 | `8vh` (tablet: `6vh`, mobile: `4vh`) |
| Hero h4 | `3vh` (tablet: `2.5vh`, mobile: `2vh`) |
| Hero p | `large` / `1rem` (mobile: `0.9rem`) |
| Nav menu items | `1.3rem` (mobile: `1.5rem`, small mobile: `1.2rem`) |
| Nav button | inherits |
| Body / general | Browser default (16px base) |

**Font Weights:**

| Usage | Weight |
|---|---|
| Nav links | `500` |
| Nav links hovered | `600` |
| Close button label | `bold` |
| Outfit font range | `100–900` (full range available) |

---

### 3.3 Spacing System

**Global CSS Variables:**

| Token | Value |
|---|---|
| `--spacing-xs` | `0.25rem` |
| `--spacing-sm` | `0.5rem` |
| `--spacing-md` | `1rem` |
| `--spacing-lg` | `1.5rem` |
| `--spacing-xl` | `2rem` |
| `--topbar-height` | `100px` |
| `--sidebar-width` | `280px` |

**Layout utility `.main-content-with-sidebar`:**
- Padding: `2rem` (mobile: `1rem`)
- `padding-top`: `calc(100px + 2rem)` (mobile: `calc(100px + 1rem)`)
- At ≥1025px: `margin-left: 280px`, `width: calc(100% - 280px)`

---

### 3.4 Border Radius System

| Usage | Value |
|---|---|
| Hero text card | `30px` (mobile: `20px`) |
| Login / Register buttons | `5px` |
| Nav Contact button | `50px` (pill shape) |
| Course card | `12px` |
| Close button circle | `50%` |
| Hamburger icon | `8px` |

---

### 3.5 Shadows

| Usage | Value |
|---|---|
| Course card | `0 2px 12px rgba(128,0,0,0.08)` |
| Course card hovered | `0 8px 24px rgba(128,0,0,0.15)` |
| Nav scrolled | `0 2px 10px rgba(0,0,0,0.1)` |
| Close button | `0 4px 15px rgba(165,0,0,0.3)` |
| Close button hover | `0 6px 20px rgba(165,0,0,0.4)` |
| Navbar blur bg | `0 2px 16px rgba(200,170,100,0.12)` |
| Mobile nav menu | `-5px 0 10px rgba(0,0,0,0.1)` |

---

### 3.6 Breakpoints

| Name | Value | Behavior |
|---|---|---|
| Mobile | `max-width: 480px` | Reduced font sizes, full-width buttons |
| Tablet | `max-width: 768px` | Hamburger menu activates, stacked buttons |
| Desktop | `min-width: 769px` | Horizontal nav, sidebar enabled at 1025px |
| Sidebar layout | `min-width: 1025px` | `margin-left: 280px` applied to main content |
| Navbar blur | `min-width: 1024px` | Cream blur background on hero scroll |

---

### 3.7 Animations & Transitions

| Animation | Description |
|---|---|
| `fadeInUp` | `opacity: 0, translateY(20px)` → `opacity:1, translateY(0)` over `0.8s ease-out` |
| Hero text elements | Staggered delays: h1 → 0.2s, h4 → 0.4s, p → 0.6s, button → 0.8s |
| Nav links | `transition: all 0.3s ease` |
| Course card hover | `translateY(-8px) scale(1.04)`, `0.3s cubic-bezier(0.25, 0.8, 0.25, 1)` |
| Login/Register button hover | `scale(1.05)`, `transform 0.2s ease-in-out` |
| Mobile nav slide-in | `right: -100%` → `right: 0`, `0.3s ease` |
| Mobile backdrop | `fadeIn` from `opacity:0` to `opacity:1`, `0.3s ease` |
| Close button hover | `scale(1.1)` |
| Nav item hover | `translateY(-2px)` |
| Nav scroll transition | `background 0.3s ease, padding 0.3s ease` |
| IntersectionObserver triggers | `animate-title` class added on scroll into view (threshold: 50%) |

---

## 4. Component Inventory

### 4.1 Landing Page Components

| Component | Location | Purpose | Data Source |
|---|---|---|---|
| `Navbar` | `features/landing/NavBar/Navbar.jsx` | Fixed navigation bar with logo and scroll-aware blur | Static links; logo SVG asset |
| `Hero` | `features/landing/Hero/Hero.jsx` | Full-viewport hero section with heading, tagline, CTA buttons | Hardcoded content; `Home.jpg` bg |
| `Programs` | `features/landing/Programs/Programs.jsx` | Horizontally scrollable course cards with expand/collapse | `coursesData.js` static array |
| `CourseCard` | `features/landing/Programs/Course/CourseCard.jsx` | Individual expandable course card | Props: courseName, description, photo, duration, keyFeatures, icon |
| `School` (ImageSlideshow) | `features/landing/School/School.jsx` | Wrapper for school section; renders facility cards + team | No direct data |
| `MeetTheTeamLeads` | `features/landing/School/Team/TeamLead/MeetTheTeamLeads.jsx` | Facility showcase with parallax mouse effect and modal detail | `teamLeadsData.js` static array |
| `LeadsHeader` | `features/landing/School/Team/TeamLead/LeadsHeader.jsx` | Heading block for facilities section | Hardcoded |
| `TeamLeadsGrid` | `features/landing/School/Team/TeamLead/TeamLeadsGrid.jsx` | Grid layout of facility cards | Props from `teamLeads` array |
| `TeamLeadCard` | `features/landing/School/Team/TeamLead/TeamLeadCard.jsx` | Individual facility clickable card | Props: name, bio, image |
| `MeetTheTeam` | `features/landing/School/Team/MeetTheTeam.jsx` | Horizontal scrollable team member list (mouse-wheel horizontal scroll) | `teamMembers` inline array |
| `TeamHeader` | `features/landing/School/Team/TeamHeader.jsx` | "Meet Our Team" heading block | Hardcoded |
| `TeamMember` | `features/landing/School/Team/TeamMember.jsx` | Individual team member card with name, role, bio, quote, social links | Props: name, role, bio, quote, image, social |
| `AboutUs` | `features/landing/AboutUs/AboutUs.jsx` | Institution history text + interactive photo mosaic | Hardcoded paragraphs; `pngs/` images; `program_3.png` |
| `RoundImage` | `features/landing/AboutUs/RoundImage/RoundImage.jsx` | Circular image display | Props: imageSrc, altText |
| `SquareBox` | `features/landing/AboutUs/SquareBox/SquareBox.jsx` | Clickable square photo box with quote reveal | Props: id, imageSrc, backgroundColor, onClick |
| `AnimatedCards` | `features/landing/Moto/AnimatedCards.jsx` | Three interactive motto cards (LEARN, GROW, INNOVATE) with click animation | Hardcoded; react-icons |
| `Testimonials` | `features/landing/Testemonials/Testomonial.jsx` | Single-card testimonial slider with left/right arrows | `testimonialsData` inline array |
| `ContactUs` | `features/landing/ContactUs/ContactUs.jsx` | Contact section wrapper | Composes sub-components |
| `ContactCard` | `features/landing/ContactUs/ContactCard.jsx` | Individual contact info card (phone/email/location) | Props: icon, title, detail, animationDelay, clickableCard, onClick |
| `ContactForm` | `features/landing/ContactUs/ContactForm.jsx` | Email contact form using EmailJS | EmailJS API |
| `SocialMedia` | `features/landing/ContactUs/SocialMedia.jsx` | Social media icon links (Follow Us) | Static `socialLinks` array |
| `SocialButtons` | `features/landing/SocialMediaButtons/SocialButtons.jsx` | Fixed floating WhatsApp + Messenger buttons | Hardcoded URLs |

---

### 4.2 Common / Shared Components

| Component | Location | Purpose |
|---|---|---|
| `ModalNotification` | `components/common/ModalNotification.jsx` | Modal popup notification |
| `Notification` | `components/common/Notification.jsx` | Inline notification banner |
| `VerificationWarningModal` | `components/common/VerificationWarningModal.jsx` | Warning modal for unverified accounts |
| `MultiStepForm` | `components/common/MultiStepForm/` | Multi-step form wrapper (used in registration) |

---

### 4.3 Admin / Dashboard Components

| Component | Location | Purpose |
|---|---|---|
| `Dashboard` | `features/admin/Dashboard/Dashboard.jsx` | Main dashboard page |
| `Reports` | `features/admin/Reports/Reports.jsx` | Reports page |
| `StudentTable` (Students) | `features/admin/Students/Students.jsx` | Student management table |
| `Accounts` | `features/admin/Accounts/Accounts.jsx` | Accounts management |
| `Tasks` | `features/admin/Tasks/Tasks.jsx` | Tasks management |
| `Inventory` | `features/admin/Inventory/Inventory.jsx` | Inventory management |
| `Teachers` | `features/admin/Teachers/Teachers.jsx` | Teachers management |
| `Login` | `features/admin/Login/Login/Login.jsx` | Login form |
| `Register` | `features/admin/Login/Register/Register.jsx` | Register form |
| `SignUpForm` | `features/admin/Login/signup/SignUpForm.jsx` | Sign-up multi-step form |
| `Portfolio` | `features/admin/Profile/Portfolio/Portfolio.jsx` | College portfolio page |
| `UnderConstruction` | `features/admin/UnderConstruction.jsx` | Fallback 404-like page ("🚧 Site Under Construction 🚧") |

---

### 4.4 Route Components

| Component | Location | Purpose |
|---|---|---|
| `AppRoutes` | `routes/index.jsx` | Root router: splits private vs public |
| `PublicRoutes` | `routes/PublicRoutes.jsx` | Public route definitions |
| `PrivateRoutes` | `routes/PrivateRoutes.jsx` | Protected route wrapper with RequireToken / RequireAuth guards |
| `HomeRoutes` | `routes/HomeRoutes.jsx` | Single-page Home layout with all landing sections |
| `AdminRoutes` | `routes/DashBoardRoutes/Admin/AdminRoutes.jsx` | Admin dashboard sub-routes |
| `ProfileRoutes` | `routes/DashBoardRoutes/Profile/ProfileRoutes.jsx` | Profile sub-routes |
| `AcademicRoutes` | `routes/DashBoardRoutes/Academics/AcademicRoutes.jsx` | Academic sub-routes |
| `UserRoutes` | `routes/UsersRoutes/UserRoutes.jsx` | User sub-router |
| `UserInfoRoutes` | `routes/UsersRoutes/infoRoutes.jsx` | User info sub-routes |
| `UserDetail` | `routes/UsersRoutes/detailRoutes.jsx` | User detail sub-routes |
| `ScrollToSection` | `routes/ScrollTo.jsx` | Smooth scroll behavior for anchor links |

---

## 5. Asset Inventory

### 5.1 Logo

| File | Path |
|---|---|
| Logo (SVG) | `src/assets/logo.svg` |

---

### 5.2 Hero Image

| File | Path |
|---|---|
| Hero background | `src/assets/Images/Home.jpg` |

---

### 5.3 Course / Program Images

| File | Path | Used In |
|---|---|---|
| cs.png | `src/assets/Images/cs.png` | ADCS course card |
| program_2.png | `src/assets/Images/program_2.png` | ADHM course card; School slideshow |
| program_3.png | `src/assets/Images/program_3.png` | Business Studies card; School slideshow; About Us main image |
| hmimgs.png | `src/assets/Images/hmimgs.png` | +2 Hotel Management card |
| adhm.jpg | `src/assets/Images/adhm.jpg` | DHM course card |
| css.png | `src/assets/Images/css.png` | +2 Computer Science card |
| preschool.png | `src/assets/Images/preschool.png` | Pre-School to Secondary card |
| program_1.png | `src/assets/Images/program_1.png` | School slideshow (images array) |

---

### 5.4 Course & Program Icons (SVG)

| File | Path | Used In |
|---|---|---|
| adcs-icon.svg | `src/assets/Icons/adcs-icon.svg` | ADCS course |
| adhm-icon.svg | `src/assets/Icons/adhm-icon.svg` | ADHM course |
| dhm-icon.svg | `src/assets/Icons/dhm-icon.svg` | DHM course |
| bs-icon.svg | `src/assets/Icons/bs-icon.svg` | Business Studies |
| hm-icon.svg | `src/assets/Icons/hm-icon.svg` | +2 Hotel Management |
| cs-icon.svg | `src/assets/Icons/cs-icon.svg` | +2 Computer Science |
| school-icon.svg | `src/assets/Icons/school-icon.svg` | Pre-School to Secondary |
| python.png | `src/assets/Icons/python.png` | (imported, available) |

---

### 5.5 Facility Images (F folder)

| File | Path | Used For |
|---|---|---|
| F/1.png | `src/assets/F/1.png` | Science Laboratory |
| F/2.png | `src/assets/F/2.png` | (available) |
| F/3.png | `src/assets/F/3.png` | STEM R&D Center |
| F/4.png | `src/assets/F/4.png` | Music and Performing Arts Room |
| F/5.png | `src/assets/F/5.png` | Agro Farming Learning Center |
| F/6.png | `src/assets/F/6.png` | Library and Resource Center |
| F/7.png | `src/assets/F/7.png` | Medical and Wellness Center |
| F/8.png | `src/assets/F/8.png` | Art and Creativity Studio |
| F/9.png | `src/assets/F/9.png` | Auditorium Hall |
| F/10.png | `src/assets/F/10.png` | AI and Robotics Lab |
| F/11.png | `src/assets/F/11.png` | Cafeteria and Dining Hall |
| F/12.png | `src/assets/F/12.png` | Advanced Computer Laboratory |
| F/13.png | `src/assets/F/13.png` | Agro Farming Learning Center (alt) |

---

### 5.6 Team Member Photos

| File | Path | Person |
|---|---|---|
| aalok.jpg | `src/assets/Images/aalok.jpg` | AALOK KARKI |
| bibek.jpg | `src/assets/Images/bibek.jpg` | BIBEK NEPAL |
| sumans.png | `src/assets/Images/sumans.png` | SUMAN SHRESTHA |
| sumanu.png | `src/assets/Images/sumanu.png` | SUMAN UPRETY |
| pramila.png | `src/assets/Images/pramila.png` | PRAMILA BAJGAIN |
| nirmal.png | `src/assets/Images/nirmal.png` | NIRMAL KHANAL |
| janardhan.png | `src/assets/Images/janardhan.png` | JANARDAN DAHAL |
| pritam.png | `src/assets/Images/pritam.png` | PRITAM KOIRALA |

---

### 5.7 Testimonial Photos

| File | Path | Person |
|---|---|---|
| CHOUHAN.png | `src/assets/Images/CHOUHAN.png` | Pranil Chauhan |
| arpanksharma.png | `src/assets/Images/arpanksharma.png` | Arpan Khatiwada |
| sadikshya.png | `src/assets/Images/sadikshya.png` | Sadikshya Khadka |
| sandhya.png | `src/assets/Images/sandhya.png` | Sandhya Mukhiya |

---

### 5.8 About Us Photo Grid

| File | Path |
|---|---|
| pngs/1.png – pngs/9.png | `src/assets/pngs/1.png` through `src/assets/pngs/9.png` |

---

### 5.9 Other Images in /Images

Additional images present (full school photography, may be used in gallery or other sections):

```
src/assets/Images/IMG_2363.JPG
src/assets/Images/IMG_2426 (1).JPG
src/assets/Images/IMG_7702.JPG
src/assets/Images/IMG_7709.JPG
src/assets/Images/IMG_7718.JPG
src/assets/Images/IMG_8024.JPG
src/assets/Images/IMG_8025.JPG
src/assets/Images/IMG_8026.JPG
src/assets/Images/IMG_8027.JPG
src/assets/Images/IMG_8030.JPG
src/assets/Images/IMG_8031 (1).JPG
src/assets/Images/IMG_8031.JPG
src/assets/Images/IMG_8032.JPG
src/assets/Images/Untitled design.png
src/assets/Images/cs.JPG
```

---

## 6. Data Source Mapping

| Section | Data Source | Type |
|---|---|---|
| Courses / Programs | `features/landing/Programs/coursesData.js` | Static JS array |
| Facility / School Labs | `features/landing/School/Team/TeamLead/teamLeadsData.js` | Static JS array |
| Team Members | `features/landing/School/Team/MeetTheTeam.jsx` (inline) | Hardcoded in component |
| Testimonials | `features/landing/Testemonials/Testomonial.jsx` (inline) | Hardcoded in component |
| About Us text | `features/landing/AboutUs/AboutUs.jsx` (inline) | Hardcoded in JSX |
| Contact info | `features/landing/ContactUs/ContactUs.jsx` (inline) | Hardcoded in JSX |
| Social links (footer) | `features/landing/ContactUs/SocialMedia.jsx` (inline) | Hardcoded in component |
| Contact form submission | EmailJS API | Third-party service |
| WhatsApp / Messenger | `SocialButtons.jsx` (inline URLs) | Hardcoded |
| Auth / User data | `Context/AuthContext.jsx` | React context (API-backed) |
| Base API URL | `App.jsx` (env-style const) | Hardcoded: `https://bishamsinchiury.com.np/api` (prod) |
| Media URL | `App.jsx` | Hardcoded: `https://bishamsinchiury.com.np/media/` (prod) |
| Dashboard data | Backend REST API (`/api/*`) | Axios API calls |
| Image assets | `/src/assets/` | Local static files |

---

## 7. SEO Extraction

### 7.1 Page Title

```html
<title>Eecohm Foundation</title>
```

### 7.2 Meta Tags

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

_No meta description, OG tags, or Twitter Card tags are defined in the current codebase._

### 7.3 Favicon

```html
<link rel="icon" type="image/svg+xml" href="./src/assets/logo.svg" />
```

### 7.4 Language

```html
<html lang="en">
```

### 7.5 SEO Gaps (currently missing)

- `<meta name="description">` — not set
- Open Graph tags (`og:title`, `og:description`, `og:image`) — not set
- Twitter Card tags — not set
- Structured data / JSON-LD — not set
- Canonical URLs — not set
- Sitemap — not present

---

## 8. Rebuild Instructions

### 8.1 Recommended Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router DOM v7 |
| Styling | Vanilla CSS (CSS Modules per component) |
| Font | Google Fonts — Outfit (wght 100–900) |
| Icons | react-icons (FaBars, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaWhatsapp, FaFacebookMessenger) + lucide-react |
| Animations | Framer Motion + CSS keyframes |
| Email | EmailJS (`@emailjs/browser`) |
| Deployment | Vercel (with `vercel.json` SPA rewrites) |
| Auth/API | Axios + JWT token (backend: `https://bishamsinchiury.com.np/api`) |

---

### 8.2 Recommended Folder Structure

```
src/
├── assets/
│   ├── logo.svg
│   ├── Images/           ← all JPG/PNG image files
│   ├── Icons/            ← SVG course icons
│   ├── F/                ← facility images (1–13)
│   └── pngs/             ← about us mosaic (1–9)
│
├── components/
│   └── common/           ← shared UI: Modal, Notification, MultiStepForm
│
├── context/
│   ├── AuthContext.jsx
│   └── BaseUrlContext.jsx
│
├── features/
│   ├── landing/
│   │   ├── Navbar/
│   │   ├── Hero/
│   │   ├── Programs/
│   │   │   ├── Course/CourseCard.jsx
│   │   │   └── coursesData.js
│   │   ├── School/
│   │   │   └── Team/
│   │   │       ├── MeetTheTeam.jsx
│   │   │       └── TeamLead/
│   │   │           ├── teamLeadsData.js
│   │   │           ├── MeetTheTeamLeads.jsx
│   │   │           ├── TeamLeadsGrid.jsx
│   │   │           └── TeamLeadCard.jsx
│   │   ├── AboutUs/
│   │   ├── Moto/
│   │   ├── Testimonials/
│   │   ├── ContactUs/
│   │   └── SocialMediaButtons/
│   └── admin/
│       ├── Dashboard/
│       ├── Login/
│       ├── Profile/
│       ├── Students/
│       ├── Teachers/
│       ├── Reports/
│       ├── Accounts/
│       ├── Tasks/
│       ├── Inventory/
│       └── UnderConstruction.jsx
│
├── hooks/                ← custom React hooks
├── routes/
│   ├── index.jsx
│   ├── PublicRoutes.jsx
│   ├── PrivateRoutes.jsx
│   ├── HomeRoutes.jsx
│   ├── ScrollTo.jsx
│   ├── DashBoardRoutes/
│   │   ├── Admin/
│   │   ├── Profile/
│   │   └── Academics/
│   └── UsersRoutes/
│
├── utils/
├── validators/
├── index.css             ← global design tokens
└── main.jsx
```

---

### 8.3 Global CSS Variables to Re-declare

```css
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap");

:root {
  /* Dashboard / App Shell */
  --dashboard-gradient: linear-gradient(135deg, #0f1527 0%, #202443 50%, #2c4464 100%);
  --background-dark: #0f1527;
  --glass-bg: rgba(31, 41, 55, 0.7);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-highlight: rgba(255, 255, 255, 0.05);
  --primary-blue: #3b82f6;
  --primary-blue-hover: #2563eb;
  --success-green: #10b981;
  --success-green-hover: #059669;
  --text-primary: #f3f4f6;
  --text-secondary: #d1d5db;
  --text-muted: #9ca3af;

  /* Layout */
  --topbar-height: 100px;
  --sidebar-width: 280px;

  /* Spacing Scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Brand Colors (landing page) */
  --brand-primary: #a50000;
  --brand-dark: #500606;
  --brand-hover: #8b0a0a;
  --brand-accent-yellow: rgb(238, 255, 0);
}
```

---

### 8.4 Key Rebuild Considerations

1. **Single Page App:** The entire public-facing website is a single page (`/`) with anchor-scroll navigation. All content lives in `HomeRoutes.jsx`. Rebuild as one long scrollable page.

2. **Content is 100% static (no CMS):** All landing page text, team data, course descriptions, and facility info are hardcoded in JS/JSX files. To make it maintainable, extract all static data arrays to a centralized `data/` folder.

3. **Responsive Design:** Three explicit breakpoints — 480px, 768px, 1025px. Use these exactly to preserve layout behavior.

4. **Navbar Behavior:** Must be position:fixed, transparent by default. Blur + cream background activates only on desktop (≥1024px) when user is scrolled within (but not at the top of) the hero section. On mobile, slides in from right.

5. **Section anchors:** Use `id="hero"`, `id="programs"`, `id="school"`, `id="about-us"`, `id="testimonials"`, `id="contact-us"` on section elements.

6. **EmailJS:** Configure with the existing service/template/key IDs listed in section 1.10. The contact form sends to `eecohmplustwo@gmail.com` and auto-replies to the submitter.

7. **Private dashboard:** The entire dashboard (`/dashboard/*`) is behind JWT auth. The `RequireToken` check is simpler (token existence) while `RequireAuth` also checks `verified` status. Keep this two-tier auth guard.

8. **Asset preservation:** All photos, icons, and logos in `src/assets/` must be preserved exactly. The institution's photography in `Images/` (IMG_*.JPG files) is real school photography and should not be replaced.

9. **SEO improvements to add on rebuild:**
   - Add `<meta name="description" content="EECOHM School of Excellence — Comprehensive education from Pre-school to High School Diploma and Advanced Diplomas in Hotel Management and Computer Science. Located in Birtamod Jhapa, Nepal.">`
   - Add Open Graph tags with logo as image
   - Update page title to: `EECOHM School of Excellence` (more descriptive than "Eecohm Foundation")
   - Add JSON-LD structured data for EducationalOrganization

10. **WhatsApp / Facebook Messenger buttons:** The Messenger link (`https://m.me/yourfacebookpageid`) is a placeholder. The WhatsApp number `+977 985-2646392` is real and should be preserved.

11. **Twitter social link is a placeholder** (`https://twitter.com/example`) — confirm real URL before rebuilding.

12. **Production API Base URL:** `https://bishamsinchiury.com.np/api` — use environment variables (`VITE_API_URL`) instead of hardcoding in `App.jsx`.

---

*End of EECOHM Website Rebuild Master Document*
*Extracted: 2026-03-25 | Source: /home/bisham/Code/website*
