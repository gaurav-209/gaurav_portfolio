import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/layout/Analytics";
/* single theme */

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://gauravmahavar.in"),
  title: "Gaurav Mahavar | Full-Stack Developer – React, Node.js & Electron",
  description:
    "Explore the portfolio of Gaurav Mahavar, a Full-Stack Developer building modern web applications, financial software and desktop applications using React, Node.js and Electron.",
  openGraph: {
    title: "Gaurav Mahavar | Full-Stack Developer – React, Node.js & Electron",
    description:
      "Explore the portfolio of Gaurav Mahavar, a Full-Stack Developer building modern web applications, financial software and desktop applications using React, Node.js and Electron.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaurav Mahavar | Full-Stack Developer – React, Node.js & Electron",
    description:
      "Full-Stack Developer building modern web applications, financial software and desktop applications using React, Node.js and Electron.",
  },
};

export default function RootLayout({ children }) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.title,
    url: "https://gauravmahavar.in",
    address: { "@type": "PostalAddress", addressLocality: "Ahmedabad", addressRegion: "Gujarat", addressCountry: "IN" },
    sameAs: [site.github, site.linkedin].filter(Boolean),
  };

  return (
    <html lang="en" data-theme="cupcake" data-scroll-behavior="smooth" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <Navbar />
        <main id="top">{children}</main>
        <Footer />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
