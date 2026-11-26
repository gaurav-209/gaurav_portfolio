// What clients can hire me for. Each service points at projects that prove it (slugs from data/projects.js)
// and at the contact-form topic it should pre-select ("a website" | "a web app" | "a desktop app" | "something else").
export const services = [
  {
    id: "web-apps",
    title: "Web apps & dashboards",
    summary: "Portals, admin panels and dashboards that turn messy workflows into a few clear screens.",
    points: ["React and Next.js front ends", "Role-based access for every user type", "Reports, charts and exports"],
    proof: ["swiftfolios-web", "mycontacts"],
    topic: "a web app",
  },
  {
    id: "desktop-apps",
    title: "Desktop apps",
    summary: "Electron workstations for teams that live in one tool all day, with live data and saved layouts.",
    points: ["Windows and macOS apps from one codebase", "Live data over WebSockets", "Auto-updates and offline storage"],
    proof: ["dealer-console", "desktop-console"],
    topic: "a desktop app",
  },
  {
    id: "websites",
    title: "Business websites",
    summary: "Fast, mobile-friendly websites for professionals and small businesses that turn visitors into enquiries.",
    points: ["Pages for every service you offer", "Enquiry forms and SEO set up", "Easy to update later"],
    proof: ["advocate-website", "portfolio"],
    topic: "a website",
  },
  {
    id: "apis",
    title: "APIs & integrations",
    summary: "The back end behind it all: secure REST APIs, databases and connections to the services you use.",
    points: ["Node.js / Express APIs with JWT sign-in", "MySQL or MongoDB data models", "Third-party and broker API integrations"],
    proof: ["swiftfolios-web", "nextjs-ecommerce"],
    topic: "something else",
  },
];
