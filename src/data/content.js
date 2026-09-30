// ─── EECOHM School of Excellence — Single source of truth ───────────────────
// All content extracted from organization_data.md. Do not invent facts.

export const org = {
  name: "EECOHM School of Excellence",
  fullName: "Eastern Empire College Of Hotel Management",
  tagline: "Shaping careers through excellence in hospitality, computer science, and business since 2015.",
  established: 2015,
  affiliation: "Nepal Examinations Board (NEB)",
  eligibility: "SEE Passed (Grade 10 or equivalent)",
  admissions: "Rolling Admissions — Apply any time, seats fill fast",
  address: "Birtamod-4, Jhapa, Koshi Province, Nepal",
  phone: "023-536392",
  email: "eecohm@gmail.com",
  mapsUrl: "https://www.google.com/maps/place/EECOHM+College/@26.643542,87.9692917,17z",
  social: {
    facebook: "https://www.facebook.com/eecohmschoolofexcellence",
    instagram: "https://www.instagram.com/eecohm_college?igsh=NzRmMWpyM2JpaW42",
    linkedin: "https://www.linkedin.com/company/106791483/",
  },
};

export const stats = [
  { value: 10, suffix: "+", label: "Years of Excellence" },
  { value: 7, suffix: "", label: "Programs Offered" },
  { value: 12, suffix: "+", label: "World-Class Facilities" },
  { value: 1000, suffix: "+", label: "Students Shaped" },
];

export const programs = [
  {
    slug: "advanced-diploma-computer-science",
    name: "+2 with Advanced Diploma in Computer Science",
    shortName: "Computer Science",
    acronym: "ADCS",
    duration: "2 Years",
    icon: "/images/Icons/adcs-icon.svg",
    image: "/images/Images/cs.webp",
    description:
      "This program equips future software developers, network administrators, and IT professionals with essential practical and theoretical skills.",
    features: [
      "Dual Certification: NEB + Advanced Diploma in Computer Science",
      "Industry Relevant Curriculum",
      "Hands-on Web & Software Development",
      "Career Oriented Approach",
      "Programming in C++, Python, SQL",
      "Networking Fundamentals",
    ],
    color: "#0D5C63",
    category: "technology",
    glb: "/glb/eecohm_laptop.glb",
  },
  {
    slug: "advanced-diploma-hotel-management",
    name: "+2 with Advanced Diploma in Hotel Management",
    shortName: "Hotel Management (ADHM)",
    acronym: "ADHM",
    duration: "2 Years",
    icon: "/images/Icons/adhm-icon.svg",
    image: "/images/Images/adhm.webp",
    description:
      "This specialized program helps students enhance their career prospects in the dynamic hospitality industry with internationally recognized credentials.",
    features: [
      "Dual Certification: NEB & UK-Accredited Diploma",
      "Practical Training & Internship Opportunities",
      "Job Opportunities in Nepal and Internationally",
      "Industry-Relevant Hospitality Skills",
    ],
    color: "#8B4513",
    category: "hospitality",
    glb: "/glb/eecohm_chef_hat.glb",
  },
  {
    slug: "diploma-hotel-management",
    name: "Diploma in Hotel Management",
    shortName: "Hotel Management (DHM)",
    acronym: "DHM",
    duration: "1 Year",
    icon: "/images/Icons/dhm-icon.svg",
    image: "/images/Images/dhm.webp",
    description:
      "A great starting point for a rewarding career in one of the largest and most dynamic industries in the world, ensuring students gain international-standard hospitality skills.",
    features: [
      "Industry-Focused Curriculum with Practical Training",
      "Internship Placement in Top Hotels & Restaurants",
      "Experienced Faculty",
      "Opportunities for Certification",
    ],
    color: "#7B5E3A",
    category: "hospitality",
    glb: "/glb/eecohm_chef_hat.glb",
  },
  {
    slug: "business-studies",
    name: "+2 with Business Studies",
    shortName: "Business Studies",
    acronym: "BS",
    duration: "2 Years",
    icon: "/images/Icons/bs-icon.svg",
    image: "/images/Images/program_1.webp",
    description:
      "This program equips students with foundational business knowledge and critical thinking skills essential for modern commerce.",
    features: [
      "Business Fundamentals",
      "Finance Basics",
      "Marketing Strategies",
      "Entrepreneurship",
    ],
    color: "#2E5902",
    category: "business",
    glb: "/glb/eecohm_book.glb",
  },
  {
    slug: "plus-two-hotel-management",
    name: "+2 with Hotel Management",
    shortName: "Hotel Management (+2)",
    acronym: "HM",
    duration: "2 Years",
    icon: "/images/Icons/hm-icon.svg",
    image: "/images/Images/hmimgs.webp",
    description:
      "This course introduces students to the hospitality industry with a focus on practical skills and foundational academic excellence.",
    features: [
      "Hospitality Industry Introduction",
      "Practical Skills Training",
      "Finance & Marketing Basics",
      "Entrepreneurship Fundamentals",
    ],
    color: "#6B4226",
    category: "hospitality",
    glb: "/glb/eecohm_chef_hat.glb",
  },
  {
    slug: "plus-two-computer-science",
    name: "+2 with Computer Science",
    shortName: "Computer Science (+2)",
    acronym: "CS",
    duration: "2 Years",
    icon: "/images/Icons/cs-icon.svg",
    image: "/images/Images/cs.webp",
    description:
      "This program blends computer science with business education for a comprehensive learning experience combining technology and commerce.",
    features: [
      "Computing Fundamentals",
      "Business & Finance Basics",
      "Marketing with Technology",
      "Entrepreneurship Focus",
    ],
    color: "#1A5276",
    category: "technology",
    glb: "/glb/eecohm_laptop.glb",
  },
  {
    slug: "pre-school-to-secondary",
    name: "Pre-School to Secondary",
    shortName: "Pre-School to Secondary",
    acronym: "PG–SEC",
    duration: "10 Years",
    icon: "/images/Icons/school-icon.svg",
    image: "/images/Images/preschool.webp",
    description:
      "A complete educational journey from pre-school to secondary levels, offering a holistic foundation for lifelong learning.",
    features: [
      "Holistic Education from Early Childhood",
      "Skill Development Programs",
      "Strong Academic Foundation",
      "Extracurricular Activities",
    ],
    color: "#6C3483",
    category: "school",
    glb: "/glb/eecohm_diploma_scroll.glb",
  },
];

