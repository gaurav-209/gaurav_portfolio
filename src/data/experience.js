// Career timeline, newest first (source: resume). Kept short on purpose: project details live in the
// Projects section, so work entries link there instead of repeating them.
//
// type:  "work" | "internship" | "training" | "education" | "earlier" (pre-development roles, shown smaller)
// start / end: "YYYY-MM" (or "YYYY" for education); end: "present" while ongoing.
// summary: one short line.
// highlights: 2–3 short points about what you did there (shown as a list on the card).
// tech: technologies used in that role (shown as small tags). projects: project slugs (see data/projects.js).
export const timeline = [
  {
    type: "work",
    role: "Software Engineer – Product Development",
    company: "Greatbear Ventures Private Limited",
    location: "Ahmedabad",
    start: "2025-10",
    end: "2026-11",
    summary: "Building Swiftfolios: React web app, Node.js/MySQL APIs and Electron trading desktops.",
    highlights: [
      "Built most of the mutual-fund module and the custom report management module.",
      "Developed REST APIs with Zerodha Kite and NSE integrations and role-based access for every user type.",
      "Shipped Electron desktop features: live market-feed health checks, FIX order handling and auto-updates.",
    ],
    tech: ["React", "Node.js", "Express", "MySQL", "Electron"],
    projects: ["swiftfolios-web", "dealer-console", "desktop-console"],
  },
  {
    type: "internship",
    role: "Web Development Intern",
    company: "Greatbear Ventures Private Limited",
    location: "Ahmedabad",
    start: "2025-07",
    end: "2025-10",
    summary: "Joined the Swiftfolios team, then moved into the product engineering role.",
    highlights: [
      "Learned the Swiftfolios codebase across the web app, API and desktop apps.",
      "Moved into a full-time engineering role after three months.",
    ],
    tech: ["React", "JavaScript", "Tailwind CSS"],
  },
  {
    type: "training",
    role: "React.js Training",
    company: "Technishal",
    start: "2024-12",
    end: "2024-12",
    summary: "Components, props, state, hooks and UI development.",
    highlights: ["Built practice apps with reusable components, state and hooks."],
    tech: ["React", "JavaScript"],
  },
  {
    type: "earlier",
    role: "Cashless Officer",
    company: "Medilink Hospital",
    start: "2023-03",
    end: "2024-10",
    summary: "Cashless insurance and claim settlements with TPAs.",
    highlights: ["Coordinated with third-party administrators and kept claim documentation in order."],
  },
  {
    type: "earlier",
    role: "Customer Care Associate",
    company: "Shoppers Stop",
    start: "2020-10",
    end: "2023-03",
    summary: "Customer service, billing and POS operations.",
    highlights: ["Helped customers with product choices, billing and inventory."],
  },
  {
    type: "education",
    role: "B.Tech, Computer Engineering",
    company: "Silver Oak University",
    start: "2020",
    end: "2024",
    summary: "Programming, data structures, databases and web development.",
  },
];
