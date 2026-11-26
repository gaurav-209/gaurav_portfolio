import { site } from "@/data/site";

// Questions recruiters and clients actually ask. Keep answers short and specific; link out from the
// sections (Projects, Experience, Skills) rather than repeating them here.
export const faqs = [
  {
    question: "What do you build?",
    answer:
      "Web platforms, desktop apps and the APIs behind them. Most of my work is on Swiftfolios, a wealth-management product: a React web app, Node.js/Express services and Electron desktop consoles for portfolio managers and dealing desks. On my own I've built full-stack apps like a MERN contact manager, a Next.js store and an advocate's website.",
  },
  {
    question: "What's your main tech stack?",
    answer:
      "React and JavaScript on the front end (with Next.js, Tailwind CSS and Redux), Node.js, Express and REST APIs on the back end, MySQL and MongoDB for data, and Electron for desktop. The Skills Constellation above shows everything, and which projects each technology is used in.",
  },
  {
    question: "How much experience do you have?",
    answer:
      "I joined Greatbear Ventures in July 2025 as a web development intern and moved into a Software Engineer – Product Development role in October 2025, building Swiftfolios. Before that I completed React.js training and a B.Tech in Computer Engineering. The Experience timeline has the full path.",
  },
  {
    question: "Have you worked on fintech or trading products?",
    answer:
      "Yes, that's my day-to-day. I've built mutual-fund flows on BSE StAR MF, integrated the Zerodha Kite API and NSE, worked with live market data over WebSockets and FIX-based order workflows, and built a custom report engine for statements and capital-gains reports.",
  },
  {
    question: "Can you work on an existing codebase?",
    answer:
      "Yes. Swiftfolios is a large, live product, so most of my work is adding features to existing code, fixing issues and improving security, such as parameterised queries, stricter route checks and masking tokens in logs.",
  },
  {
    question: "Can I see your code?",
    answer:
      "My personal projects are on GitHub, and each project page links to its repo and live site where there is one. Work projects are proprietary, so their case studies describe what I built without showing company code or data.",
  },
  {
    question: "How can I contact you?",
    answer: `Use the contact form below, email me at ${site.email}, or message me on LinkedIn. I'll get back to you as soon as I can.`,
  },
];
