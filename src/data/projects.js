// One entry per project. Optional fields are simply hidden when missing, so add them as you have them.
//
// kind: "work" (built on the job) | "personal";  status (personal only): "completed" | "in-progress"
// hidden: true                → left out of the site until it has content
// featured: 1–5               → position in the 5-project stack on the home page; the rest are on /projects
// tagline                     → one line for the home-page card
// highlight                   → your strongest contribution, shown on the card
// shortDescription            → page meta description; description → case-study summary
// year                        → shown next to the category, e.g. "2024–now"
// facts: { role, team, timeline, platform }   → quick-facts row on the case study
// contributions               → strings, or groups: [{ area, items: [...] }]
// challenges: [{ title, detail }]             → technical problems and how they were solved
// outcomes: [...]             → real results only (users, time saved, numbers)
// stack: { Frontend: [...], Backend: [...], ... }; cardTech → the 3 tags on the card
// learned                     → short note, mainly for personal projects
// image (16:10 screenshot), imageAlt, gallery: [{ src, alt }], links: { repo, live }
const all = [
  {
    slug: "swiftfolios-web",
    featured: 1,
    kind: "work",
    name: "Swiftfolios Web App",
    category: "FinTech · Web Platform",
    tagline: "Portfolio-management platform for PMSs, AIFs, RIAs, family offices and HNIs.",
    highlight: "Built most of the mutual-fund module and the custom report engine.",
    shortDescription:
      "A portfolio-management platform for PMSs, AIFs, RIAs, family offices and HNIs, covering portfolios, mutual funds, trading, KYC and reporting.",
    description:
      "Swiftfolios is a scalable portfolio-management platform delivered as a service. The web app is the main portal where customers, managers, admins and back-office teams manage portfolios, invest in mutual funds, route trades, complete KYC and generate client and regulatory reports.",
    facts: { role: "Full-stack developer", platform: "Web app" },
    problem:
      "Wealth managers run portfolios, mutual-fund transactions, broker connections, KYC and reporting across separate tools, which makes day-to-day operations slow and error-prone.",
    solution:
      "One web platform with role-based access for every user type. Mutual-fund investing runs on BSE StAR MF, equity trading connects to broker APIs, and a reporting engine produces statements, capital-gains reports and contract notes on demand or on a schedule.",
    role: "Full-Stack Developer, working across the React front end and the Node.js/Express API.",
    contributions: [
      {
        area: "Mutual funds",
        items: [
          "Built most of the mutual-fund module: the MF watchlist, MF portfolio, SIPs, transactions and SIP transactions.",
          "Built buy, redeem, SIP and SIP cancellation flows with UPI, net-banking and UTR payments and mandate registration.",
          "Built MF accounts: UCC creation for admins and client self-registration.",
        ],
      },
      { area: "Trading & broker APIs", items: ["Integrated the Zerodha API: login, a shared token pool, a live-price websocket and quotes against previous close."] },
      { area: "Reports", items: ["Built the custom report builder and API: templates, history, scheduling, gain/loss and capital-gains reports, contract notes."] },
      {
        area: "KYC & accounts",
        items: ["Added Aadhaar (DigiLocker) and PAN KYC flows.", "Redesigned login and signup."],
      },
      {
        area: "Portfolios & research",
        items: [
          "Built family-portfolio allocation and performance charts.",
          "Built the AI research module, with public report links, and the support-ticket system.",
        ],
      },
      { area: "Security", items: ["Hardened the API with parameterised queries, stricter route authorisation and log redaction."] },
    ],
    challenges: [
      {
        title: "Reports on demand and on a schedule",
        detail:
          "A custom report builder with templates and history, plus scheduling, so statements, gain/loss and capital-gains reports and contract notes can run automatically instead of being assembled by hand.",
      },
      {
        title: "Live broker data",
        detail:
          "Connected the Zerodha API through a shared token pool and a live-price websocket, so the platform can show live quotes against the previous close.",
      },
      {
        title: "Keeping client data safe",
        detail:
          "Hardened the API with parameterised queries (protection against SQL injection), stricter authorisation on every route, and redaction of sensitive values from logs.",
      },
    ],
    keyFunctionality: [
      "Customer dashboards for stock and family portfolios",
      "Mutual funds on BSE StAR MF: watchlist, portfolio, SIPs, transactions, mandates",
      "Equity strategies with bulk (blanket) execution and order instructions",
      "Order, trade, route and confirmation books",
      "Broker management with live market data",
      "KYC with DigiLocker, PAN and nominees",
      "Custom and scheduled reports, statements and capital gains",
      "Admin, back-office and role-based access management",
    ],
    stack: {
      Frontend: ["React", "React Router", "TanStack Query", "MUI", "Tailwind CSS"],
      Backend: ["Node.js", "Express", "Socket.IO"],
      Data: ["MySQL"],
      Charts: ["Recharts", "D3"],
    },
    cardTech: ["React", "Node.js", "MySQL"],
    image: "/projects/sf-wealth-fund-research.webp",
    imageAlt: "Swiftfolios website: fund research review of a large-cap mutual fund",
    gallery: [
      { src: "/projects/sf-wealth-portfolios.webp", alt: "Swiftfolios website: seven risk-calibrated model portfolios" },
      { src: "/projects/sf-wealth-difference.webp", alt: "Swiftfolios website: how portfolios are monitored every day" },
    ],
    links: { live: "https://www.swiftfolios.com/" },
  },
  {
    slug: "dealer-console",
    featured: 2,
    kind: "work",
    name: "Swiftfolios Dealer Console",
    category: "Trading Technology · Desktop App",
    tagline: "Desktop dealing workstation for placing and tracking client orders over FIX.",
    highlight: "Created the app: live order book, FIX order entry and order history.",
    shortDescription:
      "An Electron desktop app for the dealing desk to place, track and modify client orders in real time over a FIX order gateway.",
    description:
      "The Dealer Console is the dealing desk's workstation. Dealers place, modify and track client orders in real time through a FIX-protocol gateway, apply algorithmic order types, and review execution quality with transaction-cost analysis.",
    facts: { role: "Full-stack developer · created the project", platform: "Desktop (Electron)" },
    problem:
      "Dealers handle time-sensitive orders for many clients at once and need live order status, fast order entry and a clear view of execution quality.",
    solution:
      "A desktop app with a live order book connected to the FIX engine over websockets, configurable execution algorithms, bulk order import from Excel, and TCA built into the order history.",
    role: "Full-Stack Developer. I created the project and built its core screens.",
    contributions: [
      {
        area: "Orders",
        items: [
          "Created the app and built the core screens: live order book, FIX order entry and modify, order history.",
          "Built a realtime listener for FIX order updates, with reconnect handling.",
          "Added Excel order import and handling for derivatives lot sizes and exchange tokens.",
        ],
      },
      { area: "Execution quality", items: ["Built the client side of the best-execution algo, transaction-cost analysis and algo timing rules."] },
      {
        area: "Desktop app",
        items: [
          "Built the login flow, the broker login popup and in-app auto-updates.",
          "Packaged the Electron app and cut latency; built shared empty and loading states.",
        ],
      },
    ],
    challenges: [
      {
        title: "Never missing an order update",
        detail:
          "A realtime listener for FIX order updates over websockets, with reconnect handling, so the order book stays current when the connection drops and comes back.",
      },
      {
        title: "Measuring execution quality",
        detail:
          "Built the client side of the best-execution algorithm and transaction-cost analysis, with timing rules per algo, so dealers can review execution quality from the order history.",
      },
      {
        title: "Bulk orders from Excel",
        detail:
          "Excel order import that handles derivatives lot sizes and exchange tokens, so large order lists can be placed without manual entry.",
      },
    ],
    keyFunctionality: [
      "Live order book with modify and cancel",
      "FIX order entry and status tracking",
      "Algo configuration per section, with time windows",
      "Best-execution algo and transaction-cost analysis",
      "Excel/CSV order and trade import",
      "Watchlists with drag-and-drop sections and market depth",
      "Live market-data feed",
      "Auto-update and in-app install",
    ],
    stack: {
      Frontend: ["React", "MUI", "Tailwind CSS", "daisyUI"],
      Desktop: ["Electron"],
      Backend: ["Node.js", "Socket.IO", "FIX Protocol"],
      Data: ["MySQL"],
    },
    cardTech: ["Electron", "React", "FIX Protocol"],
    image: "/projects/sf-execution-algos.webp",
    imageAlt: "Swiftfolios website: the nine execution algorithms available on the dealing desk",
    gallery: [
      { src: "/projects/sf-execution-terminals.webp", alt: "Swiftfolios website: Dealer Terminal and Desktop Terminal features" },
      { src: "/projects/sf-execution-risk.webp", alt: "Swiftfolios website: pre-trade and post-trade risk controls" },
    ],
    links: { live: "https://www.swiftfolios.com/" },
  },
  {
    slug: "desktop-console",
    featured: 3,
    image: "/projects/sf-execution-hero.webp",
    imageAlt: "Swiftfolios website: institutional execution with a live execution chart",
    gallery: [
      { src: "/projects/sf-execution-terminals.webp", alt: "Swiftfolios website: Desktop Terminal features" },
      { src: "/projects/sf-execution-tca.webp", alt: "Swiftfolios website: execution analytics and cost decomposition" },
    ],
    links: { live: "https://www.swiftfolios.com/" },
    kind: "work",
    name: "Swiftfolios Desktop Console",
    category: "FinTech · Desktop App",
    tagline: "Electron workstation for portfolio managers: charts, live data and trading in one place.",
    highlight: "Built the charting engine and the saved, configurable workspace.",
    shortDescription:
      "A desktop workstation for portfolio managers that combines advanced charting and market data with the platform's portfolio, trading and reporting tools.",
    description:
      "Swiftfolios Desktop brings the web platform to an Electron workstation built for portfolio managers. It pairs an advanced charting engine and live market data with portfolio management, bulk execution, FIX order handling, reports and research, all in a configurable tabbed layout.",
    facts: { role: "Full-stack developer", platform: "Desktop (Electron)" },
    problem:
      "Portfolio managers switch between charting tools, the web platform and the dealing desk, which costs time when markets move.",
    solution:
      "A single desktop app that brings the web modules together with charting, live feeds, FIX order updates and research in one configurable workspace, with auto-updates.",
    role: "Full-Stack Developer, owning large parts of the front end and its integrations.",
    contributions: [
      {
        area: "Charts & market data",
        items: [
          "Built the charting engine: interactive technical indicators, data downsampling and live market status.",
          "Built session relogin, reconnect and feed health checks.",
        ],
      },
      {
        area: "Portfolios & trading",
        items: [
          "Ported the web modules to desktop and restyled them with Tailwind/daisyUI: portfolios, strategies, transactions, reports, clients, roles, funds, tickets.",
          "Built bulk execution, order instructions, and the capital-gains and cash logic in portfolio views.",
          "Integrated FIX order updates over sockets, with algo configuration and decision-price tracking.",
        ],
      },
      { area: "Research", items: ["Built the AI research drawer, announcements, economic calendar and news feeds."] },
      { area: "Workspace", items: ["Built a config-driven tab system saved in IndexedDB, and the auto-update flow."] },
    ],
    challenges: [
      {
        title: "Fast charts on large data",
        detail:
          "A charting engine with interactive technical indicators that downsamples long price histories, so charts stay responsive with large datasets.",
      },
      {
        title: "A workspace that remembers itself",
        detail:
          "A config-driven tab system saved in IndexedDB (the browser's local database), so each manager's tabs and layout come back the way they left them.",
      },
      {
        title: "Staying connected",
        detail: "Session relogin, socket reconnects and feed health checks, so live data and FIX order updates recover without a restart.",
      },
    ],
    keyFunctionality: [
      "Charting with technical indicators and compare mode",
      "Holdings, allocation, cash and capital gains",
      "Model portfolios, baskets and strategy configuration",
      "Bulk execution, derivatives and basket margin",
      "Order, trade, route, confirmation and FIX order books",
      "Custom and scheduled reports",
      "AI research, news and economic calendar",
      "Configurable tabs and layouts",
    ],
    stack: {
      Frontend: ["React", "TanStack Query", "Tailwind CSS", "daisyUI"],
      Desktop: ["Electron", "IndexedDB"],
      Realtime: ["Socket.IO"],
      Charts: ["D3", "Recharts"],
    },
    cardTech: ["Electron", "React", "D3"],
  },
  {
    slug: "mini-apps",
    kind: "personal",
    status: "completed",
    name: "React Mini Apps",
    category: "Web Apps · React",
    tagline: "A launcher of small React apps: a visiting-card designer and a live weather app.",
    highlight: "Print-ready card generator and an animated live-weather app, in one launcher.",
    shortDescription:
      "A dashboard of small React apps, including a visiting-card designer with PDF export and a live weather app with an animated sky.",
    description:
      "A dashboard of small React apps that each open at their own link and load only when opened. It holds Visiting Card Studio, which turns a short form into a print-ready business card in 14 front-and-back designs, and WeatherMe, a live weather app whose animated sky follows the real conditions.",
    facts: { role: "Solo project", platform: "Web app" },
    problem: "Small practice apps end up scattered across separate repos, which makes them hard to show and keep consistent.",
    solution:
      "One launcher driven by a registry: each app is one entry, gets its own URL and loads lazily, and every app shares one set of base styles.",
    role: "Solo project: design and development.",
    contributions: [
      {
        area: "Visiting Card Studio",
        items: [
          "14 card designs, each with a front and a back, built in HTML and CSS.",
          "A form with only the essential fields, with validation.",
          "Print-resolution PNG and two-page PDF export in the browser.",
        ],
      },
      {
        area: "WeatherMe",
        items: [
          "Animated sky scenes for every weather type, by day and night.",
          "24-hour outlook, 3-day forecast, air quality and sunrise/sunset.",
          "°C/°F switch, city search and clear error messages.",
        ],
      },
      { area: "Launcher", items: ["Registry-driven dashboard with hash routing and lazy-loaded apps; shared styles instead of Bootstrap."] },
    ],
    challenges: [
      {
        title: "Print-ready cards from HTML",
        detail:
          "Each design is a 3.5 × 2 in HTML card captured at 4× resolution with html2canvas and placed in a PDF with jsPDF. The designs only use CSS that html2canvas can render, and both libraries load only when a card is generated.",
      },
      {
        title: "A sky that matches the weather",
        detail:
          "Weather condition codes map to animated scenes (sun, moon and stars, drifting clouds, rain, snow, lightning, fog, haze), while keeping the text readable over moving clouds.",
      },
      {
        title: "Adding an app in one step",
        detail: "Apps live in a single registry. The dashboard card, the link and the top bar all come from it, and React.lazy keeps each app out of the first download.",
      },
    ],
    keyFunctionality: [
      "Dashboard with preview cards for each app",
      "Visiting cards: 14 designs, front and back",
      "PDF and PNG download at print resolution",
      "Live weather with an animated sky",
      "24-hour and 3-day forecast, air quality",
      "°C/°F switch and city search",
    ],
    stack: {
      Frontend: ["React", "Vite"],
      Libraries: ["html2canvas", "jsPDF"],
      Data: ["WeatherAPI"],
    },
    cardTech: ["React", "Vite", "jsPDF"],
    image: "/projects/mini-apps-card-studio.webp",
    imageAlt: "Visiting Card Studio: choosing a card design",
    gallery: [
      { src: "/projects/mini-apps-home.webp", alt: "Mini Apps dashboard with Visiting Card Studio and WeatherMe" },
      { src: "/projects/mini-apps-weather.webp", alt: "WeatherMe: live weather with an animated sky and a 24-hour outlook" },
    ],
    links: { repo: "https://github.com/gaurav-209/mini-apps", live: "https://mini-apps-brown.vercel.app" },
  },
  {
    slug: "mycontacts",
    featured: 5,
    image: "/projects/mycontacts-dashboard.webp",
    imageAlt: "MyContacts dashboard: insights panel with birthdays and relationships, and a sortable contacts table",
    gallery: [
      { src: "/projects/mycontacts-details.webp", alt: "MyContacts: a contact's details with links, tags and notes" },
      { src: "/projects/mycontacts-signup.webp", alt: "MyContacts sign-up page" },
    ],
    kind: "personal",
    status: "completed",
    name: "MyContacts",
    category: "Full-Stack · MERN App",
    year: "2025",
    tagline: "A private contact book: sign up, then add, edit, favourite and delete your contacts.",
    highlight: "Built both halves: a JWT-secured Express/MongoDB API and the React client, deployed separately.",
    shortDescription:
      "A full-stack contact manager with JWT sign-in, where each user keeps a private list of contacts they can add, edit, favourite and delete.",
    description:
      "MyContacts is a full-stack contact manager. Users register and log in, then manage their own contacts: name, phone, email, company, address, notes and favourites. The React front end runs on Vercel and talks to a Node.js/Express REST API on Render backed by MongoDB.",
    facts: { role: "Solo project", platform: "Web app + REST API" },
    problem: "Contacts saved in a phone or a spreadsheet are hard to search, enrich with details and reach from any device.",
    solution:
      "A REST API where every contact belongs to the signed-in user, and a simple dashboard that lists, edits and favourites them from any browser.",
    role: "Solo project: API design, back end, front end and deployment.",
    contributions: [
      {
        area: "Back end",
        items: [
          "REST API with Express: register, login and current-user routes, plus full CRUD for contacts.",
          "Passwords hashed with bcrypt; JWT middleware protects every contact route.",
          "Mongoose models with validation and a central error handler.",
        ],
      },
      {
        area: "Front end",
        items: [
          "Login, register and a protected dashboard with React Router.",
          "Add / edit contact modal, favourite toggle, delete with confirmation and toast feedback.",
          "Axios client that attaches the token to every request.",
        ],
      },
    ],
    challenges: [
      {
        title: "Each user sees only their own contacts",
        detail:
          "Every contact stores the owner's user id. The JWT middleware puts the user on the request, the contact list is filtered by that id, and updates and deletes check the owner first, so one user can't change another's contacts.",
      },
      {
        title: "Front end and API on different hosts",
        detail: "The client is on Vercel and the API on Render, so the API only allows the deployed site and the local dev server through CORS.",
      },
    ],
    keyFunctionality: [
      "Sign up, log in, protected dashboard",
      "Add, edit and delete contacts",
      "Favourite contacts",
      "Company, address, notes and birthday fields",
      "Toast feedback for every action",
    ],
    stack: {
      Frontend: ["React", "Vite", "React Router", "Tailwind CSS", "Axios"],
      Backend: ["Node.js", "Express", "JWT", "bcrypt"],
      Database: ["MongoDB", "Mongoose"],
      Hosting: ["Vercel", "Render"],
    },
    cardTech: ["React", "Express", "MongoDB"],
    learned: "Designing a REST API end to end and securing it with JWT, then wiring a separately hosted front end to it.",
    links: { repo: "https://github.com/gaurav-209/mycontacts-backend", live: "https://mycontacts-frontend-ten.vercel.app" },
  },
  {
    slug: "trackmycash",
    image: "/projects/trackmycash-dashboard.webp",
    imageAlt: "TrackMyCash dashboard: balance cards, add-transaction form and transactions",
    gallery: [{ src: "/projects/trackmycash-delete.webp", alt: "TrackMyCash: confirm dialog before deleting a transaction" }],
    kind: "personal",
    status: "completed",
    name: "TrackMyCash",
    category: "Personal Finance · Web App",
    year: "2025",
    tagline: "Expense tracker: log income and spending by category, filter by month and see your balance.",
    highlight: "Search and month filters with live balance, income and expense totals.",
    shortDescription:
      "An expense tracker where users sign up, record income and expenses by category, filter them by month and see their balance at a glance.",
    description:
      "TrackMyCash is a personal expense tracker. Users create an account, log income and expenses by category and date, search and filter them by type or month, and see their balance, income and spending summarised in rupees. All data stays in the browser.",
    facts: { role: "Solo project", platform: "Web app" },
    problem: "People lose track of where their money goes when expenses aren't recorded somewhere simple.",
    solution:
      "A lightweight web app with no server: accounts and transactions are saved in the browser, and summary cards update as soon as a transaction is added.",
    role: "Solo project: design and front end.",
    contributions: [
      "Register, login and protected routes using React Context.",
      "Add, edit and delete income and expense transactions with form validation.",
      "Search plus type and month filters.",
      "Balance, income and expense summary cards with INR formatting.",
    ],
    challenges: [
      {
        title: "Separate data for each account, without a server",
        detail: "Transactions are saved in localStorage and tagged with the signed-in user, so each account only sees its own entries.",
      },
    ],
    keyFunctionality: [
      "Account sign-up, login and sign-out",
      "Add, edit and delete transactions",
      "Search, type and month filters",
      "Live balance, income and expense totals",
      "Responsive layout",
    ],
    stack: {
      Frontend: ["React", "Vite", "React Router", "CSS"],
      Storage: ["localStorage"],
    },
    cardTech: ["React", "React Router", "Vite"],
    links: { repo: "https://github.com/gaurav-209/TrackMyCash", live: "https://track-my-cash-five.vercel.app" },
  },
  {
    slug: "product-catalogue",
    kind: "personal",
    status: "completed",
    name: "Product Catalogue",
    category: "E-commerce · Front End",
    year: "2025",
    image: "/projects/product-catalogue.webp",
    imageAlt: "Product Catalogue in card view, with two items in the cart",
    gallery: [{ src: "/projects/product-catalogue-table.webp", alt: "Product Catalogue in table view with availability badges" }],
    tagline: "Product listing with card and table views, stock status and a cart.",
    highlight: "A cart that respects stock: quantities stop at the inventory limit and the cart survives a reload.",
    shortDescription: "A product listing UI with card and table views, availability badges and a cart that checks stock.",
    description:
      "Product Catalogue is a front-end shop listing. Visitors switch between a card grid and a table, see which products are available, and add items to a cart where they can change quantities up to the stock limit. The cart is kept in the browser, so it is still there after a reload.",
    facts: { role: "Solo project", platform: "Web (front end)" },
    problem: "Shoppers need to see what's in stock and keep track of what they've picked.",
    solution: "Two layouts for browsing and comparing, clear availability badges and a cart that won't let quantities pass the stock on hand.",
    role: "Solo project: UI and state management.",
    contributions: [
      "Card and table views with a one-click toggle.",
      "Available / not-available badges, with add-to-cart disabled for unavailable products.",
      "Cart with React Context: add, increase, decrease, remove and a running total.",
      "Stock checks with a short message when a product runs out.",
      "Cart saved to localStorage.",
    ],
    keyFunctionality: ["Card / table views", "Availability badges", "Cart with quantity controls", "Stock limits", "Cart kept after reload"],
    stack: { Frontend: ["React", "Bootstrap 5", "CSS"], State: ["Context API", "localStorage"] },
    cardTech: ["React", "Bootstrap", "Context API"],
    links: { repo: "https://github.com/gaurav-209/Product-Catalogue" },
  },
  {
    slug: "advocate-website",
    featured: 4,
    image: "/projects/advocate-website-home.webp",
    imageAlt: "Advocate website hero: headline, consultation buttons and the advocate's portrait",
    gallery: [
      { src: "/projects/advocate-website-trust.webp", alt: "About the advocate: profile, qualification, courts and practice highlights" },
      { src: "/projects/advocate-website-services.webp", alt: "Legal services grid: when you may need each service and how it helps" },
      { src: "/projects/advocate-website-steps.webp", alt: "How it works: three steps from first contact to clear next steps" },
    ],
    kind: "personal",
    status: "in-progress",
    name: "Advocate Mehul Mahavar Website",
    category: "Professional Website",
    year: "2026",
    tagline: "Website for a High Court advocate in Ahmedabad, built to turn visitors into consultation requests.",
    highlight: "Homepage that walks a visitor from their legal problem to booking a consultation.",
    shortDescription:
      "A professional website for a Gujarat High Court advocate: practice areas, background, FAQs and a homepage designed to turn visitors into consultation requests.",
    description:
      "A website for an advocate practising before the Gujarat High Court in Ahmedabad. The homepage follows the visitor's path: the outcome they want, who the advocate is, the problem they are facing, the services that fit it, what happens after they get in touch, their common doubts, and a clear way to book. Every practice area has its own page, and each service links to the consultation form with that matter already selected.",
    facts: { role: "Design and development", platform: "Website" },
    problem:
      "People with a legal problem are often stressed and unsure where to start. A plain list of practice areas doesn't tell them whether this advocate can help, what contacting him involves, or why to reach out now.",
    solution:
      "A homepage structured as a journey: reassurance and a clear call to action first, then credentials, relatable problems, services written around the client's situation, a three-step process and honest FAQs, all ending in an easy way to book, call or message on WhatsApp.",
    role: "Design and development: content structure, UI, front end and deployment.",
    contributions: [
      {
        area: "Homepage",
        items: [
          "Seven-section layout: hero, about the advocate, client problems, services, how it works, FAQ and a final call to action.",
          "Service cards that explain when you may need each service and how it helps, with a \"Discuss your case\" link that pre-selects the matter on the form.",
          "Three-step process shown horizontally on desktop and as a vertical timeline on phones.",
        ],
      },
      {
        area: "Site",
        items: [
          "Detail page for every practice area, driven by one data file.",
          "Consultation form, FAQ, disclaimer, privacy and terms pages, and a footer with contact details, map link and legal disclaimer.",
          "Navy and gold visual identity with a court-facade line drawing behind the advocate's portrait.",
        ],
      },
      {
        area: "Quality",
        items: [
          "Per-page titles and meta tags, plus Person, LegalService and FAQPage structured data.",
          "Accessible FAQ accordion, AA-contrast colours for small text, reduced-motion support, and no horizontal scroll from phone to desktop.",
        ],
      },
    ],
    challenges: [
      {
        title: "Placeholder content that can never go live",
        detail:
          "Credentials, statistics and testimonials had to be laid out before the real details arrived. Unverified items carry a flag: in development they show with a \"Demo\" tag, and production builds leave them out entirely, so nothing invented can be published by accident.",
      },
      {
        title: "Persuasive without breaking professional rules",
        detail:
          "Advocates in India are limited in how they can advertise, so the copy stays factual and reassuring: no success rates, no invented reviews, and testimonials stay hidden until genuine, client-approved ones are added.",
      },
      {
        title: "Deep links on a static host",
        detail: "As a single-page app on Vercel, inner pages returned 404 when opened directly. A rewrite rule now serves the app for every route, and old URLs redirect to their new place.",
      },
    ],
    keyFunctionality: [
      "Conversion-focused homepage",
      "Services that pre-fill the consultation form",
      "Practice areas with detail pages",
      "Call, WhatsApp and consultation form",
      "FAQ with structured data",
      "Mobile-first layout",
    ],
    stack: {
      Frontend: ["React", "Vite", "React Router", "Tailwind CSS", "Lucide icons"],
      SEO: ["react-helmet-async", "JSON-LD structured data"],
      Hosting: ["Vercel"],
    },
    cardTech: ["React", "Tailwind CSS", "React Router"],
    learned:
      "Structuring a page around what a visitor is thinking at each step, not around what the business wants to list, and keeping marketing copy honest within a profession's rules.",
    // Client site: the code stays private, so no repo link. Swap `live` for the custom domain once it's set up.
    links: { live: "https://adv-meheulmahavar-website.vercel.app" },
  },
  {
    slug: "nextjs-ecommerce",
    image: "/projects/nextjs-ecommerce.webp",
    imageAlt: "Store home page with a sale banner and categories",
    kind: "personal",
    status: "in-progress",
    name: "Next.js E-commerce",
    category: "E-commerce · Full-Stack",
    year: "2025",
    tagline: "An online store with accounts, a MongoDB product catalogue, search and category filters.",
    highlight: "JWT sign-in in an httpOnly cookie, with protected pages checked before they load.",
    shortDescription:
      "A full-stack online store built with Next.js and MongoDB: sign-up and login, a product catalogue with search and category filters, and protected pages.",
    description:
      "A full-stack e-commerce store built with the Next.js App Router. Shoppers sign up and log in, browse a product catalogue stored in MongoDB, and search or filter it by category. The cart and checkout are being built next.",
    facts: { role: "Solo project", platform: "Web app" },
    problem: "A shop needs real accounts and a real product database, not a static list.",
    solution:
      "Next.js route handlers for auth and products on top of MongoDB, with the login token in an httpOnly cookie and protected pages checked before they render.",
    role: "Solo project: design, API routes and front end.",
    contributions: [
      "Sign-up, login and logout API routes with bcrypt and JWT.",
      "Products API and Mongoose models, plus a script to import the catalogue into MongoDB.",
      "Product listing with search across title, category and tags, category filters and ratings.",
      "Route protection that sends signed-out visitors to the login page.",
    ],
    keyFunctionality: ["Sign up, log in, log out", "Product catalogue from MongoDB", "Search and category filters", "Protected pages"],
    stack: {
      Frontend: ["Next.js", "React", "Tailwind CSS"],
      Backend: ["Next.js route handlers", "JWT", "bcrypt"],
      Database: ["MongoDB", "Mongoose"],
    },
    cardTech: ["Next.js", "MongoDB", "JWT"],
    links: { repo: "https://github.com/gaurav-209/nextjs-ecommerce" },
  },
  {
    slug: "portfolio",
    image: "/projects/portfolio-home.webp",
    imageAlt: "Portfolio home page",
    kind: "personal",
    status: "in-progress",
    name: "This Portfolio",
    category: "Personal Website",
    tagline: "The site you're on: a fast, accessible portfolio on Next.js 16, pre-rendered as static pages.",
    highlight: "Static project pages from one data file, with full SEO and accessibility.",
    shortDescription:
      "The site you're on: a fast, accessible portfolio built with the latest Next.js and pre-rendered as static pages.",
    description:
      "My personal portfolio, built with Next.js 16 and React 19. Every page is pre-rendered, and it includes per-project pages, a generated social-share image, a sitemap and structured data.",
    facts: { role: "Design and development", platform: "Website" },
    role: "Design and development.",
    contributions: [
      "Static project pages generated from a single data file.",
      "Accessible colour contrast, reduced-motion support and keyboard focus styles.",
      "SEO: metadata, Open Graph image, sitemap, robots and JSON-LD.",
    ],
    keyFunctionality: [],
    stack: { Frontend: ["Next.js", "React", "Tailwind CSS", "daisyUI"] },
  },
  {
    slug: "portfolio-v1",
    image: "/projects/portfolio-v1-home.webp",
    imageAlt: "First portfolio home page",
    kind: "personal",
    status: "completed",
    name: "Portfolio v1",
    category: "Personal Website",
    year: "2026",
    tagline: "My first portfolio: a one-page Next.js site with Framer Motion animations.",
    highlight: "An icon trail that falls from the cursor, plus scroll-in animations on every section.",
    shortDescription:
      "My first portfolio: a one-page Next.js site with hero, about, skills, projects and contact sections, animated with Framer Motion.",
    description:
      "The first version of my portfolio, built with Next.js, Tailwind CSS and daisyUI. It is a single page with hero, about, skills, projects and contact sections, each animating in on scroll, and an interactive area where icons fall from the cursor as you move it. The site you're on replaced it.",
    facts: { role: "Solo project", platform: "Website" },
    role: "Solo project: design and development.",
    contributions: [
      "Hero, about, skills, projects and contact sections on one page.",
      "Navbar that tightens on scroll, with an animated mobile menu.",
      "Scroll-in and hover animations with Framer Motion.",
      "Cursor trail: icons spawn as the mouse moves, drift with its direction and fall away.",
    ],
    keyFunctionality: ["One-page layout", "Scroll-in animations", "Cursor icon trail", "Responsive navbar and mobile menu"],
    stack: { Frontend: ["Next.js", "React", "Tailwind CSS", "daisyUI"], Animation: ["Framer Motion"] },
    cardTech: ["Next.js", "Framer Motion", "Tailwind CSS"],
    learned: "What I wanted to change here (one data file, real project pages, less motion) became the plan for this site.",
  },
  {
    slug: "the-untold-store",
    kind: "personal",
    status: "in-progress",
    hidden: true, // no content yet; remove this line once it has a description and details
    name: "The Untold Store",
    category: "E-commerce Website",
    tagline: "An online storefront for The Untold Store brand.",
    shortDescription: "An online storefront for The Untold Store brand.",
    description: "An online storefront for The Untold Store brand, currently in development.",
    role: "Design and development.",
    contributions: [],
    keyFunctionality: [],
  },
];

// Everything on the site reads this list, so hidden projects get no card, page or sitemap entry.
export const projects = all.filter((p) => !p.hidden);

export const techList = (p) => Object.values(p.stack ?? {}).flat();
// Stacked on the home page, in this order; everything else is one click away on /projects.
export const featuredProjects = projects.filter((p) => p.featured).sort((a, b) => a.featured - b.featured);