export const facilities = [
  {
    id: 1,
    name: "AI and Robotics Innovation Lab",
    description: "Fosters hands-on learning in AI, robotics, and automation.",
    image: "/images/F/1.webp",
    icon: "Bot",
  },
  {
    id: 2,
    name: "Advanced Computer Laboratory",
    description: "High-performance computers and latest software for digital learning.",
    image: "/images/F/2.webp",
    icon: "Monitor",
  },
  {
    id: 3,
    name: "STEM Research & Development Center",
    description: "Hub for innovation and real-world technology projects.",
    image: "/images/F/3.webp",
    icon: "FlaskConical",
  },
  {
    id: 4,
    name: "Auditorium & Events Hall",
    description: "Grand venue for academic seminars and cultural performances.",
    image: "/images/F/4.webp",
    icon: "Theater",
  },
  {
    id: 5,
    name: "Agro Farming Learning Center",
    description: "Introduces students to sustainable agriculture and modern farming.",
    image: "/images/F/5.webp",
    icon: "Sprout",
  },
  {
    id: 6,
    name: "Library & Resource Center",
    description: "Vast collection of books, journals, and digital resources.",
    image: "/images/F/6.webp",
    icon: "BookOpen",
  },
  {
    id: 7,
    name: "Sports & Fitness Complex",
    description: "Modern facilities for various indoor and outdoor sports.",
    image: "/images/F/7.webp",
    icon: "Dumbbell",
  },
  {
    id: 8,
    name: "Art & Creativity Studio",
    description: "Vibrant space for painting, sculpture, and design.",
    image: "/images/F/8.webp",
    icon: "Palette",
  },
  {
    id: 9,
    name: "Science Laboratory",
    description: "Hands-on experience in physics, chemistry, and biology.",
    image: "/images/F/9.webp",
    icon: "Microscope",
  },
  {
    id: 10,
    name: "Music & Performing Arts Room",
    description: "Designed for musical training, drama, and dance.",
    image: "/images/F/10.webp",
    icon: "Music",
  },
  {
    id: 11,
    name: "Cafeteria & Dining Hall",
    description: "Nutritious meals in a welcoming environment.",
    image: "/images/F/11.webp",
    icon: "UtensilsCrossed",
  },
  {
    id: 12,
    name: "Medical & Wellness Center",
    description: "Healthcare services, counseling, and wellness programs.",
    image: "/images/F/12.webp",
    icon: "HeartPulse",
  },
];

