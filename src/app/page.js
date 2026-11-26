import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import PhotoFlip from "@/components/ui/PhotoFlip";
import { photoCards } from "@/data/site";

export default function Home() {
  return (
    <>
      {/* Hero + About share a wrapper so the photo card can fly (and flip) from one to the other. */}
      <div className="relative">
        <Hero />
        <About />
        <PhotoFlip front={photoCards.front} back={photoCards.back} />
      </div>
      <Projects />
      <Services />
      <Experience />
      <Skills />
      <FAQ />
      <Contact />
    </>
  );
}
