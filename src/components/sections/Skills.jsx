"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillConstellation from "@/components/sections/skills/SkillConstellation";
import { skillCategories, skills } from "@/data/skillsEcosystem";

export default function Skills() {
  const [activeSkillId, setActiveSkillId] = useState(null);

  const onSelectSkill = (id) => {
    setActiveSkillId((prev) => (prev === id ? null : id));
  };

  const headingId = "skills-heading";

  return (
    <section
      className="section-pad bg-[var(--color-base-content)] text-[#f5f2ed] overflow-clip"
      id="skills"
      aria-labelledby={headingId}
    >
      <div className="container-wide">
        <SectionHeading
          id={headingId}
          dark
          lead="Skills"
          accent="Constellation"
          subtitle="Explore how frontend, backend, desktop, data and specialized technologies connect across the products I build."
        />

        <Reveal>
          <SkillConstellation
            skills={skills}
            categories={skillCategories}
            activeSkillId={activeSkillId}
            onSelect={onSelectSkill}
          />
        </Reveal>
      </div>
    </section>
  );
}
