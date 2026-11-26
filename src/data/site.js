export const site = {
  name: "Gaurav Mahavar",
  initials: "GM",
  title: "Full-Stack Developer",
  // Hero: the big heading is `title` (its last word gets the orange gradient); `heroLine` is the one sentence under it.
  // Says what you deliver; the tech is already in the pill (`heroTags`), so don't repeat it here.
  heroLine: "I turn complex workflows into fast, reliable web and desktop apps.",
  // Keywords in the pill above the hero heading.
  heroTags: ["Software Engineer", "React", "Node.js"],
  tagline: "A Full-Stack Developer who builds practical, reliable and scalable web and desktop applications.",
  location: "Ahmedabad, Gujarat, India",
  email: "gauravmahavar2002@gmail.com",
  github: "https://github.com/gaurav-209",
  linkedin: "https://www.linkedin.com/in/gaurav-mahavar-688114215",
  resume: "/resume/Gaurav-Mahavar-Resume.pdf",
  photo: "/images/projects/profile-image.jpeg",
  // Back of the photo card: it flips to this while scrolling from the hero into the About section.
  aboutPhoto: "/images/projects/about-image.jpeg",
  coreTechnologies: ["React.js", "Node.js", "Electron", "MySQL"],
};

// About section.
// The second paragraph and the "how I work" line come from `philosophy` below.
export const about = {
  howIWork: "understand() → build() → simplify()",
  firstName: "Gaurav",
  roleLines: ["Software Engineer", "& Full-Stack Developer."],
  // My story, told in short paragraphs (from the resume timeline). Each paragraph is [text, highlight?] pairs;
  // highlighted parts are shown in orange.
  story: [
    [
      ["After roles in ", false],
      ["customer care", true],
      [" and ", false],
      ["hospital insurance claims", true],
      [", I went all in on code in 2024. Today I build ", false],
      ["web apps, desktop apps and business websites", true],
      [" at Greatbear Ventures and for my own clients.", false],
    ],
  ],


};

// The two faces of the photo card (hero front → About back). `position` is the photo's focal point.
// A face without eyebrow/title shows the photo with no caption.
export const photoCards = {
  front: { src: site.photo, alt: site.name, eyebrow: "Full-Stack Developer", title: site.name, position: "50% 30%" },
  back: { src: site.aboutPhoto, alt: `${site.name}, smiling, in a checked shirt`, position: "50% 22%" },
};

export const philosophy = {
  headline: "Good software is more than just writing code.",
  description:
    "Building a successful application requires understanding the problem, designing the right experience and creating a reliable technical foundation.",
  principles: [
    {
      number: "01",
      title: "Understand Before Building",
      description:
        "Understand business requirements, users and real-world challenges before writing code.",
    },
    {
      number: "02",
      title: "Build for Maintainability",
      description:
        "Write structured, reusable and scalable code that can evolve with the application.",
    },
    {
      number: "03",
      title: "Focus on Usability",
      description:
        "Create interfaces that make complex workflows easier to understand and use.",
    },
  ],
};

// Navbar links, in page order. The logo stands in for "Home" (it's highlighted while the hero is on screen).
export const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/#skills" },
];
