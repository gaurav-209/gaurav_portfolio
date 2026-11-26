// Career timeline, newest first (source: resume). Kept short on purpose: project details live in the
// Projects section, so work entries link there instead of repeating them.
//
// type:  "work" | "internship" | "training" | "education" | "earlier" (pre-development roles, shown smaller)
// start / end: "YYYY-MM" (or "YYYY" for education); end: "present" while ongoing.
// summary: one short line. projects: project slugs (see data/projects.js) shown as links.
export const timeline = [
  {
    type: "work",
    role: "Software Engineer – Product Development",
    company: "Greatbear Ventures Private Limited",
    location: "Ahmedabad",
    start: "2025-10",
    end: "2026-11",
    summary: "Building Swiftfolios: React web app, Node.js/MySQL APIs and Electron trading desktops.",
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
  },
  {
    type: "training",
    role: "React.js Training",
    company: "Technishal",
    start: "2024-12",
    end: "2024-12",
    summary: "Components, props, state, hooks and UI development.",
  },
  {
    type: "earlier",
    role: "Cashless Officer",
    company: "Medilink Hospital",
    start: "2023-03",
    end: "2024-10",
    summary: "Cashless insurance and claim settlements with TPAs.",
  },
  {
    type: "earlier",
    role: "Customer Care Associate",
    company: "Shoppers Stop",
    start: "2020-10",
    end: "2023-03",
    summary: "Customer service, billing and POS operations.",
  },
  {
    type: "education",
    role: "B.Tech, Computer Engineering",
    company: "Silver Oak University",
    start: "2020",
    end: "2024",
  },
];