export const team = [
  {
    name: "Aalok Karki",
    role: "Chief Executive Officer",
    phone: "9852646392",
    email: "eecohm.ceo@gmail.com",
    image: "/images/Images/aalok.webp",
  },
  {
    name: "Bibek Nepal",
    role: "Operational Executive",
    phone: "9861760481",
    email: "eecohm.coordinator@gmail.com",
    image: "/images/Images/bibek.webp",
  },
  {
    name: "Suman Shrestha",
    role: "Finance Executive",
    phone: "9817932424",
    email: "eecohm.finance@gmail.com",
    image: "/images/Images/sumans.webp",
  },
  {
    name: "Suman Uprety",
    role: "Marketing Executive",
    phone: "9818489385",
    email: "upretysuman9@gmail.com",
    image: "/images/Images/sumanu.webp",
  },
  {
    name: "Pramila Bajgain",
    role: "Academic Executive",
    phone: "9842656772",
    email: "pramilab283@gmail.com",
    image: "/images/Images/pramila.webp",
  },
  {
    name: "Nirmal Khanal",
    role: "Operational Coordinator",
    phone: "9829726461",
    email: "eecohm@gmail.com",
    image: "/images/Images/nirmal.webp",
  },
  {
    name: "Janardan Dahal",
    role: "Operating Officer",
    phone: "9815908872",
    email: "eecohm@gmail.com",
    image: "/images/Images/janardhan.webp",
  },
  {
    name: "Pritam Koirala",
    role: "Finance Officer",
    phone: "9801430110",
    email: "pritamkoirala@gmail.com",
    image: "/images/Images/pritam.webp",
  },
];

export const testimonials = [
  {
    name: "Pranil Chauhan",
    role: "CEO @ Next Gen Learners",
    stars: 5,
    quote:
      "As a faculty member at EECOHM College, I am committed to bridging the gap between theoretical learning and real-world business applications. EECOHM truly delivers on its promise of excellence.",
    image: "/images/Images/CHOUHAN.webp",
  },
  {
    name: "Arpan Khatiwada",
    role: "Co-owner, BEES International Education Services",
    stars: 4,
    quote:
      "Having dedicated four years to teaching English at EECOHM School of Excellence, I can confidently say that it is a truly rewarding environment for both educators and students alike.",
    image: "/images/Images/arpanksharma.webp",
  },
  {
    name: "Sadikshya Khadka",
    role: "Executive Vice President, Bahradashi Jaycees",
    stars: 5,
    quote:
      "A School where excellence is not just taught but lived, preparing students to lead and inspire. Keep learning, keep growing, and keep inspiring — your potential is limitless!",
    image: "/images/Images/sadikshya.webp",
  },
  {
    name: "Sandhya Mukhiya",
    role: "Front Office, Hotel Management (Former Student)",
    stars: 5,
    quote:
      "Studying at EECOHM College has been a truly rewarding experience, and I am incredibly grateful for the opportunity. The practical training prepared me for my career from day one.",
    image: "/images/Images/sandhya.webp",
  },
];

export const philosophy = [
  {
    key: "LEARN",
    heading: "Learn",
    description:
      "A strong academic foundation built on NEB-affiliated curricula, experienced faculty, and hands-on practical training that goes beyond textbooks.",
    icon: "GraduationCap",
  },
  {
    key: "GROW",
    heading: "Grow",
    description:
      "Internship partnerships with leading hotels, IT firms, and businesses in Nepal and abroad give every student real-world experience before graduation.",
    icon: "TrendingUp",
  },
  {
    key: "INNOVATE",
    heading: "Innovate",
    description:
      "From AI labs to culinary kitchens, our state-of-the-art facilities challenge students to think creatively and develop solutions that matter.",
    icon: "Lightbulb",
  },
];

export const seo = {
  "/": {
    title: "EECOHM School of Excellence — Jhapa, Nepal",
    description:
      "Leading academic institution in Jhapa offering Computer Science, Hotel Management & Business programs since 2015. NEB-affiliated, dual certifications available.",
  },
  "/about": {
    title: "About EECOHM — Our Story & Team | EECOHM School of Excellence",
    description:
      "Discover how EECOHM evolved from a single hospitality program to a full School of Excellence in Jhapa, Nepal, in just 10 years.",
  },
  "/programs": {
    title: "Programs & Courses — EECOHM School of Excellence",
    description:
      "Explore NEB-affiliated programs in Computer Science, Hotel Management, Business Studies, and Pre-School to Secondary education in Jhapa, Nepal.",
  },
  "/facilities": {
    title: "World-Class Facilities — EECOHM School of Excellence",
    description:
      "AI lab, STEM center, culinary kitchen, auditorium and 12 more world-class facilities at EECOHM School of Excellence, Birtamod, Jhapa.",
  },
  "/contact": {
    title: "Contact EECOHM — Birtamod, Jhapa | EECOHM School of Excellence",
    description:
      "Reach EECOHM School of Excellence: +977-23-536392, Birtamod-4, Jhapa, Koshi Province, Nepal. Rolling admissions open.",
  },
};
